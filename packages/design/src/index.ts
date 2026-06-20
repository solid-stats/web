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
