/* wf-stats.jsx — shared Stats Overview blocks + sample data (fictional).
   Modules per brief: Top players · Top squads · Bounty · Recent replays.
   No KPI tiles, no commander-sides. Global rotation scope + search + freshness. */

// [name, squad, score(primary = kills/games), kills, games, kd] — ranked by SCORE
const PLAYERS = [
  ['Vektor',   'GST', '5.07', '142', '28', '1.82'],
  ['Halcyon',  'GST', '4.74', '128', '27', '1.73'],
  ['Magpie',   'KRG', '4.29', '103', '24', '1.56'],
  ['Orlan',    'KRG', '4.14', '91',  '22', '1.44'],
  ['Drozd',    '9LR', '3.97', '119', '30', '1.47'],
  ['Sever',    '9LR', '3.59', '97',  '27', '1.39'],
];
// [name, tag, players, score(primary = kills/games), kills, games]
const SQUADS = [
  ['Ghost Section', 'GST', '14', '4.62', '1,840', '398'],
  ['Krieg Group',   'KRG', '17', '4.21', '1,510', '359'],
  ['9th Line Rgt',  '9LR', '22', '3.88', '1,698', '438'],
  ['Vanguard',      'VNG', '11', '3.40', '1,120', '329'],
];
const BOUNTY = [
  ['Vektor',  'GST', '312', '×1.8 victim · ×1.3 squad'],
  ['Halcyon', 'GST', '288', '×1.6 victim · ×1.4 squad'],
  ['Magpie',  'KRG', '230', '×1.5 victim · ×1.2 squad'],
  ['Orlan',   'KRG', '176', '×1.4 victim · ×1.1 squad'],
];
const REPLAYS = [
  ['48213', 'Operation Iron Veil', 'Chernarus', 'win',  'Today 21:04', 'Vektor',  '52'],
  ['48198', 'Last Light',          'Takistan',  'loss', 'Today 19:30', 'Drozd',   '44'],
  ['48180', 'Broken Arrow',        'Altis',     'unk',  'Yest. 22:11', 'Magpie',  '38'],
  ['48164', 'Cold Harbor',         'Livonia',   'win',  'Yest. 20:46', 'Halcyon', '47'],
  ['48151', 'Salt & Iron',         'Tanoa',     'win',  'Wed 21:18',   'Orlan',   '41'],
];

const winBadge = (k) =>
  k === 'win'  ? <Badge kind="win"   glyph="▲">W</Badge> :
  k === 'loss' ? <Badge kind="loss"  glyph="▼">L</Badge> :
                 <Badge kind="amber" glyph="?">Unknown</Badge>;

// ---------- freshness banner (first-class provenance) ----------
function Fresh({ stale = false, style = {} }) {
  if (stale) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 11px', borderRadius: 4,
        background: WF.amberWash, border: `1px solid ${WF.amber}`, ...style,
      }}>
        <span style={{ color: WF.amber, fontSize: 13 }}>⟳</span>
        <Hand size={14} color={WF.amber}>Cached stats from 9 min ago — reconnecting…</Hand>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, ...style }}>
      <Badge kind="accent" glyph="●">Up to date</Badge>
      <Overline>Updated 4 min ago</Overline>
    </div>
  );
}

// ---------- section header with "view all" ----------
function SecHead({ title, all = 'View all', count, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', ...style }}>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <Hand size={18} weight={700} style={{ whiteSpace: 'nowrap' }}>{title}</Hand>
        {count && <Mono size={11} color={WF.faint}>{count}</Mono>}
      </span>
      <Hand size={13} color={WF.accent} style={{ whiteSpace: 'nowrap' }}>{all} →</Hand>
    </div>
  );
}

// ---------- compact player ranking rows (SCORE is the headline) ----------
function PlayerRows({ n = 5 }) {
  return (
    <div>
      {PLAYERS.slice(0, n).map((p, i) => (
        <div key={p[0]} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
          borderBottom: i < n - 1 ? `1px solid ${WF.line}` : 'none',
        }}>
          <Mono size={12} color={i === 0 ? WF.accent : WF.faint} weight={600}>{String(i + 1).padStart(2, '0')}</Mono>
          <Thumb s={26} label={p[1][0]} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <Hand size={15}>{p[0]}</Hand>
            <span style={{ display: 'block', marginTop: 1 }}><Mono size={9} color={WF.faint}>[{p[1]}] · {p[3]} kills · {p[4]} games</Mono></span>
          </span>
          <span style={{ textAlign: 'right' }}>
            <Mono size={15} weight={600}>{p[2]}</Mono>
            <span style={{ display: 'block', marginTop: 2 }}><Overline style={{ fontSize: 8 }}>SCORE</Overline></span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------- squad rows ----------
function SquadRows({ n = 3 }) {
  return (
    <div>
      {SQUADS.slice(0, n).map((s, i) => (
        <div key={s[1]} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
          borderBottom: i < n - 1 ? `1px solid ${WF.line}` : 'none',
        }}>
          <Mono size={12} color={i === 0 ? WF.accent : WF.faint} weight={600}>{String(i + 1).padStart(2, '0')}</Mono>
          <Thumb s={26} round label={s[1][0]} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <Hand size={15}>{s[0]}</Hand>
            <span style={{ display: 'block', marginTop: 1 }}><Mono size={9} color={WF.faint}>[{s[1]}] · {s[2]} players · {s[5]} games</Mono></span>
          </span>
          <span style={{ textAlign: 'right' }}>
            <Mono size={15} weight={600}>{s[3]}</Mono>
            <span style={{ display: 'block', marginTop: 2 }}><Overline style={{ fontSize: 8 }}>SCORE</Overline></span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------- bounty rows (formula provenance is copy) ----------
function BountyRows({ n = 3, showFormula = true }) {
  return (
    <div>
      {BOUNTY.slice(0, n).map((b, i) => (
        <div key={b[0]} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
          borderBottom: i < n - 1 ? `1px solid ${WF.line}` : 'none',
        }}>
          <Mono size={12} color={i === 0 ? WF.accent : WF.faint} weight={600}>{String(i + 1).padStart(2, '0')}</Mono>
          <span style={{ flex: 1, minWidth: 0 }}>
            <Hand size={15}>{b[0]}</Hand>
            {showFormula && <span style={{ display: 'block', marginTop: 2 }}><Mono size={9} color={WF.faint}>{b[3]}</Mono></span>}
          </span>
          <Badge kind="amber" glyph="◎">{b[2]} pts</Badge>
        </div>
      ))}
    </div>
  );
}

// ---------- replay rows ----------
function ReplayRows({ n = 3, rich = false }) {
  if (rich) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {REPLAYS.slice(0, n).map((r) => (
          <div key={r[0]} style={wfBox({ display: 'flex', gap: 12, padding: 11, alignItems: 'center', background: WF.panel2 })}>
            <Thumb s={52} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Hand size={17} weight={700}>{r[1]}</Hand>
                {winBadge(r[3])}
              </div>
              <div style={{ display: 'flex', gap: 7, marginTop: 5, flexWrap: 'wrap' }}>
                <Mono size={10} color={WF.faint}>{r[2]}</Mono>
                <Mono size={10} color={WF.faint}>· #replay-{r[0]}</Mono>
                <Mono size={10} color={WF.faint}>· {r[4]}</Mono>
              </div>
              <div style={{ marginTop: 7 }}>
                <Overline>TOP FRAG</Overline> <Hand size={14} color={WF.accent}>{r[5]}</Hand>
                <Mono size={11} color={WF.sub} style={{ marginLeft: 6 }}>{r[6]} kills</Mono>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      {REPLAYS.slice(0, n).map((r, i) => (
        <div key={r[0]} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
          borderBottom: i < n - 1 ? `1px solid ${WF.line}` : 'none',
        }}>
          <Thumb s={30} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <Hand size={14}>{r[1]}</Hand>
            <span style={{ display: 'block', marginTop: 1 }}><Mono size={9} color={WF.faint}>{r[2]} · {r[4]}</Mono></span>
          </span>
          {winBadge(r[3])}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  PLAYERS, SQUADS, BOUNTY, REPLAYS, winBadge,
  Fresh, SecHead, PlayerRows, SquadRows, BountyRows, ReplayRows,
});
