// Ambient stylesheet-module declaration for BARE (non-relative) `*.css` specifiers — e.g.
// a future `import "@solid-stats/design/theme.css"` from a consuming package. It declares
// the side-effect `*.css` module so such an import type-checks under
// `noUncheckedSideEffectImports` (tsconfig.base) without a `:export` shape (these are plain
// side-effect stylesheets, not CSS-modules). It sits under `src` (in the `include` glob), so
// it is part of the program.
//
// LIMITATION (why the Ladle entry does NOT rely on this): the type-aware gate runs
// oxlint-tsgolint (TS-Go), which — unlike stock `tsc` — does NOT consult an ambient
// `declare module "*.css"` for a RELATIVE side-effect import; it flags `import "./x.css"` /
// `import "../x.css"` as TS2882 regardless (verified against tsgolint 0.23.0: the wildcard,
// an exact-relative decl, an exact-bare decl, `allowArbitraryExtensions`, and toggling
// `noUncheckedSideEffectImports` are all ignored). So the Ladle harness routes its two
// RELATIVE css side-effect imports through `.ladle/styles.mjs` (a resolvable module) instead.
// This wildcard remains the contract for BARE css specifiers, which tsgolint does resolve
// against an ambient declaration.
declare module "*.css";
