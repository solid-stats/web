# Walking Skeleton — Solid Stats web (v0.1 design milestone)

**Phase:** 1
**Generated:** 2026-06-20

> NOTE — this is a **no-app** milestone (locked D-04). There is no routing, no DB, and no SSR
> by decision. The generic walking-skeleton template ("routing + one real DB read/write") does
> NOT apply. The thinnest end-to-end RUNNABLE slice here is the **token pipeline**, and that is
> what this skeleton proves.

## Capability Proven End-to-End

The root `DESIGN.md` is the single token source of truth; running `scripts/gen-theme.mjs`
generates `packages/design/src/styles/theme.css` (the Tailwind v4 `@theme`, dark-only, including
the data-trust state tokens); Ladle — wired to the real Vite + `@tailwindcss/vite` stack inside
`@solid-stats/design` — renders that `@theme` in one smoke story on real self-hosted type; the
workspace resolves (`@solid-stats/app` imports `@solid-stats/design`) and the toolchain is green.

In one sentence: **"`DESIGN.md` → generated `@theme` → Ladle renders the real dark-only tokens
(including the data-trust vocabulary) in a smoke story on the real stack, with the workspace
resolving and `pnpm check` green."**

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Repo shape | pnpm 11 workspace (`packages/design` + `packages/app` skeleton), `DESIGN.md` at root | Design system is an importable package the app consumes; pnpm is SolidStats canon (D-01, PROJECT.md) |
| Runtime | Node 25 (pinned `>=25 <26`, `.nvmrc`/`.node-version` = 25) | SolidStats canon; siblings on Node 25 (D-01) |
| Token pipeline | Root `scripts/gen-theme.mjs` (interim generator) → `packages/design/src/styles/theme.css` | `@google/design.md export` drops line-height; the generator emits the paired `--text-*--line-height` + `--*: initial` reset no exporter does (D-09; migration-back tracked) |
| Token source of truth | Root `DESIGN.md` (YAML front-matter), gated by `@google/design.md lint` | Shared across packages; lint = free contrast + token-ref gate (D-02, WS-05) |
| Data-trust tokens | Extend `gen-theme.mjs` to emit `components.*` (freshness ×4 + known/unknown/conflict) as named `@theme` state tokens; Russian copy stays in i18n | DS-03 "first-class tokens"; translatable copy must not live in the token layer (D-12) |
| Styling | Tailwind v4 `@theme` via `@tailwindcss/vite`, dark-only, no arbitrary values | Brief-locked; single gunmetal palette → nothing to toggle (D-10, styling.md) |
| Component catalog | Ladle 5.1.1 (bundles its own Vite 6), colocated `*.stories.tsx` at `src/shared/uikit/<Component>/` | Durable UIKIT home; a story can't drift from its slice (D-07, D-08, pipeline.md §3) |
| App package | `packages/app` skeleton ONLY — `package.json` + `workspace:*` dep, empty `src/index.ts` | No routes/loaders/SSR in v0.1; the app is the v1.0 milestone (D-04) |
| Toolchain | Vite+ `vp check` (Oxlint + Oxfmt + tsgo), root-once config; contingency = the primitives directly | WS-05 points at the conventions skill; `vp` name unverified → resolved at a checkpoint (D-03, A1) |
| Directory layout | Root owns `DESIGN.md` + `scripts/` + `tsconfig.base.json`; per-package `tsconfig.json extends` it | Config lives once; strictness never drifts (D-02) |

## Stack Touched in Phase 1

- [x] Project scaffold — pnpm workspace, root `package.json`, `tsconfig.base.json`, Node/pnpm pins, both package skeletons (plan 01)
- [x] "Routing" → N/A by D-04. The runnable analog is the **token pipeline** + the Ladle dev/build server (plan 04)
- [x] "Database" → N/A by D-04. The single-source analog is **`DESIGN.md` → `gen-theme.mjs` → `theme.css`** (one real read of the SoT, one real write of the generated output) with a drift gate (plan 03)
- [x] UI — one interactive-stack element: the Ladle smoke story rendering the real `@theme` on the real Vite+Tailwind stack (plan 04)
- [x] "Deployment" → the documented local full-stack run: `pnpm --filter @solid-stats/design ladle dev` (and `ladle build` in CI) renders the pipeline output (plan 04); `pnpm check` is the green gate (plan 05)

## Out of Scope (Deferred to Later Slices)

- Any UIKIT component or primitive — even the smallest (Phase 2+; MIGRATION D4: foundation = system + pipeline only).
- All routes, loaders, SSR, TanStack Start plumbing, the typed `server-2` client (v1.0 app milestone).
- The Russian data-trust display strings as token values — they are i18n copy (Phase 3 harness; D-12).
- Vitest / Playwright config — arrives with the first component phase (Phase 2); Phase 1 validation is toolchain exit codes + source greps.
- Light theme, payment/reward UI, comparison/nomination/global-search surfaces (out of scope, REQUIREMENTS.md).

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without re-litigating its decisions:

- Phase 2: UIKIT structural & data-display primitives (nav shell, data tables, stat tiles, data-trust components, feedback) as colocated Ladle stories.
- Phase 3: UIKIT interactive (Ark UI forms/overlays), the typed RU/EN i18n harness (where the deferred data-trust display strings land), reusable global-state patterns.
- Phases 4–7: public stats surfaces (overview/players/profile → squads → commander/bounty → replay), each spec → Ladle story → design-review.
- Phases 8–9: authenticated request flows, then moderation/admin/ops.
