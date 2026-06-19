/* wf-desktop.jsx — desktop companions showing how two leading mobile
   directions scale up to the productivity layout (top nav + density + multi-col).
   Dark gunmetal wireframe. */

function TopNav({ active = 'Stats' }) {
  const nav = ['Stats', 'Players', 'Squads', 'Rotations', 'Bounty', 'Replays'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', height: 52, borderBottom: `1.4px solid ${WF.line}`, background: WF.bar, flex: '0 0 auto' }}>
      <Brand />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 6 }}>
        {nav.map((n) => (
          <span key={n} style={{ position: 'relative', paddingBottom: 16, paddingTop: 16 }}>
            <Hand size={16} weight={n === active ? 700 : 500} color={n === active ? WF.accent : WF.sub}>{n}</Hand>
            {n === active && <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: WF.accent }} />}
          </span>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <Field w={170} style={{ background: WF.panel2 }}><span style={{ color: WF.faint }}>⌕</span><Hand size={14} color={WF.faint}>Search…</Hand></Field>
      <span style={{ width: 28, height: 28, ...wfBox({ borderRadius: '50%', background: WF.panel2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }) }}><Hand size={13} color={WF.sub}>☾</Hand></span>
      <Hand size={14} color={WF.sub}>EN·RU</Hand>
      <Btn>Sign in</Btn>
    </div>
  );
}

function PageHead() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <Hand size={28} weight={700}>Stats overview</Hand>
        <div style={{ marginTop: 6 }}><Fresh /></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={wfBox({ display: 'inline-flex', borderRadius: 4, overflow: 'hidden', background: WF.panel2 })}>
          <span style={{ padding: '6px 11px', background: WF.accentWash, borderRight: `1px solid ${WF.line}` }}><Hand size={14} color={WF.accent}>Compact</Hand></span>
          <span style={{ padding: '6px 11px' }}><Hand size={14} color={WF.sub}>Comfy</Hand></span>
        </span>
        <Field w={155} accent caret><span style={{ color: WF.accent }}>⟳</span><Hand size={15} color={WF.accent}>Rotation 14</Hand></Field>
      </div>
    </div>
  );
}

function DCard({ title, all, count, children, style = {} }) {
  return (
    <div style={wfBox({ padding: 16, display: 'flex', flexDirection: 'column', ...style })}>
      <SecHead title={title} all={all || 'View all'} count={count} style={{ marginBottom: 12 }} />
      {children}
    </div>
  );
}

// wide table-style player rows for desktop (SCORE primary; K/D lives on full list/profile)
function PlayerTable({ n = 6 }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 56px 56px 64px', padding: '0 4px 8px', borderBottom: `1.4px solid ${WF.line}` }}>
        {['#', 'PLAYER', 'KILLS', 'GAMES', 'SCORE'].map((h, i) => <Overline key={h} style={{ textAlign: i > 1 ? 'right' : 'left' }}>{h}</Overline>)}
      </div>
      {PLAYERS.slice(0, n).map((p, i) => (
        <div key={p[0]} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 56px 56px 64px', alignItems: 'center', padding: '0 4px', height: 38, borderBottom: i < n - 1 ? `1px solid ${WF.line}` : 'none', background: i === 0 ? WF.accentWash : 'transparent' }}>
          <Mono size={12} color={i === 0 ? WF.accent : WF.faint}>{String(i + 1).padStart(2, '0')}</Mono>
          <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Thumb s={24} label={p[1][0]} />
            <span><Hand size={15}>{p[0]}</Hand> <Mono size={9} color={WF.faint}>[{p[1]}]</Mono></span>
          </span>
          <Mono size={13} color={WF.sub} style={{ textAlign: 'right' }}>{p[3]}</Mono>
          <Mono size={13} color={WF.sub} style={{ textAlign: 'right' }}>{p[4]}</Mono>
          <Mono size={14} weight={600} style={{ textAlign: 'right' }}>{p[2]}</Mono>
        </div>
      ))}
    </div>
  );
}

function ReplayTable({ n = 5 }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 110px 80px 100px 90px', padding: '0 4px 8px', borderBottom: `1.4px solid ${WF.line}` }}>
        {['', 'MISSION', 'WORLD', 'RESULT', 'WHEN', 'TOP FRAG'].map((h, i) => <Overline key={i}>{h}</Overline>)}
      </div>
      {REPLAYS.slice(0, n).map((r, i) => (
        <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 110px 80px 100px 90px', alignItems: 'center', padding: '0 4px', height: 40, borderBottom: i < n - 1 ? `1px solid ${WF.line}` : 'none' }}>
          <Thumb s={26} />
          <span><Hand size={14}>{r[1]}</Hand> <Mono size={9} color={WF.faint}>#{r[0]}</Mono></span>
          <Mono size={11} color={WF.sub}>{r[2]}</Mono>
          <span>{winBadge(r[3])}</span>
          <Mono size={10} color={WF.faint}>{r[4]}</Mono>
          <Hand size={14} color={WF.accent}>{r[5]}</Hand>
        </div>
      ))}
    </div>
  );
}

const dFrame = (children) => (
  <div style={{ width: '100%', height: '100%', background: WF.page, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>{children}</div>
);

// ===== DESKTOP for Direction 1 (segmented → tabbed leaderboard + rail) ====
function DeskSeg() {
  return dFrame(<>
    <TopNav />
    <div style={{ padding: 28 }}>
      <PageHead />
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18 }}>
        <div style={wfBox({ padding: 16 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: `1.4px solid ${WF.line}`, paddingBottom: 11, marginBottom: 6 }}>
            {['Players', 'Squads', 'Bounty'].map((t, i) => <Hand key={t} size={18} weight={i === 0 ? 700 : 500} color={i === 0 ? WF.accent : WF.sub}>{t}</Hand>)}
            <div style={{ flex: 1 }} />
            <span style={wfBox({ padding: '5px 9px', borderRadius: 4, background: WF.panel2 })}><Hand size={13} color={WF.sub}>Sort: Score ▾</Hand></span>
          </div>
          <PlayerTable n={6} />
          <div style={{ textAlign: 'center', marginTop: 10 }}><Hand size={14} color={WF.accent}>View full leaderboard →</Hand></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <DCard title="Bounty leaders" all="All"><BountyRows n={4} /></DCard>
          <DCard title="Recent replays" all="All"><ReplayRows n={4} /></DCard>
        </div>
      </div>
    </div>
  </>);
}

// ===== DESKTOP for Direction 2 (stacked → multi-column grid) ==============
function DeskStack() {
  return dFrame(<>
    <TopNav />
    <div style={{ padding: 28 }}>
      <PageHead />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 18 }}>
        <DCard title="Top players" all="All" count="3,471"><PlayerTable n={6} /></DCard>
        <DCard title="Top squads" all="All" count="1,204"><SquadRows n={4} /></DCard>
        <DCard title="Bounty leaderboard" all="All"><BountyRows n={4} /></DCard>
      </div>
      <DCard title="Recent replays" all="All replays" count="1,204"><ReplayTable n={5} /></DCard>
    </div>
  </>);
}

Object.assign(window, { DeskSeg, DeskStack, TopNav, PageHead });
