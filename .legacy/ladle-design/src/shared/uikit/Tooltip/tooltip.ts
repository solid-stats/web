// KIT-06 — the `tooltip` recipe (Plan 03-06, Wave 6). One `tv({ slots })` per Ark Tooltip
// anatomy part used (RESEARCH Don't-Hand-Roll; PATTERNS tv-recipe-per-part) — `className` per
// part, NEVER `asChild` for styling (RESEARCH Anti-Patterns). Same discipline as the Dialog/
// Popover/Menu/Tabs recipes: `/lite` merge-free, literal class strings the `@source` scan picks
// up even through the Portal (RESEARCH Pitfall 3), ONLY emitted `@theme` tokens, NO arbitrary
// values (styling.md).
//
// The tooltip content is a SMALL `surface-1` + `border-2` floating surface (03-UI-SPEC KIT-06 →
// Tooltip). It animates transform/opacity ONLY (CLS = 0, QUAL-04) and `motion-reduce:` DROPS the
// non-essential animation (a11y.md Targets & motion — `prefers-reduced-motion` honoured). Ark
// shows it on focus AS WELL AS hover (its default) and owns the open/close timing + aria.
//
// Slots:
//   positioner — the Ark floating-UI positioner wrapper (no paint); `z-modal` to layer above
//                the page chrome.
//   content    — the small floating surface: `surface-1` + `border-2` + `rounded-md` +
//                `--shadow-md`, tight padding, the small-print body type. Opacity + a small
//                scale-in (transform only); `motion-reduce:` drops it.
//
// MOTION POLICY (Plan 03-11, GAP-02): the SAME family mechanism as Dialog/Menu/Popover — the
// `.uikit-overlay-motion` keyframe-animation recipe (`styles/uikit.css`) driven by Ark's
// `[data-state]` — but on the FAST duration role via the `.uikit-overlay-motion-fast` modifier
// (`--duration-fast`, the small hover surface; the design Motion roles). Transform/opacity only
// (CLS = 0), dropped under `prefers-reduced-motion`. A CSS animation (not `transition` +
// `@starting-style`) because Ark mounts the content directly in `data-state="open"`.
//   arrow      — kept as the Ark anatomy slot but unpainted: a connector arrow's size/bg/border
//                are raw-literal CSS custom props that would breach no-arbitrary-values
//                (styling.md) — the Popover precedent ships none (YAGNI). Held empty so the
//                anatomy is complete without emitting an arbitrary value.
import { tv } from "tailwind-variants/lite";

export const tooltip = tv({
  slots: {
    positioner: "z-modal",
    content:
      "uikit-overlay-motion uikit-overlay-motion-fast max-w-xs rounded-md border border-border-2 bg-surface-1 px-2.5 py-1.5 font-body text-xs text-text-primary shadow-md focus-visible:outline-none",
    arrow: "",
  },
});
