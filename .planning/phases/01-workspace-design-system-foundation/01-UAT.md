---
status: complete
phase: 01-workspace-design-system-foundation
source: [01-VERIFICATION.md]
started: 2026-06-20T17:00:00Z
updated: 2026-06-20T11:57:46Z
---

## Current Test

[testing complete]

## Tests

### 1. Smoke story visual render correctness

how-to-run: |
  export PATH="$HOME/.local/share/nvm/v25.9.0/bin:$PATH"
  pnpm --filter @solid-stats/design ladle
  # open the dev server, navigate to the Smoke story

expected: |
  Visually confirm in the browser:
  1. Gunmetal dark palette renders — no white/light background bleed.
  2. Exo 2 display font and IBM Plex Sans body font render with Cyrillic glyphs
     (check «Solid Stats — статистика» and «IBM Plex Sans — корпус»).
  3. IBM Plex Mono tabular numerals align correctly («1 234 567 · 89.50% · 00:42:17»).
  4. Four freshness pills render with distinct colors — green/Актуально,
     yellow/Данные устаревают, red/Связь потеряна, blue/Переподключение.
  5. Cyan primary accent is visible.
why-human: |
  Visual render correctness (font loading, Cyrillic glyph rendering, color
  fidelity, data-trust token appearance) is not assertable by the headless
  `ladle build`; it requires the browser rendering pipeline. The headless build
  confirms CSS is emitted and woff2 assets are bundled but cannot confirm fonts
  load or Cyrillic glyphs render. Sole Manual-Only item in 01-VALIDATION.md.
verification: |
  Verified via real browser automation (Playwright MCP) against the live `ladle dev`
  stack at http://localhost:61001/?story=smoke--tokens — DOM introspection + screenshot,
  not headless build. Evidence:
  1. Dark palette — surface card paints #151A25 (--color-surface-1, AA). Screenshot
     renders gunmetal dark, no white bleed. CAVEAT below.
  2. Fonts loaded — document.fonts.check() true for Exo 2 (700), IBM Plex Sans (400),
     IBM Plex Mono (400). Computed font-family correct on h1/body/mono. Cyrillic
     «Solid Stats — статистика» / «IBM Plex Sans — корпус» render on self-hosted woff2.
  3. Mono numerals — font-variant-numeric: tabular-nums confirmed on «1 234 567 · 89.50% · 00:42:17».
  4. Freshness pills — 4 distinct colors confirmed: green rgb(63,207,142) / amber
     rgb(242,179,61) / red rgb(255,92,108) / blue rgb(91,157,255), each with matching
     1px border, all wired to --color-freshness-* tokens.
  5. Cyan accent — rgb(54,197,224) = #36C5E0 (--color-primary). ✓
finding: |
  Sub-check 1 caveat — the gunmetal BASE backdrop (--color-bg-0 #0A0D13) is NOT
  painted by the design system in the Ladle build. The token is defined in
  theme.css:23 and DESIGN.md, but in the running build --color-bg-0 is absent from
  :root and the `.bg-bg-0` utility is not generated. The GlobalProvider wrapper
  (.ladle/components.tsx) uses `className="bg-bg-0 …"` but it is a no-op; html, body,
  #ladle-root and the wrapper are ALL transparent. The dark you see is the browser
  canvas, not the token. Root cause: `.ladle/tailwind.css` has `@source "../src"`,
  which excludes the `.ladle/` provider — Tailwind v4 only emits theme vars whose
  names/utilities appear in scanned content, so `bg-bg-0` (used only in the unscanned
  .ladle file) is tree-shaken. Surfaces/accent/freshness resolve because they ARE
  used in scanned src/ stories. Blast radius is narrow (the real app will emit bg-0
  once it @sources its own files); robust fix is to paint the base on `html, body`
  in theme.css so the dark backdrop never depends on a scanned utility class.
resolution: |
  FIXED — quick task 260620-q5q (commit d9b307a). `scripts/gen-theme.mjs` now emits
  `@layer base { html { background-color: var(--color-bg-0); color: var(--color-text-primary); } }`
  after the @theme block; theme.css regenerated. Re-verified live in the browser:
  getComputedStyle(:root)['--color-bg-0'] = #0A0D13 (was empty), html computed
  background-color = rgb(10,13,19) and color = rgb(234,238,246) — the gunmetal base is
  now painted by the token, not the browser canvas. `pnpm check` green. All 5 sub-checks
  now genuinely pass.
result: pass

## Summary

total: 1
passed: 1
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps
