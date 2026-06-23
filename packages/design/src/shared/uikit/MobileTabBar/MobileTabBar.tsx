// MobileTabBar (KIT-01) — the bottom tab bar that becomes the primary nav below
// `md`: a `<nav>` at `--tabbar-h` (60px → `h-15`) rendering the same role-aware
// `NavItem` list NavBar consumes. Each tab is a ≥44×44 interactive element (the
// box, not the glyph — `min-h-11 min-w-11`, Pitfall 3) stacking the Lucide icon
// over its label; the whole tab is the click zone. The active tab is `text-primary`
// (cyan) + `aria-current="page"` + a cyan top-edge marker — never color-alone
// (a11y.md). It reuses the NavBar `tv()` + `data-state` recipe shape so the ×7
// states render identically across the family. `/lite` is the merge-free build.
import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { Link } from "../Button";
import type { NavItem, NavItemState } from "../NavBar";

type Props = {
  className?: string;
  /** The role-aware section list (denied items simply absent — no RBAC, v1.0). */
  items: readonly NavItem[];
  /** The active section key — that tab gets cyan + `aria-current="page"` + top marker. */
  activeKey: string;
  /** The `<nav>` landmark accessible name (RU/EN), from `_fixtures/STRINGS`. */
  ariaLabel: string;
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
    </nav>
  );
}
