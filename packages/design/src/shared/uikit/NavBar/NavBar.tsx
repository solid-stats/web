// NavBar (KIT-01) — the desktop top nav: a sticky `<header>`-hosted `<nav>` at
// `--nav-h` (56px → `h-14`) rendering a role-aware `items` list. Each item is a
// focusable control whose ×7 states (enabled / hover / pressed / focused /
// selected / disabled — loading n/a for nav) are mapped through a `data-state` +
// `tv()` recipe (RESEARCH Pattern 2): the recipe applies the SAME token utilities
// the real `:hover`/`:active`/`:focus-visible` apply, and a `data-state` override
// drives the static catalog matrix (no real pointer, no arbitrary value).
//
// The active section is `text-primary` (cyan) + `aria-current="page"` + a cyan
// inset left-edge marker (`shadow-(--shadow-ring-glow)`-free; a literal inset
// box-shadow token via `--color-primary`) — meaning is never carried by color
// alone (a11y.md). Icons are `lucide-react` 18px locals; the whole item (icon +
// label) is the click zone, and the interactive element carries `min-h-11` (the
// 44px hit area lives on the control, not the glyph — Pitfall 3). Backdrop-blur on
// the sticky bar is allowed (DESIGN.md Elevation); content is never blurred.
//
// Role-aware slots are simply the passed `items` list — denied items are absent
// (NO RBAC, NO routes — v1.0). `/lite` is the tailwind-merge-free build.
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants/lite";
import { Link } from "../Button";

/** The ×7 nav-item states (loading is n/a for nav). `enabled` is the resting state. */
export type NavItemState = "enabled" | "hover" | "pressed" | "focused" | "selected" | "disabled";

/** One role-aware nav entry. The passed list IS the role slot — absent = denied (no RBAC). */
export type NavItem = {
  /** Stable section key (also the React key + active match). */
  readonly key: string;
  /** The literal display label (RU primary / EN mirror), from `_fixtures/STRINGS`. */
  readonly label: string;
  /** The Lucide icon component for the section (never a raw SVG string — V14). */
  readonly icon: LucideIcon;
  /** When true the item is non-interactive (a "soon" section with no page yet). */
  readonly disabled?: boolean;
};

type Props = {
  className?: string;
  /** The role-aware section list (denied items simply absent — no RBAC, v1.0). */
  items: readonly NavItem[];
  /** The active section key — that item gets cyan + `aria-current="page"` + edge marker. */
  activeKey: string;
  /** The `<nav>` landmark accessible name (RU/EN), from `_fixtures/STRINGS`. */
  ariaLabel: string;
  /**
   * Optional forced state for the static catalog matrix only — drives the
   * `data-state` override so one cell can show hover/pressed/focused without a
   * real pointer. Omitted in real use (real `:hover`/`:active`/`:focus-visible`
   * utilities below own live interaction).
   */
  forcedState?: NavItemState;
};

// The nav-item recipe. `base` carries the real interaction utilities (hover /
// active / focus-visible) so live nav works; the `state` variant is the catalog
// override applied via `data-state`. Active = `text-primary` + a cyan inset
// left-edge marker built from a literal `before:` pseudo-element bar
// (`before:bg-primary`) — never fill-alone.
// The sticky desktop header bar at `--nav-h` (56px → `h-14`). Backdrop-blur on the
// sticky bar is sanctioned (DESIGN.md Elevation); the translucent `bg-bg-1/80` lets
// content show through the blur — never blurs content itself.
const navBar = tv({
  base: "sticky top-0 z-40 flex h-14 items-center border-b border-border-1 bg-bg-1/80 px-4 backdrop-blur",
});

// GAP-19: the nav item renders `<Link variant="ghost">` (the shared ghost recipe owns
// the transparent surface + muted→primary hover + active bg + the canonical ring + the
// ≥44px hit area). This `navItem` recipe carries ONLY the nav-specific surface the base
// does not: `relative` (the marker anchor), the active inset cyan left-edge `before:`
// bar, and the `data-state` forced-matrix overrides (RESEARCH Pattern 2 — each maps to
// the SAME utilities the live pseudo-classes apply, for the static catalog cells).
const navItem = tv({
  base: "relative",
  variants: {
    state: {
      enabled: "",
      hover: "bg-surface-1 text-text-primary",
      pressed: "translate-y-px bg-surface-2 text-text-primary",
      focused: "shadow-(--shadow-ring) outline-none",
      selected: "text-primary",
      disabled: "",
    },
    /** The active section — cyan text + the inset cyan left-edge marker. */
    active: {
      true: "text-primary before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-primary",
      false: "",
    },
  },
});

export function NavBar({ className, items, activeKey, ariaLabel, forcedState }: Props): ReactNode {
  return (
    <header className={navBar({ className })}>
      <nav aria-label={ariaLabel} className="flex items-center gap-1">
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
              data-nav-item={item.key}
              className={navItem({ state, active: isActive })}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
