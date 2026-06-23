// MobileTabBar (KIT-01) — the bottom tab bar that becomes the primary nav below the
// raised `@5xl` breakpoint: a `<nav>` at `--tabbar-h` (60px → `h-15`) rendering 4
// primary public section tabs PLUS a dedicated 5th account/sign-in tab (GAP-04 — the
// account tab is a SEPARATE slot, not `navItemsFor().slice(0,4)`, so signed-in users
// reach their account on mobile). Each tab is a ≥44×44 interactive element (the box,
// not the glyph — `min-h-11 min-w-11`, Pitfall 3) stacking the Lucide icon over its
// label; the whole tab is the click zone. The active tab is `text-primary` (cyan) +
// `aria-current="page"` + a cyan top-edge marker — never color-alone (a11y.md).
//
// The 5th tab mirrors the NavBar account control: the universal account entry when
// signed-in, the Steam sign-in when signed-out (the `accountTab` prop). All tabs
// render through the shared `Button`/`Link` `control` recipe (GAP-19). `/lite` is the
// merge-free build.
import type { ReactNode } from "react";
import { LogIn, User } from "lucide-react";
import { tv } from "tailwind-variants/lite";
import { Button, Link } from "../Button";
import type { NavAccount, NavItem, NavItemState } from "../NavBar";

type Props = {
  className?: string;
  /** The 4 primary public section tabs (denied items simply absent — no RBAC, v1.0). */
  items: readonly NavItem[];
  /** The active section key — that tab gets cyan + `aria-current="page"` + top marker. */
  activeKey: string;
  /** The `<nav>` landmark accessible name (RU/EN), from `_fixtures/STRINGS`. */
  ariaLabel: string;
  /** GAP-04 — the dedicated 5th account/sign-in tab (account when signed in, Steam
   *  sign-in when out). A SEPARATE slot from the section tabs. */
  accountTab: NavAccount;
  /** Catalog-only forced state for the static matrix (RESEARCH Pattern 2). */
  forcedState?: NavItemState;
};

// The fixed-height bottom bar at `--tabbar-h` (h-15 = 60px). Reserves its height
// (CLS = 0); backdrop-blur on the sticky bar is sanctioned (DESIGN.md Elevation).
const tabBar = tv({
  base: "flex h-15 items-stretch gap-1 border-t border-border-1 bg-bg-1/80 px-2 backdrop-blur",
});

// GAP-19: each tab renders `<Link variant="ghost">` (the shared ghost recipe owns the
// transparent surface + muted→primary hover + active bg + the canonical ring + the
// ≥44px floor). This `tab` recipe carries ONLY the tab-specific surface the base does
// not: the icon-over-label column (`flex-col`), the ≥44px WIDTH floor (`min-w-11
// flex-1`), `relative` + the cyan top-edge active marker, and the `data-state`
// forced-matrix overrides (RESEARCH Pattern 2).
const tab = tv({
  base: "relative min-w-11 flex-1 flex-col gap-1",
  variants: {
    state: {
      enabled: "",
      hover: "bg-surface-1 text-text-primary",
      pressed: "translate-y-px bg-surface-2 text-text-primary",
      focused: "shadow-(--shadow-ring) outline-none",
      selected: "text-primary",
      disabled: "",
    },
    active: {
      true: "text-primary before:absolute before:inset-x-3 before:top-0 before:h-0.5 before:rounded-full before:bg-primary",
      false: "",
    },
  },
});

export function MobileTabBar({
  className,
  items,
  activeKey,
  ariaLabel,
  accountTab,
  forcedState,
}: Props): ReactNode {
  return (
    <nav aria-label={ariaLabel} className={tabBar({ className })} data-tabbar>
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const Icon = item.icon;
        const state = item.disabled === true ? "disabled" : forcedState;

        return (
          <Link
            key={item.key}
            variant="ghost"
            size="sm"
            href={item.disabled === true ? undefined : `#${item.key}`}
            disabled={item.disabled === true}
            aria-current={isActive ? "page" : undefined}
            data-state={state}
            data-tab={item.key}
            className={tab({ state, active: isActive })}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}

      {/* GAP-04 — the dedicated 5th account/sign-in tab. The account entry is a
          navigable Link; the sign-in is a Button (it triggers the Steam OAuth flow,
          not a route). Both reuse the shared ghost `tab` surface. */}
      {accountTab.kind === "account" ? (
        <Link
          variant="ghost"
          size="sm"
          href="#account"
          aria-current={activeKey === "account" ? "page" : undefined}
          data-state={forcedState}
          data-tab="account"
          className={tab({ state: forcedState, active: activeKey === "account" })}
        >
          <User className="size-5 shrink-0" aria-hidden />
          {accountTab.label}
        </Link>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          data-tab="signin"
          className={tab({ state: forcedState, active: false })}
        >
          <LogIn className="size-5 shrink-0" aria-hidden />
          {accountTab.label}
        </Button>
      )}
    </nav>
  );
}
