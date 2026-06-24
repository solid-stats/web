---
name: SolidStats
description: >-
  Dark-only "gunmetal" tactical-operations design system for the SolidStats web
  frontend (TanStack Start + React). Single source of truth for design tokens;
  the Tailwind v4 @theme is generated from this file, never hand-maintained.
colors:
  # ---- Ink ramp (blue-tinted gunmetal; steps UP in lightness as it comes forward) ----
  bg-0: "#0A0D13" # app backdrop, deepest
  bg-1: "#0F131C" # raised app background / sticky bars
  surface-1: "#151A25" # cards, panels
  surface-2: "#1B212F" # table header, inputs, raised-in-card
  surface-3: "#232B3B" # hover / active row
  overlay: "rgba(6, 9, 14, 0.66)" # dialog scrim

  # ---- Borders (hairline separators — the primary structural device) ----
  border-1: "#262E3D" # hairline separators
  border-2: "#36415A" # stronger frame / focus-within / emphasized panels

  # ---- Text ----
  text-primary: "#EAEEF6" # primary copy, stat readouts        (AA on every surface)
  text-muted: "#98A2B6" # secondary / labels / column headers (AA on every surface)
  text-subtle: "#616B80" # tertiary / placeholder / disabled   (3:1 — large/UI/disabled only)
  fg-on-accent: "#04141A" # text on any saturated fill (cyan / win / loss / warn / info)

  # ---- Primary — single signal cyan (interactive / active / brand) ----
  primary: "#36C5E0"
  primary-hover: "#2FB9D4"
  primary-active: "#27A8C2"
  primary-weak: "rgba(54, 197, 224, 0.13)" # tint background (selected row, badge fill)
  primary-border: "rgba(54, 197, 224, 0.40)"

  # ---- Semantics — win / loss / unknown·conflict / info (NEVER color-alone) ----
  win: "#3FCF8E" # win / positive delta
  win-weak: "rgba(63, 207, 142, 0.14)"
  win-border: "rgba(63, 207, 142, 0.38)"
  loss: "#FF5C6C" # loss / teamkill / danger
  loss-weak: "rgba(255, 92, 108, 0.14)"
  loss-border: "rgba(255, 92, 108, 0.38)"
  warn: "#F2B33D" # unknown / conflict / warning / stale
  warn-weak: "rgba(242, 179, 61, 0.15)"
  warn-border: "rgba(242, 179, 61, 0.40)"
  info: "#5B9DFF" # info / neutral notice
  info-weak: "rgba(91, 157, 255, 0.14)"
  info-border: "rgba(91, 157, 255, 0.38)"

  # ---- Data-viz ramp (sparklines, microcharts) ----
  chart-1: "#36C5E0"
  chart-2: "#3FCF8E"
  chart-3: "#F2B33D"
  chart-4: "#B58BFF"
  chart-5: "#FF8A5B"
  grid-line: "rgba(255, 255, 255, 0.06)"

typography:
  fontFamilies:
    display: "'Exo 2', system-ui, sans-serif"
    body: "'IBM Plex Sans', system-ui, sans-serif"
    mono: "'IBM Plex Mono', ui-monospace, monospace"
  fontWeights:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
  lineHeights:
    tight: 1.08 # display / big numbers
    snug: 1.25 # headings
    dense: 1.35 # dense tables
    normal: 1.5 # body
  letterSpacing:
    tight: "-0.02em" # large display
    snug: "-0.01em" # headings
    normal: "0"
    label: "0.06em" # uppercase labels / column headers
    caps: "0.12em" # brand / overline
  scale:
    # Each step carries its size AND its paired line-height (the value Tailwind v4
    # emits as `--text-<step>--line-height`). lineHeight is the RESOLVED numeric
    # literal of the named typography.lineHeights role in the trailing comment —
    # the generator copies it verbatim, so a `{typography.lineHeights.*}` ref is NOT
    # used here (same as components/roles, which only the generator resolves).
    "2xs": # micro labels, table meta, provenance
      size: "11px"
      lineHeight: "1.5" # normal
    xs: # secondary meta, badges
      size: "12px"
      lineHeight: "1.5" # normal
    sm: # dense table body
      size: "13px"
      lineHeight: "1.35" # dense
    base: # default UI text (dense-ops default)
      size: "14px"
      lineHeight: "1.5" # normal
    md: # comfortable / mobile body
      size: "16px"
      lineHeight: "1.5" # normal
    lg: # card titles
      size: "18px"
      lineHeight: "1.25" # snug
    xl: # section headings
      size: "22px"
      lineHeight: "1.25" # snug
    "2xl": # page H2
      size: "28px"
      lineHeight: "1.25" # snug
    "3xl": # page H1
      size: "36px"
      lineHeight: "1.08" # tight
    "4xl": # big stat readout
      size: "48px"
      lineHeight: "1.08" # tight
    "5xl": # hero stat
      size: "64px"
      lineHeight: "1.08" # tight
  roles:
    overline:
      fontFamily: "{typography.fontFamilies.mono}"
      fontSize: "{typography.scale.2xs}"
      fontWeight: "{typography.fontWeights.medium}"
      letterSpacing: "{typography.letterSpacing.caps}"
      textTransform: uppercase
      color: "{colors.text-muted}"
    label:
      fontFamily: "{typography.fontFamilies.body}"
      fontSize: "{typography.scale.xs}"
      fontWeight: "{typography.fontWeights.semibold}"
      letterSpacing: "{typography.letterSpacing.label}"
      textTransform: uppercase
      color: "{colors.text-muted}"
    h1:
      fontFamily: "{typography.fontFamilies.display}"
      fontSize: "{typography.scale.3xl}"
      fontWeight: "{typography.fontWeights.bold}"
      lineHeight: "{typography.lineHeights.tight}"
      letterSpacing: "{typography.letterSpacing.tight}"
      color: "{colors.text-primary}"
    h2:
      fontFamily: "{typography.fontFamilies.display}"
      fontSize: "{typography.scale.2xl}"
      fontWeight: "{typography.fontWeights.semibold}"
      lineHeight: "{typography.lineHeights.snug}"
      letterSpacing: "{typography.letterSpacing.snug}"
      color: "{colors.text-primary}"
    h3:
      fontFamily: "{typography.fontFamilies.display}"
      fontSize: "{typography.scale.xl}"
      fontWeight: "{typography.fontWeights.semibold}"
      lineHeight: "{typography.lineHeights.snug}"
      letterSpacing: "{typography.letterSpacing.snug}"
      color: "{colors.text-primary}"
    h4:
      fontFamily: "{typography.fontFamilies.body}"
      fontSize: "{typography.scale.lg}"
      fontWeight: "{typography.fontWeights.semibold}"
      lineHeight: "{typography.lineHeights.snug}"
      color: "{colors.text-primary}"
    body:
      fontFamily: "{typography.fontFamilies.body}"
      fontSize: "{typography.scale.base}"
      fontWeight: "{typography.fontWeights.regular}"
      lineHeight: "{typography.lineHeights.normal}"
      color: "{colors.text-primary}"
    body-sm:
      fontFamily: "{typography.fontFamilies.body}"
      fontSize: "{typography.scale.sm}"
      lineHeight: "{typography.lineHeights.dense}"
      color: "{colors.text-muted}"
    caption:
      fontFamily: "{typography.fontFamilies.body}"
      fontSize: "{typography.scale.xs}"
      lineHeight: "{typography.lineHeights.normal}"
      color: "{colors.text-subtle}"
    stat:
      fontFamily: "{typography.fontFamilies.mono}"
      fontVariantNumeric: tabular-nums
      fontWeight: "{typography.fontWeights.medium}"
      color: "{colors.text-primary}"
    stat-xl:
      fontFamily: "{typography.fontFamilies.display}"
      fontVariantNumeric: tabular-nums
      fontSize: "{typography.scale.4xl}"
      fontWeight: "{typography.fontWeights.bold}"
      lineHeight: "{typography.lineHeights.tight}"
      letterSpacing: "{typography.letterSpacing.tight}"
      color: "{colors.text-primary}"
    mono:
      fontFamily: "{typography.fontFamilies.mono}"
      fontVariantNumeric: tabular-nums
      fontSize: "{typography.scale.sm}"
      color: "{colors.text-muted}"

spacing:
  # Spacing uses Tailwind's STOCK 4px scale — no custom keys.
  # p-0.5 = 2px · p-1 = 4px · p-2 = 8px · p-3 = 12px · p-4 = 16px · p-6 = 24px · p-8 = 32px …
  # Dense defaults: 8 / 12 / 16 dominate; 24 / 32 separate major regions.

rounded:
  # Sharp, technical radii — nothing pill-soft except avatars and toggle pills.
  xs: "2px" # chips, tags
  sm: "4px" # inputs, buttons
  md: "6px" # small cards
  lg: "8px" # cards, panels
  xl: "12px" # dialogs, sheets
  full: "999px" # avatars, toggle pills only

elevation:
  # Restrained — reserved for things that truly FLOAT (menus, popovers, dialogs,
  # toasts). Cards on dark use border-1 + surface step, NOT shadow.
  sm: "0 1px 2px rgba(0, 0, 0, 0.35)"
  md: "0 6px 18px rgba(0, 0, 0, 0.45)"
  lg: "0 18px 48px rgba(0, 0, 0, 0.55)"
  ring: "0 0 0 2px {colors.bg-0}, 0 0 0 4px {colors.primary}" # focus ring (2px offset)
  ring-glow: "0 0 0 1px {colors.primary-border}, 0 0 12px rgba(54, 197, 224, 0.25)" # input focus
  selected: "inset 2px 0 0 {colors.primary}" # GAP-09 table-row left-edge marker (inset box-shadow value)
  # GAP-09 fix: the marker consumed via Tailwind's `inset-shadow-(--var)` utility, which
  # PREPENDS its own `inset` keyword (`--tw-inset-shadow: inset var(--…)`). So the value here
  # carries NO `inset` keyword — `inset-shadow-(--shadow-selected-marker)` resolves to
  # `inset 2px 0 0 {primary}`. This puts the selected marker on the `--tw-inset-shadow` slot,
  # leaving `--tw-shadow` free for `row-focus`, so a selected+focused row composes BOTH
  # (`box-shadow: var(--tw-inset-shadow), …, var(--tw-shadow)`) — WCAG 2.4.7.
  selected-marker: "2px 0 0 {colors.primary}"
  row-focus: "inset 0 0 0 2px {colors.primary}" # GAP-10 table-row focus-within frame (inset, never clipped under the sticky header)

motion:
  # Fast and functional — animate transform/opacity ONLY (CLS = 0). No decorative motion.
  duration:
    fast: "120ms" # hover, press, focus
    base: "170ms" # most transitions
    slow: "260ms" # route / sheet transitions
  easing:
    out: "cubic-bezier(0.2, 0.7, 0.3, 1)" # most
    in-out: "cubic-bezier(0.5, 0, 0.3, 1)" # symmetric moves

layout:
  # The canonical breakpoint + container set is defined in the design-system skill
  # (references/design-system.md). Do NOT re-hardcode it elsewhere — change it there.
  container: "1760px" # data/page ceiling — fluid below, then centers (replaces old 1240)
  container-prose: "720px" # reading content (request flows, moderation comments, about/help)
  nav-h: "56px" # desktop top nav
  tabbar-h: "60px" # mobile bottom tab bar
  border-width: "1px"
  breakpoints:
    # Tailwind md/lg/xl/2xl kept; 3xl/4xl added. Design/review at 360·768·1024·1280·1920·2560.
    md: "768px" # tablet portrait
    lg: "1024px" # tablet landscape / small laptop
    xl: "1280px" # small desktop / laptop
    "2xl": "1536px" # Tailwind stock
    "3xl": "120rem" # 1920 — modal desktop (~54% of audience)
    "4xl": "160rem" # 2560 — large desktop / 2K
    # 3440 / 3840 ultrawide+4K: container caps at 1760 and centers (no extra breakpoint)

components:
  # ---- Buttons -------------------------------------------------------------
  button-primary:
    # type: roles.label-cased body · fontFamily body · fontWeight semibold (applied in code via typography.roles)
    backgroundColor: "{colors.primary}"
    textColor: "{colors.fg-on-accent}"
    rounded: "{rounded.sm}"
    hover:
      backgroundColor: "{colors.primary-hover}"
    active:
      backgroundColor: "{colors.primary-active}"
    focusVisible:
      boxShadow: "{elevation.ring}"
    disabled:
      backgroundColor: "{colors.surface-2}"
      textColor: "{colors.text-subtle}"
      opacity: 0.6
  button-secondary:
    # type: fontFamily body · fontWeight semibold (applied in code via typography.roles)
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-primary}"
    border: "1px solid {colors.border-1}"
    rounded: "{rounded.sm}"
    hover:
      backgroundColor: "{colors.surface-3}"
      border: "1px solid {colors.border-2}"
    active:
      backgroundColor: "{colors.surface-2}"
    focusVisible:
      boxShadow: "{elevation.ring}"
    disabled:
      textColor: "{colors.text-subtle}"
      opacity: 0.6
  button-ghost:
    # type: fontFamily body · fontWeight medium (applied in code via typography.roles)
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    hover:
      backgroundColor: "{colors.surface-1}"
      textColor: "{colors.text-primary}"
    active:
      backgroundColor: "{colors.surface-2}"
    focusVisible:
      boxShadow: "{elevation.ring}"
    disabled:
      textColor: "{colors.text-subtle}"
      opacity: 0.6

  # ---- Badges — outcome / status / freshness (icon + label, never color-alone) ----
  badge-outcome-win:
    # type: fontFamily body · fontSize scale.xs · fontWeight semibold (applied in code via typography.roles)
    backgroundColor: "{colors.win-weak}"
    textColor: "{colors.win}"
    border: "1px solid {colors.win-border}"
    rounded: "{rounded.xs}"
    icon: "trending-up" # Lucide; pair with label "W"
  badge-outcome-loss:
    # type: fontFamily body · fontSize scale.xs · fontWeight semibold (applied in code via typography.roles)
    backgroundColor: "{colors.loss-weak}"
    textColor: "{colors.loss}"
    border: "1px solid {colors.loss-border}"
    rounded: "{rounded.xs}"
    icon: "trending-down" # pair with label "L"
  badge-status-pending:
    # type: fontFamily body · fontSize scale.xs · fontWeight semibold (applied in code via typography.roles)
    backgroundColor: "{colors.info-weak}"
    textColor: "{colors.info}"
    border: "1px solid {colors.info-border}"
    rounded: "{rounded.xs}"
    icon: "clock"
  badge-status-approved:
    # type: fontFamily body · fontSize scale.xs · fontWeight semibold (applied in code via typography.roles)
    backgroundColor: "{colors.win-weak}"
    textColor: "{colors.win}"
    border: "1px solid {colors.win-border}"
    rounded: "{rounded.xs}"
    icon: "badge-check"
  badge-status-rejected:
    # type: fontFamily body · fontSize scale.xs · fontWeight semibold (applied in code via typography.roles)
    backgroundColor: "{colors.loss-weak}"
    textColor: "{colors.loss}"
    border: "1px solid {colors.loss-border}"
    rounded: "{rounded.xs}"
    icon: "x-circle"
  badge-freshness:
    # Live connection state. Vocabulary: Актуально / Данные устаревают / Связь потеряна / Переподключение.
    # type: fontFamily body · fontSize scale.xs · fontWeight medium (applied in code via typography.roles)
    rounded: "{rounded.full}"
    states:
      up-to-date: # «Актуально»
        backgroundColor: "{colors.win-weak}"
        textColor: "{colors.win}"
        border: "1px solid {colors.win-border}"
        icon: "circle" # filled dot
      stale: # «Данные устаревают»
        backgroundColor: "{colors.warn-weak}"
        textColor: "{colors.warn}"
        border: "1px solid {colors.warn-border}"
        icon: "circle-dot"
      offline: # «Связь потеряна»
        backgroundColor: "{colors.loss-weak}"
        textColor: "{colors.loss}"
        border: "1px solid {colors.loss-border}"
        icon: "wifi-off"
      reconnecting: # «Переподключение»
        backgroundColor: "{colors.info-weak}"
        textColor: "{colors.info}"
        border: "1px solid {colors.info-border}"
        icon: "refresh-cw" # spinning (respect prefers-reduced-motion)

  # ---- Card — border + surface step, no drop shadow ----
  card:
    backgroundColor: "{colors.surface-1}"
    border: "1px solid {colors.border-1}"
    rounded: "{rounded.lg}"
    hover:
      border: "1px solid {colors.border-2}" # interactive cards only
  card-prose:
    # maxWidth: layout.container-prose (720px reading width, applied in code)
    backgroundColor: "{colors.surface-1}"
    border: "1px solid {colors.border-1}"
    rounded: "{rounded.lg}"

  # ---- Table ----
  table-header:
    # type: roles.label · fontFamily body · fontSize scale.xs · fontWeight semibold · letterSpacing label (applied in code via typography.roles)
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-muted}"
    textTransform: uppercase
    borderBottom: "1px solid {colors.border-1}"
    position: sticky
  table-row:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-primary}"
    borderBottom: "1px solid {colors.border-1}"
    hover:
      backgroundColor: "{colors.surface-3}"
    selected:
      backgroundColor: "{colors.primary-weak}"
      boxShadow: "inset 2px 0 0 {colors.primary}" # left edge marker, not fill-only
  table-row-zebra:
    backgroundColor: "{colors.bg-1}" # optional alternate row tint
  table-cell-numeric:
    # type: roles.mono · fontFamily mono (applied in code via typography.roles)
    fontVariantNumeric: tabular-nums
    textAlign: right

  # ---- Stat tile (hero + mini-stat grid) ----
  stat-tile:
    backgroundColor: "{colors.surface-1}"
    border: "1px solid {colors.border-1}"
    rounded: "{rounded.md}"
    labelColor: "{colors.text-muted}" # uses label role
    # value type: roles.stat-xl · fontFamily display (applied in code via typography.roles)
    valueColor: "{colors.text-primary}"
    valueFontVariantNumeric: tabular-nums
    deltaPositiveColor: "{colors.win}" # signed delta, paired with trending-up icon
    deltaNegativeColor: "{colors.loss}" # paired with trending-down icon

  # ---- Data-trust components ----
  provenance-line:
    # «посчитано из N реплеев · <freshness> · Как считается» — always present under headline stats.
    # type: fontFamily body · fontSize scale.2xs (applied in code via typography.roles)
    textColor: "{colors.text-muted}"
    linkColor: "{colors.primary}"
    separator: "·"
  badge-known: # «Known» data-trust state
    # type: fontFamily body · fontSize scale.xs · fontWeight medium (applied in code via typography.roles)
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-muted}"
    border: "1px solid {colors.border-1}"
    rounded: "{rounded.xs}"
    icon: "circle-check"
  badge-unknown: # «Unknown» — literal word, amber, never 0 or — alone
    # type: fontFamily body · fontSize scale.xs · fontWeight semibold (applied in code via typography.roles)
    backgroundColor: "{colors.warn-weak}"
    textColor: "{colors.warn}"
    border: "1px solid {colors.warn-border}"
    rounded: "{rounded.xs}"
    icon: "circle-help"
  badge-conflict: # «Conflict» — amber + alert icon
    # type: fontFamily body · fontSize scale.xs · fontWeight semibold (applied in code via typography.roles)
    backgroundColor: "{colors.warn-weak}"
    textColor: "{colors.warn}"
    border: "1px solid {colors.warn-border}"
    rounded: "{rounded.xs}"
    icon: "triangle-alert"
  inline-review-row:
    # Quiet inline row inside a SteamID list for a pending merge — a workflow footnote, NOT a banner.
    # type: fontFamily body · fontSize scale.xs (applied in code via typography.roles)
    textColor: "{colors.warn}"
    backgroundColor: "transparent"
    icon: "triangle-alert" # «на проверке» + request link
    linkColor: "{colors.primary}"

  # ---- Inputs ----
  input:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
    placeholderColor: "{colors.text-subtle}"
    border: "1px solid {colors.border-1}"
    rounded: "{rounded.sm}"
    hover:
      border: "1px solid {colors.border-2}"
    focusVisible:
      border: "1px solid {colors.primary-border}"
      boxShadow: "{elevation.ring-glow}"
    disabled:
      backgroundColor: "{colors.surface-1}"
      textColor: "{colors.text-subtle}"
      opacity: 0.6

  # ---- Floating UI (uses shadow) ----
  dialog:
    backgroundColor: "{colors.surface-1}"
    border: "1px solid {colors.border-2}"
    rounded: "{rounded.xl}"
    boxShadow: "0 18px 48px rgba(0, 0, 0, 0.55)" # elevation.lg
    scrim: "{colors.overlay}"
  popover:
    backgroundColor: "{colors.surface-1}"
    border: "1px solid {colors.border-2}"
    rounded: "{rounded.lg}"
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.45)" # elevation.md
---

# SolidStats Design System

## Overview

SolidStats is the public statistics and moderation site for the **SolidGames** tactical-milsim
community. The UI is a **"tactical operations terminal"**: a gunmetal-ink command surface where
**data is the hero**. It is dense, dark-only, mobile-first, and bilingual (RU + EN). It must _feel
instant, stable, and trustworthy before it feels decorative_ — the product reports, it does not sell.

This file is the **single source of truth for design tokens**. The production Tailwind v4 `@theme`,
the W3C DTCG export, and any other token artifact are _generated_ from it — never hand-maintained in
parallel. Run the export as an explicit build step on every token change:

```bash
node scripts/gen-theme.mjs              # generates src/styles/theme.css (interim generator — a dumb copy of this file)
npx @google/design.md lint DESIGN.md    # structure + broken {token} refs + WCAG contrast (blocker)
npx @google/design.md diff DESIGN.md    # token drift between revisions
```

`@google/design.md` is used for `lint`/`diff` only; the official
`export --format css-tailwind` is the future migration target, but it currently drops
typography `line-height`, so `theme.css` is generated by `scripts/gen-theme.mjs` until that
exporter is fixed.

Add `--*: initial` to the emitted `@theme` so Tailwind's stock palette is removed and only the
SolidStats dark palette exists.

**Locked direction (do not regenerate):**

- **Dark-only** layered gunmetal surfaces — no light theme.
- **One** cyan signal accent, used sparingly so it stays meaningful.
- **Four** semantics (win / loss / unknown·conflict / info), each with `-weak` + `-border`, **never
  color-alone** (always icon and/or label).
- **Exo 2** display + **IBM Plex Sans** body + **IBM Plex Mono** tabular numerals (all carry Cyrillic).
- Sharp technical radii (2–12px), hairline borders as the primary separator, restrained shadows for
  floating UI only, fast functional motion.

## Colors

### Ink ramp (surfaces)

Neutrals are **blue-tinted gunmetal**, not pure gray. Surfaces step **up** in lightness as they come
forward — depth reads from the surface step + a hairline border, not from shadow.

| Token       | Hex                | Role                                             |
| ----------- | ------------------ | ------------------------------------------------ |
| `bg-0`      | `#0A0D13`          | app backdrop, deepest                            |
| `bg-1`      | `#0F131C`          | raised app background / sticky bars / zebra rows |
| `surface-1` | `#151A25`          | cards, panels (default content surface)          |
| `surface-2` | `#1B212F`          | table header, inputs, raised-in-card             |
| `surface-3` | `#232B3B`          | hover / active row                               |
| `overlay`   | `rgba(6,9,14,.66)` | dialog scrim                                     |

### Borders

Hairline `border-1` is the **primary structural separator** — this is a table/ops product, so
structure comes from 1px lines + surface steps, not heavy shadow. `border-2` frames focus-within and
emphasized panels.

| Token      | Hex       | Role                          |
| ---------- | --------- | ----------------------------- |
| `border-1` | `#262E3D` | hairline separators           |
| `border-2` | `#36415A` | stronger frame / focus-within |

### Text

| Token          | Hex       | Role                                | Contrast                                    |
| -------------- | --------- | ----------------------------------- | ------------------------------------------- |
| `text-primary` | `#EAEEF6` | primary copy, stat readouts         | 13.8–16.7:1 — **AA** everywhere             |
| `text-muted`   | `#98A2B6` | secondary / labels / column headers | 6.3–7.6:1 — **AA** everywhere               |
| `text-subtle`  | `#616B80` | tertiary / placeholder / disabled   | 3.25–3.63:1 — **AA-large/UI/disabled only** |
| `fg-on-accent` | `#04141A` | text on any saturated fill          | 9.1–9.5:1 on cyan / win — **AA**            |

> **`text-subtle` is NOT for body text.** At 3.25:1 on `surface-1` it passes WCAG 2.2 for large text
> (≥18.66px / ≥14px bold), UI-component boundaries, and the _disabled_ state (exempt from contrast),
> but **fails** the 4.5:1 normal-text rule. Use `text-muted` for any meaningful sentence; reserve
> `text-subtle` for placeholders, disabled controls, and decorative captions only.

### Primary — signal cyan

The single accent. It means **interactive / active / brand**: links, active nav, primary buttons,
focus rings, selected rows, sparkline strokes. Used sparingly so it stays meaningful. `#36C5E0`
clears AA on every surface (7.8–9.5:1).

| Token            | Value                  | Role                       |
| ---------------- | ---------------------- | -------------------------- |
| `primary`        | `#36C5E0`              | default interactive        |
| `primary-hover`  | `#2FB9D4`              | hover                      |
| `primary-active` | `#27A8C2`              | press                      |
| `primary-weak`   | `rgba(54,197,224,.13)` | selected-row / badge tint  |
| `primary-border` | `rgba(54,197,224,.40)` | tinted frame / input focus |

### Semantics

Green / red / amber / blue carry the palette range so the UI is never one-note. **Never color-alone**
— every semantic is paired with a Lucide icon and/or a text label. Each token clears AA on dark
(loss is the floor at 5.8:1 on `surface-1`).

| Token  | Hex       | Meaning                              | `-weak`                | `-border`              |
| ------ | --------- | ------------------------------------ | ---------------------- | ---------------------- |
| `win`  | `#3FCF8E` | win / positive delta / approved      | `rgba(63,207,142,.14)` | `rgba(63,207,142,.38)` |
| `loss` | `#FF5C6C` | loss / teamkill / danger / rejected  | `rgba(255,92,108,.14)` | `rgba(255,92,108,.38)` |
| `warn` | `#F2B33D` | unknown / conflict / warning / stale | `rgba(242,179,61,.15)` | `rgba(242,179,61,.40)` |
| `info` | `#5B9DFF` | info / pending / neutral notice      | `rgba(91,157,255,.14)` | `rgba(91,157,255,.38)` |

Data-viz ramp (`chart-1…5` + `grid-line`) is for sparklines and microcharts; `chart-1`/`chart-2`
reuse cyan/green so charts stay on-brand. Use `grid-line` (`rgba(255,255,255,.06)`) for axes, never
a hard border.

## Typography

Three families, all carrying full Cyrillic for the RU/EN interface:

- **Display — Exo 2** (aerospace/HUD grotesk): headings and big stat readouts, 600/700, tight tracking.
- **Body — IBM Plex Sans**: engineered, highly legible UI text.
- **Mono — IBM Plex Mono** with **tabular figures**: _all_ stats, ranks, IDs, slugs, timers,
  checksums — anywhere numbers must align.

The scale is px-based and dense (**14px is the UI default**, not 16px), ranging `2xs` 11px →
`5xl` 64px. Weights 400/500/600/700; line-heights 1.08 (display) / 1.25 (headings) / 1.35 (dense
tables) / 1.5 (body). Uppercase labels get `letterSpacing.label` (0.06em); brand/overline get
`letterSpacing.caps` (0.12em).

**Semantic roles** (`typography.roles.*`) are the named recipes to apply — `overline`, `label`, `h1`–`h4`,
`body`, `body-sm`, `caption`, `stat`, `stat-xl`, `mono`. Headings (`h1`–`h3`) are Exo 2; `h4`, body,
and captions are IBM Plex Sans; `stat`/`stat-xl`/`mono` are tabular. Numbers are right-aligned in
tables, signed for deltas (`+12`, `−3`), with explicit units.

## Layout

- **Spacing** uses **Tailwind's stock 4px scale** — no custom keys. `p-0.5`=2px, `p-1`=4px, `p-2`=8px,
  `p-4`=16px, `p-6`=24px, `p-8`=32px. Dense defaults: 8/12/16 dominate; 24/32 separate major regions.
- **Two containers.** `container` (data/page) = **1760px ceiling, fluid below** then centers — tables,
  leaderboards, stat grids, profiles spend the width. `container-prose` = **720px** — reading content
  (request flows, moderation comments, about/help), capped for line length. This **replaces** the
  seed's old `1240px` cap.
- **Reflow is container-driven** (`@container` / the `--container-*` scale), not viewport — the device
  frames make viewport media queries lie. Set `container-type: inline-size` on the content container.
- **Breakpoints** (canonical set; defined once in `references/design-system.md`, mirrored under
  `layout.breakpoints`): design and review at **360 · 768 · 1024 · 1280 · 1920 · 2560**, with 390/414
  mobile spot-checks and a 3440 ultrawide cap-check. Tailwind's `md`/`lg`/`xl`/`2xl` are kept; add
  `--breakpoint-3xl: 120rem` (1920) and `--breakpoint-4xl: 160rem` (2560). Large screens are
  first-class: ~54% of the PC-gamer audience sits at 1920 and ~40% are wider, so data surfaces use
  the width; ultrawide caps at 1760 + centers (turn extra width into rows/columns, not gutter).
- Chrome: desktop top nav (`nav-h` 56px); mobile bottom tab bar (`tabbar-h` 60px). Sticky table
  headers and filter toolbars. **Reserve space for all async content — CLS budget ≤ 0.02.**

## Elevation & Depth

Depth is communicated by the **surface step + hairline border first**, shadow second.

- **Cards on dark use `border-1` + a surface step — no drop shadow.**
- **Shadows are reserved for things that truly float:** menus, popovers (`elevation.md`), dialogs and
  toasts (`elevation.lg`). `elevation.sm` is a barely-there lift for sticky bars.
- **Focus** is always visible: `elevation.ring` (2px offset ring in cyan) on every interactive
  control; `elevation.ring-glow` for inputs.
- **Transparency** is purposeful only: `-weak` tints (13–15% alpha) for badge/row fills, the
  `overlay` scrim behind dialogs, and an optional subtle backdrop-blur on the sticky top nav / bottom
  tab bar. **Never blur content regions.**

## Shapes

Sharp, technical radii — `rounded.xs` 2px (chips) · `sm` 4px (inputs, buttons) · `md` 6px (small
cards) · `lg` 8px (cards, panels) · `xl` 12px (dialogs, sheets). `rounded.full` (avatars, toggle
pills) is the **only** pill-soft shape. Borders are `1px`. Icons are **Lucide outline, 2px stroke**,
`currentColor`, sized 16 (dense/inline) / 18–20 (buttons, nav) / 24 (section headers, empty states).

## Components

All recipes live under `components.*` and reference base tokens via `{colors.*}` / `{rounded.*}` /
`{typography.*}` / `{elevation.*}`.

- **Buttons** — `button-primary` (cyan fill, `fg-on-accent` text), `button-secondary` (surface +
  hairline), `button-ghost` (transparent). All carry hover / active (press = background shift, no
  positional translate) / focus-visible (ring) / disabled (`text-subtle` + 0.6 opacity). Every interactive control
  (button, link, icon-button, segmented / sort member, pager, tab) shows **`cursor-pointer`** — a
  deliberate product choice over the native `<button>` default-arrow; `disabled` keeps
  `pointer-events-none`, so a disabled control shows no pointer. The shared `Button` / `Link`
  `control` recipe is the single owner — cursor is never set per call-site.
- **Badges** — `badge-outcome-*` (win/loss with trending icon + W/L), `badge-status-*`
  (pending/approved/rejected), and `badge-freshness` with the four-state vocabulary
  **Актуально / Данные устаревают / Связь потеряна / Переподключение**. Every badge pairs color with
  a Lucide icon — never color-alone.
- **Card** — `card` (surface-1 + `border-1`, hover brightens to `border-2` for interactive cards);
  `card-prose` caps at the 720px reading width.
- **Table** — sticky uppercase `table-header` on `surface-2`; `table-row` with `surface-3` hover and
  a `selected` state that combines a `primary-weak` fill with an inset left-edge cyan marker (not
  fill-only); optional `table-row-zebra` on `bg-1`; numeric cells are right-aligned tabular mono.
- **Stat tile** — display-font value (tabular), `text-muted` label, signed delta colored
  win/loss and paired with a trending icon.
- **Data-trust components** — the trust layer is _systemic, always-present_, not a transient badge:
  - `provenance-line`: `посчитано из N реплеев · <freshness> · Как считается`, always under headline
    stats, with a cyan "how it's computed" link.
  - `badge-known` / `badge-unknown` / `badge-conflict`: the **Known / Unknown / Conflict** data-trust
    states. `Unknown` is the literal amber word with a `circle-help` icon — **never `0` or `—`
    alone**. `Conflict` is amber + `triangle-alert`.
  - `inline-review-row`: a pending SteamID merge is a **workflow footnote** — a quiet inline amber
    row (`на проверке` + request link) _inside_ the SteamID list it describes, **never** a filled
    banner pinned to the bottom of a stretched column.
- **Inputs** — `surface-2` fill, hairline border that brightens on hover and goes `primary-border` +
  `ring-glow` on focus.
- **Floating UI** — `dialog` (`rounded.xl` + `elevation.lg` + `overlay` scrim), `popover`
  (`rounded.lg` + `elevation.md`).

## Do's and Don'ts

**Do**

- Build depth from **surface steps + hairline borders**; reserve shadow for floating UI.
- Keep cyan **rare** — links, active state, primary action, focus, selected. If everything is cyan,
  nothing is.
- Show **`cursor-pointer`** on every interactive element (deliberate, over the native button
  default-arrow); a `disabled` control suppresses it via `pointer-events-none`.
- Pair **every** semantic color with a Lucide icon and/or label. Color is never the sole signal.
- Use **tabular mono** for every number that aligns (stats, ranks, IDs, timers); right-align numeric
  columns.
- Make data-trust first-class: provenance line, freshness pill, honest Known/Unknown/Conflict states.
- Spend large-screen width on **data** (rows/columns), keep reading content at the 720px prose width.
- Animate **`transform`/`opacity` only**, honor `prefers-reduced-motion`, hold the CLS ≤ 0.02 budget.
- i18n-key every string (RU + EN) and sanity-check the Russian for clipped or awkward wording.

**Don't**

- Don't add a light theme, decorative gradients, blobs, nested cards, or emoji-as-icons.
- Don't use `text-subtle` for body text (3.25:1 — fails AA for normal text).
- Don't render `Unknown` as `0` or `—`; don't dress a short-lived workflow event up as "the trust layer."
- Don't let a data table stretch past the 1760px ceiling on ultrawide — center it, or go master-detail.
- Don't introduce arbitrary Tailwind values or invent a custom spacing scale — stay on the stock 4px grid.
- Don't reach for shadow to separate cards, or animate layout properties (width/height/top/left/margin).
- Don't re-hardcode breakpoints or container widths elsewhere — they live in `references/design-system.md`.
