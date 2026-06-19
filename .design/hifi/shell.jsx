/* hifi/shell.jsx — i18n-aware app shell: top nav, mobile tab bar, footer.
   Reuses kit.css classes. Localizes nav labels via SS_T. */

/* Steam wordmark glyph — Lucide ships no brand marks, so this OAuth provider
   logo is an inline SVG (the one sanctioned exception to the icon system). */
function SteamLogo({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.98 2C6.65 2 2.28 6.1 2 11.32l5.35 2.21a2.74 2.74 0 0 1 1.56-.48l.13.01 2.38-3.45v-.05a3.66 3.66 0 1 1 3.66 3.66h-.08l-3.4 2.43.01.1a2.75 2.75 0 1 1-5.47-.18l-3.83-1.58A10 10 0 1 0 11.98 2zM9.4 17.18l-1.23-.51a2.06 2.06 0 0 0 3.82-.27 2.06 2.06 0 0 0-2.7-2.6l1.27.53a1.52 1.52 0 1 1-1.16 2.8l-.01.01zm8.7-7.83a2.44 2.44 0 1 0-4.88 0 2.44 2.44 0 0 0 4.88 0zm-4.27 0a1.84 1.84 0 1 1 3.67 0 1.84 1.84 0 0 1-3.67 0z"/>
    </svg>
  );
}

/* Static page map — these three surfaces are built and link to each other; the
   remaining nav items have no page yet, so they stay non-navigating (dimmed, no
   dead 404 link) until built. */
const SS_PAGES = { overview: 'Stats Overview.html', players: 'Players.html', player: 'Player Profile.html', squads: 'Squads.html' };
function ssGo(id) { const f = SS_PAGES[id]; if (f) window.location.href = f; }
window.ssGo = ssGo;
window.SS_PAGES = SS_PAGES;

const SHELL_NAV = [
  ['overview', 'nav_overview', 'bar-chart-3'],
  ['players', 'nav_players', 'user'],
  ['squads', 'nav_squads', 'users'],
  ['bounty', 'nav_bounty', 'target'],
  ['commanders', 'nav_commanders', 'shield'],
  ['replays', 'nav_replays', 'film'],
];
const SHELL_TAB = [
  ['overview', 'tab_stats', 'bar-chart-3'],
  ['players', 'nav_players', 'user'],
  ['bounty', 'nav_bounty', 'target'],
  ['replays', 'nav_replays', 'film'],
];

function Shell({ lang, setLang, signedIn, onSearch, active = 'overview', children }) {
  const t = (k) => window.SS_T(lang, k);
  return (
    <div className="app">
      <header className="nav">
        <div className="container nav-inner">
          <Brand onClick={() => ssGo('overview')} />
          <nav className="nav-links" aria-label="Primary">
            {SHELL_NAV.map(([id, key, icon]) => {
              const href = SS_PAGES[id];
              const cls = `nav-link${id === active ? ' active' : ''}${href ? '' : ' nav-link--soon'}`;
              const inner = <><Icon name={icon} size={15} /><span className="nav-link-label">{t(key)}</span></>;
              return href
                ? <a key={id} className={cls} href={href} title={t(key)}>{inner}</a>
                : <div key={id} className={cls} role="link" aria-disabled="true" title={t(key)}>{inner}</div>;
            })}
          </nav>
          <div className="nav-right">
            <Button variant="ghost" size="sm" icon="search" aria-label={t('search')} onClick={onSearch} />
            <button className="selpill" style={{ padding: '6px 9px' }} onClick={() => setLang(lang === 'EN' ? 'RU' : 'EN')} aria-label="Language">
              <Icon name="languages" size={15} />{lang}
            </button>
            {signedIn ? (
              <button className="btn btn-sm btn-secondary nav-account" title={t('myAccount')} aria-label={t('myAccount')}>
                <span className="nav-avatar"><Icon name="user" size={14} /></span>
                <span className="nav-account-name">{t('myAccount')}</span>
              </button>
            ) : (
              <button className="btn btn-sm steam" title={t('signin')} aria-label={t('signin')}>
                <SteamLogo size={15} />{t('signin')}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main">{children}</main>

      <nav className="tabbar" aria-label="Mobile">
        <div className="tabbar-inner">
          {SHELL_TAB.map(([id, key, icon]) => {
            const href = SS_PAGES[id];
            return (
              <button key={id} className={`${id === active ? 'active' : ''}${href ? '' : ' tab--soon'}`.trim()}
                onClick={href ? () => ssGo(id) : undefined} aria-disabled={href ? undefined : 'true'}>
                <Icon name={icon} size={20} />{t(key)}
              </button>
            );
          })}
          {signedIn ? (
            <button>
              <span className="tab-avatar"><Icon name="user" size={15} /></span>{t('tab_account')}
            </button>
          ) : (
            <button>
              <Icon name="log-in" size={20} />{t('signinShort')}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
window.Shell = Shell;
