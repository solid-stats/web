# `.design/` — FROZEN reference archive

> **Status: frozen (D-11).** Everything in this directory is **visual / historical
> reference only**, with two exceptions that stay **live and authoritative**:
> `CLAUDE.md` and `MIGRATION.md` (see below). Nothing here is portable code.

## Canonical source of truth

The design system's single source of truth is the **repo-root [`/DESIGN.md`](../DESIGN.md)**
(token system, YAML front-matter). It is regenerated into the importable Tailwind v4
`@theme` at `packages/design/src/styles/theme.css` by **[`scripts/gen-theme.mjs`](../scripts/gen-theme.mjs)**.

- `theme.css` is a **pure build output** — never hand-edited. Any token change goes in
  `/DESIGN.md`, then `pnpm gen-theme` regenerates it (the `pnpm check` gate fails on drift).
- The durable component catalog (UIKIT, surfaces) is built natively on the real stack
  inside `packages/design` as colocated Ladle stories — **not** from anything in here.

## What is frozen reference (never ported)

These are the output of Claude Design (`@google/design.md`) on a **fake stack** (plain CSS
on the `support.js` canvas harness — not TanStack / Tailwind / Ark). They are kept as
**visual reference only**; every surface is rebuilt natively (spec → Ladle → route) in GSD
phases (MIGRATION.md D1/D2). Do **not** copy any `*.jsx` or wireframe into `packages/`.

| Path | What it is |
|------|------------|
| `hifi/` | Hi-fi surface mockups (`*.jsx` + plain CSS): Overview, Players, Player, Squads, Trust sketches. Fake-stack reference. |
| `wireframes/` | Low-fi wireframes (`*.jsx`). Reference. |
| `_ds/` | The generated design-system seed bundle. Reference. |
| `app/` | Canvas-harness app shell. Reference. |
| `screenshots/`, `uploads/`, `export/` | Captured images / exports (gitignored heavy artifacts). Reference. |
| `support.js` | The Claude Design canvas runtime (fake stack). Reference. |

The dead `--container: 1240` token survives **only** here (frozen) — `/DESIGN.md` supersedes
it with the `--container` 1760 ceiling + `--container-prose` 720. Nothing live sources it.

## What stays LIVE and authoritative

- **`CLAUDE.md`** — the running per-surface companion notes and the domain-truth home
  (Score / K-D formulas, `SS_BASELINE` population tiers, the list loading model, the
  data-trust A/C-not-B model). Every downstream design phase inherits these rules; keep it
  actively updated.
- **`MIGRATION.md`** — the migration decision pack (`.design/` → real-stack workspace).

These two files are the contract; do not freeze, move, or treat them as reference.
