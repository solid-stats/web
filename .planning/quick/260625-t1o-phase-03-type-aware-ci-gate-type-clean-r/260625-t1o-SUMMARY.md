---
phase: 03-uikit-interactive-i18n-global-state-patterns
plan: 01
quick: 260625-t1o
subsystem: design-system / tooling
status: complete
tags: [typescript, tsgolint, ci, i18n, kit-08, type-aware-gate]
requires:
  - "vite.config.ts typeCheck:true (HEAD e72894c)"
  - "@types/react@19 (HEAD e72894c)"
  - "lingui.d.ts Register.messageIds augmentation"
provides:
  - "type-clean repo (pnpm check exits 0 with the type-aware checker active)"
  - "the KIT-08 typed-key regression oracle (typed-key.oracle.ts)"
  - "the .github/workflows/check.yml type-aware CI gate"
affects:
  - "every packages/design source/story file (prop-widening + story return types)"
  - "phase-03 SC#4 closure (UAT + VERIFICATION)"
tech-stack:
  added: []
  patterns:
    - "leaf-primitive optional props declared `?: T | undefined` (exactOptionalPropertyTypes uniform pattern)"
    - "synchronous Ladle story helpers typed `ReactElement` (not `ReturnType<Story>`)"
    - "committed `@ts-expect-error` oracle as a typed-contract regression guard"
    - "Ladle relative .css side-effect imports routed through a .mjs aggregator (tsgolint constraint)"
    - "root vite.config.ts `lint.ignorePatterns` drops package-root config files from the gate"
key-files:
  created:
    - packages/design/src/css-modules.d.ts
    - packages/design/.ladle/styles.mjs
    - packages/design/src/shared/uikit/_i18n/typed-key.oracle.ts
    - .github/workflows/check.yml
  modified:
    - packages/design/src/shared/uikit/Table/Table.stories.tsx
    - packages/design/src/shared/uikit/AsyncBoundary/AsyncBoundary.stories.tsx
    - packages/design/src/shared/uikit/NavBar/NavBar.stories.tsx
    - packages/design/src/shared/uikit/MobileTabBar/MobileTabBar.stories.tsx
    - packages/design/src/shared/uikit/EmptyState/EmptyState.tsx
    - packages/design/src/shared/uikit/ErrorState/ErrorState.tsx
    - packages/design/src/shared/uikit/Skeleton/Skeleton.tsx
    - packages/design/src/shared/uikit/Toast/Toast.tsx
    - packages/design/src/shared/uikit/StatTile/StatTile.tsx
    - packages/design/src/shared/uikit/DataTrustBanner/DataTrustBanner.tsx
    - packages/design/src/shared/uikit/Table/Table.tsx
    - packages/design/src/shared/uikit/Table/Th.tsx
    - packages/design/src/shared/uikit/Table/AutoTable.tsx
    - packages/design/src/shared/uikit/NavBar/NavBar.tsx
    - packages/design/src/shared/uikit/Button/Button.tsx
    - packages/design/src/shared/uikit/Button/Link.tsx
    - packages/design/.ladle/components.tsx
    - packages/design/tsconfig.json
    - vite.config.ts
    - .planning/phases/03-uikit-interactive-i18n-global-state-patterns/03-UAT.md
    - .planning/phases/03-uikit-interactive-i18n-global-state-patterns/03-VERIFICATION.md
decisions:
  - "Widen leaf-primitive optional props to `?: T | undefined` (B1) as the uniform exactOptionalPropertyTypes pattern, rather than omit-when-undefined at each callsite."
  - "Route the Ladle relative .css side-effect imports through a .mjs aggregator — tsgolint does not honor ambient `*.css` decls for relative specifiers (deviation from the plan's ambient-decl mechanism)."
  - "Drop the package-root config files (vite.config.ts / playwright.config.ts) from the gate via root vite.config.ts `lint.ignorePatterns`, not a tsconfig `exclude` (an exclude only subtracts from include; these were never in it)."
metrics:
  duration: ~26m
  tasks: 3
  files_created: 4
  files_modified: 21
  completed: 2026-06-25
---

# Phase 3 Plan 01 (quick 260625-t1o): Type-aware CI gate + type-clean repo Summary

Made `pnpm check` type-clean under the now-active TS-Go/tsgolint type-aware gate by fixing
all 33 latent type errors as classes, added a committed `@ts-expect-error` regression oracle
that makes the KIT-08 typed message-id contract a permanently-exercised gate, wired the
`.github/workflows/check.yml` CI to run `pnpm check` on every push + PR, and recorded the
phase-03 SC#4 resolution.

## What shipped

- **Task 1 — type-clean (`033f598`):** all 33 errors fixed as classes, no per-line
  suppression / `any` / non-null-on-index, no disabled typeCheck, no added `vite` dep.
- **Task 2 — oracle + CI (`9e24900`):** the typed-key regression oracle + the type-aware
  CI workflow.
- **Task 3 — artifacts (`0b67b55`):** SC#4 recorded as VERIFIED in 03-UAT.md + 03-VERIFICATION.md.

## The 33 errors, fixed as classes

- **CLASS A (~11 TS2322 + 1 TS2769):** synchronous Ladle story helpers were typed
  `ReturnType<Story>`, which under `@types/react@19` widens to `ReactNode | Promise<ReactNode>`
  — not a valid JSX child nor a `(density) => ReactNode` value. Retyped each synchronous helper
  (`dataTable`, `VolumeCaption`, `renderRows`, `LoadingTable`, `readyContent`) as `ReactElement`
  imported as a type from `react`. Exported `Story`-typed stories left as `Story`.
- **CLASS B (~16 TS2375 + 2 TS2322):** `exactOptionalPropertyTypes` rejects an explicit
  `T | undefined` argument for a `prop?: T`. Applied ONE uniform pattern (B1): widened the
  declared optional prop to `?: T | undefined` on the leaf presentational primitives
  (EmptyState `totalCount`/`action`, ErrorState `contact`, Skeleton table `density`, Toast
  `action`, StatTile `delta`, DataTrustBanner `label`, Table `onSort`, Th `numeric`/`onSort`,
  AutoTable `onSort`, NavBar `brand`/`roleExtras`) and the Button/Link base system props
  (`className`/`variant`/`size`/`justify`/`type`/`active`/`disabled`/`href`). Parents
  forwarding maybe-undefined values then type-check with no per-callsite omit. No runtime
  change (widening is type-only). Prop order untouched.
- **CLASS C (2 TS2532):** `ONE[0].icon` (`noUncheckedIndexedAccess`) replaced with a guarded
  destructure (`const [NAV_SAMPLE] = ONE; if (NAV_SAMPLE === undefined) throw …`) in the
  NavBar/MobileTabBar stories — no non-null assertion, no `as`.
- **CLASS D (2 TS2882):** the Ladle relative `.css` side-effect imports. See Deviations.
- **CLASS E (1 TS2307 + 1 TS2769):** `vite.config.ts` / `playwright.config.ts` dropped from
  the gate via root `vite.config.ts` `lint.ignorePatterns` — preserves the no-direct-vite-dep
  boundary, no `vite` dep added. See Deviations (the planned tsconfig `exclude` was a no-op).

## The regression oracle (KIT-08 SC#4)

`packages/design/src/shared/uikit/_i18n/typed-key.oracle.ts` holds a single `@ts-expect-error`
over `i18n._({ id: "no.such.key.exists" })` (id-only descriptor — the proven story call shape).
Proven LIVE both ways:

- bad id + directive → the unknown-id error is suppressed → **GREEN**.
- flip the id to a real STRINGS key → the line stops erroring → the directive turns UNUSED
  (TS2578) → **RED**. Restore → GREEN.

(Also confirmed: bad id WITHOUT the directive → real TS2769, proving the directive suppresses
the genuine unknown-id error, not a coincidental one.) It is the only sanctioned suppression in
the repo; reachable via the tsconfig `include` glob alone (no barrel pollution — index.ts
untouched, per the plan default); tree-shakeable, never reaches runtime/Ladle.

## CI

`.github/workflows/check.yml` runs `pnpm check` (gen-theme drift + design.md lint + type-aware
`vp check`) on every `push` + `pull_request`. Node 25 (engines `>=25 <26`), pnpm via corepack
reading the `packageManager` pin (11.6.0), `pnpm install --frozen-lockfile`, actions pinned
`@v4`. No new deps; no untrusted event input in any `run` step (T-03q-01 mitigated).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] CLASS D mechanism (ambient `declare module "*.css"`) is infeasible under tsgolint**
- **Found during:** Task 1, CLASS D.
- **Issue:** The plan's CLASS D fix — one ambient `declare module "*.css"` — does not work
  under the actual type-checker (oxlint-tsgolint 0.23.0 / TS-Go). Empirically verified that
  tsgolint does NOT consult ambient module declarations for **relative** side-effect imports
  (`import "./tailwind.css"`, `import "../src/styles/fonts.css"`): the wildcard, an exact-
  relative decl, an exact-bare decl, `allowArbitraryExtensions` (+ `.d.css.ts` companions →
  TS6263 "flag not set", i.e. ignored), and even toggling `noUncheckedSideEffectImports` were
  all ignored — the TS2882 persisted in every case. (`declare module "*.css"` only matches
  bare specifiers in stock TS; tsgolint additionally ignores it for bare side-effect imports.)
- **Fix:** Routed the two Ladle relative `.css` side-effect imports through a sibling
  `packages/design/.ladle/styles.mjs` aggregator (a `.mjs` resolves as a real module, so the
  side-effect import type-checks) — preserving the documented fonts.css→tailwind.css import-once
  order. `components.tsx` keeps full type coverage on its locale-guard + activate-in-effect
  logic (the code hardened in `8517d78`), which excluding the file would have lost. The required
  artifact `packages/design/src/css-modules.d.ts` is kept (ambient `*.css` for any future BARE
  css specifier) with a head comment documenting the tsgolint limitation.
- **Files:** `packages/design/.ladle/styles.mjs` (new), `packages/design/.ladle/components.tsx`,
  `packages/design/src/css-modules.d.ts`.
- **Commit:** `033f598`.

**2. [Rule 3 - Blocking] CLASS E: tsconfig `exclude` is a no-op for the config files**
- **Found during:** Task 1, CLASS E.
- **Issue:** The plan suggested a tsconfig `exclude` for `vite.config.ts`/`playwright.config.ts`.
  An `exclude` only subtracts from `include`, and these files were never in `include`
  (`["src", ".ladle"]`); `vp check packages` globs every `.ts` under the package and checks them
  regardless. The `exclude` had zero effect (verified: errors persisted).
- **Fix:** Dropped them via root `vite.config.ts` `lint.ignorePatterns`
  (`["**/vite.config.ts", "**/playwright.config.ts"]`) — the OxlintConfig glob that `vp` honors.
  Removed the dead tsconfig `exclude`; left a comment in tsconfig.json pointing to the real
  mechanism. No `vite` dep added; the no-direct-vite-dep boundary intact.
- **Files:** `vite.config.ts`, `packages/design/tsconfig.json`.
- **Commit:** `033f598`.

## Verification

| Gate | Result |
|------|--------|
| `pnpm check` (hard acceptance) | PASSED — exit 0, 0 type errors, 162 files lint+type-clean, theme.css clean |
| `pnpm --filter @solid-stats/design test` | PASSED — 186 unit tests |
| `pnpm --filter @solid-stats/design ladle:build` | PASSED — meta.json produced (no-direct-vite-dep + Ladle build intact) |
| Oracle live both ways | CONFIRMED — flip-to-real-key → RED (TS2578 unused directive); restore → GREEN |
| `.github/workflows/check.yml` | Valid YAML; triggers push + pull_request; runs `pnpm check` on Node 25 / pnpm 11.6 (corepack) |

Note: the e2e suite (`test:e2e`, 344 tests) was not re-run in this quick task — these changes
are type-only prop-widening + story return-type annotations + a tree-shakeable oracle + a CI
file + docs, none of which alter runtime behavior; the prior phase-03 verification recorded
344/344 and unit tests + ladle:build confirm no regression.

## Self-Check: PASSED

- All 4 created files exist on disk.
- All 3 commits exist in the worktree history (033f598, 9e24900, 0b67b55).
