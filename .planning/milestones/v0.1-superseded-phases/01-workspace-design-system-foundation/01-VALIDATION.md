---
phase: 1
slug: workspace-design-system-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-20
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Phase 1 has **no unit-test surface** — it is workspace scaffolding + the DESIGN.md→@theme
> pipeline + one Ladle smoke story. "Tests" here are deterministic toolchain assertions.
> The Per-Task map below is populated by the planner's `<automated>`/`<verify>` blocks and
> reconciled by `gsd-nyquist-auditor`. See `01-RESEARCH.md` § Validation Architecture for the
> full Phase-Requirement → Validation map.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Toolchain gates (no test runner this phase): Vite+ `vp check` (Oxlint + Oxfmt + tsgo) · `@google/design.md lint` · `gen-theme.mjs` regen + drift check |
| **Config file** | root `tsconfig.base.json` + per-package `tsconfig.json` (extends) · `packages/design/.ladle/config.mjs` + root `vite.config.ts` |
| **Quick run command** | `vp check` *(contingency: `oxlint && oxfmt --check && tsgo --noEmit` if Vite+ `vp` is unavailable — see RESEARCH A1)* |
| **Full suite command** | `pnpm install --frozen-lockfile && node scripts/gen-theme.mjs && git diff --exit-code packages/design/src/styles/theme.css && npx @google/design.md lint DESIGN.md && vp check && pnpm --filter @solid-stats/design build` |
| **Estimated runtime** | ~60–150 seconds |

---

## Sampling Rate

- **After every task commit:** Run `vp check` (or the primitive contingency)
- **After every plan wave:** Run the full suite command
- **Before `/gsd-verify-work`:** Full suite must be green (exit 0; `design.md lint` = zero error-severity findings, warnings allowed — see RESEARCH: the 7 `-weak` contrast warnings are false positives)
- **Max feedback latency:** ~150 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| *populated by planner* | — | — | WS-01..05 / DS-01..03 | T-1-* / — | supply-chain only (no runtime surface) | toolchain-assertion | per-task `<automated>` | ✅ / ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Phase 1 installs its own toolchain — Wave 0 is the dependency/environment floor, not test stubs:

- [ ] Node 25 active (`.nvmrc` / `.node-version` = `25`; machine currently on Node 24 — bump required)
- [ ] pnpm 11 (`packageManager: pnpm@11.x`) and a clean `pnpm install`
- [ ] Root dev-deps pinned: `@ladle/react@5.1.1`, `tailwindcss@4.3.1`, `@tailwindcss/vite@4.3.1`, `@google/design.md@0.3.0`
- [ ] Vite+ `vp` resolved & verified (RESEARCH A1, `checkpoint:human-verify`) — or the primitive contingency wired
- [ ] Self-hosted font assets present in `packages/design` (Saira, IBM Plex Sans + Mono `.woff2` — QUAL-04)

*No test-framework install — there is no unit-test surface this phase.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Smoke story renders real tokens (colors, type, the data-trust vocabulary) in Ladle on the real stack, dark-only | WS-04, DS-01..03 | Visual render correctness is not assertable by a headless toolchain command | Run Ladle dev, open the smoke story, confirm gunmetal palette + cyan accent + Saira/IBM Plex type + tabular numerals + data-trust tokens render (not unstyled) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (toolchain + env floor above)
- [ ] No watch-mode flags
- [ ] Feedback latency < 150s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
