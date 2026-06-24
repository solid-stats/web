// GAP-19 base primitives slice barrel. `control` (the recipe fn) stays internal;
// `Button` / `Link` + the `ButtonVariant` / `ButtonSize` finite-union types graduate.
// `FORCED_STATE` graduates too (GAP-20): the catalog-only forced-state mirror is the
// single source of the real `:hover`/`:active`/`:focus-visible` tokens a control routes
// through, so every story whose item renders via `Button`/`Link` (NavBar, MobileTabBar,
// Th) reuses it instead of re-deriving a variant-agnostic — and drift-prone — map.
export type { ButtonVariant, ButtonSize, ButtonJustify } from "./control";
export { FORCED_STATE } from "./control";
export { Button } from "./Button";
export { Link } from "./Link";
