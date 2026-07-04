// The app-wide CSS side-effect imports for the Ladle harness, in the import-once order
// `components.tsx` documents: fonts.css FIRST (registers the self-hosted @font-face) then
// tailwind.css (which `@import`s the generated theme.css + uikit.css and the @source globs).
//
// Why a `.mjs` and not the imports inline in components.tsx: the type-aware gate runs
// oxlint-tsgolint (TS-Go), which flags every relative side-effect import of a non-TS module
// as TS2882 ("cannot find module or type declarations") and — unlike stock `tsc` — does NOT
// consult an ambient `declare module "*.css"` for a RELATIVE specifier (verified: the
// wildcard, an exact-relative decl, an exact-bare decl, `allowArbitraryExtensions`, and even
// toggling `noUncheckedSideEffectImports` are all ignored by tsgolint 0.23.0). A `.mjs`
// resolves as a real module, so the side-effect import type-checks, while `components.tsx`
// keeps full type coverage on its locale-guard + activate-in-effect logic. The order +
// import-once invariant (styling.md) are unchanged — only the file the imports live in moved.
import "../src/styles/fonts.css";
import "./tailwind.css";
