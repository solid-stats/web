// KIT-06 — the `tabs` recipe (Plan 03-06, Wave 6). One `tv({ slots })` per Ark Tabs anatomy
// part used (RESEARCH Don't-Hand-Roll; PATTERNS tv-recipe-per-part) — `className` per part,
// NEVER `asChild` for styling (RESEARCH Anti-Patterns). Same discipline as the Dialog/Popover/
// Menu recipes: `/lite` merge-free, literal class strings the `@source` scan picks up, ONLY
// emitted `@theme` tokens, NO arbitrary values (styling.md).
//
// Tabs keyboard model is Ark's (arrow-key roving tabindex, Home/End, the panel aria-association)
// — the recipe only paints. The active trigger is cyan (`text-primary`) PAIRED with a STRUCTURAL
// marker: a `border-b-2 border-primary` underline on the selected trigger (`data-[selected]`) so
// selection is NEVER color-alone (a11y.md; 03-UI-SPEC KIT-06). Every trigger carries the
// canonical focus ring (`focus-visible:shadow-(--shadow-ring)`) so the focused tab is visible and
// — because the ring paints on the trigger's own box — never obscured under a sticky bar (WCAG
// 2.4.12, the Table GAP-10 inset-ring rationale).
//
// Slots:
//   list      — the tablist row: a `border-b` baseline the active underline sits flush against,
//               a small inter-tab gap; `cursor-pointer` is on the trigger (the interactive part).
//   trigger   — a ≥44px tab (`min-h-11`, a11y.md 2.5.5): muted resting text, the canonical ring,
//               and the active state (`data-[selected]`) → cyan text + a `border-primary`
//               underline (the structural marker pairing the cyan — never color-alone).
//   indicator — the optional Ark sliding indicator wrapper (no paint of its own here; the
//               per-trigger underline is the selection marker — kept for the Ark anatomy slot).
//   content   — the tab panel region: comfortable padding, muted body text, the canonical ring
//               if the panel itself is focusable.
import { tv } from "tailwind-variants/lite";

export const tabs = tv({
  slots: {
    list: "flex items-stretch gap-1 border-b border-border-2",
    trigger:
      "inline-flex min-h-11 cursor-pointer items-center border-b-2 border-transparent px-4 font-body text-sm font-semibold text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:shadow-(--shadow-ring) data-[selected]:border-primary data-[selected]:text-primary",
    indicator: "bg-primary",
    content:
      "py-4 font-body text-sm text-text-muted focus-visible:outline-none focus-visible:shadow-(--shadow-ring)",
  },
});
