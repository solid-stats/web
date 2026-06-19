/* hifi/squads.jsx — Squads list (hi-fi, Solid Stats DS).
   Full directory / leaderboard of squads — the "View all" target of the Overview's
   Top-squads card and the breadcrumb root of a (future) squad profile. Mirrors the
   Players list: same shell, period selector, freshness, provenance, i18n, Tweaks and
   the capped sticky-header scroll window (desktop) / top-N + "show more" (mobile).
   Squad-flavored: a side-colored emblem monogram + [tag]·leader identity, a Members
   column, and SQUAD-population tiers (SS_SQ_BASELINE — aggregate ratios sit lower
   than star players, so squads get their own tier cutoffs).
   NB: the "last 4 weeks" window is a SQUAD-PROFILE mechanic, not this list — the
   period selector here is Rotation N… / All-time, same as the Players list. */
const { useState, useMemo, useEffect, useRef, useCallback } = React;
const SQ_ROSTER = window.SS_SQUADS;
const SQ_SIDE_COLOR = { red: 'var(--loss)', blue: 'var(--info)', yellow: 'var(--warn)', green: 'var(--win)', gray: 'var(--fg-3)' };
const SQ_ROW_H = { comfortable: 52, compact: 44 };

/* period-explicit tier off the SQUAD population baseline */
function sqTierBy(metric, v, period) {
  const b = window.SS_SQ_BASELINE.by[period][metric];
  return v >= b.elite ? 'elite' : v >= b.good ? 'good' : v >= b.base ? 'base' : 'low';
}
function SqPips({ tier }) {
  const lvl = (window.SS_TIER && window.SS_TIER.level[tier]) || 0;
  return <span className="pips" aria-hidden="true">{[1, 2, 3, 4].map(i => <i key={i} className={i <= lvl ? 'on' : ''} />)}</span>;
}
function SqTierNum({ v, tier, pips = true }) {
  return <span className={`cell-tier tierc tier-${tier}`}>{pips && <SqPips tier={tier} />}<b>{v.toFixed(2)}</b></span>;
}
/* weekly score trend — one bar per week, each colored by ITS OWN tier. Interactive:
   hovering a week highlights that bar (glow + lift, others dim) and floats a tooltip
   with the score value + how many weeks back it is. */
function SqTrend({ spark, period, weeks = 4, lang }) {
  const [hi, setHi] = useState(-1);
  const data = spark.slice(-weeks);
  const max = Math.max(...data, 1);
  const n = data.length;
  const t = (k, v) => window.SS_T(lang || 'EN', k, v);
  return (
    <span className="score-trend trend-iv" onMouseLeave={() => setHi(-1)}>
      {data.map((v, i) => {
        const tier = sqTierBy('score', v, period);
        const h = Math.max(Math.round((Math.max(v, 0) / max) * 100), 8);
        return (
          <span key={i}
            className={`stb-cell tierc tier-${tier}${hi === i ? ' on' : ''}${hi > -1 && hi !== i ? ' dim' : ''}`}
            onMouseEnter={() => setHi(i)}>
            <i className="stb" style={{ height: `${h}%` }} />
          </span>
        );
      })}
      {hi > -1 && (
        <span className="stb-tip" style={{ left: `${((hi + 0.5) / n) * 100}%` }}>
          <b className={`tierc tier-${sqTierBy('score', data[hi], period)}`}>{data[hi].toFixed(2)}</b>
          <span className="stb-tip-cap">{(n - 1 - hi) === 0 ? t('trend_cur') : t('trend_ago', { n: n - 1 - hi })}</span>
        </span>
      )}
    </span>
  );
}

/* squad avatar — neutral users glyph, matching the player avatar (a real squad
   emblem image drops in later). Side is conveyed by the side-dot in the sub-line. */
function SqEmblem({ mobile }) {
  return <span className="pl-avatar"><Icon name="users" size={mobile ? 18 : 16} /></span>;
}
/* identity sub-line: side dot + [tag] (squad leader intentionally omitted) */
function SqSub({ sq }) {
  const c = SQ_SIDE_COLOR[sq.side] || 'var(--fg-3)';
  return (
    <span className="sq-sub">
      <span className="side-dot" style={{ background: c }} />
      <span className="sq-tag">[{sq.tag}]</span>
    </span>
  );
}

/* ---------- period selector (rotations + All-time, default active rotation) ---------- */
function resolvePeriod(id) {
  // squads have NO all-time. Standalone "recent4w" = last 4 weeks (no rotation
  // attachment) is the default; a rotation defaults to its own last-4-weeks window.
  if (id === '4w') return { id, kind: 'recent4w', baseline: 'rotation' };
  const r = window.SS_OV.rotations.find(x => 'rot' + x.r === id) || window.SS_OV.rotations[0];
  return { id: 'rot' + r.r, kind: 'rotation', baseline: 'rotation', r };
}
/* the "last 4 weeks" window ends at the rotation's end date (CLAUDE.md: a window on
   top of ANY rotation — a squad-stats mechanic, not on the player list). */
function last4wRange(e) {
  const d = new Date(e[0], e[1], e[2]);
  const s = new Date(d); s.setDate(s.getDate() - 27);
  return [[s.getFullYear(), s.getMonth(), s.getDate()], e];
}
function PeriodPick({ value, setValue, t, lang }) {
  const [open, setOpen] = useState(false);
  const recent = last4wRange(window.SS_OV.rotations[0].e);
  const opts = [
    { id: '4w', icon: 'calendar-range', label: t('per_last4w'), range: recent },
    ...window.SS_OV.rotations.map(r => ({ id: 'rot' + r.r, icon: 'repeat', label: `${t('rotation')} ${r.r}`, range: [r.s, r.e] })),
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

/* ---------- provenance line (roster-level) ---------- */
function ProvLine({ t, replays }) {
  return (
    <div className="prov-line pl-prov">
      <a className="prov-item prov-link"><Icon name="database" size={14} />{t('provReplays', { n: replays.toLocaleString('en-US') })}</a>
      <span className="prov-sep" />
      <span className="prov-item"><Icon name="bar-chart-3" size={14} />{t('slist_levels')}</span>
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
          {s !== 'all' && <span className="side-dot" style={{ background: SQ_SIDE_COLOR[s] }} />}
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

function buildCols({ t, lang, period, showSecondary, showTrend, weeks }) {
  return [
    { key: 'rank', label: 'c_rank', l: true, w: '54px',
      cell: (s, i) => <td key="r" className={`l rank${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</td> },
    { key: 'name', label: 'c_squadName', l: true, sortable: true, w: showTrend ? '26%' : '32%',
      cell: (s) => <td key="n" className="l"><span className="pl-id sq-id"><SqEmblem sq={s} /><span className="cell-id"><span className="nm">{s.name}</span><span className="sub"><SqSub sq={s} /></span></span></span></td> },
    { key: 'members', label: 'c_members', sortable: true, w: '11%',
      cell: (s) => <td key="m"><span className="sq-members">{s.members}</span></td> },
    { key: 'games', label: 'c_games', sortable: true, w: '9%',
      cell: (s) => <td key="g" className="muted">{s.games.toLocaleString('en-US')}</td> },
    { key: 'kills', label: 'c_kills', sortable: true, w: '11%',
      cell: (s) => <td key="k">{s.kills.toLocaleString('en-US')}</td> },
    showSecondary && { key: 'tk', label: 'c_tk', sortable: true, w: '8%',
      cell: (s) => <td key="tk" style={{ color: s.tk ? 'var(--warn)' : 'var(--fg-3)' }}>{s.tk || '—'}</td> },
    showSecondary && { key: 'deaths', label: 'c_deaths', sortable: true, w: '9%',
      cell: (s) => <td key="d" className="muted">{s.deaths.toLocaleString('en-US')}</td> },
    showTrend && { key: 'trend', label: 'c_trendN', labelVars: { n: weeks }, cls: 'col-trend', w: (weeks * 8 + 22) + 'px',
      cell: (s) => <td key="t" className="col-trend"><SqTrend spark={s.spark} period={period} weeks={weeks} lang={lang} /></td> },
    { key: 'kd', label: 'c_kd', sortable: true, w: '11%',
      cell: (s) => <td key="kd"><SqTierNum v={s.kd} tier={sqTierBy('kd', s.kd, period)} /></td> },
    { key: 'score', label: 'c_score', sortable: true, w: '12%',
      cell: (s) => <td key="sc"><SqTierNum v={s.score} tier={sqTierBy('score', s.score, period)} /></td> },
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

/* Virtualized table — only the visible row window (+overscan) is in the DOM. */
function SquadsTable({ rows, sort, onSort, t, lang, period, showSecondary, showTrend, weeks, density }) {
  const cols = buildCols({ t, lang, period, showSecondary, showTrend, weeks });
  const rowH = SQ_ROW_H[density] || SQ_ROW_H.comfortable;
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
            {win.map((s, j) => {
              const i = start + j;
              return <tr key={s.tag + i} className="row-link" onClick={() => window.ssGo('squad')}>{cols.map(c => c.cell(s, i))}</tr>;
            })}
            {padBottom > 0 && <tr className="spacer" aria-hidden="true" style={{ height: padBottom }}><td colSpan={cols.length} /></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* skeleton shown while the backend aggregates the all-time squad roster */
function TableSkeleton({ t, period, showSecondary, showTrend, weeks, density }) {
  const cols = buildCols({ t, period, showSecondary, showTrend, weeks });
  const rowH = SQ_ROW_H[density] || SQ_ROW_H.comfortable;
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

/* ---------- mobile list ---------- a compact 2-row squad card (more than the player
   row, since squads carry more stats): identity + headline Счёт on top, then a stat
   strip (K/D · Игры · Убийства) with the interactive trend on the right, under the
   Счёт. Not a full mirror of the player row — squads get their own denser layout. */
function MobileList({ rows, t, lang, period }) {
  const STEP = 40, BASE = 20;
  const [shown, setShown] = useState(BASE);
  useEffect(() => { setShown(BASE); }, [rows.length, period]);
  const n = Math.min(shown, rows.length);
  const vis = rows.slice(0, n);
  const remaining = rows.length - n;
  return (
    <div className="card m-list sq-mlist">
      {vis.map((s, i) => {
        const st = sqTierBy('score', s.score, period), kt = sqTierBy('kd', s.kd, period);
        const c = SQ_SIDE_COLOR[s.side] || 'var(--fg-3)';
        return (
          <div className="sq-mcard row-link" key={s.tag + i} onClick={() => window.ssGo('squad')}>
            <div className="sq-mtop">
              <span className={`rank mono${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
              <SqEmblem mobile />
              <span className="sq-mname">
                <b>{s.name}</b>
                <span className="sq-msub">
                  <span className="side-dot" style={{ background: c }} />
                  <span className="sq-tag">[{s.tag}]</span> · {t('members_sh', { n: s.members })}
                </span>
              </span>
              <span className="sq-mscore">
                <SqTierNum v={s.score} tier={st} pips={false} />
                <span className="lb-cap">{t('c_score')}</span>
              </span>
            </div>
            <div className="sq-mstats">
              <span className="sq-mstatset">
                <span className="sq-mstat"><b className={`tierc tier-${kt}`}>{s.kd.toFixed(2)}</b><i>{t('c_kd')}</i></span>
                <span className="sq-mstat"><b>{s.games.toLocaleString('en-US')}</b><i>{t('c_games')}</i></span>
                <span className="sq-mstat"><b>{s.kills.toLocaleString('en-US')}</b><i>{t('c_kills')}</i></span>
              </span>
              <span className="sq-mtrend"><SqTrend spark={s.spark} period={period} weeks={6} lang={lang} /></span>
            </div>
          </div>
        );
      })}
      {remaining > 0 && (
        <button className="pl-m-more" onClick={() => setShown(s => s + STEP)}>
          {t('slist_showMore', { n: Math.min(STEP, remaining), rem: remaining.toLocaleString('en-US') })}
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

function MobileSkeleton() {
  return (
    <div className="card m-list sq-mlist" aria-busy="true">
      {Array.from({ length: 7 }).map((_, i) => (
        <div className="sq-mcard sk-row" key={i}>
          <div className="sq-mtop">
            <span className="sk sk-rank" />
            <span className="sk sk-av" />
            <span className="sq-mname"><span className="sk sk-nm" /><span className="sk sk-sub" /></span>
            <span className="sk sk-num" />
          </div>
          <div className="sq-mstats">
            <span className="sq-mstatset"><span className="sk sk-num" /><span className="sk sk-num" /><span className="sk sk-num" /></span>
            <span className="sk sk-trend" style={{ width: 64 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===================== PAGE ===================== */
function SquadsList({ lang, device = 'desktop', dataset = 'typical', fresh = 'ok', onSearch }) {
  const t = (k, v) => window.SS_T(lang, k, v);
  const winMobile = window.useMedia('(max-width: 980px)');
  const winRoomy = window.useMedia('(min-width: 1024px)');
  const winTrend = window.useMedia('(min-width: 900px)');
  const veryWide = window.useMedia('(min-width: 1440px)');
  const isMobile = device === 'mobile' || (device === 'desktop' && winMobile);
  const density = (device === 'desktop' && !winMobile) ? 'comfortable' : 'compact';
  let showSecondary, showTrend, weeks;
  if (device === 'tablet') { showSecondary = true; showTrend = true; weeks = 5; }
  else { showSecondary = winRoomy; showTrend = winTrend; weeks = veryWide ? 10 : 6; }

  const readHash = () => {
    const h = (typeof location !== 'undefined' ? location.hash : '').replace('#', '');
    return h === '4w' || /^rot\d+$/.test(h) ? h : '4w';
  };
  const [period, setPeriod] = useState(readHash);
  const [win4w, setWin4w] = useState(true);   // 4-week window defaults ON for any rotation (squad mechanic)
  const [q, setQ] = useState('');
  const [side, setSide] = useState('all');
  const [sort, setSort] = useState({ key: 'score', dir: 'desc' });
  const onSort = (key) => setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' ? 'asc' : 'desc' });

  const pr = useMemo(() => resolvePeriod(period), [period]);
  useEffect(() => { try { history.replaceState(null, '', '#' + period); } catch (e) {} }, [period]);
  useEffect(() => { setWin4w(true); }, [period]);   // every period switch resets the window to its default (ON)

  const win4 = pr.kind === 'recent4w' || (pr.kind === 'rotation' && win4w);
  let src = SQ_ROSTER.rotation(dataset);
  if (win4) src = SQ_ROSTER.window4w(src);
  const total = src.length;
  const replays = win4 ? 612 : 1842;   // 4-week window vs full rotation

  const ql = q.trim().toLowerCase();
  const rows = useMemo(() => {
    let r = src.filter(s => (side === 'all' || s.side === side) &&
      (!ql || s.name.toLowerCase().includes(ql) || s.tag.toLowerCase().includes(ql)));
    const dir = sort.dir === 'asc' ? 1 : -1;
    r = r.slice().sort((a, b) => sort.key === 'name' ? a.name.localeCompare(b.name) * dir : (a[sort.key] - b[sort.key]) * dir);
    return r;
  }, [src, side, ql, sort]);

  const filtered = ql || side !== 'all';
  const sortLabelKey = { name: 'c_squadName', members: 'c_members', games: 'c_games', kills: 'c_kills', tk: 'c_tk', deaths: 'c_deaths', kd: 'c_kd', score: 'c_score' }[sort.key];

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-title">{t('slist_title')}</h1>
        <div className="ph-rot">
          <PeriodPick value={period} setValue={setPeriod} t={t} lang={lang} />
          {resolvePeriod(period).kind === 'rotation' && (
            <button className={`selpill win4w${win4w ? ' on' : ''}`} onClick={() => setWin4w(v => !v)} aria-pressed={win4w}>
              <Icon name="calendar-range" size={15} />{t('per_4w')}
            </button>
          )}
        </div>
        <div className="ph-fresh"><Freshness t={t} state={fresh} mins={SQ_ROSTER.updatedMin} /></div>
        <div className="ph-date">
          {win4
            ? <span className="rotsel-range mono">{(() => { const e = pr.kind === 'recent4w' ? window.SS_OV.rotations[0].e : pr.r.e; const r = last4wRange(e); return window.SS_RANGE(lang, r[0], r[1]); })()}</span>
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
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('slist_filterPh')} aria-label={t('slist_filterPh')} />
            {q && <button className="clr" onClick={() => setQ('')} aria-label={t('plist_clear')}><Icon name="x" size={13} /></button>}
          </div>
          <SideChips side={side} setSide={setSide} t={t} />
          <div className="pl-cap" style={{ margin: '2px 2px 0' }}>
            <span className="pl-n">{filtered ? t('slist_filtered', { n: rows.length, total }) : t('slist_count', { n: total })}</span>
            {rows.length > 0 && <span className="pl-sort"><Icon name="arrow-down-up" size={13} />{t('sortBy', { m: t(sortLabelKey) })}</span>}
          </div>
          {rows.length === 0
            ? <EmptyState t={t} onClear={() => { setQ(''); setSide('all'); }} />
            : <MobileList rows={rows} t={t} lang={lang} period={pr.baseline} />}
        </div>
      ) : (
        /* ===== DESKTOP / TABLET ===== */
        <>
          <div className="pl-tools">
            <div className="control pl-search">
              <Icon name="search" size={16} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('slist_filterPh')} aria-label={t('slist_filterPh')} />
              {q && <button className="clr" onClick={() => setQ('')} aria-label={t('plist_clear')}><Icon name="x" size={13} /></button>}
            </div>
            <SideChips side={side} setSide={setSide} t={t} />
          </div>

          <div className="pl-cap">
            <span className="pl-n">
              {filtered ? t('slist_filtered', { n: rows.length, total }) : t('slist_count', { n: total })}
            </span>
          </div>

          {rows.length === 0
            ? <div className="card"><EmptyState t={t} onClear={() => { setQ(''); setSide('all'); }} /></div>
            : <SquadsTable rows={rows} sort={sort} onSort={onSort} t={t} lang={lang} period={pr.baseline} showSecondary={showSecondary} showTrend={showTrend} weeks={weeks} density={density} />}
        </>
      )}
    </div>
  );
}

function EmptyState({ t, onClear }) {
  return (
    <div className="pl-empty">
      <span className="pe-ic"><Icon name="users" size={22} /></span>
      <span className="pe-t">{t('slist_empty')}</span>
      <Button variant="secondary" size="sm" icon="x" onClick={onClear}>{t('plist_clear')}</Button>
    </div>
  );
}

window.SquadsList = SquadsList;
