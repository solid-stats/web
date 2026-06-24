# Phase 3: UIKIT — Interactive, i18n & Global-State Patterns - Context

**Gathered:** 2026-06-24 (assumptions mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the interactive half of the UIKIT and the i18n harness as colocated Ladle stories on the
real stack (Tailwind v4 `@theme` + dark-only) passing design-review: Ark UI **form** primitives
(KIT-05), Ark UI **overlay** primitives (KIT-06), the typed RU/EN **i18n harness** + language
switcher (KIT-08), and the reusable **global-state patterns** (SURF-18 — loading / empty / error /
offline / reconnecting / stale) every later surface composes. Quality gates QUAL-01..05 applied
per component.

**In scope:** Ark-UI-backed interactive primitives wrapped as presentational `shared/uikit`
slices (props-down, fixture-driven) — form family (Input, Select, Stepper/NumberInput,
FileUpload, Field) and overlay family (Dialog, Menu, Tabs, Tooltip, Popover); the Lingui typed
i18n harness that replaces the Phase-2 placeholder STRINGS seed and drives every catalogued
string; the language switcher; the SURF-18 global-state recipes + a thin AsyncBoundary wrapper;
and the deferred Toast trigger/portal/queue manager.

**Out of scope (later phases / v1.0):** Any surface composition (Overview, Players, profiles,
request steppers, moderation) — Phases 4–9. The `/ru` `/en` route layer, TanStack Start app,
SSR, real `server-2` data wiring, and the typed OpenAPI client — v1.0 app milestone. Lingui is
adopted in framework-agnostic **core** mode now (no router coupling); its routing graduation is
v1.0.
</domain>

<decisions>
## Implementation Decisions

### Ark UI Adoption (KIT-05 / KIT-06)
- **D-01:** Add `@ark-ui/react` as a `packages/design` runtime dependency. Each Ark headless
  primitive is wrapped in a thin PascalCase `shared/uikit/<Component>/` slice that styles Ark's
  anatomy parts with `tailwind-variants` `tv()` recipes consuming `@theme` tokens — mirroring the
  Phase-2 props-down presentational boundary (controlled props in, `data-*` test hooks, **no**
  business/i18n imports inside the primitive). Slice inventory:
  - **KIT-05 (forms):** `Input`, `Select`, `Stepper` (Ark NumberInput), `FileUpload`
    (image + link evidence), and a `Field` wrapper owning the visible label, error message, and
    live-region (`aria-live`) behavior shared across fields.
  - **KIT-06 (overlays):** `Dialog`, `Menu`, `Tabs`, `Tooltip`, `Popover` — keyboard-accessible,
    focus-managed, no traps.
  *Evidence: Ark UI is brief-locked (PROJECT.md L108-109; conventions `SKILL.md`,
  `architecture.md` "shared/uikit … built on Ark UI"); `@ark-ui/react` is NOT yet in
  `packages/design/package.json` (deps: `lucide-react`, `react`, `tailwind-variants` only); the
  `Button` and `Toast` slices already establish the `tv()` + controlled-props + `data-*` wrapper
  shape.*
- **D-02:** Interactive behavior is demonstrated **two ways**: (1) a static `StateMatrix` /
  `StateCell` grid for the screenshot + axe + 44px catalog gate (forced open/validation states
  where needed), and (2) interactive Ladle `Playground` stories (Ladle args) that exercise Ark's
  real keyboard/focus runtime. The Phase-2 Playwright-against-Ladle harness is extended with
  per-component behavior specs: trap-free Tab cycle, `Esc`-to-close, `aria-expanded`/`aria-controls`,
  and form live-region announcements. *Evidence: `_state-matrix/StateMatrix.tsx` (the labelled
  `data-state-cell` grid the specs assert against, `min-h-11` 44px); existing
  Playwright + `@axe-core/playwright` wiring in `packages/design/package.json`; QUAL-03 gate
  established in Phase 2.*

### i18n Harness (KIT-08) — Lingui
- **D-03:** **Lingui** is the i18n library (user-selected over `intl-messageformat`+typed-map and
  `typesafe-i18n`). It is adopted in **framework-agnostic core mode** (`@lingui/core` +
  `@lingui/react`) — **no** routing coupling, since v0.1 has no app and no `/ru` `/en` routes. The
  existing `_fixtures/strings.ts` `STRINGS` placeholder seed (D-07 of Phase 2) **migrates into
  Lingui message catalogs** (RU primary, EN at parity). ICU plural rules (RU one/few/many) and
  interpolation (`{n}`, `{from}–{to} из {total}`, `{col}`, `{id}`) are **exercised now**, not
  deferred. The harness is shaped to graduate cleanly into the v1.0 TanStack Start `/ru` `/en`
  routing setup. *Evidence: `localization.md` mandates typed keys (missing key = `tsc` error), ICU
  syntax, and RU/EN parity but leaves the library open; `_fixtures/strings.ts` is already the typed
  `Record<string, Bilingual>` seed whose header says "NOT a real i18n harness (KIT-08 / Phase 3)";
  01-CONTEXT D-12 + 02-CONTEXT D-07 lock that the Phase-3 harness replaces it.*
- **D-04:** The **language switcher** is wired as a Ladle global control / addon plus a Lingui
  `I18nProvider` in `.ladle/components.tsx`, so every story renders from the catalog and can toggle
  RU↔EN. RU is the primary display language; RU strings are sanity-checked for clipped/awkward
  wording (QUAL-05). *Evidence: `.ladle/components.tsx` already hosts the single GlobalProvider;
  `.ladle/config.mjs` `addons` block shows the global-control pattern (theme disabled, width
  enabled).*

### Global-State Patterns (SURF-18)
- **D-05:** SURF-18 is delivered as reusable **story-level recipes that compose the existing
  Phase-2 primitives** (`Skeleton`, `EmptyState`, `ErrorState`, `DataTrustBanner`) into the six
  named states (loading / empty / error / offline / reconnecting / stale), **plus one thin
  `AsyncBoundary`-style wrapper slice** that maps a state union → the right primitive with reserved
  space (CLS = 0), never color-alone. The underlying primitives are **not** rebuilt — they already
  encode CLS-0 reservation and icon+text semantics. The wrapper gives Phases 4–9 a single
  state→primitive seam. *Evidence: `DataTrustBanner.tsx` has the `reserved` (same-height) kind for
  CLS=0 and its `BannerKind` already covers offline/reconnecting/stale; `Skeleton.tsx` reserves
  exact final dimensions; `EmptyState.tsx`/`ErrorState.tsx` have `min-h-48`, `role="alert"`/`status`,
  and a recovery action; SURF-18 wording is "reusable PATTERNS across surfaces" (REQUIREMENTS.md
  L66; ROADMAP SC#3).*

### Toast Manager
- **D-06:** The deferred Toast lifecycle (trigger / portal / queue / auto-dismiss / stacking) is
  built on Ark UI's `createToaster`, wrapping the existing presentational `Toast/Toast.tsx` as the
  visual leaf, and demonstrated via an interactive Ladle `Playground` story with trigger buttons
  (`createToaster` mounts its own portal into `document.body` — no app shell needed). *Evidence:
  `Toast/Toast.tsx` was deliberately built as "VISUAL primitive ONLY … later surfaces compose it
  under a real toast manager"; 02-CONTEXT Deferred Ideas; a11y.md "prefer the Ark UI primitive over
  hand-rolling". If Ark's `createToaster` cannot slot the existing styled `Toast` markup
  (`render`/`asChild` limits), the planner flags it — see research item.*

### Per-Component Review Conventions
- **D-07:** Every interactive story demonstrates the component states (enabled / hover / pressed /
  focused / selected / disabled / loading), the ×4 data-volume states (empty / few / many /
  limit-reached) for any list/field, and the ×5 scenario endings where applicable; forms have
  visible labels + inline errors + live-region feedback; overlays are focus-managed with no traps;
  all are axe-clean, keyboard-operable, 44px targets, never color-alone. *Evidence: QUAL-01..05;
  ROADMAP Phase 3 SC#1, #4; `.design/CLAUDE.md` component-states + click-zone checklist.*

### Claude's Discretion
- **AsyncBoundary** exact prop shape (state discriminated union vs. slots) and slice granularity —
  planner reconciles against `architecture.md` slice rules; D-05 is the intended shape, not a rigid
  file count.
- Whether `Field` is one shared wrapper or split per-control, and whether `Stepper` is its own
  slice or a `NumberInput` variant — planner's call against the Phase-2 slice convention.
- The exact Ladle mechanism for the language toggle (global state vs. addon control) and for
  forcing overlay open-state in the static grid — execution mechanics (see research items).

### Folded Todos
None — `todo.match-phase 3` returned zero matches.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` — Phase 3 section + success criteria #1–4 (the goal-backward truth set).
- `.planning/REQUIREMENTS.md` — KIT-05 (L33), KIT-06 (L34), KIT-08 (L36), SURF-18 (L66),
  QUAL-01..05 (L70-74); the Phase-3 traceability rows (L118-121).
- `.planning/phases/02-uikit-structural-data-display-primitives/02-CONTEXT.md` — Phase 2 locked
  decisions; especially D-07 (the placeholder STRINGS seed the Phase-3 harness replaces), the
  `_state-matrix` + Playwright/axe harness, and the Phase-3 deferrals (KIT-05/06/08, SURF-18, Toast
  manager) in Deferred Ideas.
- `.planning/phases/01-workspace-design-system-foundation/01-CONTEXT.md` — D-07 (story path
  `packages/design/src/shared/uikit/<Component>/`), D-08 (Ladle config + GlobalProvider +
  self-hosted fonts), D-12 (i18n display strings deferred to the Phase-3 harness, NOT token values).

### Design system & binding domain truth
- `DESIGN.md` — authored `components.*` recipes for the interactive layer (inputs, dialog, popover,
  menu, tabs, tooltip) + the `## Components` Do's-and-Don'ts; token source of truth, no arbitrary
  values. Note: the interactive `components.*` recipes are NOT yet emitted into `theme.css` (only
  the data-trust `components.*` were emitted by Phase 1 D-12) — the planner decides whether Phase 3
  extends `gen-theme.mjs` or styles via `tv()` against existing color/overlay/ring tokens.
- `.design/CLAUDE.md` — BINDING per-surface design rules + domain truth: component-states +
  click-zone checklist, the data-trust A/C model, the list loading model (informs SURF-18). Stays
  live and authoritative.
- `packages/design/src/styles/theme.css` — the generated tokens actually available (`--color-overlay`,
  ring/glow shadow tokens, the data-trust tokens); confirm what the interactive primitives can
  consume today.

### Established conventions (the rule sources the planner enforces)
- `.claude/skills/solidstats-frontend-react-conventions/SKILL.md` +
  `references/patterns/forms.md` (Ark UI form pattern, labels/errors/live-region),
  `references/patterns/localization.md` (typed keys, ICU, RU/EN parity — the KIT-08 rule source),
  `references/patterns/a11y.md` (focus management, no-trap, live-region, 44px, never-color-alone),
  `references/patterns/component-shape.md`, `references/patterns/architecture.md` (`shared/uikit`
  slice rules, props-down primitive boundary), `references/patterns/styling.md` (`@theme`
  consumption, `tv()`, no-arbitrary-values), `references/patterns/errors.md` (never a blank screen).
- `.claude/skills/solidstats-frontend-react-design/SKILL.md` + `references/pipeline.md`
  (brief→spec→Ladle→review→graduate), `references/spec-template.md` (per-component spec format).
- `.claude/skills/solidstats-frontend-react-design-review/SKILL.md` — the design-review gate each
  component must pass.

### Existing code the phase extends
- `packages/design/src/shared/uikit/_fixtures/strings.ts` — the `STRINGS` placeholder map (the
  seed Lingui catalogs migrate from).
- `packages/design/src/shared/uikit/_state-matrix/StateMatrix.tsx` — the catalog-grid harness.
- `packages/design/src/shared/uikit/Toast/Toast.tsx` + `Toast.stories.tsx` — the visual leaf the
  `createToaster` manager wraps.
- `packages/design/src/shared/uikit/{Skeleton,EmptyState,ErrorState,DataTrustBanner}/` — the
  primitives SURF-18 composes.
- `packages/design/src/shared/uikit/{Button,Pill,Badge}/` — the `tv()` wrapper precedent.
- `.ladle/config.mjs` + `.ladle/components.tsx` — the GlobalProvider + global-control hooks for the
  language switcher.
- `packages/design/package.json` — current deps (`@ark-ui/react` to be added; Playwright + axe
  already present).
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- The four global-state primitives (`Skeleton`, `EmptyState`, `ErrorState`, `DataTrustBanner`) are
  built, reviewed, and already CLS-0 + never-color-alone — SURF-18 composes them (D-05), it does not
  rebuild them. `DataTrustBanner`'s `BannerKind` already maps offline/reconnecting/stale.
- `_fixtures/strings.ts` `STRINGS` is the typed bilingual seed (RU+EN, ICU `{n}` placeholders) that
  becomes the Lingui catalog content.
- `_state-matrix/StateMatrix.tsx` is the durable screenshot/axe grid harness, reusable for the
  interactive families.
- `Toast/Toast.tsx` is the styled visual leaf the `createToaster` manager wraps.
- `Button`/`Pill`/`Badge` slices are the `tv()` + controlled-props + `data-*` wrapper precedent for
  every Ark slice.

### Established Patterns
- FSD `shared/uikit` colocation: one PascalCase slice owns its component + `*.stories.tsx`, exported
  through `packages/design/src/index.ts`; generic primitives only — props-down, no
  pages/business/localization imports inside the primitive.
- Tailwind v4 `@theme` via `tv()`, `theme.css` imported once, **no arbitrary values**.
- Playwright-against-Ladle + `@axe-core/playwright` is the a11y/keyboard gate; `StateMatrix` cells
  carry visible labels the specs assert against.

### Integration Points
- `packages/design/src/index.ts` — the barrel; Phase 3 graduates the new interactive primitives,
  the `AsyncBoundary` wrapper, and the i18n hooks/types into it.
- `.ladle/components.tsx` GlobalProvider — where the Lingui `I18nProvider` + language toggle wire in
  so every story is bilingual.
- The Lingui catalogs become the single string seam; in v1.0 the same primitives consume the same
  catalogs under the `/ru` `/en` router.
</code_context>

<specifics>
## Specific Ideas

Three items forwarded to the planning researcher (`gsd-phase-researcher`) — execution mechanics,
not user decisions; they resolve HOW, not the locked decisions above:

1. **Ark UI React version pin + API surface.** Pin `@ark-ui/react` compatible with React 19.2 (the
   workspace pin) and confirm the current component anatomy / styling approach (part-level
   `className` vs `asChild`), the controlled/uncontrolled prop contracts for
   Dialog/Menu/Tabs/Tooltip/Popover/Select/Field/FileUpload/NumberInput, and whether `createToaster`
   can slot/replace the existing styled `Toast` markup. Verify against the official Ark UI docs
   (free sources only — training data lags).
2. **Lingui × Ladle integration in a no-app/no-router context.** Confirm the current Lingui setup
   for a framework-agnostic catalog driven from Ladle: macro vs. runtime message catalogs, the
   `extract`/compile step in the workspace, the `I18nProvider` mount in `.ladle/components.tsx`, RU
   one/few/many ICU plural support, and compile-time key typing. Confirm the migration path for the
   `STRINGS` seed. Verify against the official Lingui docs.
3. **Ladle 5.1.1 global-control / language-switch + forced open-state.** Confirm the current Ladle
   API for a custom global control/addon to drive the language switch across all stories from
   `.ladle/config.mjs` + `.ladle/components.tsx`, and how to force overlay open-state /
   form-validation state for the static `StateMatrix` axe gate. Verify against `@ladle/react@5.1.1`.
</specifics>

<deferred>
## Deferred Ideas

- **`/ru` `/en` route layer + Lingui router coupling** — v1.0 app milestone (no routes in v0.1).
- **Real `server-2` data wiring, the typed OpenAPI client, SSR/SSE** — v1.0.
- **Surface composition** (Overview, Players, profiles, the 5 request steppers, moderation queue) —
  Phases 4–9; Phase 3 ships only the reusable interactive primitives + patterns they compose.

### Reviewed Todos (not folded)
None — `todo.match-phase 3` returned zero matches.
</deferred>
