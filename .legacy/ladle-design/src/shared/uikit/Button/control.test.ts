// GAP-19 — pure-logic contract test for the shared `control` recipe behind
// Button/Link (vitest = pure logic only, no DOM — solidstats-frontend-react-tests).
// The recipe is the single source of the ≥44px hit area + the ONE canonical focus
// ring + the per-variant token utilities; this test pins that contract so a later
// drift (a re-introduced `focus-visible:outline-*` ring, a dropped `min-h-11`, or a
// wrong variant token) fails here instead of shipping.
import { describe, expect, test } from "vitest";
import { control, FORCED_STATE } from "./control";

describe("control recipe — the shared Button/Link base", () => {
  test("every variant carries min-h-11 (the non-negotiable ≥44px floor, a11y 2.5.5)", () => {
    for (const variant of ["primary", "secondary", "ghost", "segment"] as const) {
      for (const size of ["sm", "md"] as const) {
        expect(control({ variant, size })).toContain("min-h-11");
      }
    }
  });

  test("every variant carries the ONE canonical focus ring — shadow-(--shadow-ring)", () => {
    for (const variant of ["primary", "secondary", "ghost", "segment"] as const) {
      const cls = control({ variant });
      expect(cls).toContain("focus-visible:outline-none");
      expect(cls).toContain("focus-visible:shadow-(--shadow-ring)");
    }
  });

  test("NO drift ring — never the Toast/ProvenanceLine outline ring (GAP-19 symptom)", () => {
    for (const variant of ["primary", "secondary", "ghost", "segment"] as const) {
      const cls = control({ variant });
      expect(cls).not.toContain("focus-visible:outline-2");
      expect(cls).not.toContain("outline-primary");
    }
  });

  test("primary resolves the DESIGN.md button-primary recipe tokens", () => {
    const cls = control({ variant: "primary" });
    expect(cls).toContain("bg-primary");
    expect(cls).toContain("text-fg-on-accent");
    expect(cls).toContain("hover:bg-primary-hover");
    expect(cls).toContain("active:bg-primary-active");
  });

  test("secondary resolves the DESIGN.md button-secondary recipe tokens", () => {
    const cls = control({ variant: "secondary" });
    expect(cls).toContain("bg-surface-1");
    expect(cls).toContain("text-text-primary");
    expect(cls).toContain("border-border-1");
    expect(cls).toContain("hover:bg-surface-3");
    expect(cls).toContain("hover:border-border-2");
    expect(cls).toContain("active:bg-surface-2");
  });

  test("ghost resolves the DESIGN.md button-ghost recipe tokens", () => {
    const cls = control({ variant: "ghost" });
    expect(cls).toContain("bg-transparent");
    expect(cls).toContain("text-text-muted");
    expect(cls).toContain("hover:bg-surface-1");
    expect(cls).toContain("hover:text-text-primary");
    expect(cls).toContain("active:bg-surface-2");
  });

  test("segment is the muted sort-header member; active=true paints it cyan", () => {
    const resting = control({ variant: "segment" });
    expect(resting).toContain("text-text-muted");
    expect(resting).toContain("hover:text-text-primary");

    const active = control({ variant: "segment", active: true });
    expect(active).toContain("text-primary");
  });

  test("disabled is the shared non-interactive treatment", () => {
    const cls = control({ variant: "primary", disabled: true });
    expect(cls).toContain("pointer-events-none");
    expect(cls).toContain("opacity-60");
  });

  test("the base shape is shared across Button + Link (one rounded/flex recipe)", () => {
    const cls = control({ variant: "primary" });
    expect(cls).toContain("inline-flex");
    expect(cls).toContain("rounded-sm");
    expect(cls).toContain("font-semibold");
  });

  test("no variant applies a press translate (the 1px depress was removed for consistency)", () => {
    for (const variant of ["primary", "secondary", "ghost", "segment"] as const) {
      expect(control({ variant })).not.toContain("translate-y");
    }
  });

  // The catalog StateMatrix forces states via FORCED_STATE; it must equal the live
  // recipe's hover:/active:/focus-visible: utilities, or the catalog cells lie (the
  // GAP-19 follow-up bug: a variant-agnostic forced map showed primary "hover" as grey).
  test("FORCED_STATE mirrors the live recipe per variant (catalog cells can't drift)", () => {
    const pseudo = (cls: string, prefix: string): string[] =>
      cls
        .split(/\s+/)
        .filter((c) => c.startsWith(`${prefix}:`))
        .map((c) => c.slice(prefix.length + 1))
        .sort();
    const forced = (s: string): string[] =>
      s
        .split(/\s+/)
        .filter(Boolean)
        .map((c) => c.replace(/!$/, ""))
        .sort();

    for (const variant of ["primary", "secondary", "ghost", "segment"] as const) {
      const cls = control({ variant });
      const f = FORCED_STATE[variant];
      expect(forced(f.hover)).toEqual(pseudo(cls, "hover"));
      expect(forced(f.pressed)).toEqual(pseudo(cls, "active"));
      expect(forced(f.focused)).toEqual(pseudo(cls, "focus-visible"));
    }
  });
});
