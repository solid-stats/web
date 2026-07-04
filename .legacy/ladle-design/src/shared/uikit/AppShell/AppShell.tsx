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
// `@5xl` (~1024px container) and up — the RAISED breakpoint (GAP-03) at which the
// brand + 6 section links + right cluster fit without overflowing (the old `@md` =
// 448px cramped/overflowed) — and the MobileTabBar is the primary nav below `@5xl`.
// Both nav heights are reserved (`h-14` / `h-15`) so there is no layout shift
// (CLS = 0), and nothing scrolls horizontally at the 360px floor. The NavBar itself
// also condenses its section labels below `@5xl` content width (icon-only) so no
// intermediate width shows a cramped bar. Role-aware slots are simply the passed
// `items` list — denied items absent (NO RBAC — v1.0).
import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import type { NavAccount, NavItem } from "../NavBar";
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
  /** The LEFT brand slot threaded into the NavBar (a word-mark node). */
  brand?: ReactNode;
  /** The right-cluster account control (universal account, or Steam sign-in). */
  account: NavAccount;
  /** Role-specific extras (queue / admin) added to the NavBar right cluster (GAP-02). */
  roleExtras?: readonly NavItem[];
  /** The mobile 5th-tab account control (mirrors `account` — GAP-04). */
  accountTab: NavAccount;
  /** The current language code shown on the NavBar language toggle (e.g. "RU"). */
  langCode: string;
  /** Accessible name for the icon-only search control (RU/EN). */
  searchAriaLabel: string;
  /** Accessible name for the language toggle (RU/EN). */
  languageAriaLabel: string;
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
  brand,
  account,
  roleExtras,
  accountTab,
  langCode,
  searchAriaLabel,
  languageAriaLabel,
  skipLabel,
  navAriaLabel,
  tabsAriaLabel,
}: Props): ReactNode {
  return (
    <div className={shell({ className })} data-app-shell>
      <SkipLink label={skipLabel} />

      {/* Desktop top nav — container-keyed: it appears only at @5xl (~1024px
          container), the width at which the brand + 6 sections + right cluster fit
          without overflow (GAP-03 raised breakpoint). Below that the MobileTabBar is
          the primary nav. */}
      <div className="hidden @5xl:block">
        <NavBar
          items={items}
          activeKey={activeKey}
          ariaLabel={navAriaLabel}
          brand={brand}
          account={account}
          roleExtras={roleExtras}
          langCode={langCode}
          searchAriaLabel={searchAriaLabel}
          languageAriaLabel={languageAriaLabel}
        />
      </div>

      {/* The data/page container caps at the `--container` (1760px) ceiling and
          CENTERS on wide screens — fluid below, then the gutters grow symmetrically
          (DESIGN.md "container = 1760 ceiling, fluid below, then centers"). The
          `<main>` landmark keeps the side padding full-width; the inner wrapper is the
          measured content box (`max-w-(--container)` reads the token — no arbitrary
          value, styling.md). `mx-auto` does the centering. */}
      <main id="main" className="flex-1 px-4 py-6" data-main>
        <div className="mx-auto w-full max-w-(--container)" data-main-content>
          {children}
        </div>
      </main>

      {/* Mobile bottom tabs — primary nav below @5xl, hidden at @5xl and up. */}
      <div className="@5xl:hidden" data-mobile-nav>
        <MobileTabBar
          items={tabs}
          activeKey={activeKey}
          ariaLabel={tabsAriaLabel}
          accountTab={accountTab}
        />
      </div>
    </div>
  );
}
