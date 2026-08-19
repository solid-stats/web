# `.visual-prototypes/` — prototype documents

This is the local document workspace for the global `design` prototype workflow. The visual
artifact itself lives in the Penpot `App Design` file
(`5954a801-37cf-8094-8008-81f63a8ba3d3`).

Use one directory per slice:

```text
<slice-id>/
  BRIEF.md
  ITERATIONS.md
  SUMMARY.md
  fixtures/        # optional representative data
```

Do not store prototype HTML, JSX, source code, or screenshots here. Build and review the screens in
Penpot. Each application page has its own Penpot page; state, breakpoint, role, and flow variants
are boards on that page. Assemble screens from connected `SolidStats UIKit` component instances
and token references, never detached copies or ad hoc visual values.

## Inputs

- repo-root `DESIGN.md` and generated `src/styles/theme.css`;
- Penpot `SolidStats UIKit` (`3be9e5e1-190f-8090-8008-724cff55ab11`);
- real `server-2` OpenAPI fields and representative replay-derived data;
- signed-out visitor, player, moderator, and admin roles;
- data-trust states, RU/EN copy, long labels, and min/max data volumes;
- `.design/` and `.legacy/ladle-design/` only as frozen historical reference.

## Graduation

Production implementation starts only after the slice has an accepted `SUMMARY.md`. Keep the full
handoff in that file and also file its accepted summary in the SolidStats MemPalace `design` room.
The implementation stage then converts it into the global implementation surface spec plus the
SolidStats overlay.
