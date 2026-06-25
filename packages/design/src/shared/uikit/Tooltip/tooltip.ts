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
//   arrow      — kept as the Ark anatomy slot but unpainted: a connector arrow's size/bg/border
//                are raw-literal CSS custom props that would breach no-arbitrary-values
//                (styling.md) — the Popover precedent ships none (YAGNI). Held empty so the
//                anatomy is complete without emitting an arbitrary value.
import { tv } from "tailwind-variants/lite";

export const tooltip = tv({
  slots: {
    positioner: "z-modal",
    content:
      "max-w-xs rounded-md border border-border-2 bg-surface-1 px-2.5 py-1.5 font-body text-xs text-text-primary shadow-md transition duration-150 focus-visible:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 motion-reduce:transition-none motion-reduce:data-[state=closed]:scale-100",
    arrow: "",
  },
});
