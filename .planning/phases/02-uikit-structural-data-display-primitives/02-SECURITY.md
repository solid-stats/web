---
phase: 02-uikit-structural-data-display-primitives
audit_date: 2026-06-24
asvs_level: 2
block_on: high
threats_total: 14
threats_closed: 14
threats_open: 0
unregistered_flags: 0
verdict: SECURED
---

# Phase 02 — UIKIT Structural & Data-Display Primitives — Security Audit

Mitigation-verification audit of the declared threat register (deduplicated across the 11
plan `<threat_model>` blocks). ASVS L2, `block_on: high`. Implementation files were read
only — never modified. Every declared mitigation was confirmed present in code by grep +
read, not accepted on documentation or intent.

**Scope reality (design decision D-01):** Phase 2 is a presentational, fixture-only Ladle
component catalog (Ladle 5.1 + Tailwind v4 + React 19/TSX). No auth, no network/fetch, no
persistence, no secrets, no real sort/pagination engine, no user input. The only untrusted
surface is npm dev-deps at install time. ASVS V2/V3/V4(enforcement)/V6 are N/A this phase;
the applicable categories are V5 (input/output rendering — JSX auto-escaping) and V14
(config / dependencies).

## Verdict: SECURED — 14/14 threats CLOSED, 0 open, 0 unregistered flags

All `mitigate` mitigations were located in the implementation; all `accept` threats were
confirmed presentation-only and are logged below. The standing regression gate is GREEN —
Vitest **97/97** re-run live during this audit (`pnpm --filter @solid-stats/design exec
vitest run` → 97 passed), Playwright **252/252** per the phase UAT/VERIFICATION artifacts
(requires a live ladle preview server + browsers; not re-run in this audit, corroborated by
the discharged orchestrator run `203 passed` on the merged milestone tree).

## Threat Verification

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|-------------|--------|----------|
| T-02-SC | Tampering / supply-chain | high | mitigate | CLOSED | `packages/design/package.json:20-33` — all 5 new deps pinned to EXACT versions (no `^`/`~`): `lucide-react@1.21.0`, `tailwind-variants@3.2.2`, `vitest@4.1.9`, `@axe-core/playwright@4.11.3`, `@playwright/test@1.61.0`. `pnpm-lock.yaml` specifier == version for each; integrity sha512 of each lockfile entry EXACTLY matches the npm registry's published integrity (verified via `npm view <pkg> dist.integrity`); each resolves to its legitimate upstream repo (lucide-icons/lucide, heroui-inc/tailwind-variants, vitest-dev/vitest, dequelabs/axe-core-npm, microsoft/playwright) — no typosquat/slopsquat. No non-default registry/tarball overrides. No postinstall-network hook reaches a consumer install: `pnpm-workspace.yaml` carries an explicit `allowBuilds` suppression (all three listed transitive build scripts `false`), pnpm 11.6.0 blocks dependency lifecycle scripts unless allowlisted, and no `onlyBuiltDependencies` allowlist exists. (Of the 5 deps, only `@axe-core/playwright` declares a `prepare` and `tailwind-variants` a `prepublishOnly`; neither runs on a registry-tarball consumer install — both are maintainer-side publish hooks.) |
| T-02-01 | Tampering / XSS (V5) | high | mitigate | CLOSED | Whole-tree grep `grep -rnE "dangerouslySetInnerHTML\|\.innerHTML\|insertAdjacentHTML\|document\.write\|\beval\(\|new Function\(" src/` over all 96 source files → ZERO sinks. The single textual match is the explanatory comment `_fixtures/strings.ts:5` ("…never dangerouslySetInnerHTML (V5)"), not a sink. `_fixtures/strings.ts:18+` `STRINGS` is a static object literal of RU/EN constants — no runtime/external input. L2 spot-check `ErrorState.tsx:65-68`: `message`, `contact`, the `{id}` placeholder all flow through standard JSX text interpolation (React auto-escaped) at the correct rendering boundary. |
| T-02-02 | Tampering / icon+SVG injection (V14) | high | mitigate | CLOSED | All 20 icon imports come from `lucide-react`; ZERO foreign icon sources (react-icons/heroicons/tabler/radix). ZERO dynamic SVG injection (`src={`, `srcDoc`, `data:image/svg`, blob-svg — none). The ONLY inline `<svg>` in the tree is `NavBar/SteamLogo.tsx:17-26` — a static local React component with a hard-coded literal `<path d="…">`, `fill="currentColor"`, `aria-hidden` (the one sanctioned brand mark; Lucide ships no brand glyphs). `Sparkline/Sparkline.tsx:72-95` is dependency-free DOM bars (`<span>` in a flex row), no charting lib, no raw SVG string; bar height is a computed `%` via inline style, fill is a token class, the series + figcaption summary render via escaped JSX. |
| T-02-AC | Access Control / Info-disclosure (informational) | low | accept | CLOSED (accepted) | `NavBar/navFixtures.ts:82-84` — `navItemsFor(_role, lang)` ignores the role entirely (underscore-prefixed, unused) and returns the role-invariant `publicSections`; `roleExtrasFor`/`accountFor` are display-only label/icon selection with no authorization check, token, or gate. Logged as accepted risk below. |
| T-02-08-01 | Information Disclosure (no RBAC) | low | accept | CLOSED (accepted) | Same seam as T-02-AC. The shell renders role-SHAPED visual slots only; denied items are simply absent from the passed list. NO enforcement. Documented in `02-08-SUMMARY.md` "Known Stubs" ("…NO RBAC — the documented v1.0 seam, threat T-02-08-01 accepted"). Logged as accepted risk below. |
| T-02-07-01 | Tampering / a11y-contract regression | medium | mitigate | CLOSED | The Playwright closure gate: `tests/catalog.spec.ts:34-42` runs `AxeBuilder.withTags(["wcag2a","wcag2aa","wcag22aa"]).analyze()` per story, blocking on `serious`/`critical`. Gate GREEN (Playwright 252/252, UAT 2026-06-24). |
| T-02-08-02 | Tampering / green-but-broken a11y (GAP-05) | medium | mitigate | CLOSED | `tests/keyboard.spec.ts:41-42` asserts the COMPUTED `getComputedStyle(...).clipPath === "none"` AND `.clip === "auto"` on the SkipLink at focus — a paint-blind (clipped-but-44px) regression fails the gate. |
| T-02-09-01 | Tampering / dangling import on DensityToggle removal | medium | mitigate | CLOSED | `DensityToggle` is never imported/exported/rendered anywhere in `src/` (live-symbol grep ZERO; the only matches are GAP-06 removal comments). The barrel + `pnpm check` (tsgo) would fail compilation on a dangling import; `pnpm check` exit 0 (VERIFICATION.md:72,154). |
| T-02-09-02 | Tampering / stray-scrollbar regression (GAP-08) | medium | mitigate | CLOSED | `tests/cls.spec.ts:63-67,99` asserts `scrollHeight - clientHeight <= 0` on the table skeleton and both table viewports — a re-appearing scrollbar fails the gate. |
| T-02-10-01 | Tampering / fill-only selected row (color-alone) | medium | mitigate | CLOSED | Component invariant present: `Table/TableRow.tsx:6-7,83-88` — selected row = `primary-weak` fill + an inset 2px cyan left-edge marker (`inset-shadow-(--shadow-selected-marker)`) + `aria-selected` (never fill-only). keyboard.spec aria-selected/boxShadow checks + design-review Pillar 3 run as the gate (UAT/VERIFICATION green). |
| T-02-11-01 | Tampering / reserved-box height change (CLS) | medium | mitigate | CLOSED | `tests/cls.spec.ts:58-59,96-97` asserts `skeletonBox.height === finalBox.height` and `.width === .width` (skeleton box == final box) — a reserved-height change fails the gate. |
| T-02-11-02 | Tampering / non-transform animation (perf) | medium | mitigate | CLOSED | `animate-pulse` never appears as a live class in `src/` (the single match is a `uikit.css:21` comment documenting its replacement). The skeleton shimmer uses the transform/opacity `sk-sweep` keyframe (VERIFICATION.md:156-157). design-review Pillar 2 (transform/opacity-only) + the grep run as the gate. |
| T-02-07-SC | Tampering / supply-chain (no new installs) | low | accept | CLOSED (accepted) | Plan 02-07 adds no new packages (Button reuses the already-cleared lucide-react + tailwind-variants). Logged below. |
| T-02-08-SC / 09-SC / 10-SC / 11-SC | Tampering / supply-chain (no new installs) | low | accept | CLOSED (accepted) | Plans 02-08…02-11 add no new packages (Steam mark is a local inline SVG; remaining changes are token/CSS/story restructure). `package.json` dep set unchanged from the 02-01 install. Logged below. |

> Severity assignment (register predated a Severity column; assigned here by impact ×
> likelihood for the `block_on: high` gate): T-02-SC / T-02-01 / T-02-02 are the only
> threats with a plausible high-impact vector (build-time code execution; XSS sink), rated
> **high** and all CLOSED. The regression-gate threats are **medium** (a regressed a11y/CLS
> contract degrades quality, not a confidentiality/integrity breach), all CLOSED. The
> visual-RBAC and no-new-install accept threats are **low**, all CLOSED-accepted. No OPEN
> threat exists at any severity, so `threats_open` = 0 regardless of the threshold.

## Accepted Risks Log

| Threat ID | Risk | Rationale | Owner / Re-evaluation |
|-----------|------|-----------|-----------------------|
| T-02-AC / T-02-08-01 | The nav-shell role-aware slots are VISUAL ONLY — denied items are simply absent from the passed list; there is NO RBAC enforcement in the catalog. A consumer must not mistake the visual slot for an authorization control. | By design (D-01): RBAC enforcement is the v1.0 app route/loader gate, not the presentational catalog. `navItemsFor` ignores the role; the slots are display fixtures. No secret or privileged data exists in the catalog to leak. Verified presentation-only at `NavBar/navFixtures.ts:82-84`. | Re-evaluate at v1.0 when the route/loader RBAC gate lands. The fixture seam (`accountFor`/`roleExtrasFor`/`publicSections`) is the documented swap point. |
| T-02-07-SC … T-02-11-SC | Supply-chain exposure from new package installs in plans 02-07…02-11. | Accepted because these plans install NO new packages — they reuse the deps cleared at the 02-01 Package Legitimacy Gate (lucide-react, tailwind-variants) plus local code. Confirmed: `package.json` dependency set is unchanged across the wave. | Re-evaluate if a later plan adds a dependency (re-run the Package Legitimacy Gate). |

## Unregistered Flags

None. No `## Threat Flags` section exists in any phase-02 summary (the executor raised no
net-new attack surface). The only threat IDs referenced in the summaries (`T-02-08-01`,
`T-02-AC`) are both already in the register.

## Audit Method Notes

- Implementation files (`packages/design/src/**`, `package.json`, `pnpm-lock.yaml`,
  `pnpm-workspace.yaml`) were READ-ONLY. This audit created only this SECURITY.md.
- T-02-01 / T-02-02 XSS+icon greps were run over the ENTIRE `src/` tree (all 96 files /
  all 20 icon imports), not a sample — every rendering entry point is covered.
- T-02-SC integrity was cross-checked against the LIVE npm registry (`npm view`), so the
  pinning is verified against the real published artifact, not only the lockfile.
- The regression-gate (Vitest) was re-run live during this audit (97/97 green); the
  Playwright half is corroborated by the UAT/VERIFICATION artifacts (252/252; needs a live
  ladle server + browsers, out of scope for a static audit).
