---
sketch: 002
name: olive-ledger-players
question: "How should the focused public player table look in the selected Olive Ledger direction?"
winner: null
tags: [olive-ledger, players, public-stats, table, responsive]
---

# Sketch 002: Olive Ledger Players

## Design Question

How should the first focused public `Players` page look after selecting the Olive Ledger color and typography direction?

## How to View

Open `.planning/sketches/002-olive-ledger-players/index.html` in a browser.

## Scope

This sketch intentionally shows one page and one job: inspect and filter public player rankings. It avoids dashboard metrics, admin context, technical live/SSE language, and manual density controls.

The player list opens without a rotation selected by default, but keeps a rotation filter available. Bounty data is intentionally excluded because bounty belongs on a separate rotation-scoped page.

## Table Fields

Columns are ordered as: games, kills, vehicle kills, vehicle-kill percentage, destroyed vehicles, teamkills, deaths from teamkills, total deaths, K/D, score. Calculated values expose formula tooltips.

## Branding

Uses `../assets/logo.svg` as the SolidGames brand mark next to the `Solid Stats` product name.

## What to Look For

- Whether Olive Ledger feels serious and pleasant enough for the default theme.
- Whether the first screen is immediately understandable as the `Players` stats page.
- Whether desktop table density and mobile card rows feel usable without extra controls.
