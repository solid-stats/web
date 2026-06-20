// @solid-stats/design — UIKIT public barrel (the package `exports` map "." entry
// resolves here, D-05). Components graduate into this barrel as each family slice
// lands; the Smoke catalog story and the underscore-prefixed `_fixtures` /
// `_state-matrix` helpers are NOT UIKIT exports and stay intentionally absent.
//
// Later family plans append their own export blocks to distinct regions (barrel
// writes are serialized by wave).

// ---- KIT-04 Data-trust family (Wave 2 / Plan 02-02) ----
export type { FreshnessState } from "./shared/uikit/FreshnessPill";
export { FreshnessPill } from "./shared/uikit/FreshnessPill";
export { ProvenanceLine } from "./shared/uikit/ProvenanceLine";
export type { TrustKind } from "./shared/uikit/TrustBadge";
export { TrustBadge } from "./shared/uikit/TrustBadge";
export type { BannerKind } from "./shared/uikit/DataTrustBanner";
export { DataTrustBanner } from "./shared/uikit/DataTrustBanner";
export { InlineReviewRow } from "./shared/uikit/InlineReviewRow";

// ---- KIT-07 Feedback family (Wave 3 / Plan 02-03) ----
export type { BadgeVariant } from "./shared/uikit/Badge";
export { Badge } from "./shared/uikit/Badge";
export type { PillTone } from "./shared/uikit/Pill";
export { Pill } from "./shared/uikit/Pill";
export type { SkeletonDensity } from "./shared/uikit/Skeleton";
export { ROW_H, Skeleton } from "./shared/uikit/Skeleton";
export { EmptyState } from "./shared/uikit/EmptyState";
export type { ErrorKind } from "./shared/uikit/ErrorState";
export { ErrorState } from "./shared/uikit/ErrorState";
export type { ToastVariant } from "./shared/uikit/Toast";
export { Toast } from "./shared/uikit/Toast";

// ---- KIT-01 Nav-shell family (Wave 4 / Plan 02-04) ----
// The durable prop contract is `NavItem` (the role-aware item list — denied items
// simply absent; NO RBAC, v1.0); the `navItemsFor`/`NAV_ROLES` story fixtures stay
// internal to the slice and are intentionally NOT graduated.
export { SkipLink } from "./shared/uikit/SkipLink";
export type { NavItem, NavItemState } from "./shared/uikit/NavBar/NavBar";
export { NavBar } from "./shared/uikit/NavBar/NavBar";
export { MobileTabBar } from "./shared/uikit/MobileTabBar";
export { AppShell } from "./shared/uikit/AppShell";
