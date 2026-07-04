# Toolchain Resolution — WS-05 Lint / Format / Type-Check Gate

Resolves the D-03 decision and RESEARCH A1 / Pitfall 4 open question: the exact package
and command behind the WS-05 "green across the workspace" gate. Plan 05 wires the resolved
command into the root `check` script.

## Resolved Gate Command

```
vp check
```

Run at the workspace root via the `vite-plus` binary (`pnpm exec vp check`, or
`node_modules/.bin/vp check`). `vp check` runs **format, lint, and type checks** in one pass
(Vite+ wraps Oxfmt + Oxlint + tsgo — the D-03 primitives).

**Path chosen:** Vite+ `vp check` (the primary D-03 path), NOT the primitive contingency.

## Why this path (not the contingency)

- `vite-plus` is the confirmed official package: repo `github.com/voidzero-dev/vite-plus`
  (voidzero is the Vite org), ~648K weekly downloads, no postinstall hook.
- `gsd-tools query package-legitimacy check --ecosystem npm vite-plus` returned only the
  `too-new` flag (published 2026-06-18) — i.e. a legitimate current release, not a
  squat/typo. Trust boundary **T-1-03 satisfied**.
- Installed as a root dev-dep: `pnpm add -Dw vite-plus` (resolved `vite-plus@^0.2.1`),
  under Node 25.9.0.
- `vp check` **runs at the root with exit 0** this session — it reported formatting findings
  (which is fine; WS-05 only requires it to RUN here, and plan 05 makes it pass). The
  `vp` binary exposes `check` (confirmed via `vp --help`), so the contingency was not needed.

## Notes for plan 05 (wiring the gate)

- **Scope `vp check`.** With no `vite.config` yet (arrives in plan 04), `vp check` scans the
  whole tree including the vendored `.agents/skills/**` markdown and flagged formatting in
  those files. Plan 05 must scope the gate to project source (e.g. ignore `.agents/`,
  `.planning/`, `.design/`) so WS-05 reflects our code, not vendored skill docs.
- **No allowBuilds flip was required.** `vp` ran without enabling any of the
  `@swc/core` / `esbuild` / `msw` native builds currently pinned `false` in
  `pnpm-workspace.yaml`. Leave that block untouched unless a later phase needs the artifact.
- Replace the current placeholder root `check` (`pnpm gen-theme && pnpm lint:design`) by
  composing `vp check` into it, keeping `gen-theme` + `design.md lint` as design-system
  gates alongside the code gate.

## Contingency (recorded, NOT used)

If a future `vite-plus` release drops `vp check` or hard-requires an unavailable config,
fall back per D-03 to the wrapped primitives:

```
oxlint && oxfmt --check . && tsgo --noEmit
```

(install `oxlint`, the current Oxfmt package, and `@typescript/native-preview` for `tsgo`).
This path was verified as available in principle but is not the wired gate.
