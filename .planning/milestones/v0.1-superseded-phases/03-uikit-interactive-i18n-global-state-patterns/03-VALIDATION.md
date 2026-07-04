---
phase: 3
slug: uikit-interactive-i18n-global-state-patterns
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-24
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Seeded from 03-RESEARCH.md `## Validation Architecture`. The Per-Task Verification Map
> is completed by the planner / nyquist-auditor against the final PLAN.md tasks.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.9 (hooks/logic) · Playwright 1.61.0 against Ladle (component/keyboard/focus) · @axe-core/playwright 4.11.3 (a11y) |
| **Config file** | `packages/design` (`.ladle/config.mjs` story harness; playwright + vitest configs) |
| **Quick run command** | `pnpm --filter @solid-stats/design test` |
| **Full suite command** | `pnpm --filter @solid-stats/design test && pnpm --filter @solid-stats/design test:e2e` |
| **Estimated runtime** | ~TBD (set after Wave 0) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --filter @solid-stats/design test`
- **After every plan wave:** Run the full suite (vitest + Playwright/axe against Ladle)
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** TBD seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | KIT-05 | — | N/A (presentational, no untrusted input) | e2e | `pnpm --filter @solid-stats/design test:e2e` | ❌ W0 | ⬜ pending |

*Seeded scaffold — planner replaces with the real task rows. Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Add `@ark-ui/react` + `@lingui/*` deps (human-verify checkpoint per RESEARCH.md before first `pnpm add`)
- [ ] Per-component Playwright behavior specs (trap-free Tab cycle, Esc-to-close, aria-expanded/controls, form live-region) — extend the Phase-2 catalog/keyboard harness
- [ ] StateMatrix cells for forced overlay-open / invalid-field states (axe gate)

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| RU copy sanity (clipped/awkward wording) | KIT-08 / QUAL-05 | Linguistic judgment, not machine-checkable | Toggle RU in Ladle, review each catalogued string at story widths |

*Automated coverage (axe / keyboard / 44px / tsc missing-key) handles the rest.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < TBDs
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
