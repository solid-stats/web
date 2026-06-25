// KIT-06 — the `dialog` recipe (Plan 03-05, Wave 5). One `tv({ slots })` per Ark Dialog
// anatomy part used (RESEARCH Don't-Hand-Roll; PATTERNS tv-recipe-per-part) — `className`
// per part, NEVER `asChild` for styling (RESEARCH Anti-Patterns). Same discipline as
// `Select/select.ts` + `Button/control.ts`: `/lite` (the tailwind-merge-free build), literal
// class strings so Tailwind's static `@source` scan picks them up EVEN through the Portal
// (RESEARCH Pitfall 3 — the recipe lives under src/, so the literal classes ARE scanned;
// the carried_forward Phase-1 tree-shake lesson is the verify-in-browser check, not a
// source-scan gap), ONLY emitted `@theme` tokens, NO arbitrary values (styling.md).
//
// Animate transform/opacity ONLY (CLS = 0, QUAL-04 / styling.md) — never width/height; the
// open/close enter-exit is an opacity fade the backdrop + content share. `motion-reduce:`
// drops the non-essential animation (a11y.md Targets & motion).
//
// MOTION POLICY (Plan 03-11, GAP-02): the family shares ONE motion mechanism — the
// `.uikit-overlay-motion` keyframe-animation recipe in `styles/uikit.css`, driven by Ark's
// `[data-state]` (enter on `open`, exit on `closed`). It reads the @theme motion tokens
// (`--duration-base` / `--ease-out`), animates transform/opacity ONLY (CLS = 0), and the
// `prefers-reduced-motion: reduce` media query in that stylesheet DROPS the non-essential
// enter/exit. A CSS animation (not a Tailwind `transition` + `@starting-style`) is used because
// Ark mounts the content directly in `data-state="open"` (lazyMount + unmountOnExit), so the
// element's first resolved style is already the open frame — a `transition` needs a cross-frame
// property delta to fire and `@starting-style` did not run in this Ark/Chromium matrix, whereas a
// CSS animation runs as soon as its rule first applies to the connected element. The backdrop
// scrim uses the opacity-only `.uikit-overlay-backdrop-motion` sibling (scaling a full-viewport
// scrim is meaningless). See the long rationale in `styles/uikit.css`.
//
// Slots:
//   backdrop   — the fixed full-viewport overlay scrim (`bg-overlay`, the dark-trust scrim
//                token theme.css#L28); fades in/out on opacity only.
//   positioner — the Ark floating-UI centering wrapper (no paint of its own); fixed inset-0,
//                flex-centered, padded so the content never touches the viewport edge.
//   content    — the modal surface: `surface-1` + `border-2` hairline + `rounded-xl` +
//                `--shadow-lg` (the elevated-overlay shadow, theme.css#L112). `z-modal` so it
//                layers above the page chrome. Opacity + a small scale-in (transform only).
//   title      — the dialog-title typography role (18px / 600 semibold, 03-UI-SPEC Typography).
//   body       — the dialog body region (muted secondary text, comfortable measure).
//   close      — the icon-only close affordance (Lucide X). ≥44px (`min-h-11 min-w-11`,
//                a11y.md 2.5.5) with the canonical focus ring; its accessible NAME is the
//                injected `closeAria` prop (the slice never invents copy).
import { tv } from "tailwind-variants/lite";

export const dialog = tv({
  slots: {
    backdrop: "uikit-overlay-backdrop-motion fixed inset-0 z-modal bg-overlay",
    positioner: "fixed inset-0 z-modal flex items-center justify-center p-4",
    content:
      "uikit-overlay-motion flex w-full max-w-md flex-col gap-4 rounded-xl border border-border-2 bg-surface-1 p-6 shadow-lg focus-visible:outline-none",
    title: "font-body text-lg font-semibold leading-snug text-text-primary",
    body: "font-body text-sm text-text-muted",
    close:
      "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center self-end rounded-sm text-text-muted transition-colors hover:bg-surface-3 hover:text-text-primary focus-visible:shadow-(--shadow-ring) focus-visible:outline-none",
  },
});
