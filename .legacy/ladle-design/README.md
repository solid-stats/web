# Legacy Ladle Design Archive

This directory preserves the former `packages/design` workspace after the repo moved away from the
package-based design milestone.

Status:

- read-only reference for the old Ladle UIKIT and public-stats surface work;
- not part of the active package manager workspace;
- not part of `pnpm check`;
- not a source to port directly into production routes.

Use it only to recover proven UIKIT ideas, component APIs, fixtures, or test patterns when the real
app implementation needs a component isolation harness. Future Ladle work is UIKIT-only and must be
reintroduced deliberately into the active root app structure.

Active design work now lives in `.visual-prototypes/`. Active implementation work starts from an
accepted visual prototype `SUMMARY.md` and belongs in the root app source.
