/* hifi/overview.jsx — Stats Overview (hi-fi, Solid Stats DS).
   SCORE = kills ÷ games is the headline metric. K/D omitted (full list / profile).
   Desktop = multi-column digest · Mobile = segmented leaderboards.
   Reuses kit primitives (Icon, Button, Badge, Avatar, Provenance) + kit.css classes. */
const { useState, useEffect } = React;
const OV = window.SS_OV;

/* squad tag → side (faction), so a player's squad can carry its side color */
const SQUAD_SIDE = (OV.squads || []).reduce((m, s) => { m[s.tag] = s.side; return m; }, {});
/* player's squad reference with a side-color dot (DS: color paired with the tag label) */
function PlayerSquad({ squad, t }) {
  if (!squad) return <span className="sq-ref muted">{t('noSquad')}</span>;
  const c = (window.SS_OV_SIDE && window.SS_OV_SIDE(squad)) || 'var(--fg-3)';
  return <span className="sq-ref"><span className="side-dot" style={{ background: c }} />{squad}</span>;
}
window.SS_OV_SIDE = (tag) => ({ red: 'var(--loss)', blue: 'var(--info)', yellow: 'var(--warn)', green: 'var(--win)', gray: 'var(--fg-3)' }[SQUAD_SIDE[tag]] || 'var(--fg-3)');

function useMedia(q) {
  const [m, setM] = useState(() => (window.__FORCE_MOBILE != null ? window.__FORCE_MOBILE : window.matchMedia(q).matches));
  useEffect(() => {
    const mq = window.matchMedia(q);
    const fn = () => setM(window.__FORCE_MOBILE != null ? window.__FORCE_MOBILE : mq.matches);
    mq.addEventListener('change', fn);
    window.addEventListener('forcemedia', fn);
    return () => { mq.removeEventListener('change', fn); window.removeEventListener('forcemedia', fn); };
  }, [q]);
  return m;
}

/* ---------- shared atoms ---------- */
/* Score cell — tier color + pips, IDENTICAL treatment to the player profile (kit.css). */
function ScoreCell({ v, big, pips = true }) {
  const tier = window.SS_TIER ? window.SS_TIER.score(v) : 'base';
  return (
    <span className={`cell-tier tierc tier-${tier}`} title="">
      {pips && <Pips tier={tier} />}
      <b style={{ fontSize: big ? 19 : 14 }}>{v.toFixed(2)}</b>
    </span>
  );
}

/* mini 4-week score trend — one bar PER WEEK, each colored by ITS OWN tier, so the
   dynamics read by color alone (a red week among greens jumps out). */
function ScoreTrend({ spark }) {
  const max = Math.max(...spark, 1);
  return (
    <span className="score-trend" aria-hidden="true">
      {spark.map((v, i) => {
        const tier = window.SS_TIER ? window.SS_TIER.score(v) : 'base';
        const h = Math.max(Math.round((Math.max(v, 0) / max) * 100), 8);
        return <i key={i} className={`stb tierc tier-${tier}`} style={{ height: `${h}%` }} title={v.toFixed(2)} />;
      })}
    </span>
  );
}

/* variable-width squad tag chip (handles 7th / inTeam / Wagner / SEAL / SMERSH) */
function TagChip({ children }) {
  return <span className="tag-chip">{children}</span>;
}

/* squad emblem placeholder (real emblem image drops in here later) — tinted by side */
function SquadEmblem({ side, s = 28 }) {
  const c = { blue: 'var(--info)', yellow: 'var(--warn)', red: 'var(--loss)', green: 'var(--win)', gray: 'var(--fg-3)' }[side] || 'var(--fg-3)';
  return (
    <span className="sq-emblem" style={{ width: s, height: s, flex: `0 0 ${s}px`, color: c }}>
      <Icon name="users" size={Math.round(s * 0.5)} />
    </span>
  );
}

/* player avatar placeholder (real Steam avatar drops in here later) */
function PlayerAvatar({ s = 28 }) {
  return (
    <span className="pl-avatar" style={{ width: s, height: s, flex: `0 0 ${s}px` }}>
      <Icon name="user" size={Math.round(s * 0.52)} />
    </span>
  );
}

function CapHead({ icon, title, action, onAction }) {
  return (
    <div className="card-head">
      <h3><Icon name={icon} />{title}</h3>
      {action && <Button variant="ghost" size="sm" icon="arrow-right" onClick={onAction}>{action}</Button>}
    </div>
  );
}

/* ---------- desktop leaderboard tables ---------- */
function PlayersTable({ t, density, rows = OV.players }) {
  return (
    <div className="tw">
      <table className={`tbl${density === 'compact' ? ' compact' : ''}`}>
        <thead><tr>
          <th className="l">{t('c_rank')}</th>
          <th className="l">{t('c_player')}</th>
          <th>{t('c_kills')}</th>
          <th>{t('c_games')}</th>
          <th className="col-trend">{t('c_trend')}</th>
          <th title={t('scoreHint')}>{t('c_score')}</th>
        </tr></thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={p.name} className="row-link" onClick={() => window.ssGo('player')}>
              <td className={`l rank${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</td>
              <td className="l"><div className="cell-id"><span className="nm">{p.name}</span><span className="sub"><PlayerSquad squad={p.squad} t={t} /></span></div></td>
              <td>{p.kills.toLocaleString('en-US')}</td>
              <td className="muted">{p.games}</td>
              <td className="col-trend">{p.spark ? <ScoreTrend spark={p.spark} /> : '—'}</td>
              <td><ScoreCell v={p.score} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* squad side → DS semantic color, matching sg.zone red/blue/yellow/green/gray */
const SIDE_COLOR = { red: 'var(--loss)', blue: 'var(--info)', yellow: 'var(--warn)', green: 'var(--win)', gray: 'var(--fg-3)' };
function SideLabel({ side, t }) {
  const c = SIDE_COLOR[side] || 'var(--fg-3)';
  return (
    <span className="side-label" style={{ color: c }}>
      <span className="side-dot" style={{ background: c }} />{t('side_' + side)}
    </span>
  );
}

/* shared leaderboard rows — IDENTICAL markup on desktop side-cards and mobile lists */
function SquadRow({ s, i, t }) {
  return (
    <div className="lb-row">
      <span className={`rank mono${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
      <span className="lb-name">
        <span className="lb-title"><b>{s.name}</b><TagChip>{s.tag}</TagChip></span>
        <span className="lb-sub"><SideLabel side={s.side} t={t} /> · {t('players_n', { n: s.members })}</span>
      </span>
      <span className="lb-score"><ScoreCell v={s.score} /><span className="lb-cap">{t('c_score')}</span></span>
    </div>
  );
}
function BountyRow({ b, i }) {
  return (
    <div className="lb-row">
      <span className={`rank mono${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
      <span className="lb-name"><b>{b.name}</b></span>
      <span className="badge b-warn lb-pts"><Icon name="target" />{b.pts.toLocaleString('en-US')}</span>
    </div>
  );
}

function SquadsTable({ t, density }) {
  return (
    <div className="tw">
      <table className={`tbl${density === 'compact' ? ' compact' : ''}`}>
        <thead><tr>
          <th className="l">{t('c_rank')}</th>
          <th className="l">{t('c_squad')}</th>
          <th>{t('c_score')}</th>
        </tr></thead>
        <tbody>
          {OV.squads.map((s, i) => (
            <tr key={s.tag}>
              <td className={`l rank${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</td>
              <td className="l"><div className="cell-id"><span className="nm sq-nm"><b>{s.name}</b><TagChip>{s.tag}</TagChip></span><span className="sub"><SideLabel side={s.side} t={t} /> · {t('players_n', { n: s.members })}</span></div></td>
              <td><ScoreCell v={s.score} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function BountyTable({ t, density, n = 10 }) {
  return (
    <div className="tw">
      <table className={`tbl${density === 'compact' ? ' compact' : ''}`}>
        <thead><tr>
          <th className="l">{t('c_rank')}</th>
          <th className="l">{t('c_player')}</th>
          <th>{t('c_pts')}</th>
        </tr></thead>
        <tbody>
          {OV.bounty.slice(0, n).map((b, i) => (
            <tr key={b.name}>
              <td className={`l rank${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</td>
              <td className="l"><span className="nm" style={{ fontWeight: 600, color: 'var(--fg-1)' }}>{b.name}</span></td>
              <td><span className="badge b-warn lb-pts"><Icon name="target" />{b.pts.toLocaleString('en-US')}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReplaysTable({ t, density }) {
  return (
    <div className="tw">
      <table className={`tbl${density === 'compact' ? ' compact' : ''}`}>
        <thead><tr>
          <th className="l">{t('c_mission')}</th>
          <th className="l">{t('c_map')}</th>
          <th className="l">{t('c_result')}</th>
          <th>{t('c_kills')}</th>
          <th className="l">{t('c_top')}</th>
          <th className="l">{t('c_when')}</th>
        </tr></thead>
        <tbody>
          {OV.replays.map(r => (
            <tr key={r.id}>
              <td className="l"><div className="cell-id"><span className="nm">{r.mission}</span><span className="sub mono">#replay-{r.id}</span></div></td>
              <td className="l muted">{r.map}</td>
              <td className="l">{resultBadge(r, t)}</td>
              <td>{r.kills || '—'}</td>
              <td className="l" style={{ fontFamily: 'var(--font-sans)', color: 'var(--primary)' }}>{r.top}</td>
              <td className="l mono" style={{ color: 'var(--fg-3)' }}>{r.when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function resultBadge(r, t) {
  if (r.status === 'parsing') return <Badge kind="parsing">{t('parsing')}</Badge>;
  if (r.status === 'failed') return <Badge kind="failed">{t('failed')}</Badge>;
  if (r.outcome === 'win') return <Badge kind="win">{t('win')}</Badge>;
  if (r.outcome === 'loss') return <Badge kind="loss">{t('loss')}</Badge>;
  return <Badge kind="unknown">{t('unknown')}</Badge>;
}

/* ---------- mobile leaderboard list (one ranking in focus) ---------- */
function MobilePlayers({ t }) {
  return OV.players.map((p, i) => (
    <div className="lb-row row-link" key={p.name} onClick={() => window.ssGo('player')}>
      <span className={`rank mono${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
      <span className="lb-name">
        <span className="lb-title"><b>{p.name}</b></span>
        <span className="lb-sub"><PlayerSquad squad={p.squad} t={t} /> · {t('kills_n', { n: p.kills.toLocaleString('en-US') })} · {t('games_n', { n: p.games })}</span>
      </span>
      {p.spark && <ScoreTrend spark={p.spark} />}
      <span className="lb-score"><ScoreCell v={p.score} pips={false} /><span className="lb-cap">{t('c_score')}</span></span>
    </div>
  ));
}
function MobileSquads({ t }) {
  return OV.squads.map((s, i) => <SquadRow key={s.tag} s={s} i={i} t={t} />);
}
function MobileBounty({ t }) {
  return OV.bounty.map((b, i) => <BountyRow key={b.name} b={b} i={i} />);
}

function MobileReplays({ t }) {
  return OV.replays.slice(0, 4).map(r => (
    <div className="m-replay" key={r.id}>
      <div className="m-rep-main">
        <b>{r.mission}</b>
        <span className="lb-sub mono">{r.map} · #{r.id} · {r.when}</span>
      </div>
      {resultBadge(r, t)}
    </div>
  ));
}

/* ---------- rotation selector (real dropdown) ---------- */
function RotationSelect({ rot, setRot, t, lang }) {
  const [open, setOpen] = useState(false);
  const cur = OV.rotations.find(r => r.r === rot) || OV.rotations[0];
  return (
    <div className="rotsel">
      <button className="selpill" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-haspopup="listbox">
        <Icon name="repeat" size={15} />{t('rotation')} {rot}<Icon name="chevron-down" size={15} />
      </button>
      {open && (
        <>
          <div className="rotsel-back" onClick={() => setOpen(false)} />
          <div className="rotsel-menu" role="listbox">
            {OV.rotations.map(r => (
              <button key={r.r} role="option" aria-selected={r.r === rot}
                className={`rotsel-item${r.r === rot ? ' on' : ''}`}
                onClick={() => { setRot(r.r); setOpen(false); }}>
                <span className="rs-main"><Icon name="repeat" size={14} />{t('rotation')} {r.r}</span>
                <span className="rs-range">{window.SS_RANGE(lang, r.s, r.e)}</span>
                <span className="rs-check">{r.r === rot && <Icon name="check" size={14} />}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- search overlay (command-palette) — shared by desktop icon,
   tablet icon and the mobile search field ---------- */
function SearchOverlay({ open, onClose, lang }) {
  const t = (k, v) => window.SS_T(lang, k, v);
  const [q, setQ] = useState('');
  useEffect(() => {
    if (!open) return;
    setQ('');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;

  const ql = q.trim().toLowerCase();
  const players = OV.players.filter(p => !ql || p.name.toLowerCase().includes(ql) || (p.squad || '').toLowerCase().includes(ql)).slice(0, 4);
  const squads = OV.squads.filter(s => !ql || s.name.toLowerCase().includes(ql) || s.tag.toLowerCase().includes(ql)).slice(0, 3);
  const replays = OV.replays.filter(r => !ql || r.mission.toLowerCase().includes(ql) || r.map.toLowerCase().includes(ql) || r.id.includes(ql)).slice(0, 3);
  const total = players.length + squads.length + replays.length;

  return (
    <div className="search-scrim" onClick={onClose}>
      <div className="search-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="search-head">
          <div className="control">
            <Icon name="search" size={16} />
            <input className="search-input" autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={t('searchPh')} />
            <button className="search-close" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button>
          </div>
        </div>
        <div className="search-results">
          {total === 0 && <div className="search-empty">{t('noResults')} «{q}»</div>}
          {!ql && total > 0 && <div className="search-section-cap">{t('searchTop')}</div>}

          {players.length > 0 && <div className="search-group"><div className="search-group-cap"><Icon name="user" size={13} />{t('nav_players')}</div>
            {players.map(p => (
              <button className="search-row" key={p.name} onClick={() => window.ssGo('player')}>
                <span className="search-main"><b>{p.name}</b><span className="search-sub">{(p.squad || t('noSquad'))} · {t('kills_n', { n: p.kills.toLocaleString('en-US') })}</span></span>
                <span className="search-metric mono">{p.score.toFixed(2)} <span className="search-metric-cap">{t('c_score')}</span></span>
              </button>
            ))}</div>}

          {squads.length > 0 && <div className="search-group"><div className="search-group-cap"><Icon name="users" size={13} />{t('nav_squads')}</div>
            {squads.map(s => (
              <button className="search-row" key={s.tag}>
                <span className="search-main"><span className="search-title"><b>{s.name}</b><TagChip>{s.tag}</TagChip></span><span className="search-sub"><SideLabel side={s.side} t={t} /> · {t('players_n', { n: s.members })}</span></span>
                <span className="search-metric mono">{s.score.toFixed(2)} <span className="search-metric-cap">{t('c_score')}</span></span>
              </button>
            ))}</div>}

          {replays.length > 0 && <div className="search-group"><div className="search-group-cap"><Icon name="film" size={13} />{t('nav_replays')}</div>
            {replays.map(r => (
              <button className="search-row" key={r.id}>
                <span className="search-main"><b>{r.mission}</b><span className="search-sub mono">{r.map} · #{r.id} · {r.when}</span></span>
                {resultBadge(r, t)}
              </button>
            ))}</div>}
        </div>
        <div className="search-foot">
          <span><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd> {t('searchNavHint')}</span>
          <span><kbd className="kbd">⏎</kbd> {t('searchOpenHint')}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */
function StatsOverview({ lang, fresh, device = 'desktop', onSearch }) {
  const t = (k, v) => window.SS_T(lang, k, v);
  const fstate = typeof fresh === 'string' ? fresh : (fresh ? 'ok' : 'stale');
  const winMobile = useMedia('(max-width: 880px)');
  const isMobile = device === 'mobile' || (device === 'desktop' && winMobile);
  // density auto-follows the layout: desktop = comfortable, tablet/mobile = compact
  const density = (device === 'desktop' && !winMobile) ? 'comfortable' : 'compact';
  const gridCls = device === 'tablet' ? 'ov-grid cols2 section-gap'
                : device === 'desktop' ? 'ov-grid section-gap'
                : 'ov-grid cols3 section-gap';
  const [seg, setSeg] = useState('players');
  const [rot, setRot] = useState(14);
  const rotObj = OV.rotations.find(r => r.r === rot) || OV.rotations[0];

  return (
    <div className="container">
      <div className="page-head">
        <h1 className="page-title">{t('pageTitle')}</h1>
        <div className="ph-rot">
          {rotObj && <RotationSelect rot={rot} setRot={setRot} t={t} lang={lang} />}
        </div>
        <div className="ph-fresh">
          <Freshness t={t} state={fstate} mins={4} />
        </div>
        <div className="ph-date">
          {rotObj && <span className="rotsel-range mono">{window.SS_RANGE(lang, rotObj.s, rotObj.e)}</span>}
        </div>
      </div>

      {fstate !== 'ok' && <div className="banner"><Icon name={fstate === 'offline' ? 'wifi-off' : 'refresh-cw'} />{t('stale')}</div>}

      {isMobile ? (
        /* ===== MOBILE — segmented leaderboards ===== */
        <div className="m-wrap">
          <button className="control m-search" onClick={onSearch}><Icon name="search" /><span style={{ color: 'var(--fg-3)' }}>{t('searchPh')}</span></button>
          <div className="m-seg">
            {[['players', t('seg_players')], ['squads', t('seg_squads')], ['bounty', t('seg_bounty')]].map(([id, lbl]) => (
              <button key={id} className={seg === id ? 'on' : ''} onClick={() => setSeg(id)}>{lbl}</button>
            ))}
          </div>
          <div className="m-meta">
            <span className="mono">{t('players_n', { n: OV.totals.players })}</span>
          </div>
          <div className="card m-list">
            {seg === 'players' && <MobilePlayers t={t} />}
            {seg === 'squads' && <MobileSquads t={t} />}
            {seg === 'bounty' && <MobileBounty t={t} />}
          </div>
          <div className="m-section">
            <h3 className="m-sec-title">{t('recentReplays')}</h3>
            <span className="lb-cap" style={{ color: 'var(--primary)' }}>{t('viewAll')} →</span>
          </div>
          <div className="card m-list">
            <MobileReplays t={t} />
          </div>
        </div>
      ) : (
        /* ===== DESKTOP — multi-column digest ===== */
        <>
          <div className={gridCls}>
            <div className="card">
              <CapHead icon="trophy" title={t('topPlayers')} action={t('viewAll')} onAction={() => window.ssGo('players')} />
              <PlayersTable t={t} density={density} />
            </div>
            <div className="card">
              <CapHead icon="users" title={t('topSquads')} action={t('viewAll')} onAction={() => {}} />
              <SquadsTable t={t} density={density} />
            </div>
            <div className="card">
              <CapHead icon="target" title={t('bountyBoard')} action={t('viewAll')} onAction={() => {}} />
              <BountyTable t={t} density={density} />
            </div>
          </div>
          <div className="card section-gap">
            <CapHead icon="film" title={t('recentReplays')} action={t('viewAll')} onAction={() => {}} />
            <ReplaysTable t={t} density={density} />
          </div>
        </>
      )}
    </div>
  );
}

window.StatsOverview = StatsOverview;
window.SearchOverlay = SearchOverlay;
window.useMedia = useMedia;
