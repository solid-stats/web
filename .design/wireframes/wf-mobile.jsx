/* wf-mobile.jsx — three mobile-first structural directions for Stats Overview.
   390px-wide phone frames. Each is a full vertical scroll (frame grows to fit),
   with status bar + sticky header + bottom tab bar. Dark gunmetal wireframe. */

// shared phone chrome ------------------------------------------------------
function Status() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 18px 2px', background: WF.bar }}>
      <Mono size={12} weight={600} color={WF.ink}>9:41</Mono>
      <span style={{ display: 'flex', gap: 5, color: WF.sub }}><Mono size={10}>▰▰▰</Mono><Mono size={10}>◗</Mono></span>
    </div>
  );
}

function Header({ title, rotation = true }) {
  return (
    <div style={{ padding: '6px 16px 12px', borderBottom: `1.4px solid ${WF.line}`, background: WF.bar }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Brand size={15} />
        <span style={{ display: 'flex', gap: 7 }}>
          {['☾', '⌕'].map((g) => (
            <span key={g} style={{ width: 26, height: 26, ...wfBox({ borderRadius: '50%', background: WF.panel2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }) }}><Hand size={12} color={WF.sub}>{g}</Hand></span>
          ))}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 11 }}>
        <Hand size={22} weight={700} style={{ whiteSpace: 'nowrap' }}>{title}</Hand>
        {rotation && (
          <span style={wfBox({ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 9px', borderRadius: 4, borderColor: WF.accent, background: WF.accentWash })}>
            <span style={{ color: WF.accent, fontSize: 12 }}>⟳</span><Hand size={13} color={WF.accent}>Rotation 14 ▾</Hand>
          </span>
        )}
      </div>
    </div>
  );
}

function TabBar({ active = 'Stats' }) {
  const tabs = [['Stats', '▤'], ['Players', '☖'], ['Squads', '◧'], ['Bounty', '◎'], ['More', '⋯']];
  return (
    <div style={{ display: 'flex', borderTop: `1.4px solid ${WF.line}`, background: WF.bar, paddingBottom: 10 }}>
      {tabs.map((t) => (
        <span key={t[0]} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '9px 0' }}>
          <Hand size={16} color={t[0] === active ? WF.accent : WF.faint}>{t[1]}</Hand>
          <Hand size={10.5} weight={t[0] === active ? 700 : 500} color={t[0] === active ? WF.accent : WF.faint}>{t[0]}</Hand>
        </span>
      ))}
    </div>
  );
}

function SearchField() {
  return (
    <span style={wfBox({ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 5, background: WF.panel2, borderColor: WF.line2 })}>
      <span style={{ color: WF.faint, fontSize: 14 }}>⌕</span>
      <Hand size={15} color={WF.faint}>Search players, squads, replays…</Hand>
    </span>
  );
}

const Frame = ({ children }) => (
  <div style={{ width: '100%', minHeight: '100%', background: WF.page, display: 'flex', flexDirection: 'column' }}>{children}</div>
);

const card = (extra = {}) => wfBox({ padding: 13, ...extra });

// segmented control
function Segmented({ items, active = 0 }) {
  return (
    <span style={wfBox({ display: 'inline-flex', borderRadius: 5, overflow: 'hidden', background: WF.panel2, width: '100%' })}>
      {items.map((it, i) => (
        <span key={it} style={{
          flex: 1, textAlign: 'center', padding: '8px 0',
          background: i === active ? WF.accentWash : 'transparent',
          borderRight: i < items.length - 1 ? `1px solid ${WF.line}` : 'none',
        }}>
          <Hand size={15} weight={i === active ? 700 : 500} color={i === active ? WF.accent : WF.sub}>{it}</Hand>
        </span>
      ))}
    </span>
  );
}

// ===== DIRECTION 1 — Segmented leaderboards ==============================
// One ranking in focus at a time (Players/Squads/Bounty), recent replays below.
function MobSeg() {
  return (
    <Frame>
      <Status />
      <Header title="Stats overview" />
      <div style={{ flex: 1, padding: '13px 16px', display: 'flex', flexDirection: 'column', gap: 13 }}>
        <SearchField />
        <Fresh />
        <Segmented items={['Players', 'Squads', 'Bounty']} active={0} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Mono size={11} color={WF.faint}>3,471 players · Rotation 14</Mono>
          <span style={wfBox({ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 4, background: WF.panel2 })}><Hand size={13} color={WF.sub}>Sort: Score ▾</Hand></span>
        </div>
        <div style={card()}><PlayerRows n={6} /></div>
        <span style={{ textAlign: 'center' }}><Hand size={14} color={WF.accent}>View full leaderboard →</Hand></span>
        <div style={{ height: 1, background: WF.line, margin: '2px 0' }} />
        <SecHead title="Recent replays" all="All" count="1,204" />
        <div style={card()}><ReplayRows n={3} /></div>
      </div>
      <TabBar />
    </Frame>
  );
}

// ===== DIRECTION 2 — Stacked digest =====================================
// Every module visible as its own card, priority order, single scroll.
function MobStack() {
  return (
    <Frame>
      <Status />
      <Header title="Stats overview" />
      <div style={{ flex: 1, padding: '13px 16px', display: 'flex', flexDirection: 'column', gap: 13 }}>
        <SearchField />
        <Fresh />
        <div style={card()}>
          <SecHead title="Top players" all="All" count="3,471" style={{ marginBottom: 10 }} />
          <PlayerRows n={4} />
        </div>
        <div style={card()}>
          <SecHead title="Top squads" all="All" count="1,204" style={{ marginBottom: 10 }} />
          <SquadRows n={3} />
        </div>
        <div style={card()}>
          <SecHead title="Bounty leaderboard" all="All" style={{ marginBottom: 4 }} />
          <Mono size={9} color={WF.faint} style={{ display: 'block', marginBottom: 8 }}>Points this rotation · weighted by prev-rotation effectiveness</Mono>
          <BountyRows n={3} />
        </div>
        <div style={card()}>
          <SecHead title="Recent replays" all="All" style={{ marginBottom: 10 }} />
          <ReplayRows n={3} />
        </div>
      </div>
      <TabBar />
    </Frame>
  );
}

// ===== DIRECTION 3 — Activity-led feed ==================================
// "What just happened" replay feed is the hero; rankings peek as a swipe row.
function MobFeed() {
  return (
    <Frame>
      <Status />
      <Header title="What happened" />
      <div style={{ flex: 1, padding: '13px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Fresh stale />
        {/* swipeable top-of-rotation podium cards */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            <Hand size={16} weight={700}>Top of Rotation 14</Hand>
            <Mono size={10} color={WF.faint}>swipe ›</Mono>
          </div>
          <div style={{ display: 'flex', gap: 10, overflow: 'hidden' }}>
            {[['Players', <PlayerRows n={3} key="p" />], ['Squads', <SquadRows n={3} key="s" />], ['Bounty', <BountyRows n={3} showFormula={false} key="b" />]].map((c, i) => (
              <div key={c[0]} style={{ flex: '0 0 78%', ...card() }}>
                <SecHead title={c[0]} all="All" style={{ marginBottom: 8 }} />
                {c[1]}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 1, background: WF.line }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Hand size={18} weight={700}>Recent replays</Hand>
          <Hand size={13} color={WF.accent}>All →</Hand>
        </div>
        <ReplayRows n={3} rich />
      </div>
      <TabBar active="Stats" />
    </Frame>
  );
}

Object.assign(window, { MobSeg, MobStack, MobFeed, Status, Header, TabBar, Segmented, SearchField });
