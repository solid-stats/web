// Shared role-aware nav-item fixtures for the KIT-01 family stories (NavBar /
// MobileTabBar / AppShell). One source so the roles ×4 demonstration is identical
// across all three slices. These are STORY fixtures (catalog-only) — the real app
// builds its item list from the route tree + the signed-in role (v1.0). Lucide +
// STRINGS are generic shared deps (no page/business import). RU primary; pass the
// EN mirror by swapping the `lang` arg.
import { BarChart3, Film, LogIn, ShieldCheck, Target, User, Users } from "lucide-react";
import { STRINGS } from "../_fixtures";
import type { NavItem } from "./NavBar";

type Lang = "ru" | "en";

/** The four visual roles the shell renders slots for (NO RBAC — v1.0). */
export type NavRole = "signed-out" | "player" | "moderator" | "admin";

// Public sections (mirror the hi-fi shell semantics). `squads`/`commanders` have no
// page yet → disabled ("soon"), so the catalog also proves the disabled state.
const publicSections = (lang: Lang): readonly NavItem[] => [
  { key: "overview", label: STRINGS.navOverview[lang], icon: BarChart3 },
  { key: "players", label: STRINGS.navPlayers[lang], icon: User },
  { key: "squads", label: STRINGS.navSquads[lang], icon: Users, disabled: true },
  { key: "bounty", label: STRINGS.navBounty[lang], icon: Target },
  { key: "commanders", label: STRINGS.navCommanders[lang], icon: ShieldCheck, disabled: true },
  { key: "replays", label: STRINGS.navReplays[lang], icon: Film },
];

// Role additions — denied items are simply absent from the returned list.
const ROLE_EXTRAS = {
  "signed-out": (lang: Lang): readonly NavItem[] => [
    { key: "signin", label: STRINGS.navSignIn[lang], icon: LogIn },
  ],
  player: (lang: Lang): readonly NavItem[] => [
    { key: "my-requests", label: STRINGS.navMyRequests[lang], icon: User },
  ],
  moderator: (lang: Lang): readonly NavItem[] => [
    { key: "queue", label: STRINGS.navQueue[lang], icon: ShieldCheck },
  ],
  admin: (lang: Lang): readonly NavItem[] => [
    { key: "admin", label: STRINGS.navAdmin[lang], icon: ShieldCheck },
  ],
} as const satisfies Record<NavRole, (lang: Lang) => readonly NavItem[]>;

/** The role-aware item list for a given visual role + language. */
export function navItemsFor(role: NavRole, lang: Lang = "ru"): readonly NavItem[] {
  return [...publicSections(lang), ...ROLE_EXTRAS[role](lang)];
}

/** The four roles, in display order — drives the roles ×4 matrix. */
export const NAV_ROLES: readonly NavRole[] = ["signed-out", "player", "moderator", "admin"];
