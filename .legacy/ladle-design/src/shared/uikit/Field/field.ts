// KIT-05 — the `Field` wrapper recipe (Plan 03-02, Wave 2). One `tv({ slots })` per Ark
// `Field` anatomy part used (RESEARCH Pattern 2; PATTERNS tv-recipe-per-part) — the
// part-based shape Ark v5 wants (each anatomy part takes a `className`), mirroring
// `Button/control.ts`'s discipline: `/lite` (the tailwind-merge-free build), literal class
// strings so Tailwind's static `@source` scan picks them up, ONLY emitted `@theme` tokens,
// NO arbitrary values (styling.md).
//
// Slots:
//   root       — the field group container (vertical label↔control↔message rhythm, gap-2 = 8px)
//   label      — the visible <label> in the UI-SPEC `label` typography role (12px / 600 /
//                uppercase / tracking-label) (03-UI-SPEC Typography)
//   requiredMarker — the visible required affordance appended to a required field's label: the
//                `*` glyph (a SHAPE, not colour) tinted `text-loss`, PAIRED with visually-hidden
//                "required" text (a11y.md — never the asterisk in colour alone) (GAP-07).
//   helperText — secondary caption copy in `text-text-muted`
//   errorText  — the announced error row: `text-loss` PAIRED with the Lucide icon (color is
//                never the only carrier — a11y.md Structure & contrast); inline-flex so the
//                icon + message sit on one row.
import { tv } from "tailwind-variants/lite";

export const field = tv({
  slots: {
    root: "flex flex-col gap-2",
    label:
      "font-body text-xs font-semibold uppercase tracking-label text-text-muted data-[disabled]:text-text-subtle",
    requiredMarker: "ml-1 text-loss",
    helperText: "font-body text-xs text-text-muted",
    errorText: "inline-flex items-center gap-1.5 font-body text-xs text-loss",
  },
});
