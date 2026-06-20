// AppShell (KIT-01) — the structural composer every later surface mounts into. It
// composes the already-catalogued family slices in the landmark order the whole
// product inherits (a11y.md "Skip links + semantic landmarks"):
//
//   SkipLink → <header> (NavBar) → <main id="main">{children} → <nav> (MobileTabBar)
//
// The meaningful `<h1>` is the PAGE's responsibility, not the shell (a11y.md "one
// meaningful H1 per page") — AppShell emits none.
//
// Reflow is CONTAINER-keyed, not viewport-keyed (styling.md "prefer @container over
// viewport branching"): the root is an `@container`, the desktop NavBar shows at
// `@md` and up, and the MobileTabBar is the primary nav below `@md`. Both nav
// heights are reserved (`h-14` / `h-15`) so there is no layout shift (CLS = 0), and
// nothing scrolls horizontally at the 360px floor. Role-aware slots are simply the
// passed `items` list — denied items absent (NO RBAC — v1.0).
import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import type { NavItem } from "../NavBar";
import { MobileTabBar } from "../MobileTabBar";
import { NavBar } from "../NavBar";
import { SkipLink } from "../SkipLink";

// The shell root is the `@container` reflow anchor (container-keyed, not viewport).
const shell = tv({
  base: "@container flex min-h-0 flex-col bg-bg-0",
});

type Props = {
  className?: string;
  children: ReactNode;
  /** The role-aware section list for the desktop nav (denied items absent — v1.0). */
  items: readonly NavItem[];
  /** The role-aware bottom-tab list (a focused subset of `items` for mobile). */
  tabs: readonly NavItem[];
  /** The active section key — shared by NavBar + MobileTabBar. */
  activeKey: string;
  /** Skip-link copy (RU/EN), from `_fixtures/STRINGS`. */
  skipLabel: string;
  /** Desktop `<nav>` accessible name (RU/EN), from `_fixtures/STRINGS`. */
  navAriaLabel: string;
  /** Mobile `<nav>` accessible name (RU/EN), from `_fixtures/STRINGS`. */
  tabsAriaLabel: string;
};

export function AppShell({
  className,
  children,
  items,
  tabs,
  activeKey,
  skipLabel,
  navAriaLabel,
  tabsAriaLabel,
}: Props): ReactNode {
  return (
    <div className={shell({ className })} data-app-shell>
      <SkipLink label={skipLabel} />

      {/* Desktop top nav — container-keyed: hidden below @md, the NavBar's own
          <header> landmark above. */}
      <div className="hidden @md:block">
        <NavBar items={items} activeKey={activeKey} ariaLabel={navAriaLabel} />
      </div>

      <main id="main" className="flex-1 px-4 py-6" data-main>
        {children}
      </main>

      {/* Mobile bottom tabs — primary nav below @md, hidden at @md and up. */}
      <div className="@md:hidden" data-mobile-nav>
        <MobileTabBar items={tabs} activeKey={activeKey} ariaLabel={tabsAriaLabel} />
      </div>
    </div>
  );
}
