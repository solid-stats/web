/* hifi/players.jsx — Players list (hi-fi, Solid Stats DS).
   Full leaderboard / directory of all players — the "View all" target of the
   Overview's Top-players card and the breadcrumb root of the Player profile.
   Same shell, tier system, freshness, provenance, i18n and Tweaks as the other
   two pages. Desktop = one full-width sortable table that scrolls inside a capped
   window with a sticky header (total in the caption). Mobile = top-N list with a
   "show all" expander (no nested scroll; secondary columns dropped). */
const { useState, useMemo, useEffect, useRef, useCallback } = React;
const ROSTER = window.SS_ROSTER;
const PL_SIDE_COLOR = { red: 'var(--loss)', blue: 'var(--info)', yellow: 'var(--warn)', green: 'var(--win)', gray: 'var(--fg-3)' };
const ROW_H = { comfortable: 52, compact: 44 };   // pinned in players.css so virtualization math is exact

/* period-explicit tier (Ротация / Всё время toggle drives the population baseline) */
function tierBy(metric, v, period) {
  const b = window.SS_BASELINE.by[period][metric];
  return v >= b.elite ? 'elite' : v >= b.good ? 'good' : v >= b.base ? 'base' : 'low';
}
function PipsT({ tier }) {
  const lvl = (window.SS_TIER && window.SS_TIER.level[tier]) || 0;
  return <span className="pips" aria-hidden="true">{[1, 2, 3, 4].map(i => <i key={i} className={i <= lvl ? 'on' : ''} />)}</span>;
}
/* tier-colored number cell (Score / K/D) — color paired with pip meter, never color-alone */
function TierNum({ v, tier, pips = true }) {
  return <span className={`cell-tier tierc tier-${tier}`}>{pips && <PipsT tier={tier} />}<b>{v.toFixed(2)}</b></span>;
}
/* weekly score trend — one bar per week, each colored by ITS OWN tier (same as
   Overview). `weeks` controls how many recent weeks are shown (4–10, by width). */
function Trend({ spark, period, weeks = 4 }) {
  const data = spark.slice(-weeks);
  const max = Math.max(...data, 1);
  return (
    <span className="score-trend" aria-hidden="true">
      {data.map((v, i) => {
        const tier = tierBy('score', v, period);
        const h = Math.max(Math.round((Math.max(v, 0) / max) * 100), 8);
        return <i key={i} className={`stb tierc tier-${tier}`} style={{ height: `${h}%` }} title={v.toFixed(2)} />;
      })}
    </span>
  );
}
function PlAvatar() {
  return <span className="pl-avatar"><Icon name="user" size={16} /></span>;
}
function SquadRef({ squad, side, t }) {
  if (!squad) return <span className="sq-ref muted">{t('noSquad')}</span>;
  const c = PL_SIDE_COLOR[side] || 'var(--fg-3)';
  return <span className="sq-ref"><span className="side-dot" style={{ background: c }} />{squad}</span>;
}

/* ---------- period selector ---------- rotations + All-time, defaulting to the
   active rotation (synced with the Overview's "View all"). Drives the population
   tier baseline (rotation scale for a rotation, all-time scale for all-time).
   NB: the "last 4 weeks" window belongs to SQUAD stats, not the player list. */
function resolvePeriod(id) {
  if (id === 'all') return { id, kind: 'alltime', baseline: 'alltime' };
  const r = window.SS_OV.rotations.find(x => 'rot' + x.r === id) || window.SS_OV.rotations[0];
  return { id: 'rot' + r.r, kind: 'rotation', baseline: 'rotation', r };
}
function PeriodPick({ value, setValue, t, lang }) {
  const [open, setOpen] = useState(false);
  const opts = [
    ...window.SS_OV.rotations.map(r => ({ id: 'rot' + r.r, icon: 'repeat', label: `${t('rotation')} ${r.r}`, range: [r.s, r.e] })),
    { id: 'all', icon: 'infinity', label: t('per_all'), range: null },
  ];
  const cur = opts.find(o => o.id === value) || opts[0];
  return (
    <div className="rotsel">
      <button className="selpill" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-haspopup="listbox">
        <Icon name={cur.icon} size={15} />{cur.label}<Icon name="chevron-down" size={15} />
      </button>
      {open && (
        <>
          <div className="rotsel-back" onClick={() => setOpen(false)} />
          <div className="rotsel-menu" role="listbox">
            {opts.map(o => (
              <button key={o.id} role="option" aria-selected={o.id === value}
                className={`rotsel-item${o.id === value ? ' on' : ''}`}
                onClick={() => { setValue(o.id); setOpen(false); }}>
                <span className="rs-main"><Icon name={o.icon} size={14} />{o.label}</span>
                <span className="rs-range">{o.range ? window.SS_RANGE(lang, o.range[0], o.range[1]) : t('per_all')}</span>
                <span className="rs-check">{o.id === value && <Icon name="check" size={14} />}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- provenance line (roster-level) — derivation only;
   freshness lives in the page head (synced with Overview) ---------- */
function ProvLine({ t, replays }) {
  return (
    <div className="prov-line pl-prov">
      <a className="prov-item prov-link"><Icon name="database" size={14} />{t('provReplays', { n: replays.toLocaleString('en-US') })}</a>
      <span className="prov-sep" />
      <span className="prov-item"><Icon name="bar-chart-3" size={14} />{t('plist_levels')}</span>
      <span className="prov-sep" />
      <a className="prov-item prov-link"><Icon name="function-square" size={14} />{t('provHow')}</a>
    </div>
  );
}

/* ---------- filter toolbar (search + side chips) ---------- */
const SIDES = ['all', 'red', 'blue', 'yellow', 'green', 'gray'];
function SideChips({ side, setSide, t }) {
  return (
    <div className="side-chips" role="group" aria-label={t('sideLabel')}>
      {SIDES.map(s => (
        <button key={s} className={`side-chip${side === s ? ' on' : ''}`} onClick={() => setSide(s)}>
          {s !== 'all' && <span className="side-dot" style={{ background: PL_SIDE_COLOR[s] }} />}
          {s === 'all' ? t('side_all') : t('side_' + s)}
        </button>
      ))}
    </div>
  );
}

/* ---------- desktop table ---------- */
function Th({ col, sort, onSort, t }) {
  const active = sort.key === col.key;
  const cls = `${col.l ? 'l ' : ''}${col.sortable ? 'sortable ' : ''}${active ? 'sorted' : ''}`.trim();
  return (
    <th className={cls} onClick={col.sortable ? () => onSort(col.key) : undefined}>
      <span className="th-in">
        {t(col.label, col.labelVars)}
        {col.sortable && <span className="sort-ic"><Icon name={active ? (sort.dir === 'asc' ? 'arrow-up' : 'arrow-down') : 'arrow-up-down'} size={12} /></span>}
      </span>
    </th>
  );
}

/* column definitions shared by the table + skeleton (so widths line up exactly) */
function buildCols({ t, period, showSecondary, showTrend, weeks }) {
  return [
    { key: 'rank', label: 'c_rank', l: true, w: '54px',
      cell: (p, i) => <td key="r" className={`l rank${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</td> },
    { key: 'name', label: 'c_player', l: true, sortable: true, w: showTrend ? '20%' : '26%',
      cell: (p) => <td key="n" className="l"><span className="pl-id"><PlAvatar /><span className="cell-id"><span className="nm">{p.name}</span><span className="sub"><SquadRef squad={p.squad} side={p.side} t={t} /></span></span></span></td> },
    { key: 'games', label: 'c_games', sortable: true, w: '9%',
      cell: (p) => <td key="g" className="muted">{p.games}</td> },
    { key: 'kills', label: 'c_kills', sortable: true, w: '11%',
      cell: (p) => <td key="k">{p.kills.toLocaleString('en-US')}</td> },
    showSecondary && { key: 'tk', label: 'c_tk', sortable: true, w: '8%',
      cell: (p) => <td key="tk" style={{ color: p.tk ? 'var(--warn)' : 'var(--fg-3)' }}>{p.tk || '—'}</td> },
    showSecondary && { key: 'deaths', label: 'c_deaths', sortable: true, w: '9%',
      cell: (p) => <td key="d" className="muted">{p.deaths}</td> },
    showTrend && { key: 'trend', label: 'c_trendN', labelVars: { n: weeks }, cls: 'col-trend', w: (weeks * 8 + 22) + 'px',
      cell: (p) => <td key="t" className="col-trend"><Trend spark={p.spark} period={period} weeks={weeks} /></td> },
    { key: 'kd', label: 'c_kd', sortable: true, w: '12%',
      cell: (p) => <td key="kd"><TierNum v={p.kd} tier={tierBy('kd', p.kd, period)} /></td> },
    { key: 'score', label: 'c_score', sortable: true, w: '12%',
      cell: (p) => <td key="sc"><TierNum v={p.score} tier={tierBy('score', p.score, period)} /></td> },
  ].filter(Boolean);
}

function TableHead({ cols, sort, onSort, t }) {
  return (
    <thead>
      <tr>
        {cols.map(c => c.sortable
          ? <Th key={c.key} col={c} sort={sort} onSort={onSort} t={t} />
          : <th key={c.key} className={`${c.l ? 'l ' : ''}${c.cls || ''}`.trim()}>{t(c.label, c.labelVars)}</th>)}
      </tr>
    </thead>
  );
}

/* Virtualized table — only the visible row window (+overscan) is in the DOM, so a
   2040-row all-time roster stays a light DOM and instant to scroll/sort. The header
   is sticky; spacer rows above/below reserve the full scroll height. */
function PlayersTable({ rows, sort, onSort, t, period, showSecondary, showTrend, weeks, density }) {
  const cols = buildCols({ t, period, showSecondary, showTrend, weeks });
  const rowH = ROW_H[density] || ROW_H.comfortable;
  const scrollRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewH, setViewH] = useState(612);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const measure = () => setViewH(el.clientHeight || 612);
    measure();
    const ro = window.ResizeObserver ? new ResizeObserver(measure) : null;
    ro && ro.observe(el);
    return () => ro && ro.disconnect();
  }, []);
  // keep the window anchored to the top when the result set changes (sort/filter)
  useEffect(() => { if (scrollRef.current) { scrollRef.current.scrollTop = 0; setScrollTop(0); } }, [sort.key, sort.dir, rows.length]);

  const onScroll = useCallback((e) => setScrollTop(e.currentTarget.scrollTop), []);
  const overscan = 8;
  const start = Math.max(0, Math.floor(scrollTop / rowH) - overscan);
  const end = Math.min(rows.length, Math.ceil((scrollTop + viewH) / rowH) + overscan);
  const padTop = start * rowH;
  const padBottom = Math.max((rows.length - end) * rowH, 0);
  const win = rows.slice(start, end);

  return (
    <div className="card pl-card">
      <div className="pl-scroll" ref={scrollRef} onScroll={onScroll}>
        <table className={`tbl pl-tbl virt${density === 'compact' ? ' compact' : ''}`}>
          <colgroup>{cols.map(c => <col key={c.key} style={{ width: c.w }} />)}</colgroup>
          <TableHead cols={cols} sort={sort} onSort={onSort} t={t} />
          <tbody>
            {padTop > 0 && <tr className="spacer" aria-hidden="true" style={{ height: padTop }}><td colSpan={cols.length} /></tr>}
            {win.map((p, j) => {
              const i = start + j;
              return <tr key={p.name + i} className="row-link" onClick={() => window.ssGo('player')}>{cols.map(c => c.cell(p, i))}</tr>;
            })}
            {padBottom > 0 && <tr className="spacer" aria-hidden="true" style={{ height: padBottom }}><td colSpan={cols.length} /></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* skeleton shown while the backend aggregates a large roster (all-time = ~2040).
   Same colgroup + header + reserved height → CLS ≈ 0 when the data lands. */
function TableSkeleton({ t, period, showSecondary, showTrend, weeks, density }) {
  const cols = buildCols({ t, period, showSecondary, showTrend, weeks });
  const rowH = ROW_H[density] || ROW_H.comfortable;
  const n = Math.max(Math.floor(612 / rowH), 8);
  return (
    <div className="card pl-card" aria-busy="true">
      <div className="pl-scroll" style={{ overflow: 'hidden' }}>
        <table className={`tbl pl-tbl virt${density === 'compact' ? ' compact' : ''}`}>
          <colgroup>{cols.map(c => <col key={c.key} style={{ width: c.w }} />)}</colgroup>
          <thead><tr>{cols.map(c => <th key={c.key} className={`${c.l ? 'l ' : ''}${c.cls || ''}`.trim()}>{t(c.label, c.labelVars)}</th>)}</tr></thead>
          <tbody>
            {Array.from({ length: n }).map((_, r) => (
              <tr key={r} className="sk-row">
                {cols.map(c => (
                  <td key={c.key} className={c.l ? 'l' : ''}>
                    {c.key === 'rank' ? <span className="sk sk-rank" />
                      : c.key === 'name' ? <span className="pl-id"><span className="sk sk-av" /><span className="sk sk-nm" /></span>
                      : c.key === 'trend' ? <span className="sk sk-trend" />
                      : <span className="sk sk-num" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- mobile list ---------- top-N then incremental "show more" (never dumps
   2040 rows at once); no nested scroll — the page scrolls. */
function MobileList({ rows, t, period }) {
  const STEP = 40, BASE = 20;
  const [shown, setShown] = useState(BASE);
  useEffect(() => { setShown(BASE); }, [rows.length, period]);
  const n = Math.min(shown, rows.length);
  const vis = rows.slice(0, n);
  const remaining = rows.length - n;
  return (
    <div className="card m-list" style={{ padding: '4px 12px' }}>
      {vis.map((p, i) => {
        const st = tierBy('score', p.score, period), kt = tierBy('kd', p.kd, period);
        return (
          <div className="pl-m-row row-link" key={p.name + i} onClick={() => window.ssGo('player')}>
            <span className={`rank mono${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
            <PlAvatar />
            <span className="pl-m-name">
              <b>{p.name}</b>
              <span className="lb-sub"><SquadRef squad={p.squad} side={p.side} t={t} /> · {t('games_n', { n: p.games })} · {t('kills_n', { n: p.kills })}</span>
            </span>
            <span className="pl-m-metrics">
              <span className="pl-m-kd"><TierNum v={p.kd} tier={kt} pips={false} /><span className="lb-cap">{t('c_kd')}</span></span>
              <span className="pl-m-score"><TierNum v={p.score} tier={st} pips={false} /><span className="lb-cap">{t('c_score')}</span></span>
            </span>
          </div>
        );
      })}
      {remaining > 0 && (
        <button className="pl-m-more" onClick={() => setShown(s => s + STEP)}>
          {t('plist_showMore', { n: Math.min(STEP, remaining), rem: remaining.toLocaleString('en-US') })}
          <Icon name="chevron-down" size={15} />
        </button>
      )}
      {remaining === 0 && rows.length > BASE && (
        <button className="pl-m-more" onClick={() => setShown(BASE)}>
          {t('plist_collapse')}<Icon name="chevron-up" size={15} />
        </button>
      )}
    </div>
  );
}

/* mobile skeleton while the all-time roster aggregates */
function MobileSkeleton() {
  return (
    <div className="card m-list" aria-busy="true" style={{ padding: '4px 12px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div className="pl-m-row sk-row" key={i}>
          <span className="sk sk-rank" />
          <span className="sk sk-av" />
          <span className="pl-m-name"><span className="sk sk-nm" /><span className="sk sk-sub" /></span>
          <span className="pl-m-metrics"><span className="sk sk-num" /><span className="sk sk-num" /></span>
        </div>
      ))}
    </div>
  );
}

/* ===================== PAGE ===================== */
function PlayersList({ lang, device = 'desktop', dataset = 'typical', fresh = 'ok', cache = 'warm', onSearch }) {
  const t = (k, v) => window.SS_T(lang, k, v);
  const winMobile = window.useMedia('(max-width: 980px)');
  const winRoomy = window.useMedia('(min-width: 1024px)');
  const winTrend = window.useMedia('(min-width: 900px)');
  const veryWide = window.useMedia('(min-width: 1440px)');
  const isMobile = device === 'mobile' || (device === 'desktop' && winMobile);
  const density = (device === 'desktop' && !winMobile) ? 'comfortable' : 'compact';
  // column visibility keys off the actual surface (device frame / desktop window),
  // not one viewport breakpoint — the tablet frame has room to keep every column.
  let showSecondary, showTrend, weeks;
  if (device === 'tablet') { showSecondary = true; showTrend = true; weeks = 5; }
  else { showSecondary = winRoomy; showTrend = winTrend; weeks = veryWide ? 10 : 6; }

  // Period is URL-driven so it's shareable / survives refresh — i.e. "Всё время"
  // can legitimately be the FIRST page you land on (deep link), not only a switch-to.
  const readHash = () => {
    const h = (typeof location !== 'undefined' ? location.hash : '').replace('#', '');
    return h === 'all' || /^rot\d+$/.test(h) ? h : 'rot14';
  };
  const [period, setPeriod] = useState(readHash);
  const [q, setQ] = useState('');
  const [side, setSide] = useState('all');
  const [sort, setSort] = useState({ key: 'score', dir: 'desc' });
  const onSort = (key) => setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' ? 'asc' : 'desc' });

  const pr = useMemo(() => resolvePeriod(period), [period]);
  useEffect(() => { try { history.replaceState(null, '', '#' + period); } catch (e) {} }, [period]);

  const src = pr.kind === 'alltime' ? ROSTER.allTime : ROSTER.rotation(dataset);
  const total = src.length;
  const replays = ROSTER.replaysFor(pr.kind);

  // LOADING MODEL — period drives the volume, and the volume drives the wait:
  //  • Rotation = the active cohort (hundreds), SSR/cached → ALWAYS instant.
  //  • All-time = the ~2040-player community. It's a cached materialized aggregate
  //    (recomputed on a schedule → the freshness pill), so:
  //    – first paint (you LANDED on all-time): SSR returns the cached HTML → instant,
  //      NO skeleton — unless the aggregate is mid-recompute (cache miss), in which
  //      case the shell + header + skeleton stream immediately and fill when ready.
  //    – in-session SWITCH to all-time: a brief client fetch of the cached aggregate.
  const mounted = useRef(false);
  const recomputing = cache === 'cold';
  const [loading, setLoading] = useState(() => readHash() === 'all' && recomputing);
  useEffect(() => {
    if (pr.kind !== 'alltime') { setLoading(false); return; }
    if (recomputing) { setLoading(true); return; }              // backend busy → wait until done
    if (!mounted.current) { setLoading(false); return; }        // landed on all-time, cache warm → instant (SSR)
    setLoading(true);                                            // in-session switch → brief cached fetch
    const id = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(id);
  }, [pr.id, recomputing]);
  useEffect(() => { mounted.current = true; }, []);

  const ql = q.trim().toLowerCase();
  const rows = useMemo(() => {
    if (loading) return [];
    let r = src.filter(p => (side === 'all' || p.side === side) && (!ql || p.name.toLowerCase().includes(ql) || (p.squad || '').toLowerCase().includes(ql)));
    const dir = sort.dir === 'asc' ? 1 : -1;
    r = r.slice().sort((a, b) => sort.key === 'name' ? a.name.localeCompare(b.name) * dir : (a[sort.key] - b[sort.key]) * dir);
    return r;
  }, [src, side, ql, sort, loading]);

  const filtered = ql || side !== 'all';
  const loadMsg = recomputing ? t('plist_recompute') : t('plist_loading');
  const sortLabelKey = { name: 'c_player', games: 'c_games', kills: 'c_kills', tk: 'c_tk', deaths: 'c_deaths', kd: 'c_kd', score: 'c_score' }[sort.key];

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-title">{t('plist_title')}</h1>
        <div className="ph-rot">
          <PeriodPick value={period} setValue={setPeriod} t={t} lang={lang} />
        </div>
        <div className="ph-fresh"><Freshness t={t} state={fresh} mins={ROSTER.updatedMin} /></div>
        <div className="ph-date">
          {pr.kind === 'alltime'
            ? <span className="rotsel-range mono">{t('per_all')}</span>
            : <span className="rotsel-range mono">{window.SS_RANGE(lang, pr.r.s, pr.r.e)}</span>}
        </div>
      </div>

      {fresh !== 'ok' && <div className="banner"><Icon name={fresh === 'offline' ? 'wifi-off' : 'refresh-cw'} />{t('stale')}</div>}

      <ProvLine t={t} replays={replays} />

      {isMobile ? (
        /* ===== MOBILE ===== */
        <div className="pl-m" style={{ marginTop: 14 }}>
          <div className="control pl-msearch">
            <Icon name="search" size={16} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('filterPh')} aria-label={t('filterPh')} />
            {q && <button className="clr" onClick={() => setQ('')} aria-label={t('plist_clear')}><Icon name="x" size={13} /></button>}
          </div>
          <SideChips side={side} setSide={setSide} t={t} />
          <div className="pl-cap" style={{ margin: '2px 2px 0' }}>
            <span className="pl-n">{loading ? loadMsg : (filtered ? t('plist_filtered', { n: rows.length, total }) : t('plist_count', { n: total }))}</span>
            {!loading && rows.length > 0 && <span className="pl-sort"><Icon name="arrow-down-up" size={13} />{t('sortBy', { m: t(sortLabelKey) })}</span>}
          </div>
          {loading ? <MobileSkeleton />
            : rows.length === 0
            ? <EmptyState t={t} onClear={() => { setQ(''); setSide('all'); }} />
            : <MobileList rows={rows} t={t} period={pr.baseline} />}
        </div>
      ) : (
        /* ===== DESKTOP / TABLET ===== */
        <>
          <div className="pl-tools">
            <div className="control pl-search">
              <Icon name="search" size={16} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('filterPh')} aria-label={t('filterPh')} />
              {q && <button className="clr" onClick={() => setQ('')} aria-label={t('plist_clear')}><Icon name="x" size={13} /></button>}
            </div>
            <SideChips side={side} setSide={setSide} t={t} />
          </div>

          <div className="pl-cap">
            <span className="pl-n">
              {loading
                ? <span className="pl-loading"><Icon name="loader" size={14} />{loadMsg}</span>
                : (filtered ? t('plist_filtered', { n: rows.length, total }) : t('plist_count', { n: total }))}
            </span>
          </div>

          {loading
            ? <TableSkeleton t={t} period={pr.baseline} showSecondary={showSecondary} showTrend={showTrend} weeks={weeks} density={density} />
            : rows.length === 0
            ? <div className="card"><EmptyState t={t} onClear={() => { setQ(''); setSide('all'); }} /></div>
            : <PlayersTable rows={rows} sort={sort} onSort={onSort} t={t} period={pr.baseline} showSecondary={showSecondary} showTrend={showTrend} weeks={weeks} density={density} />}
        </>
      )}
    </div>
  );
}

function EmptyState({ t, onClear }) {
  return (
    <div className="pl-empty">
      <span className="pe-ic"><Icon name="user-x" size={22} /></span>
      <span className="pe-t">{t('plist_empty')}</span>
      <Button variant="secondary" size="sm" icon="x" onClick={onClear}>{t('plist_clear')}</Button>
    </div>
  );
}

window.PlayersList = PlayersList;
