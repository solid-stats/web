// StatTile (KIT-03) — the hero stat tile: a `label` (text-muted) over a `stat-xl`
// tabular-mono value (Exo 2, 48px, text-primary), with an optional signed delta
// colored win/loss and ALWAYS paired with a `trending-up`/`trending-down` Lucide
// icon — meaning is never carried by color alone (a11y.md). Recipe `stat-tile`
// (DESIGN.md L394): surface-1 + border-1 + rounded-md. The tile reserves stable
// dimensions (CLS = 0); its loading placeholder is the KIT-07 `Skeleton` "tile"
// variant, which reserves the identical box.
//
// The `stat-xl` / `label` typography roles are applied in code (DESIGN.md
// "applied in code via typography.roles") since the generator does not emit them
// as `text-*` utilities: stat-xl = font-display + text-4xl + font-bold +
// tabular-nums + tracking-tight; label = text-2xs uppercase tracking-label muted.
//
// Class strings stay literal inside `tv()` so the Tailwind v4 `@source ../src`
// scan emits them; `/lite` is the tailwind-merge-free build (Badge precedent).
import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { tv } from "tailwind-variants/lite";

/** Sign of the delta — drives both the color recipe and the trend icon (never color-alone). */
type DeltaSign = "up" | "down";

type Props = {
  className?: string;
  /** Metric name (e.g. «Счёт», «K/D»), rendered in the muted label role. */
  label: string;
  /** The already-formatted hero value (tabular mono); the caller formats it (e.g. `4.13`). */
  value: string;
  /**
   * Optional signed delta vs. the prior period. The sign drives the win/loss color
   * AND the paired trend icon; the formatted text (e.g. `+0.4`) is shown verbatim.
   */
  delta?: {
    readonly sign: DeltaSign;
    readonly text: string;
  };
};

const deltaTv = tv({
  base: "inline-flex items-center gap-0.5 font-mono text-sm font-medium tabular-nums",
  variants: {
    sign: {
      up: "text-win",
      down: "text-loss",
    },
  },
});

const DELTA_ICON = {
  up: TrendingUp,
  down: TrendingDown,
} as const;

export function StatTile({ className, label, value, delta }: Props): ReactNode {
  const DeltaIcon = delta === undefined ? null : DELTA_ICON[delta.sign];

  return (
    <div
      className={`flex flex-col gap-1 rounded-md border border-border-1 bg-surface-1 p-4 ${className ?? ""}`}
      data-stat-tile
    >
      <span className="font-body text-2xs font-semibold uppercase tracking-label text-text-muted">
        {label}
      </span>
      <span className="font-display text-4xl font-bold tabular-nums tracking-tight text-text-primary">
        {value}
      </span>
      {delta === undefined || DeltaIcon === null ? null : (
        <span className={deltaTv({ sign: delta.sign })}>
          <DeltaIcon className="size-4" aria-hidden />
          {delta.text}
        </span>
      )}
    </div>
  );
}
