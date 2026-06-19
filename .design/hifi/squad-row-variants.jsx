/* hifi/squad-row-variants.jsx — three ROW compositions for the Squads list, shown
   side-by-side on a design canvas. Same data (Rotation 14, top squads), same DS
   tokens/components — only the row layout differs, so the choice is about
   composition, not styling. Exports RowsA / RowsB / RowsC to window. */
const RV_SIDE = { red: 'var(--loss)', blue: 'var(--info)', yellow: 'var(--warn)', green: 'var(--win)', gray: 'var(--fg-3)' };
function rvTier(metric, v) {
  const b = window.SS_SQ_BASELINE.by.rotation[metric];
  return v >= b.elite ? 'elite' : v >= b.good ? 'good' : v >= b.base ? 'base' : 'low';
}
function RVPips({ tier }) {
  const lvl = (window.SS_TIER && window.SS_TIER.level[tier]) || 0;
  return <span className="pips" aria-hidden="true">{[1, 2, 3, 4].map(i => <i key={i} className={i <= lvl ? 'on' : ''} />)}</span>;
}
function RVNum({ v, tier, pips = true }) {
  return <span className={`cell-tier tierc tier-${tier}`}>{pips && <RVPips tier={tier} />}<b>{v.toFixed(2)}</b></span>;
}
function RVTrend({ spark, weeks = 6 }) {
  const data = spark.slice(-weeks);
  const max = Math.max(...data, 1);
  return (
    <span className="score-trend" aria-hidden="true">
      {data.map((v, i) => {
        const t = rvTier('score', v);
        const h = Math.max(Math.round((Math.max(v, 0) / max) * 100), 8);
        return <i key={i} className={`stb tierc tier-${t}`} style={{ height: `${h}%` }} />;
      })}
    </span>
  );
}
function RVAvatar({ size = 30 }) {
  return <span className="pl-avatar" style={{ width: size, height: size, borderRadius: 'var(--radius-sm)', flex: 'none' }}><Icon name="users" size={size >= 34 ? 18 : 16} /></span>;
}

const RV_DATA = window.SS_SQUADS.rotation('typical').slice(0, 7);

/* ---- Variant A: dense table row (the shipped design) ---- */
function RowsA() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <table className="tbl" style={{ width: '100%', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '46px' }} /><col style={{ width: '32%' }} /><col style={{ width: '11%' }} />
          <col style={{ width: '12%' }} /><col style={{ width: '13%' }} /><col style={{ width: '70px' }} />
          <col style={{ width: '13%' }} /><col style={{ width: '14%' }} />
        </colgroup>
        <thead><tr>
          <th className="l">#</th><th className="l">Отряд</th><th>Состав</th><th>Игры</th>
          <th>Убийства</th><th className="col-trend">Тренд</th><th>K/D</th><th>Счёт</th>
        </tr></thead>
        <tbody>
          {RV_DATA.map((s, i) => (
            <tr key={i}>
              <td className={`l rank${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</td>
              <td className="l"><span className="pl-id"><RVAvatar /><span className="cell-id">
                <span className="nm">{s.name}</span>
                <span className="sub sq-sub"><span className="side-dot" style={{ background: RV_SIDE[s.side] }} /><span className="sq-tag">[{s.tag}]</span><span className="sq-dot">·</span><span className="sq-lead"><Icon name="user" size={12} />{s.leader}</span></span>
              </span></span></td>
              <td><span className="sq-members"><Icon name="users" size={13} />{s.members}</span></td>
              <td className="muted">{s.games.toLocaleString('en-US')}</td>
              <td>{s.kills.toLocaleString('en-US')}</td>
              <td className="col-trend"><RVTrend spark={s.spark} weeks={6} /></td>
              <td><RVNum v={s.kd} tier={rvTier('kd', s.kd)} /></td>
              <td><RVNum v={s.score} tier={rvTier('score', s.score)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---- Variant B: identity-led card row (side accent stripe + sub-line stats) ---- */
function RowsB() {
  return (
    <div className="card" style={{ padding: '2px 0' }}>
      {RV_DATA.map((s, i) => (
        <div className="rv-b-row" key={i} style={{ '--side': RV_SIDE[s.side] }}>
          <span className={`rank mono${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
          <RVAvatar size={38} />
          <span className="rv-b-id">
            <span className="rv-b-name">{s.name}<span className="sq-tag">[{s.tag}]</span></span>
            <span className="rv-b-sub"><Icon name="user" size={12} />{s.leader}<span className="sq-dot">·</span>{s.members} участн.<span className="sq-dot">·</span>{s.games} игр<span className="sq-dot">·</span>{s.kills.toLocaleString('en-US')} уб.</span>
          </span>
          <RVTrend spark={s.spark} weeks={6} />
          <span className="rv-b-metrics">
            <span className="rv-b-m"><RVNum v={s.kd} tier={rvTier('kd', s.kd)} pips={false} /><span className="lb-cap">K/D</span></span>
            <span className="rv-b-m"><RVNum v={s.score} tier={rvTier('score', s.score)} pips={false} /><span className="lb-cap">Счёт</span></span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---- Variant C: score-forward (headline metric as a proportional tier bar) ---- */
function RowsC() {
  const maxScore = Math.max(...RV_DATA.map(s => s.score), 1);
  return (
    <div className="card" style={{ padding: '2px 0' }}>
      {RV_DATA.map((s, i) => {
        const tier = rvTier('score', s.score);
        const pct = Math.max((s.score / maxScore) * 100, 6);
        return (
          <div className="rv-c-row" key={i}>
            <span className={`rank mono${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
            <RVAvatar size={32} />
            <span className="rv-c-id">
              <span className="rv-c-name">{s.name}</span>
              <span className="rv-c-sub"><span className="side-dot" style={{ background: RV_SIDE[s.side] }} /><span className="sq-tag">[{s.tag}]</span><span className="sq-dot">·</span>{s.members} участн.</span>
            </span>
            <span className="rv-c-bar-wrap">
              <span className="rv-c-track"><span className={`rv-c-bar tierc tier-${tier}`} style={{ width: `${pct}%` }} /></span>
              <span className={`rv-c-score tierc tier-${tier}`}><b>{s.score.toFixed(2)}</b></span>
            </span>
            <span className="rv-c-kd">{s.kd.toFixed(2)}<i>K/D</i></span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { RowsA, RowsB, RowsC });
