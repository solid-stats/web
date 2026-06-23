export type { NavAccount, NavItem, NavItemState } from "./NavBar";
export { NavBar } from "./NavBar";
export { SteamLogo } from "./SteamLogo";
// Shared role-aware nav fixtures — consumed by the KIT-01 family stories
// (MobileTabBar / AppShell) so the roles ×4 demo is identical across slices.
export type { AccountControl, NavRole } from "./navFixtures";
export {
  accountFor,
  isSignedIn,
  NAV_ROLES,
  navItemsFor,
  publicSections,
  roleExtrasFor,
} from "./navFixtures";
