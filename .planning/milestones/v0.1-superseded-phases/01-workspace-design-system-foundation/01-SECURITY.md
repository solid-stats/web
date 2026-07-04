---
phase: 01
slug: workspace-design-system-foundation
status: verified
threats_open: 0
asvs_level: 2
created: 2026-06-20
---

# Phase 01 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

Phase 01 has **no runtime, network, auth, or data surface** — no app, no routes, no
`fetch` (AGENTS.md frontend boundary; RESEARCH Runtime State Inventory). The only attack
surface is **supply-chain / build-integrity**: third-party dev-deps, the lockfile, font
binaries, and the build scripts (`gen-theme.mjs`, the Vite/Ladle config, the `check`
gate) that execute at build time. The register below is supply-chain/build-integrity
only by design; there are no runtime threats to model in this phase.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| npm registry → workspace | Pinned dev-deps + transitive deps enter the build at `pnpm install` | Third-party code (build-time) |
| npm registry → workspace (vite-plus) | The WS-05 gate package crosses into the build | Third-party code (build-time) |
| external font source → repo | `.woff2` binaries from Google Fonts / IBM Plex enter the build graph | Static binary assets (no executable surface) |
| DESIGN.md → gen-theme.mjs → theme.css | Build script reads the SoT and writes the consumed CSS | Local design tokens (build-time) |
| Ladle/Vite config → build | `vite.config.ts` + `.ladle/*` execute at build time | Build-time code |
| root `check` script → toolchain | The CI gate executes gen-theme + design.md lint + the resolved toolchain | Build-time code |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-1-01 | Tampering | npm dev-dep installs (`@google/design.md`, `@ladle/react`, `tailwindcss`, `@tailwindcss/vite`) | mitigate | Exact-version pins (verified: all 5 `packages/design` deps pinned, no caret) + committed `pnpm-lock.yaml` (verified tracked) + plan-01 blocking checkpoint against RESEARCH § Package Legitimacy Audit | closed |
| T-1-02 | Elevation of Privilege | transitive postinstall scripts | accept | RESEARCH audit confirmed none of the four direct deps run postinstall; transitive risk low for official tailwindlabs/google-labs/tajo packages. Re-audit on version bump. | closed |
| T-1-03 | Tampering | `vite-plus` install (WS-05 gate, originally unconfirmed name A1) | mitigate | Resolved to `vite-plus` and confirmed legit (STATE decision, package-legitimacy check + blocking checkpoint). Installed version bound by the committed lockfile. See Observation O-1 re: caret range. | closed |
| T-1-04 | Tampering | self-hosted font binaries | mitigate | Sourced only from official origins (Google Fonts / IBM Plex repo); static assets, no executable surface; provenance + Cyrillic subset confirmed at checkpoint | closed |
| T-1-05 | Tampering | `scripts/gen-theme.mjs` (build script writing consumed CSS) | mitigate | Generator stays dependency-free — verified imports are `node:fs`/`node:path`/`node:url` only, no network/`child_process`/new dep (re-verified after the 260620-q5q base-layer change this session); output gated by `git diff --exit-code` drift detection + `design.md lint`. `pnpm check` green. | closed |
| T-1-06 | Information Disclosure | Russian product copy leaking into the token layer | mitigate | D-12 rule enforced: no display string becomes a token value; acceptance-criteria grep rejects it (correctness boundary the gate protects) | closed |
| T-1-07 | Tampering | `vite.config.ts` / `.ladle/config.mjs` / `.ladle/components.tsx` (build-time code) | mitigate | Config applies only the audited `@tailwindcss/vite` plugin (plan-01 legitimacy audit); no network, no postinstall, no untrusted plugin; Ladle owns its bundled Vite 6 (no second Vite introduced) | closed |
| T-1-08 | Tampering | font binaries loaded by the provider | accept | Static `.woff2` assets from official origins (per T-1-04); no executable surface | closed |
| T-1-09 | Tampering | the `check` gate (executes build + lint tools) | mitigate | Gate runs only audited tools; `git diff --exit-code` drift step fails the gate on any unexpected `theme.css` change, surfacing tampering with the SoT→output pipeline. `pnpm check` green this session. | closed |
| T-1-SC | Tampering | npm/pnpm installs (whole-phase supply-chain) | mitigate | Exact-pin + committed lockfile + RESEARCH legitimacy audit + blocking human checkpoints on the four dev-deps (T-1-01) and `vite-plus` (T-1-03); no `[ASSUMED]`/`[SUS]` package auto-approved | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Observations (non-blocking)

| ID | Severity | Note |
|----|----------|------|
| O-1 | informational | `vite-plus` is the lone caret-ranged specifier (`^0.2.1` in root `package.json`) while every other workspace dep is exact-pinned. The committed `pnpm-lock.yaml` binds the actually-installed version, so the T-1-SC supply-chain control (reproducible install) holds. Tighten to an exact pin on the next `vite-plus` bump for consistency with the rest of the workspace. Below `block_on: high` — does not gate phase advancement. |

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-1 | T-1-02 | None of the four direct dev-deps run postinstall (RESEARCH audit); transitive postinstall risk is low for official tailwindlabs/google-labs/tajo packages. Re-audit on version bump. | Pavlov Alexandr | 2026-06-20 |
| AR-2 | T-1-04 / T-1-08 | Self-hosted `.woff2` font binaries from official origins are static assets with no executable surface. | Pavlov Alexandr | 2026-06-20 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-06-20 | 10 | 10 | 0 | gsd-secure-phase (plan-time register, short-circuit + evidence check) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-06-20
