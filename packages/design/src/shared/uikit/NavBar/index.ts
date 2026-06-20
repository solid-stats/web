export type { NavItem, NavItemState } from "./NavBar";
export { NavBar } from "./NavBar";
// Shared role-aware nav fixtures — consumed by the KIT-01 family stories
// (MobileTabBar / AppShell) so the roles ×4 demo is identical across slices.
export type { NavRole } from "./navFixtures";
export { NAV_ROLES, navItemsFor } from "./navFixtures";
