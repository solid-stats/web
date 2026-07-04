// Shared role-aware nav fixtures for the KIT-01 family stories (NavBar /
// MobileTabBar / AppShell). One source so the roles ×4 demonstration is identical
// across all three slices. These are STORY fixtures (catalog-only) — the real app
// builds its item list from the route tree + the signed-in role (v1.0). Lucide +
// STRINGS are generic shared deps (no page/business import). RU primary; pass the
// EN mirror by swapping the `lang` arg.
//
// GAP-01/02 nav-shell rework — the model is split into THREE concerns that map to
// the three-zone NavBar:
//   • `publicSections`  → the CENTER section links (overview…replays) — the same
//      for every role (denied sections simply absent). Account/role extras are NOT
//      in this list any more (GAP-02: they used to leak into the section row).
//   • `accountFor(role)` → the RIGHT-cluster account control: the UNIVERSAL account
//      entry for every signed-in role (player / moderator / admin all get the SAME
//      account control — GAP-02), or the Steam sign-in when signed-out.
//   • `roleExtrasFor(role)` → the role-specific ADDITIONS (moderator → queue,
//      admin → admin) that ADD to — never replace — the account entry.
import { BarChart3, Film, ShieldCheck, Target, User, Users } from "lucide-react";
import { STRINGS } from "../_fixtures";
import type { NavItem } from "./NavBar";

type Lang = "ru" | "en";

/** The four visual roles the shell renders slots for (NO RBAC — v1.0). */
export type NavRole = "signed-out" | "player" | "moderator" | "admin";

/** Whether a role is signed in (any of player / moderator / admin). */
export function isSignedIn(role: NavRole): boolean {
  return role !== "signed-out";
}

// Public sections (mirror the hi-fi shell semantics). `squads`/`commanders` have no
// page yet → disabled ("soon"), so the catalog also proves the disabled state. These
// are the CENTER zone only — identical across roles (denied sections simply absent).
export function publicSections(lang: Lang): readonly NavItem[] {
  return [
    { key: "overview", label: STRINGS.navOverview[lang], icon: BarChart3 },
    { key: "players", label: STRINGS.navPlayers[lang], icon: User },
    { key: "squads", label: STRINGS.navSquads[lang], icon: Users, disabled: true },
    { key: "bounty", label: STRINGS.navBounty[lang], icon: Target },
    { key: "commanders", label: STRINGS.navCommanders[lang], icon: ShieldCheck, disabled: true },
    { key: "replays", label: STRINGS.navReplays[lang], icon: Film },
  ];
}

/** The right-cluster account control kind: the universal signed-in account entry, or
 *  the signed-out Steam sign-in. The NavBar renders these as distinct variants
 *  (`secondary` account vs `primary` Steam). */
export type AccountControl =
  | { readonly kind: "account"; readonly label: string }
  | { readonly kind: "signin"; readonly label: string };

/** GAP-02 — the UNIVERSAL account control: every signed-in role gets the SAME
 *  account entry; signed-out gets the Steam sign-in. Role does not change which
 *  control appears here (only `roleExtrasFor` adds the role-specific extras). */
export function accountFor(role: NavRole, lang: Lang = "ru"): AccountControl {
  return isSignedIn(role)
    ? { kind: "account", label: STRINGS.navAccount[lang] }
    : { kind: "signin", label: STRINGS.navSignInSteam[lang] };
}

// Role-specific ADDITIONS (moderator → queue, admin → admin). These ADD to the
// account entry — they never replace it (GAP-02). Denied roles get an empty list.
const ROLE_EXTRAS = {
  "signed-out": (): readonly NavItem[] => [],
  player: (): readonly NavItem[] => [],
  moderator: (lang: Lang): readonly NavItem[] => [
    { key: "queue", label: STRINGS.navQueue[lang], icon: ShieldCheck },
  ],
  admin: (lang: Lang): readonly NavItem[] => [
    { key: "admin", label: STRINGS.navAdmin[lang], icon: ShieldCheck },
  ],
} as const satisfies Record<NavRole, (lang: Lang) => readonly NavItem[]>;

/** The role-specific extra entries (queue / admin) that ADD to the account control. */
export function roleExtrasFor(role: NavRole, lang: Lang = "ru"): readonly NavItem[] {
  return ROLE_EXTRAS[role](lang);
}

/** The center section list for a role + language. Account/role-extras are NOT here
 *  (GAP-02 — they live in the right cluster); the sections are role-invariant. */
export function navItemsFor(_role: NavRole, lang: Lang = "ru"): readonly NavItem[] {
  return publicSections(lang);
}

/** The four roles, in display order — drives the roles ×4 matrix. */
export const NAV_ROLES: readonly NavRole[] = ["signed-out", "player", "moderator", "admin"];
