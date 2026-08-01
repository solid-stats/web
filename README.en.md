# web

[Русский](README.md) · **English**

Browser UI for **Solid Stats** — game statistics for the
[Solid Games](https://sg.zone) community (ArmA 3). Public stats pages, Steam
sign-in, the UX for authenticated actions, and the moderator and admin screens.
A React application on TanStack Start with server-side rendering.

Part of a multi-repo platform: the source of truth and HTTP API live in
`server-2`, raw replay discovery in `replays-fetcher`, OCAP parsing in
`replay-parser-2`, runtime and operations in `infrastructure`. web is the
platform's storefront: it owns only the UI and UI state, talks to the backend
exclusively through the typed API client generated from the `server-2` OpenAPI
schema, and never touches the database or S3 directly.

> Solid Stats is built end to end by AI agents following the
> [GSD](https://github.com/open-gsd/gsd-core) process. Development outside GSD is
> outside the process.

## Quick start

The TanStack Start app is not scaffolded yet — the repo currently holds only the design-token
toolchain and planning/design artifacts.

```sh
pnpm install
pnpm run gen-theme   # DESIGN.md -> src/styles/theme.css
pnpm run check       # gen-theme + design.md lint + vp check
```

Once app development starts, a running `server-2` will be required: web consumes its HTTP API, and
the client types are generated from its OpenAPI schema. Run the repository's verification gate
before committing.

## Documentation

- `AGENTS.md` — what the repo is, its ownership boundary, and the conventions for
  agents.
- Product briefs and plans live in the central `plans` repo (`plans/web/`);
  operational GSD state lives in `.planning/`.

## Stack

TypeScript · React · TanStack Start (Router · Query · Table · Form) · Ark UI ·
Tailwind CSS v4 · openapi-typescript · `/ru` and `/en` localization

## License — MIT
