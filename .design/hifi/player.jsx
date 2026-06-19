/* hifi/player.jsx — Player profile (hi-fi, Solid Stats DS).
   Headline view = how the player has performed over recent WEEKS, read against
   meaningful thresholds (tier color + pip meter). Desktop A = identity band +
   summary + weekly perf chart + weekly table + arsenal, with an identity /
   commander / bounty rail. Mobile A = stats-led, segmented Weeks / Arsenal / Identity.
   Reuses kit primitives (Icon, Button, Badge, Avatar, Provenance) + kit.css + player.css. */
const { useState } = React;
const P = window.SS_PLAYER;
const TIER = window.SS_TIER;
/* side (faction) → DS semantic color, shared with Overview's SideLabel */
const SIDE_COLOR = { red: 'var(--loss)', blue: 'var(--info)', yellow: 'var(--warn)', green: 'var(--win)', gray: 'var(--fg-3)' };
const sideColor = (s) => SIDE_COLOR[s] || 'var(--fg-3)';

/* month/year date formatting for identity history (dates, not rotations) */
const MONTHS = {
  RU: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  EN: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
function fmtMon(lang, ym) { return ym ? `${MONTHS[lang][ym[1]]} ${ym[0]}` : ''; }
function fmtSpan(lang, from, to, nowLabel) { return `${fmtMon(lang, from)} — ${to ? fmtMon(lang, to) : nowLabel}`; }

/* ---------- A: provenance line — how the headline aggregate was derived ---------- */
function ProvenanceLine({ t, lang, fresh = 'ok' }) {
  const p = P.provenance;
  return (
    <div className="prov-line">
      <a className="prov-item prov-link">
        <Icon name="database" size={14} />{t('provReplays', { n: p.replays })}
      </a>
      <span className="prov-sep" />
      <Freshness t={t} state={fresh} mins={p.updatedMin} />
      <span className="prov-sep" />
      <a className="prov-item prov-link"><Icon name="function-square" size={14} />{t('provHow')}</a>
    </div>
  );
}

/* shared identity sub-blocks (used by mobile IdentityCard + desktop ReferencePanel).
   Desktop caps a visible window and scrolls inside it; MOBILE never nests a scroll
   (the page already scrolls) — it shows top-N with a "show all" expander instead. */
function MoreBtn({ open, total, t, onClick }) {
  return (
    <button className="more-btn" onClick={onClick}>
      {open ? t('collapse') : t('showAllN', { n: total })}
      <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} />
    </button>
  );
}
function SteamList({ lang, t, steam, mobile }) {
  // A pending SteamID merge is a workflow footnote, NOT a trust banner: it renders as a
  // quiet inline row in the list it belongs to (amber "pending review" state + request
  // link), attached to the data it describes — never a detached box floating in the column.
  return (
    <div className="steam-block">
      <div className={mobile ? 'steam-rows' : 'steam-rows hist-scroll steam-scroll'}>
        {steam.map(s => (
          <div className="steam-row" key={s.id}>
            <span className="steam-ic"><Icon name="user" size={13} /></span>
            <span className="steam-id">{s.id}</span>
            <span className={`badge ${s.kind === 'primary' ? 'b-primary' : 'b-neutral'}`} style={{ padding: '2px 7px', fontSize: 10 }}>{t(s.kind)}</span>
            <span className="steam-since">{t('since', { d: fmtMon(lang, s.since) })}</span>
          </div>
        ))}
        {P.pendingLink && (
          <div className="steam-row steam-row--pending" key="pending">
            <span className="steam-ic"><Icon name="user" size={13} /></span>
            <span className="steam-id">{P.pendingLink.steam}</span>
            <span className="badge b-warn" style={{ padding: '2px 7px', fontSize: 10 }}><Icon name="circle-help" size={10} />{t('pendingLink')}</span>
            <a className="steam-since req-link">{t('reqRef', { id: P.pendingLink.req })}</a>
          </div>
        )}
      </div>
    </div>
  );
}
function NickHistory({ lang, t, nicks, mobile }) {
  const [open, setOpen] = useState(false);
  const cap = 6;
  const vis = mobile && !open ? nicks.slice(0, cap) : nicks;
  return (
    <div className={mobile ? 'hist' : 'hist hist-scroll'}>
      {vis.map((n, i) => (
        <div className="hist-row" key={n.name + i}>
          <span className={`chip${i === 0 ? ' cur' : ''}`}>{n.name}</span>
          <span className="hist-when">{fmtSpan(lang, n.from, n.to, t('now'))}</span>
        </div>
      ))}
      {mobile && nicks.length > cap && <MoreBtn open={open} total={nicks.length} t={t} onClick={() => setOpen(o => !o)} />}
    </div>
  );
}
function SquadHistory({ lang, t, timeline, mobile }) {
  const [open, setOpen] = useState(false);
  const cap = 4;
  const vis = mobile && !open ? timeline.slice(0, cap) : timeline;
  return (
    <div className={mobile ? 'timeline' : 'timeline hist-scroll'}>
      {vis.map((tl, i) => (
        <div className="tl-item" key={tl.tag + i}>
          <span className="tl-dot" style={tl.cur ? { borderColor: 'var(--primary-border)', background: 'var(--primary-weak)' } : {}}>
            <Icon name="users" size={14} />
          </span>
          <div className="tl-body">
            <div className="t"><b>{tl.squad}</b> <span className="mono" style={{ color: 'var(--fg-3)', fontSize: 11 }}>[{tl.tag}]</span></div>
            <div className="when">{fmtSpan(lang, tl.from, tl.to, t('now'))}</div>
          </div>
        </div>
      ))}
      {mobile && timeline.length > cap && <MoreBtn open={open} total={timeline.length} t={t} onClick={() => setOpen(o => !o)} />}
    </div>
  );
}
/* section label with a count chip (история ников · 15) */
function RefLabel({ icon, children, count }) {
  return (
    <span className="t-label ref-label">
      {icon && <Icon name={icon} size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} />}
      {children}
      <span className="ref-count">{count}</span>
    </span>
  );
}

/* ---------- tier atoms ---------- */
/* tier thresholds (good / elite) per metric — drive the visual level scales */
const THR = { score: { good: 3, elite: 5 }, kd: { good: 5, elite: 10 } };

/* level boundaries come from the whole playerbase for the active period (SS_BASELINE) */
function periodLabel(t) {
  const B = window.SS_BASELINE;
  return B.period === 'rotation' ? t('period_rotation', { n: B.rotationNo }) : t('period_alltime');
}

/* horizontal level scale: 4 named tier zones, each labelled with its NAME + the
   value it starts at (population-derived). Current zone lit + a marker on the bar.
   Labels are a per-zone name+threshold (short), so they never collide the way a
   single run of 4 words does. */
function TierScale({ metric, value, t }) {
  const b = window.SS_BASELINE.get(metric);
  const segs = [
    { tier: 'low',   lo: 0,       hi: b.base,  entry: null },
    { tier: 'base',  lo: b.base,  hi: b.good,  entry: b.base },
    { tier: 'good',  lo: b.good,  hi: b.elite, entry: b.good },
    { tier: 'elite', lo: b.elite, hi: b.elite + (b.elite - b.good), entry: b.elite },
  ];
  let curIdx = 0, pos = 0;
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (value >= s.hi && i < segs.length - 1) continue;
    curIdx = i;
    const frac = Math.min(Math.max((value - s.lo) / (s.hi - s.lo), 0), 1);
    pos = (i + frac) / segs.length;
    break;
  }
  if (value < 0) { curIdx = 0; pos = 0; }
  const fmt = (n) => Number.isInteger(n) ? String(n) : n.toFixed(1);
  return (
    <div className="tscale">
      <div className="tscale-track">
        {segs.map((s, i) => <span key={s.tier} className={`tscale-seg tierc tier-${s.tier}${i === curIdx ? ' on' : ''}`} />)}
        <span className="tscale-marker" style={{ left: `${(pos * 100).toFixed(1)}%` }} />
      </div>
      <div className="tscale-legend">
        {segs.map((s, i) => (
          <span key={s.tier} className={`tsl tierc tier-${s.tier}${i === curIdx ? ' on' : ''}`}>
            <span className="tsl-num">{s.entry == null ? `<${fmt(b.base)}` : `≥${fmt(s.entry)}`}</span>
            <span className="tsl-name">{t('tierS_' + s.tier)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* hero stat tile — SCORE / K/D with tier color + chip + level scale + formula */
function HeroTile({ icon, label, value, tier, metric, formula, t }) {
  return (
    <div className={`hero-tile tierc tier-${tier}`}>
      <div className="ht-top">
        <span className="ht-label"><Icon name={icon} size={14} />{label}</span>
        <span className="tier-chip">{t('tier_' + tier)}</span>
      </div>
      <div className="ht-main">
        <span className="ht-val">{value.toFixed(2)}</span>
      </div>
      <TierScale metric={metric} value={value} t={t} />
      <div className="ht-note">{t('thresholdsBy', { p: periodLabel(t) })}</div>
      <div className="ht-formula">{formula}</div>
    </div>
  );
}

function Mini({ icon, label, value, sub, warn }) {
  return (
    <div className="mini">
      <span className="mk"><Icon name={icon} size={12} />{label}</span>
      <div className={`mv${warn ? ' warn' : ''}`}>{value}</div>
      {sub && <div className="msub">{sub}</div>}
    </div>
  );
}

/* ---------- weekly performance chart (metric toggle: Score / K/D) ---------- */
function PerfChart({ lang, t }) {
  const [metric, setMetric] = useState('score');
  const series = P.weeks.slice().reverse();           // oldest → newest (left → right)
  const vals = series.map(w => metric === 'kd' ? w.kd : w.score);
  const b = window.SS_BASELINE.get(metric);
  const tierOf = (w) => metric === 'kd' ? TIER.kd(w.kd) : TIER.score(w.score);
  const dataMax = Math.max(...vals), dataMin = Math.min(...vals);
  const vMax = Math.max(dataMax * 1.12, b.good);        // follows the data; 'отлично' shows only if reached
  const vMin = Math.min(0, dataMin * 1.35);              // headroom for sub-zero bars
  const range = vMax - vMin;
  const pct = (v) => ((v - vMin) / range) * 100;
  const zeroPct = pct(0);
  const zones = [
    { tier: 'low',   lo: 0,       hi: b.base },
    { tier: 'base',  lo: b.base,  hi: b.good },
    { tier: 'good',  lo: b.good,  hi: b.elite },
    { tier: 'elite', lo: b.elite, hi: vMax },
  ].filter(z => z.lo < vMax && z.hi > z.lo);

  return (
    <div className="card perf-card">
      <div className="perf-head">
        <h3><Icon name="trending-up" />{t('perfTitle')}<span className="perf-sub">{t('perfSub', { n: series.length })}</span></h3>
        <div className="metric-seg" role="tablist">
          {[['score', t('metric_score')], ['kd', t('metric_kd')]].map(([id, lbl]) => (
            <button key={id} role="tab" aria-selected={metric === id} className={metric === id ? 'on' : ''} onClick={() => setMetric(id)}>{lbl}</button>
          ))}
        </div>
      </div>
      <div className="perf-body">
        <div className="perf-chart">
          <div className="perf-zones">
            {zones.map(z => (
              <div key={z.tier} className={`perf-zone tierc tier-${z.tier}`}
                   style={{ bottom: `${pct(z.lo).toFixed(2)}%`, height: `${(pct(Math.min(z.hi, vMax)) - pct(z.lo)).toFixed(2)}%` }}>
                <span className="perf-zone-lbl">{t('tierS_' + z.tier)}</span>
              </div>
            ))}
            {vMin < 0 && (
              <div className="perf-zone perf-zone-neg" style={{ bottom: `${pct(vMin).toFixed(2)}%`, height: `${(zeroPct - pct(vMin)).toFixed(2)}%` }}>
                <span className="perf-zone-lbl">&lt; 0</span>
              </div>
            )}
            <div className="perf-zero" style={{ bottom: `${zeroPct.toFixed(2)}%` }}><span className="perf-zero-num">0</span></div>
          </div>
          {series.map((w, i) => {
            const v = metric === 'kd' ? w.kd : w.score;
            const tier = tierOf(w);
            const cur = i === series.length - 1;
            const neg = v < 0;
            const vp = pct(v);
            const barBottom = Math.min(vp, zeroPct);
            const barHeight = Math.max(Math.abs(vp - zeroPct), 0.8);
            return (
              <div key={i} className={`perf-col tierc tier-${tier}${cur ? ' cur' : ''}`}
                   title={`${window.SS_RANGE_SHORT(lang, w.s, w.e)} · ${v.toFixed(2)}`}>
                <span className={`barfill tier-${tier}${neg ? ' neg' : ''}`} style={{ bottom: `${barBottom.toFixed(2)}%`, height: `${barHeight.toFixed(2)}%` }} />
                <span className="perf-colval" style={neg ? { bottom: `max(2px, calc(${vp.toFixed(2)}% - 15px))` } : { bottom: `calc(${vp.toFixed(2)}% + 2px)` }}>{v.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
        <div className="perf-xrow">
          {series.map((w, i) => <span key={i} className="perf-x">{window.SS_WEEK_SHORT(lang, w.e)}</span>)}
        </div>
      </div>
      <div className="perf-foot">
        <span className="legend">{metric === 'kd' ? t('kdFormula') : t('scoreFormula')}</span>
        <span className="legend perf-thr">{t('thresholdsBy', { p: periodLabel(t) })}</span>
      </div>
    </div>
  );
}

/* ---------- per-game match row (used in week expansion, desktop + mobile) ---------- */
function MatchRow({ m, lang, t }) {
  const sc = window.SS_MATCH.score(m), st = TIER.score(sc);
  const resColor = { W: 'var(--win)', L: 'var(--loss)', Unknown: 'var(--warn)' }[m.result];
  const resIcon = { W: 'check', L: 'x', Unknown: 'circle-help' }[m.result];
  return (
    <a className="match-row" title={`#${m.replay} · ${m.map}`}>
      <span className="mr-rep mono"><Icon name="film" size={13} />#{m.replay}</span>
      <span className="mr-map">{m.map}</span>
      <span className="mr-side mono">{m.side}</span>
      <span className="mr-res" style={{ color: resColor }}><Icon name={resIcon} size={12} /><span className="mr-res-t">{t('res_' + m.result)}</span></span>
      <span className="mr-kd mono">{m.kills}<i>K</i> {m.deaths}<i>D</i>{m.tk ? <em> {m.tk}TK</em> : null}</span>
      <span className={`mr-score cell-tier tierc tier-${st}`}><b>{sc.toFixed(2)}</b></span>
    </a>
  );
}

/* ---------- weekly table (rows expand to per-game matches) ---------- */
function WeeklyTable({ lang, t, density = 'comfortable' }) {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(o => o === i ? null : i);
  return (
    <div className="card">
      <div className="card-head">
        <h3><Icon name="calendar-days" />{t('weeklyTitle')}</h3>
        <Button variant="ghost" size="sm" icon="arrow-right">{t('showAll')}</Button>
      </div>
      <div className="tw">
        <table className={`tbl tbl-tight wk-tbl${density === 'compact' ? ' compact' : ''}`}>
          <thead><tr>
            <th className="l">{t('c_week')}</th>
            <th>{t('m_games')}</th>
            <th>{t('m_kills')}</th>
            <th className="col-sec">{t('c_veh')}</th>
            <th className="col-sec">{t('m_tk')}</th>
            <th className="col-sec">{t('m_deaths')}</th>
            <th title={t('kdScale')}>{t('m_kd')}</th>
            <th title={t('scoreScale')}>{t('m_score')}</th>
            <th className="col-x" aria-hidden="true"></th>
          </tr></thead>
          <tbody>
            {P.weeks.map((w, i) => {
              const st = TIER.score(w.score), kt = TIER.kd(w.kd);
              const isOpen = open === i;
              return (
                <React.Fragment key={i}>
                  <tr className={`wk-row${i === 0 ? ' row-cur' : ''}${isOpen ? ' is-open' : ''}`} onClick={() => toggle(i)}>
                    <td className="l">
                      <div className="wk-name">
                        <span className="wk-t">{window.SS_RANGE_SHORT(lang, w.s, w.e)}{i === 0 && <span className="badge b-primary" style={{ marginLeft: 8, padding: '1px 6px', fontSize: 10 }}>{t('current')}</span>}</span>
                      </div>
                    </td>
                    <td className="muted">{w.games}</td>
                    <td>{w.kills}</td>
                    <td className="muted col-sec">{w.vehK || '—'}</td>
                    <td className="col-sec" style={{ color: w.tk ? 'var(--warn)' : 'var(--fg-3)' }}>{w.tk}</td>
                    <td className="muted col-sec">{w.deaths}</td>
                    <td><span className={`cell-tier tierc tier-${kt}`}><Pips tier={kt} /><b>{w.kd.toFixed(2)}</b></span></td>
                    <td><span className={`cell-tier tierc tier-${st}`}><Pips tier={st} /><b>{w.score.toFixed(2)}</b></span></td>
                    <td className="col-x"><Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} /></td>
                  </tr>
                  {isOpen && (
                    <tr className="match-wrap">
                      <td colSpan={9}>
                        <div className="match-list">
                          <div className="match-list-head"><Icon name="film" size={13} />{w.games} {t('expandWeek')} · {t('matchesNote')}</div>
                          {w.matches.map((m, mi) => <MatchRow key={mi} m={m} lang={lang} t={t} />)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- arsenal (weapons / vehicles) ----------
   DESKTOP: fixed ~6-row window that scrolls inside the card (equal-height cards).
   MOBILE: no nested scroll (the page scrolls) — show top-N with a "show all" expander. */
function BreakTable({ title, icon, rows, colLabel, t, density = 'comfortable', slots = 6, mobile = false }) {
  const [open, setOpen] = useState(false);
  const total = rows.length;
  const visible = mobile && !open ? rows.slice(0, slots) : rows;
  const pad = mobile ? 0 : Math.max(0, slots - total);
  const scrolls = !mobile && total > slots;
  return (
    <div className="card">
      <div className="card-head">
        <h3><Icon name={icon} />{title}</h3>
        <span className="t-caption">{t('byKills')} · {total}</span>
      </div>
      <div className={`tw${mobile ? '' : ' brk-scroll'}${scrolls ? ' is-scroll' : ''}`}>
        <table className={`tbl${density === 'compact' ? ' compact' : ''}`}>
          <thead><tr>
            <th className="l">#</th>
            <th className="l">{colLabel}</th>
            <th>{t('m_kills')}</th>
            <th>{t('c_maxdist')}</th>
          </tr></thead>
          <tbody>
            {visible.map((r, i) => (
              <tr key={r.name}>
                <td className="l rank">{i + 1}</td>
                <td className="l" style={{ fontWeight: 600, color: 'var(--fg-1)' }}>{r.name}</td>
                <td>{r.kills}</td>
                <td className="muted">{r.dist}{lang_m()}</td>
              </tr>
            ))}
            {Array.from({ length: pad }).map((_, i) => (
              <tr className="row-empty" key={'e' + i} aria-hidden="true">
                <td className="l rank">{total + i + 1}</td>
                <td className="l">—</td>
                <td>—</td>
                <td>—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mobile && total > slots && <MoreBtn open={open} total={total} t={t} onClick={() => setOpen(o => !o)} />}
    </div>
  );
}
function lang_m() { return 'м'; }   // distances are recorded in metres (legacy uses «м.»)

/* ---------- rail cards ---------- */
function IdentityCard({ lang, t, steam, nicks, timeline, mobile }) {
  return (
    <div className="card rail-card">
      <div className="rail-sec rail-sec--first">
        <RefLabel count={steam.length}>{t('steamidsLabel')}</RefLabel>
        <SteamList lang={lang} t={t} steam={steam} mobile={mobile} />
      </div>

      <div className="rail-sec">
        <RefLabel count={nicks.length}>{t('nicknamesLabel')}</RefLabel>
        <NickHistory lang={lang} t={t} nicks={nicks} mobile={mobile} />
      </div>

      <div className="rail-sec">
        <RefLabel count={timeline.length}>{t('squadHistLabel')}</RefLabel>
        <SquadHistory lang={lang} t={t} timeline={timeline} mobile={mobile} />
      </div>
    </div>
  );
}

function CommanderCard({ t }) {
  const c = P.commander;
  return (
    <div className="card rail-card">
      <div className="rc-head"><h3><Icon name="shield" />{t('commanderTitle')}</h3></div>
      <div className="ks-badges">
        <span className="ks-games"><span className="v mono">{c.games}</span><span className="k">{t('ks_games')}</span></span>
        <span className="badge b-win"><Icon name="check" />{c.w} {t('ks_w')}</span>
        <span className="badge b-loss"><Icon name="x" />{c.l} {t('ks_l')}</span>
        <span className="badge b-warn"><Icon name="circle-help" />{c.unk} {t('ks_unknown')}</span>
      </div>
      <div className="ks-note">{t('ks_note')}</div>
    </div>
  );
}

/* desktop reference footer: SteamIDs · nicknames · squad history · commander —
   one full-width card with 4 internal columns, so nothing is a near-empty strip
   and there is no side-by-side height mismatch. */
function ReferencePanel({ lang, t, steam, nicks, timeline }) {
  const c = P.commander;
  return (
    <div className="card ref-panel">
      <div className="ref-col">
        <RefLabel count={steam.length}>{t('steamidsLabel')}</RefLabel>
        <div className="ref-body">
          <SteamList lang={lang} t={t} steam={steam} />
        </div>
      </div>

      <div className="ref-col">
        <RefLabel count={nicks.length}>{t('nicknamesLabel')}</RefLabel>
        <div className="ref-body">
          <NickHistory lang={lang} t={t} nicks={nicks} />
        </div>
      </div>

      <div className="ref-col">
        <RefLabel count={timeline.length}>{t('squadHistLabel')}</RefLabel>
        <div className="ref-body">
          <SquadHistory lang={lang} t={t} timeline={timeline} />
        </div>
      </div>

      <div className="ref-col">
        <span className="t-label"><Icon name="shield" size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} />{t('commanderTitle')}</span>
        <div className="ref-body">
          <div className="ks-badges">
            <span className="ks-games"><span className="v mono">{c.games}</span><span className="k">{t('ks_games')}</span></span>
            <span className="badge b-win"><Icon name="check" />{c.w} {t('ks_w')}</span>
            <span className="badge b-loss"><Icon name="x" />{c.l} {t('ks_l')}</span>
            <span className="badge b-warn"><Icon name="circle-help" />{c.unk} {t('ks_unknown')}</span>
          </div>
          <div className="ks-note">{t('ks_note')}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- identity band (shared head) ---------- */
function Band({ t, lang }) {
  const c = P.career;
  return (
    <div className="pf-band">
      <div className="pf-id">
        <div className="pf-namerow">
          <span className="pf-name">{P.nick}</span>
          <span className="badge b-neutral squad-ref"><span className="side-dot" style={{ background: sideColor(P.side) }} />{P.squad}<span className="sq-tag">[{P.tag}]</span></span>
          <span className="pf-rank">{t('pf_rank')} #{P.rank}</span>
        </div>
        <div className="pf-meta">
          <a className="pf-extlink" href={`https://sg.zone/profile/${P.nick}`} target="_blank" rel="noopener noreferrer">
            <Icon name="external-link" size={13} /><span>{`sg.zone/profile/${P.nick}`}</span>
          </a>
        </div>
      </div>
      <div className="pf-actions">
        <div className="pf-actbtns">
          <Button variant="secondary" size="sm" icon="film">{t('act_replays')}</Button>
          <Button variant="primary" size="sm" icon="flag-triangle-right">{t('act_correction')}</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- summary (desktop) ---------- */
function Summary({ t, lang, fresh }) {
  const c = P.career;
  return (
    <div>
      <div className="pf-hero">
        <HeroTile icon="crosshair" label={t('m_score')} value={c.score} tier={TIER.score(c.score)} metric="score" formula={t('scoreFormula')} t={t} />
        <HeroTile icon="swords" label={t('m_kd')} value={c.kd} tier={TIER.kd(c.kd)} metric="kd" formula={t('kdFormula')} t={t} />
      </div>
      <div className="pf-mini">
        <Mini icon="gamepad-2" label={t('m_games')} value={c.games} />
        <Mini icon="crosshair" label={t('m_kills')} value={c.kills} sub={`${c.vehKills} ${t('c_veh').toLowerCase()} · ${c.vehPct}%`} />
        <Mini icon="users" label={t('m_tk')} value={c.tk} warn />
        <Mini icon="skull" label={t('m_deaths')} value={c.deaths} />
        <Mini icon="user-x" label={t('m_deathsTk')} value={c.deathsTk} warn />
        <Mini icon="target" label={t('bountyTitle')} value={P.bounty.pts} sub={t('bountyRot', { r: P.bounty.rotation })} />
      </div>
      <ProvenanceLine t={t} lang={lang} fresh={fresh} />
    </div>
  );
}

/* ===================== PAGE ===================== */
function PlayerProfile({ lang, device = 'desktop', dataset = 'typical', fresh = 'ok' }) {
  const t = (k, v) => window.SS_T(lang, k, v);
  const winMobile = window.useMedia('(max-width: 980px)');
  const isMobile = device === 'mobile' || (device === 'desktop' && winMobile);
  const density = (device === 'desktop' && !winMobile) ? 'comfortable' : 'compact';
  const src = dataset === 'heavy' ? P.heavy : P;

  if (isMobile) return <MobileProfile lang={lang} t={t} src={src} fresh={fresh} />;

  return (
    <div className="container">
      <div className="crumb"><a className="crumb-link" onClick={() => window.ssGo('players')}>{t('crumb_players')}</a><span className="sep">/</span><span className="cur">{P.nick}</span></div>
      <Band t={t} lang={lang} />
      <Summary t={t} lang={lang} fresh={fresh} />
      <div className="section-gap"><PerfChart lang={lang} t={t} /></div>
      <div className="section-gap"><WeeklyTable lang={lang} t={t} density={density} /></div>
      <div className="two-up section-gap">
        <BreakTable title={t('weaponsTitle')} icon="crosshair" rows={src.weapons} colLabel={t('c_weapon')} t={t} density={density} />
        <BreakTable title={t('vehiclesTitle')} icon="truck" rows={src.vehicles} colLabel={t('c_vehicle')} t={t} density={density} />
      </div>
      <div className="section-gap"><ReferencePanel lang={lang} t={t} steam={src.steam} nicks={src.nickHistory} timeline={src.timeline} /></div>
    </div>
  );
}

/* ---------- mobile ---------- */
function MobileProfile({ lang, t, src, fresh = 'ok' }) {
  const c = P.career;
  const [seg, setSeg] = useState('weeks');
  const [openWk, setOpenWk] = useState(null);
  return (
    <div className="container">
      <div className="m-pf">
        <div className="m-pf-head">
          <div className="pf-namerow">
            <span className="pf-name" style={{ fontSize: 26 }}>{P.nick}</span>
            <span className="badge b-neutral squad-ref"><span className="side-dot" style={{ background: sideColor(P.side) }} />{P.squad}<span className="sq-tag">[{P.tag}]</span></span>
          </div>
          <div className="m-meta">
            <span className="m-rank mono"><Icon name="trophy" size={12} />#{P.rank}</span>
            <a className="pf-extlink" href={`https://sg.zone/profile/${P.nick}`} target="_blank" rel="noopener noreferrer">
              <Icon name="external-link" size={13} /><span>{`sg.zone/profile/${P.nick}`}</span>
            </a>
          </div>
        </div>

        <div className="m-headfoot">
          <Button variant="primary" icon="flag-triangle-right" style={{ width: '100%' }}>{t('act_correction')}</Button>
        </div>

        <div className="pf-hero">
          <HeroTile icon="crosshair" label={t('m_score')} value={c.score} tier={TIER.score(c.score)} metric="score" formula={t('scoreFormula')} t={t} />
          <HeroTile icon="swords" label={t('m_kd')} value={c.kd} tier={TIER.kd(c.kd)} metric="kd" formula={t('kdFormula')} t={t} />
        </div>
        <div className="pf-mini">
          <Mini icon="gamepad-2" label={t('m_games')} value={c.games} />
          <Mini icon="crosshair" label={t('m_kills')} value={c.kills} />
          <Mini icon="users" label={t('m_tk')} value={c.tk} warn />
          <Mini icon="skull" label={t('m_deaths')} value={c.deaths} />
          <Mini icon="user-x" label={t('m_deathsTk')} value={c.deathsTk} warn />
          <Mini icon="target" label={t('bountyTitle')} value={P.bounty.pts} sub={t('bountyRot', { r: P.bounty.rotation })} />
        </div>
        <ProvenanceLine t={t} lang={lang} fresh={fresh} />

        <PerfChart lang={lang} t={t} />

        <div className="m-seg">
          {[['weeks', t('seg_weeks')], ['weapons', t('seg_weapons')], ['identity', t('seg_identity')]].map(([id, lbl]) => (
            <button key={id} className={seg === id ? 'on' : ''} onClick={() => setSeg(id)}>{lbl}</button>
          ))}
        </div>

        {seg === 'weeks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {P.weeks.map((w, i) => {
              const st = TIER.score(w.score);
              const isOpen = openWk === i;
              return (
                <div className={`card wk-card tierc tier-${st}${isOpen ? ' is-open' : ''}`} key={i} onClick={() => setOpenWk(o => o === i ? null : i)}>
                  <div className="wc-top">
                    <span className="wc-week"><b>{window.SS_RANGE_SHORT(lang, w.s, w.e)}</b>{i === 0 && <span className="badge b-primary" style={{ padding: '1px 6px', fontSize: 10 }}>{t('current')}</span>}</span>
                    <span className="cell-tier"><Pips tier={st} /><b style={{ fontSize: 18, color: 'var(--tc)', fontFamily: 'var(--font-display)' }}>{w.score.toFixed(2)}</b><Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={15} /></span>
                  </div>
                  <div className="wc-stats">
                    <span>{w.games} {t('m_games').toLowerCase()}</span>
                    <span>{w.kills}K · {w.deaths}D</span>
                    <span>{w.kd.toFixed(2)} {t('m_kd')}</span>
                    {w.vehK > 0 && <span>{w.vehK} {t('c_veh').toLowerCase()}</span>}
                  </div>
                  {isOpen && (
                    <div className="match-list" style={{ padding: 0, marginTop: 4 }}>
                      {w.matches.map((m, mi) => <MatchRow key={mi} m={m} lang={lang} t={t} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {seg === 'weapons' && (
          <div className="m-arsenal" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <BreakTable title={t('weaponsTitle')} icon="crosshair" rows={src.weapons} colLabel={t('c_weapon')} t={t} density="compact" mobile />
            <BreakTable title={t('vehiclesTitle')} icon="truck" rows={src.vehicles} colLabel={t('c_vehicle')} t={t} density="compact" mobile />
          </div>
        )}

        {seg === 'identity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <IdentityCard lang={lang} t={t} steam={src.steam} nicks={src.nickHistory} timeline={src.timeline} mobile />
            <CommanderCard t={t} />
          </div>
        )}
      </div>
    </div>
  );
}

window.PlayerProfile = PlayerProfile;
