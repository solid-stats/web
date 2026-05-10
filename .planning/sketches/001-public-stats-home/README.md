---
sketch: 001
name: public-stats-home
question: "What first screen best balances dense public stats, trust indicators, and navigation into player/squad/replay surfaces?"
winner: null
tags: [layout, public-stats, dashboard, table]
---

# Sketch 001: Public Stats Home

## Design Question

What should the first public Solid Stats screen feel like: a dense command table, a mobile-first feed, or an ops console with stronger system context?

## How to View

Open `.planning/sketches/001-public-stats-home/index.html` in a browser.

## Variants

- **A: Players Table** - focused public player list with filters, sorting, and a clear page purpose.
- **B: Match Feed** - mobile-first public stats feed with sticky search, ranking strips, and stacked data rows.
- **C: Ops Console** - broader status surface that combines stats, parser freshness, replay health, and moderation entrypoints.

## What to Look For

Compare which variant feels closest to the product promise: fast public stat inspection first, visible trust/provenance, and a path toward request/moderation flows without turning into a marketing page.

## Feedback Applied

- Variant A is now a focused player table page, not a mixed dashboard.
- The selected visual direction is **Olive Ledger**: dark olive/stone surfaces, calm data-ledger contrast, Manrope UI text, condensed headings, and restrained green accents.
- Technical live/SSE language, admin request context, manual density toggle, and the Trust table column were removed from Variant A.
