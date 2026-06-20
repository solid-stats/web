# Design Migration — `.design/` (Claude Design) → real-stack workspace

Decision pack from the deep-brainstorm on 2026-06-20. Captures how the existing Claude Design output
in `.design/` migrates into a properly structured design workspace inside `web`, so a fresh context
can execute the foundation task without re-deriving the decisions.

## Context

`.design/` is the output of Claude Design (`@google/design.md`): a generated design-system seed
(`_ds/…`), hi-fi surface mockups (`hifi/*.jsx` + plain CSS, rendered by the `support.js` canvas
harness — a **fake stack**, not TanStack/Tailwind/Ark), wireframes, brand assets, and a 14 KB
`CLAUDE.md` of binding design rules + per-surface domain knowledge (Score/KD formulas, population
tiers, the list loading model, data-trust A/C-not-B). The target is the two-layer model from
`solidstats-frontend-react-design`: a canonical `DESIGN.md` token system → Tailwind v4 `@theme`, a
durable Ladle component catalog on the real stack, per-surface specs, and graduate-to-routes.

Key insight: the hi-fi is plain CSS on a fake harness, so it is **visual reference, not portable
code**. The migration is *extract durable knowledge + rebuild on the real stack*, not *move files*.

## Decisions (locked)

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | `.design/` becomes a **frozen reference archive**; the durable build is on the real stack. | One source of truth (`DESIGN.md` + `src/`), no drift vs a parallel design lab. |
| D2 | Hi-fi `*.jsx` = **visual reference only**; each surface is rebuilt natively (spec → Ladle → route) in GSD phases. | The mockups are fake-stack plain CSS; porting drags legacy CSS debt. |
| D3 | The migration runs as a **foundation task BEFORE `gsd-new-project`**. | The roadmap should be planned against a real, importable design system. |
| D4 | Foundation scope = **system + pipeline only** (DESIGN.md → @theme, app scaffold, Ladle wired). **Zero components** (primitives included). | Smallest foundation that gives the roadmap a real DS; all components are GSD phases. |
| D5 | Ladle catalog = **colocated `*.stories.tsx`** in `src/shared/uikit/<Component>/`. | Matches the conventions skill (a slice owns its artifacts); a story can't drift from its component. |

## Foundation task (risk-first order)

1. **`DESIGN.md`** (repo root) authored from `.design/_ds/…` (`colors_and_type.css`, `README.md`,
   manifest) + the design skill's `references/design-system.md` + `.design/CLAUDE.md`. Reconcile the
   container token: `--container: 1240` → `--container` 1760 ceiling/fluid + `--container-prose` 720.
   Dark-only; spacing = Tailwind stock 4px; canonical breakpoints. Gate: `design.md lint` (contrast).
2. **Validate the export tool early** (highest technical risk): `@google/design.md` CLI maturity /
   version / license; `design.md export --tailwind-v4 DESIGN.md > src/styles/theme.css`. Fallback if
   it disappoints: DTCG → `@terrazzo/plugin-tailwind`, or Style Dictionary v4, or hand-author `@theme`.
3. **Scaffold**: Vite + TanStack Start (SSR), Tailwind v4 on `theme.css` (`@theme` + `--*: initial`),
   Router/Query providers, `tailwind-variants`, FSD layers (`src/routes` / `src/pages` / `src/shared`)
   per `solidstats-frontend-react-conventions`.
4. **Ladle** wired to the real stack (dark-only, the `@theme`), colocated-stories convention. Zero
   components — only a smoke story proving tokens render.
5. **Freeze `.design/`**: keep `CLAUDE.md` as the living companion; `hifi/` / `wireframes/` / `_ds/` /
   `app/` become reference (+ a README pointing to the canonical `/DESIGN.md`); brand assets →
   `public/`. (All of `.design/` except `CLAUDE.md` + `MIGRATION.md` is frozen archive — the dead
   `--container: 1240` survives only there, nothing live sources it.)
6. **Wire the design skills into GSD**: `web/AGENTS.md` overlays (`gsd-ui-phase` → design,
   `gsd-ui-review` → design-review); commit the installed skills (`skills-lock.json`, `.agents/skills/`).

Then → `/gsd-new-project --auto @../plans/web/briefs/web.md` (config: `ui_phase` / `ui_review` /
`ui_safety_gate` on, `discuss` mode, `granularity: fine`, `response_language: Russian`). The roadmap
plans all surfaces and primitives on the real DS, each via design → design-review.

## Open / deferred (P2)

- `@google/design.md` maturity / license — validated in step 2; fallback ready.
- Domain truth from the hi-fi (Score/KD formulas, `SS_BASELINE` tiers, list loading model, data-trust
  A/C-not-B) must survive — it lives in `.design/CLAUDE.md`; keep that file authoritative and extract
  into `src/shared/business` helpers + Ladle story fixtures + typed ICU i18n as surfaces graduate.
- Exact `.design/reference/` archive layout — cosmetic.

## Post-validation updates (2026-06-20)

After authoring `DESIGN.md` and validating the toolchain, two decisions firmed up:

- **Foundation shrunk (amends D4).** The foundation is now **`DESIGN.md` + `src/styles/theme.css`
  only** (plus the already-done: design skills installed, `AGENTS.md` UI overlays, this file). The app
  scaffold (Vite + TanStack Start + Tailwind v4 wiring + Ladle) moves to the **first `gsd-new-project`
  phase** — building empty plumbing pre-GSD was premature. The roadmap still stands on a real,
  importable design system (the token layer).
- **`theme.css` is generated by a tiny in-repo generator, not the `design.md` CLI.** Validation found
  `@google/design.md@0.3.0` `export --format css-tailwind` (the flag is `--format css-tailwind`, NOT
  `--tailwind-v4`) **silently drops typography `line-height`** — and its DTCG export drops it too. So:
  - `theme.css` ← `scripts/gen-theme.mjs` (reads `DESIGN.md` YAML → `@theme` + the `--*: initial`
    reset no exporter emits). `theme.css` is a pure build output — never hand-edited (**DRY**: one
    source = `DESIGN.md`). Hand-author is the fallback only if the generator approach fails.
  - `@google/design.md` stays as the **authoring + `lint` / `diff` gate** on `DESIGN.md`.
  - **Migration obligation (tracked):** watch `@google/design.md` releases; **retire `gen-theme.mjs`
    and switch to the official `design.md export --format css-tailwind`** as soon as the line-height
    drop is fixed (the README already promises `--leading-*`). Re-validate the paired
    `--text-*--line-height` output before switching.
- **Skill fix owed:** `solidstats-frontend-react-design/references/design-system.md` documents the
  wrong export flag (`--tailwind-v4`) and claims the CLI path works — correct it to the above (interim
  generator + the migration trigger).

## Next step

Execute the foundation task — it is pre-GSD plumbing. `DESIGN.md` is authored and lint-clean (0
errors); next is `theme.css` via `scripts/gen-theme.mjs`, then the DRY audit, then logical-chunk
commits. The scaffold is deferred to the first `gsd-new-project` phase.
