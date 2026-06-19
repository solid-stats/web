/* wf-player.jsx — Player profile wireframe directions (dark gunmetal, low-fi).
   Now grounded in the REAL legacy page (solid-stats.web.app/player/Sonr): the
   modules and field set mirror what the community already relies on —
   PERFORMANCE chart (toggle Kills / K-D / Score), an extended CAREER summary
   (rank, kills, vehicle kills + %, vehicles destroyed, TK, deaths-from-TK,
   deaths, K/D, Score), a BY-ROTATION table, and WEAPON / VEHICLE breakdowns
   (kills + max distance). Our product layers on what legacy lacks: a CANONICAL
   player (nickname history + multiple SteamIDs), provenance / Unknown,
   commander-side (KS), and bounty.
   Reuses wf-kit + wf-stats + wf-desktop primitives. */

// ---- sample player — Sonr's real legacy career numbers ----
const PRO = {
  rank: '141', nick: 'Sonr', tag: 'A', squad: 'Alpha', side: 'blue',
  memberSince: 'Rotation 6',
  aka: ['[A]Sonr', 'Sonr_', 'S0nr', 'Sonar'],            // nickname history
  steam: [
    ['••••3071', 'primary', 'since R3'],
    ['••••8842', 'linked',  'since R9'],
  ],
  // CAREER totals (all-time, from legacy "Общая статистика")
  totals: {
    games: '506', kills: '608', vehKills: '99', vehPct: '16%', vehDestroyed: '67',
    tk: '15', deathsTk: '25', deaths: '427', kd: '1.48', score: '1.23', bounty: '1,284',
  },
  // squad membership timeline [squad, tag, range]
  timeline: [
    ['Alpha',       'A',   'R6 — now'],
    ['Krieg Group', 'KRG', 'R3 — R5'],
  ],
  // per-ROTATION rows (legacy weekly) [label, games, kills, vehK, tk, deaths, kd, score, trend]
  rotations: [
    ['Rotation 92', '4', '6',  '6', '0', '4', '1.50', '1.50', 'flat'],
    ['Rotation 91', '3', '11', '3', '0', '2', '5.50', '3.67', 'up'],
    ['Rotation 90', '4', '3',  '0', '0', '4', '0.75', '0.75', 'down'],
    ['Rotation 89', '4', '5',  '4', '0', '4', '1.25', '1.25', 'up'],
    ['Rotation 88', '2', '1',  '0', '0', '2', '0.50', '0.50', 'down'],
  ],
  // commander-side (KS) record
  commander: { games: '12', w: '7', l: '3', unk: '2' },
  // weapon breakdown [name, kills, maxDist]
  weapons: [
    ['AK-12 (2018)',          '22', '393м'],
    ['AK-74M',                '17', '309м'],
    ['M4A1 PIP',              '15', '326м'],
    ['AK-74M (Zenitco/B-33)', '13', '258м'],
    ['M3 MAAWS',              '10', '593м'],
  ],
  // vehicle breakdown [name, kills, maxDist]
  vehicles: [
    ['BMP-2 (obr. 1986g.)', '10', '1223м'],
    ['BMD-2M',              '8',  '1377м'],
  ],
};
// per-rotation score for the performance chart (last 10)
const PERF = [0.5, 1.25, 0.75, 1.5, 2.75, 1.67, 2.25, 0.75, 3.67, 1.5];

// ---- breadcrumb ----
function Crumb({ items }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Mono size={12} color={WF.faint}>/</Mono>}
          <Hand size={14} color={i === items.length - 1 ? WF.ink : WF.accent}>{it}</Hand>
        </React.Fragment>
      ))}
    </div>
  );
}

// ---- AKA (nickname history) chips ----
function AkaChips({ list, max }) {
  const shown = max ? list.slice(0, max) : list;
  const rest = max ? list.length - max : 0;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      <Overline>AKA</Overline>
      {shown.map((a) => (
        <span key={a} style={wfBox({ padding: '1px 7px', borderRadius: 3, background: WF.panel2, borderColor: WF.line })}>
          <Mono size={11} color={WF.sub}>{a}</Mono>
        </span>
      ))}
      {rest > 0 && <Hand size={13} color={WF.accent}>+{rest} more</Hand>}
    </span>
  );
}

// ---- one mono stat tile ----
function StatTile({ label, value, sub, accent = false, warn = false, w }) {
  return (
    <div style={wfBox({
      padding: '10px 12px', borderRadius: 6, width: w,
      background: accent ? WF.accentWash : WF.panel,
      borderColor: accent ? WF.accent : WF.line,
      display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0,
    })}>
      <Overline style={{ fontSize: 9 }}>{label}</Overline>
      <Mono size={accent ? 22 : 18} weight={700} color={warn ? WF.amber : (accent ? WF.accent : WF.ink)}>{value}</Mono>
      {sub && <Mono size={9.5} color={WF.faint}>{sub}</Mono>}
    </div>
  );
}

// ---- extended career summary strip (mirrors legacy columns) ----
function StatStrip() {
  const T = PRO.totals;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr repeat(8, 1fr)', gap: 9 }}>
      <StatTile label="SCORE · kills/game" value={T.score} accent sub="career" />
      <StatTile label="K / D" value={T.kd} />
      <StatTile label="KILLS" value={T.kills} />
      <StatTile label="DEATHS" value={T.deaths} />
      <StatTile label="VEHICLE K · %" value={T.vehKills} sub={T.vehPct} />
      <StatTile label="VEH DESTR." value={T.vehDestroyed} />
      <StatTile label="TEAMKILLS" value={T.tk} warn />
      <StatTile label="DEATHS · TK" value={T.deathsTk} warn />
      <StatTile label="GAMES" value={T.games} />
    </div>
  );
}

// ---- tab strip ----
function Tabs({ items, active = 0 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, borderBottom: `1.4px solid ${WF.line}`, marginBottom: 14 }}>
      {items.map((t, i) => (
        <span key={t} style={{ position: 'relative', paddingBottom: 11 }}>
          <Hand size={16} weight={i === active ? 700 : 500} color={i === active ? WF.accent : WF.sub}>{t}</Hand>
          {i === active && <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: WF.accent }} />}
        </span>
      ))}
    </div>
  );
}

// ---- performance chart with metric toggle (Kills / K-D / Score) ----
function PerfChart({ h = 116 }) {
  const max = Math.max(...PERF);
  return (
    <div style={wfBox({ padding: 16, borderRadius: 8 })}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <Hand size={17} weight={700}>Performance over rotations</Hand>
        <span style={wfBox({ display: 'inline-flex', borderRadius: 5, overflow: 'hidden', background: WF.panel2 })}>
          {['Kills', 'K/D', 'Score'].map((m, i) => (
            <span key={m} style={{ padding: '5px 12px', background: i === 2 ? WF.accentWash : 'transparent', borderRight: i < 2 ? `1px solid ${WF.line}` : 'none' }}>
              <Hand size={13} color={i === 2 ? WF.accent : WF.sub}>{m}</Hand>
            </span>
          ))}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: h }}>
        {PERF.map((v, i) => {
          const ht = (v / max) * (h - 18);
          const cur = i === PERF.length - 1;
          return (
            <span key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <span style={{ width: '100%', height: ht, background: cur ? WF.accent : WF.fillHi, borderRadius: '3px 3px 0 0' }} />
              <Mono size={8.5} color={WF.faint}>R{83 + i}</Mono>
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ---- per-rotation table ----
function RotationTable({ compact = false }) {
  const cols = '1.3fr 50px 52px 50px 46px 56px 60px 64px';
  const heads = ['ROTATION', 'GAMES', 'KILLS', 'VEH', 'TK', 'K/D', 'SCORE', 'BOUNTY'];
  return (
    <div style={wfBox({ padding: compact ? 12 : 16, borderRadius: 8 })}>
      <SecHead title="By rotation" all="Compare" count={`${PRO.rotations.length} of 92`} style={{ marginBottom: 12 }} />
      <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '0 4px 8px', borderBottom: `1.4px solid ${WF.line}` }}>
        {heads.map((hd, i) => <Overline key={hd} style={{ textAlign: i === 0 ? 'left' : 'right' }}>{hd}</Overline>)}
      </div>
      {PRO.rotations.map((r, i) => (
        <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', padding: '0 4px', height: 38, borderBottom: i < PRO.rotations.length - 1 ? `1px solid ${WF.line}` : 'none', background: i === 0 ? WF.accentWash : 'transparent' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Hand size={14} color={i === 0 ? WF.accent : WF.ink}>{r[0]}</Hand>
            {i === 0 && <Badge kind="accent" style={{ fontSize: 9, padding: '1px 5px' }}>current</Badge>}
          </span>
          <Mono size={12} color={WF.sub} style={{ textAlign: 'right' }}>{r[1]}</Mono>
          <Mono size={12} color={WF.sub} style={{ textAlign: 'right' }}>{r[2]}</Mono>
          <Mono size={12} color={WF.sub} style={{ textAlign: 'right' }}>{r[3]}</Mono>
          <Mono size={12} color={r[4] === '0' ? WF.faint : WF.amber} style={{ textAlign: 'right' }}>{r[4]}</Mono>
          <Mono size={12} color={WF.sub} style={{ textAlign: 'right' }}>{r[6]}</Mono>
          <Mono size={14} weight={700} style={{ textAlign: 'right' }}>{r[7]}</Mono>
          <span style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
            <Delta v="" dir={r[8] === 'down' ? 'down' : 'up'} />
          </span>
        </div>
      ))}
    </div>
  );
}

// ---- weapon / vehicle breakdown table (legacy: kills + max distance) ----
function BreakTable({ title, rows, icon }) {
  return (
    <div style={wfBox({ padding: 16, borderRadius: 8 })}>
      <SecHead title={title} all="All" count="by kills" style={{ marginBottom: 12 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 52px 70px', padding: '0 4px 8px', borderBottom: `1.4px solid ${WF.line}` }}>
        <Overline>#</Overline><Overline>NAME</Overline>
        <Overline style={{ textAlign: 'right' }}>KILLS</Overline>
        <Overline style={{ textAlign: 'right' }}>MAX DIST</Overline>
      </div>
      {rows.map((r, i) => (
        <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 52px 70px', alignItems: 'center', padding: '0 4px', height: 34, borderBottom: i < rows.length - 1 ? `1px solid ${WF.line}` : 'none' }}>
          <Mono size={11} color={WF.faint}>{i + 1}</Mono>
          <Hand size={14} color={WF.ink} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{r[0]}</Hand>
          <Mono size={13} weight={600} style={{ textAlign: 'right' }}>{r[1]}</Mono>
          <Mono size={12} color={WF.sub} style={{ textAlign: 'right' }}>{r[2]}</Mono>
        </div>
      ))}
    </div>
  );
}

// ---- identity panel (the distinctive bit: AKA + SteamIDs + squad timeline) ----
function IdentityPanel() {
  return (
    <div style={wfBox({ padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 16 })}>
      <Hand size={17} weight={700}>Identity &amp; provenance</Hand>

      <div>
        <Overline style={{ display: 'block', marginBottom: 7 }}>Linked SteamIDs</Overline>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {PRO.steam.map((s) => (
            <div key={s[0]} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Thumb s={22} round />
              <Mono size={13}>{s[0]}</Mono>
              <Badge kind={s[1] === 'primary' ? 'accent' : 'neutral'} style={{ fontSize: 9 }}>{s[1]}</Badge>
              <span style={{ flex: 1 }} />
              <Mono size={10} color={WF.faint}>{s[2]}</Mono>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Overline style={{ display: 'block', marginBottom: 7 }}>Nickname history</Overline>
        <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[PRO.nick, ...PRO.aka].map((a, i) => (
            <span key={a} style={wfBox({ padding: '2px 8px', borderRadius: 3, background: i === 0 ? WF.accentWash : WF.panel2, borderColor: i === 0 ? WF.accent : WF.line })}>
              <Mono size={11} color={i === 0 ? WF.accent : WF.sub}>{a}{i === 0 ? ' ·current' : ''}</Mono>
            </span>
          ))}
        </span>
      </div>

      <div>
        <Overline style={{ display: 'block', marginBottom: 7 }}>Squad membership</Overline>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PRO.timeline.map((t, i) => (
            <div key={t[1]} style={{ display: 'flex', alignItems: 'center', gap: 9, paddingLeft: 4 }}>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: i === 0 ? WF.accent : WF.faint, marginTop: 5 }} />
                {i < PRO.timeline.length - 1 && <span style={{ flex: 1, width: 1.5, background: WF.line, minHeight: 16 }} />}
              </span>
              <span style={{ paddingBottom: i < PRO.timeline.length - 1 ? 12 : 0 }}>
                <Hand size={15}>{t[0]}</Hand> <Mono size={9} color={WF.faint}>[{t[1]}]</Mono>
                <span style={{ display: 'block' }}><Mono size={10} color={WF.faint}>{t[2]}</Mono></span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingTop: 2, borderTop: `1px solid ${WF.line}` }}>
        <span style={{ color: WF.amber }}>⚠</span>
        <Hand size={13} color={WF.amber}>1 SteamID merge under review</Hand>
      </div>
    </div>
  );
}

// ---- commander (KS) record card ----
function CommanderCard() {
  const c = PRO.commander;
  return (
    <div style={wfBox({ padding: 16, borderRadius: 8 })}>
      <SecHead title="Commander · KS" all="Details" style={{ marginBottom: 12 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <StatTile label="GAMES" value={c.games} w={64} />
        <Badge kind="win" glyph="▲" style={{ fontSize: 12, padding: '4px 9px' }}>{c.w} W</Badge>
        <Badge kind="loss" glyph="▼" style={{ fontSize: 12, padding: '4px 9px' }}>{c.l} L</Badge>
        <Badge kind="amber" glyph="?" style={{ fontSize: 12, padding: '4px 9px' }}>{c.unk} Unknown</Badge>
      </div>
      <div style={{ marginTop: 9 }}><Mono size={10} color={WF.faint}>2 legacy games have no recorded side outcome</Mono></div>
    </div>
  );
}

// ---- bounty teaser card (our addition) ----
function BountyCard() {
  return (
    <div style={wfBox({ padding: 16, borderRadius: 8 })}>
      <SecHead title="Bounty" all="Breakdown" count="Rotation 92" style={{ marginBottom: 12 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <Mono size={26} weight={700} color={WF.accent}>312</Mono><Overline>pts</Overline>
      </div>
      <div style={{ marginTop: 8 }}>
        <Mono size={11} color={WF.sub}>victim eff. ×1.8 · squad eff. ×1.3</Mono>
      </div>
    </div>
  );
}

// =====================================================================
// DESKTOP A — identity top-band + perf chart + summary + table & rail
// =====================================================================
function DeskProfileA() {
  return (
    <div style={{ width: '100%', height: '100%', background: WF.page, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopNav active="Players" />
      <div style={{ padding: 28, overflow: 'hidden' }}>
        <Crumb items={['Players', 'Sonr']} />

        {/* identity header band */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
          <Thumb s={60} round />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Hand size={29} weight={700}>Sonr</Hand>
              <Badge kind="neutral" style={{ fontSize: 11 }}>[A] Alpha</Badge>
              <Badge kind="accent" glyph="✓" style={{ fontSize: 10 }}>Canonical</Badge>
              <Mono size={12} color={WF.faint}>· rank #{PRO.rank}</Mono>
            </div>
            <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <AkaChips list={PRO.aka} max={2} />
              <Mono size={11} color={WF.faint}>· 2 SteamIDs · since {PRO.memberSince}</Mono>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <Fresh />
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn>Open in replays</Btn>
              <Btn primary>Request correction</Btn>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}><StatStrip /></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PerfChart />
            <RotationTable />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <BreakTable title="Weapons" rows={PRO.weapons} />
              <BreakTable title="Vehicles" rows={PRO.vehicles} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <IdentityPanel />
            <CommanderCard />
            <BountyCard />
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// DESKTOP B — identity LEFT SIDEBAR (sticky) + single-scroll content
// =====================================================================
function DeskProfileB() {
  return (
    <div style={{ width: '100%', height: '100%', background: WF.page, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopNav active="Players" />
      <div style={{ padding: 28, overflow: 'hidden' }}>
        <Crumb items={['Players', 'Sonr']} />
        <div style={{ display: 'grid', gridTemplateColumns: '292px 1fr', gap: 20, alignItems: 'start' }}>

          {/* sticky identity sidebar */}
          <div style={wfBox({ padding: 18, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 14 })}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, textAlign: 'center' }}>
              <Thumb s={72} round />
              <div>
                <Hand size={25} weight={700}>Sonr</Hand>
                <div style={{ marginTop: 4, display: 'flex', gap: 5, justifyContent: 'center' }}>
                  <Badge kind="accent" glyph="✓" style={{ fontSize: 10 }}>Canonical</Badge>
                  <Badge kind="neutral" style={{ fontSize: 10 }}>rank #{PRO.rank}</Badge>
                </div>
              </div>
              <Badge kind="neutral">[A] Alpha</Badge>
            </div>
            <Btn primary w="100%">Request correction</Btn>
            <div style={{ height: 1, background: WF.line }} />
            <IdentityPanelInline />
          </div>

          {/* content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
            <Fresh style={{ alignSelf: 'flex-start' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 9 }}>
              <StatTile label="SCORE · k/game" value={PRO.totals.score} accent />
              <StatTile label="K / D" value={PRO.totals.kd} />
              <StatTile label="KILLS" value={PRO.totals.kills} />
              <StatTile label="DEATHS" value={PRO.totals.deaths} />
              <StatTile label="GAMES" value={PRO.totals.games} />
            </div>
            <PerfChart />
            <RotationTable compact />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <BreakTable title="Weapons" rows={PRO.weapons} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <CommanderCard />
                <BountyCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// compact identity block for the sidebar (no outer card)
function IdentityPanelInline() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <Overline style={{ display: 'block', marginBottom: 7 }}>Linked SteamIDs</Overline>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {PRO.steam.map((s) => (
            <div key={s[0]} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Mono size={12}>{s[0]}</Mono>
              <Badge kind={s[1] === 'primary' ? 'accent' : 'neutral'} style={{ fontSize: 9 }}>{s[1]}</Badge>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Overline style={{ display: 'block', marginBottom: 7 }}>Also known as</Overline>
        <span style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {PRO.aka.map((a) => (
            <span key={a} style={wfBox({ padding: '1px 6px', borderRadius: 3, background: WF.panel2, borderColor: WF.line })}>
              <Mono size={10.5} color={WF.sub}>{a}</Mono>
            </span>
          ))}
        </span>
      </div>
      <div>
        <Overline style={{ display: 'block', marginBottom: 7 }}>Squad history</Overline>
        {PRO.timeline.map((t) => (
          <div key={t[1]} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <Hand size={14}>{t[0]}</Hand>
            <Mono size={10} color={WF.faint}>{t[2]}</Mono>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 8, borderTop: `1px solid ${WF.line}` }}>
        <span style={{ color: WF.amber }}>⚠</span>
        <Hand size={12} color={WF.amber}>SteamID merge under review</Hand>
      </div>
    </div>
  );
}

// =====================================================================
// MOBILE A — stats-led: compact header + tiles + segmented + rotation cards
// =====================================================================
function mFrame(children) {
  return <div style={{ width: '100%', height: '100%', background: WF.page, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>{children}</div>;
}
function MobBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: `1.4px solid ${WF.line}`, background: WF.bar }}>
      <Hand size={20} color={WF.sub}>‹</Hand>
      <Brand size={15} />
      <span style={{ flex: 1 }} />
      <Hand size={16} color={WF.sub}>⌕</Hand>
    </div>
  );
}
function MobTabBar({ active = 1 }) {
  const t = [['Stats', '▤'], ['Players', '◍'], ['Bounty', '◎'], ['Replays', '▷'], ['Sign in', '⎆']];
  return (
    <div style={{ display: 'flex', borderTop: `1.4px solid ${WF.line}`, background: WF.bar, marginTop: 'auto' }}>
      {t.map((x, i) => (
        <span key={x[0]} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '9px 0' }}>
          <Hand size={16} color={i === active ? WF.accent : WF.faint}>{x[1]}</Hand>
          <Hand size={11} color={i === active ? WF.accent : WF.faint}>{x[0]}</Hand>
        </span>
      ))}
    </div>
  );
}
function MobProfileA() {
  return mFrame(<>
    <MobBar />
    <div style={{ flex: 1, overflow: 'hidden', padding: 14, display: 'flex', flexDirection: 'column', gap: 13 }}>
      {/* identity header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Thumb s={52} round />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Hand size={23} weight={700}>Sonr</Hand>
            <Badge kind="accent" glyph="✓" style={{ fontSize: 9 }}>Canonical</Badge>
          </div>
          <div style={{ marginTop: 4, display: 'flex', gap: 5 }}>
            <Badge kind="neutral" style={{ fontSize: 10 }}>[A] Alpha</Badge>
            <Badge kind="neutral" style={{ fontSize: 10 }}>rank #{PRO.rank}</Badge>
          </div>
          <div style={{ marginTop: 7 }}><Hand size={13} color={WF.accent}>4 known names · 2 SteamIDs ›</Hand></div>
        </div>
      </div>

      <Fresh />

      {/* stat tiles 2-up */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        <StatTile label="SCORE · kills/game" value={PRO.totals.score} accent />
        <StatTile label="K / D" value={PRO.totals.kd} />
        <StatTile label="KILLS" value={PRO.totals.kills} />
        <StatTile label="DEATHS" value={PRO.totals.deaths} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}><Hand size={13} color={WF.accent}>Show vehicle · TK · games · bounty ▾</Hand></div>

      {/* segmented */}
      <span style={wfBox({ display: 'flex', borderRadius: 5, overflow: 'hidden', background: WF.panel2 })}>
        {['Rotations', 'Weapons', 'Identity'].map((s, i) => (
          <span key={s} style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: i === 0 ? WF.accentWash : 'transparent', borderRight: i < 2 ? `1px solid ${WF.line}` : 'none' }}>
            <Hand size={14} color={i === 0 ? WF.accent : WF.sub}>{s}</Hand>
          </span>
        ))}
      </span>

      {/* rotation cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {PRO.rotations.slice(0, 3).map((r, i) => (
          <div key={r[0]} style={wfBox({ padding: 11, borderRadius: 6, background: i === 0 ? WF.accentWash : WF.panel, borderColor: i === 0 ? WF.accent : WF.line })}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Hand size={16} weight={700} color={i === 0 ? WF.accent : WF.ink}>{r[0]}</Hand>
                {i === 0 && <Badge kind="accent" style={{ fontSize: 9 }}>current</Badge>}
              </span>
              <span style={{ textAlign: 'right' }}><Mono size={17} weight={700}>{r[7]}</Mono> <Overline style={{ fontSize: 8 }}>SCORE</Overline></span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Mono size={11} color={WF.faint}>{r[1]} games</Mono>
              <Mono size={11} color={WF.faint}>{r[2]}K · {r[5]}D</Mono>
              <Mono size={11} color={WF.faint}>{r[6]} K/D</Mono>
            </div>
          </div>
        ))}
      </div>
    </div>
    <MobTabBar />
  </>);
}

// =====================================================================
// MOBILE B — identity-led (provenance foregrounded), single scroll
// =====================================================================
function MobProfileB() {
  return mFrame(<>
    <MobBar />
    <div style={{ flex: 1, overflow: 'hidden', padding: 14, display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', paddingTop: 4 }}>
        <Thumb s={66} round />
        <Hand size={25} weight={700}>Sonr</Hand>
        <div style={{ display: 'flex', gap: 6 }}>
          <Badge kind="accent" glyph="✓" style={{ fontSize: 9 }}>Canonical</Badge>
          <Badge kind="neutral" style={{ fontSize: 10 }}>[A] Alpha · #{PRO.rank}</Badge>
        </div>
        <Btn primary w="100%">Request a correction</Btn>
      </div>

      {/* hero stat row */}
      <div style={wfBox({ padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-around', background: WF.panel })}>
        {[['SCORE', PRO.totals.score, true], ['K/D', PRO.totals.kd], ['KILLS', PRO.totals.kills], ['BOUNTY', PRO.totals.bounty]].map((s) => (
          <span key={s[0]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Mono size={s[2] ? 20 : 17} weight={700} color={s[2] ? WF.accent : WF.ink}>{s[1]}</Mono>
            <Overline style={{ fontSize: 8 }}>{s[0]}</Overline>
          </span>
        ))}
      </div>

      {/* identity card foregrounded */}
      <div style={wfBox({ padding: 13, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 12 })}>
        <Hand size={16} weight={700}>Identity</Hand>
        <div>
          <Overline style={{ display: 'block', marginBottom: 6 }}>SteamIDs</Overline>
          {PRO.steam.map((s) => (
            <div key={s[0]} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <Mono size={12}>{s[0]}</Mono><Badge kind={s[1] === 'primary' ? 'accent' : 'neutral'} style={{ fontSize: 9 }}>{s[1]}</Badge>
            </div>
          ))}
        </div>
        <div>
          <Overline style={{ display: 'block', marginBottom: 6 }}>Known as</Overline>
          <span style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {PRO.aka.map((a) => <span key={a} style={wfBox({ padding: '1px 6px', borderRadius: 3, background: WF.panel2, borderColor: WF.line })}><Mono size={10.5} color={WF.sub}>{a}</Mono></span>)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 8, borderTop: `1px solid ${WF.line}` }}>
          <span style={{ color: WF.amber }}>⚠</span><Hand size={12} color={WF.amber}>SteamID merge under review</Hand>
        </div>
      </div>

      <SecHead title="By rotation" all="All" />
    </div>
    <MobTabBar />
  </>);
}

Object.assign(window, { DeskProfileA, DeskProfileB, MobProfileA, MobProfileB });
