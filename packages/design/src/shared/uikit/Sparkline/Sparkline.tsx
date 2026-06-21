// Sparkline (KIT-03, D-03) — a dependency-free weekly-trend microchart. NO
// recharts / visx / d3 (a second charting lib would import a second color system
// and break CLS). The chart is plain DOM bars (`<span>`) inside a FIXED-height
// flex row: each bar's height is a computed `%` set via inline `style` — the
// sanctioned dynamic-dimension escape hatch (styling.md: "a genuine escape hatch …
// a dynamic computed value"), NOT a themable value. The bar FILL is always a token
// class (the tier-mapped semantic token), held literal so the Tailwind v4
// `@source` scan emits it — never an inline hex.
//
// Accessibility (a11y.md charts rule): the chart bars are decorative
// (`aria-hidden`), and an `sr-only` `<figcaption>` inside the `<figure>` carries
// the value summary so screen readers get the data without the color. The mount
// grow is a `transform: scaleY` (origin-bottom) under `motion-safe:` only —
// transform/opacity, never layout — and is dropped under `motion-reduce:`. The
// fixed `h-10` wrapper → CLS = 0 across every data-volume state (empty/few/many).
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { tv } from "tailwind-variants/lite";
import { type Baseline, type TierLevel, type TierPeriod, tierFor } from "../_fixtures";

// Each bar is colored by ITS OWN score tier (same rule as the Overview trend):
// ascending quality loss → warn → info → win. Literal so the @source scan emits it.
const bar = tv({
  base: "min-w-1 flex-1 origin-bottom rounded-xs motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-reduce:transition-none",
  variants: {
    level: {
      low: "bg-loss",
      base: "bg-warn",
      good: "bg-info",
      elite: "bg-win",
    } satisfies Record<TierLevel, string>,
    grown: {
      // Mount grow: scaleY 0 → 1 (transform only, origin-bottom). Under reduced
      // motion the transition is off so it appears already grown — no layout shift.
      true: "scale-y-100",
      false: "scale-y-0",
    },
  },
});

type Props = {
  className?: string;
  /** The weekly value series (most recent last). Empty renders a flat baseline. */
  values: readonly number[];
  /** Population baseline — passed EXPLICITLY (D-04) so each bar derives its tier. */
  baseline: Baseline;
  /** Active period of the baseline (rotation by default). */
  period?: TierPeriod;
  /** Pre-formatted accessible summary (RU/EN) read by screen readers. */
  summary: string;
};

/** Minimum visible bar height (%) so a near-zero week is still a visible nub. */
const MIN_BAR_PCT = 8;

export function Sparkline({ className, values, baseline, period = "rotation", summary }: Props): ReactNode {
  // One-shot mount grow: render at scaleY 0 on first paint, flip to 1 after mount
  // so the bars grow up. SSR-safe (server emits grown=false; client grows once).
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    setGrown(true);
  }, []);

  // Scale every bar against the series max (floored at 1 so an all-zero series is flat).
  const max = Math.max(...values, 1);

  return (
    <figure className={`m-0 ${className ?? ""}`} data-sparkline={String(values.length)}>
      {/* The visual bars are decorative (aria-hidden); the data reaches a screen
          reader through the sibling figcaption — never via color. The fixed h-10
          row holds the layout across every data-volume state (CLS = 0). */}
      <div className="flex h-10 items-end gap-0.5" aria-hidden="true">
        {values.length === 0 ? (
          // Empty: a single flat baseline bar holds the fixed height (no collapse, CLS 0).
          <span className="h-px w-full rounded-xs bg-border-2" data-sparkline-empty />
        ) : (
          values.map((value, i) => {
            const pct = Math.max((Math.max(value, 0) / max) * 100, MIN_BAR_PCT);
            const level = tierFor("score", value, baseline, period).level;
            // Inline style is the sanctioned computed-dimension escape (height %),
            // NOT a themable token; the fill stays a token class via `bar({ level })`.
            const style: CSSProperties = { height: `${pct.toFixed(2)}%` };
            return <span key={i} className={bar({ level, grown })} style={style} data-bar={level} />;
          })
        )}
      </div>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}
