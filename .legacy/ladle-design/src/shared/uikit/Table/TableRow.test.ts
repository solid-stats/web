// GAP-20 — pure-logic sync test for the `<TableRow>` catalog forced-state mirror
// (vitest = pure logic only, no DOM — solidstats-frontend-react-tests). The row has its
// OWN `tv()` recipe (not the shared Button/Link `control`), so it carries its own forced
// map; this test pins that map against the live recipe so a later drift (a changed hover
// fill, a re-introduced fake `pressed`, a moved focus ring) fails HERE instead of shipping
// a fake catalog cell that misrepresents the real `:hover`/`:has(:focus-visible)` (the GAP-20
// defect: a variant-agnostic forced override lost to the base by stylesheet order under the
// merge-free `/lite` build).
import { describe, expect, test } from "vitest";
import { ROW_FOCUS, ROW_FORCED_STATE, row } from "./TableRow";

// The pseudo-prefixed utilities the recipe applies live for a given prefix, prefix dropped.
const pseudo = (cls: string, prefix: string): string[] =>
  cls
    .split(/\s+/)
    .filter((c) => c.startsWith(`${prefix}:`))
    .map((c) => c.slice(prefix.length + 1))
    .sort();

// The forced cell's utilities, the `!`-important suffix dropped (the catalog adds `!` so the
// override deterministically wins in the merge-free build).
const forced = (s: string): string[] =>
  s
    .split(/\s+/)
    .filter(Boolean)
    .map((c) => c.replace(/!$/, ""))
    .sort();

describe("TableRow — the catalog forced-state mirror stays in sync with the recipe", () => {
  test("forced `hover` mirrors the recipe's live `hover:` fill (GAP-20)", () => {
    expect(forced(ROW_FORCED_STATE.hover)).toEqual(pseudo(row(), "hover"));
  });

  test("forced `focused` mirrors the live `:has(:focus-visible)` lift + inset ring", () => {
    // The live `has-[:focus-visible]:` utilities and `ROW_FOCUS` (the exported source of truth
    // the recipe composes) describe the SAME treatment — the forced cell mirrors both.
    expect(forced(ROW_FORCED_STATE.focused)).toEqual(pseudo(row(), "has-[:focus-visible]"));
    expect(forced(ROW_FORCED_STATE.focused)).toEqual(forced(ROW_FOCUS));
  });

  test("forced `pressed` is empty — the row has no `:active` press treatment", () => {
    // The whole-row click delegates to the name anchor; the `<tr>` carries no `active:`
    // utility, so a faithful mirror is empty (NOT the old invented `bg-surface-2`).
    expect(forced(ROW_FORCED_STATE.pressed)).toEqual([]);
    expect(pseudo(row(), "active")).toEqual([]);
  });

  test("every non-empty forced state carries the `!`-important suffix (merge-free override)", () => {
    for (const state of ["hover", "focused"] as const) {
      for (const cls of ROW_FORCED_STATE[state].split(/\s+/).filter(Boolean)) {
        expect(cls.endsWith("!"), `${cls} must be !-important`).toBe(true);
      }
    }
  });

  test("the selected row pairs the primary-weak fill with the inset left-edge marker (never fill-only)", () => {
    const cls = row({ selected: true });
    expect(cls).toContain("bg-primary-weak");
    expect(cls).toContain("inset-shadow-(--shadow-selected-marker)");
  });

  test("a disabled row is non-interactive and dimmed", () => {
    const cls = row({ disabled: true });
    expect(cls).toContain("pointer-events-none");
    expect(cls).toContain("opacity-60");
  });
});
