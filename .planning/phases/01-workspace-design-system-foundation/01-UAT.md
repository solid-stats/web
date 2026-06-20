---
status: testing
phase: 01-workspace-design-system-foundation
source: [01-VERIFICATION.md]
started: 2026-06-20T17:00:00Z
updated: 2026-06-20T17:00:00Z
---

## Current Test

number: 1
name: Smoke story visual render correctness (dark-only @theme, self-hosted Cyrillic type, data-trust tokens)
expected: |
  All five visual checks pass — tokens are not unstyled, fonts load from the
  self-hosted woff2 assets, Cyrillic renders, and the four-state freshness
  vocabulary is color-distinct and legible.
awaiting: user response

## Tests

### 1. Smoke story visual render correctness

how-to-run: |
  export PATH="/home/afgan0r/.local/share/nvm/v25.9.0/bin:$PATH"
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
result: [pending]

## Summary

total: 1
passed: 0
issues: 0
pending: 1
skipped: 0
blocked: 0

## Gaps
