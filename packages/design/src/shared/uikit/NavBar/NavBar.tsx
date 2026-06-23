// NavBar (KIT-01) — the desktop top nav, reworked into a THREE-ZONE shell
// (GAP-01/02, diffed against the binding hi-fi `.design/hifi/shell.jsx` nav-inner;
// re-implemented with project tokens, never ported):
//
//   [ Brand ]      [ section links (center) ]      [ right utility cluster ]
//   left            overview … replays              search · language · account
//
// The right cluster is pinned right (`ml-auto`) and holds: a search icon-only
// `<Button variant="ghost">` (accessible name from `navSearchAria`), a language
// toggle `<Button variant="ghost">` showing the lang code (`navLanguageAria`), and
// the account control — the UNIVERSAL signed-in account entry (`<Button
// variant="secondary">` + user glyph) for every signed-in role, OR the Steam
// sign-in (`<Button variant="primary">` + the sanctioned SteamLogo SVG) when
// signed-out (GAP-02). Role extras (queue / admin) ADD to the cluster, never
// replace the account entry.
//
// GAP-03 mid-width condense: the center section-link LABELS collapse to icon-only
// below the `@5xl` container width and reappear at `@5xl` and up, so no width
// between the mobile floor and the full-desktop breakpoint shows a cramped /
// overflowing bar (the icons keep the targets ≥44px; the label is `title`-exposed).
//
// Every interactive control renders through the shared `Button` / `Link` `control`
// recipe (GAP-19) — one source for the ≥44px hit area + the ONE canonical
// `focus-visible:shadow-(--shadow-ring)` ring + `cursor-pointer`. The active
// section stays `text-primary` (cyan) + `aria-current="page"` + a cyan inset
// left-edge `before:` marker — never color-alone (a11y.md). `/lite` is the
// merge-free build; all classes are literal token utilities (no arbitrary values).
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Languages, Search, User } from "lucide-react";
import { tv } from "tailwind-variants/lite";
import { Button, Link } from "../Button";
import { SteamLogo } from "./SteamLogo";

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

/** The right-cluster account control: the universal signed-in account entry, or the
 *  signed-out Steam sign-in. Shaped by `navFixtures.accountFor(role)`. */
export type NavAccount =
  | { readonly kind: "account"; readonly label: string }
  | { readonly kind: "signin"; readonly label: string };

type Props = {
  className?: string;
  /** The role-aware section list (denied items simply absent — no RBAC, v1.0). */
  items: readonly NavItem[];
  /** The active section key — that item gets cyan + `aria-current="page"` + edge marker. */
  activeKey: string;
  /** The `<nav>` landmark accessible name (RU/EN), from `_fixtures/STRINGS`. */
  ariaLabel: string;
  /** The LEFT brand slot — a word-mark / glyph node the consumer passes (rendered as a
   *  ghost Link to overview). Omitted = no brand (the catalog passes one). */
  brand?: ReactNode;
  /** The RIGHT-cluster account control (universal account, or Steam sign-in). */
  account: NavAccount;
  /** Role-specific extras (queue / admin) that ADD to the right cluster (GAP-02). */
  roleExtras?: readonly NavItem[];
  /** The current language code shown on the language toggle (e.g. "RU" / "EN"). */
  langCode: string;
  /** Accessible name for the icon-only search control (RU/EN), from STRINGS. */
  searchAriaLabel: string;
  /** Accessible name for the language toggle (RU/EN), from STRINGS. */
  languageAriaLabel: string;
  /**
   * Optional forced state for the static catalog matrix only — drives the
   * `data-state` override so one cell can show hover/pressed/focused without a
   * real pointer. Omitted in real use.
   */
  forcedState?: NavItemState;
};

// The sticky desktop header bar at `--nav-h` (56px → `h-14`). Backdrop-blur on the
// sticky bar is sanctioned (DESIGN.md Elevation); the translucent `bg-bg-1/80` lets
// content show through the blur — never blurs content itself.
const navBar = tv({
  base: "sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border-1 bg-bg-1/80 px-4 backdrop-blur",
});

// GAP-19: the nav item renders `<Link variant="ghost">` (the shared ghost recipe owns
// the transparent surface + muted→primary hover + active bg + the canonical ring + the
// ≥44px hit area). This `navItem` recipe carries ONLY the nav-specific surface the base
// does not: `relative` (the marker anchor), the active inset cyan left-edge `before:`
// bar, and the `data-state` forced-matrix overrides (RESEARCH Pattern 2).
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

export function NavBar({
  className,
  items,
  activeKey,
  ariaLabel,
  brand,
  account,
  roleExtras,
  langCode,
  searchAriaLabel,
  languageAriaLabel,
  forcedState,
}: Props): ReactNode {
  return (
    <header className={navBar({ className })}>
      {/* LEFT — brand slot (ghost Link to overview). */}
      {brand !== undefined && (
        <Link variant="ghost" size="sm" href="#overview" className="shrink-0" data-nav-brand>
          {brand}
        </Link>
      )}

      {/* CENTER — role-invariant section links. */}
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
              title={item.label}
              data-state={state}
              data-nav-item={item.key}
              className={navItem({ state, active: isActive })}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              {/* GAP-03 condense: label icon-only below @5xl, shown at full width. */}
              <span className="hidden @5xl:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* RIGHT — utility cluster, pinned right. */}
      <div className="ml-auto flex shrink-0 items-center gap-1" data-nav-right>
        <Button variant="ghost" size="sm" aria-label={searchAriaLabel} data-nav-search>
          <Search className="size-5 shrink-0" aria-hidden />
        </Button>
        <Button variant="ghost" size="sm" aria-label={languageAriaLabel} data-nav-language>
          <Languages className="size-5 shrink-0" aria-hidden />
          {langCode}
        </Button>

        {/* Role-specific extras ADD to (never replace) the account entry (GAP-02). */}
        {roleExtras?.map((extra) => {
          const Icon = extra.icon;
          return (
            <Link
              key={extra.key}
              variant="ghost"
              size="sm"
              href={`#${extra.key}`}
              title={extra.label}
              data-nav-extra={extra.key}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className="hidden @5xl:inline">{extra.label}</span>
            </Link>
          );
        })}

        {account.kind === "account" ? (
          <Button variant="secondary" size="sm" data-nav-account>
            <User className="size-5 shrink-0" aria-hidden />
            {account.label}
          </Button>
        ) : (
          <Button variant="primary" size="sm" data-nav-signin>
            <SteamLogo size={16} className="shrink-0" />
            {account.label}
          </Button>
        )}
      </div>
    </header>
  );
}
