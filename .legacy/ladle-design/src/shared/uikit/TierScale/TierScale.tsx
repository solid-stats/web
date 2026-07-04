// TierScale (KIT-03) — the zone scale showing all four population-derived tier
// levels (ниже / норма / хорошо / отлично) with the player's CURRENT tier marked
// selected/active. `Pips` (the discrete 4-level indicator) lives inside this slice
// per architecture.md leaf-granularity (D-02 — the intended shape, not a rigid file
// count); it is re-exported so siblings (TierChip) can render the same pip meter.
//
// The active zone is signalled THREE redundant ways — the tier color, the level
// word, AND `aria-current`/the filled pip count — so meaning is never carried by
// color alone (a11y.md). Tier→token mapping (no `--color-tier-*` token exists):
// ascending quality loss → warn → info → win, held literal so the @source scan
// emits it.
import type { ReactNode } from "react";
import { tv } from "tailwind-variants/lite";
import { TIER_PIPS, type TierLevel } from "../_fixtures";

/** The four tier levels in ascending order — the fixed scale axis. */
const SCALE: readonly TierLevel[] = ["low", "base", "good", "elite"];

// ---- Pips: the discrete 4-level indicator (filled pips out of 4) ----

// The tier color applies ONLY to "on" pips (compoundVariants) — an "off" pip is
// `bg-border-2` alone. With `/lite` (no tailwind-merge) a level color + a muted
// override would BOTH emit and source order would decide, leaking the color onto
// off pips; gating the color behind `on=true` keeps each pip a single fill.
const pip = tv({
  base: "size-1.5 rounded-full",
  variants: {
    level: {
      low: "",
      base: "",
      good: "",
      elite: "",
    } satisfies Record<TierLevel, string>,
    on: {
      true: "",
      false: "bg-border-2",
    },
  },
  compoundVariants: [
    { level: "low", on: true, class: "bg-loss" },
    { level: "base", on: true, class: "bg-warn" },
    { level: "good", on: true, class: "bg-info" },
    { level: "elite", on: true, class: "bg-win" },
  ],
});

type PipsProps = {
  className?: string;
  /** The resolved tier level — fills `TIER_PIPS[level]` of the four pips. */
  level: TierLevel;
};

/**
 * A discrete 4-pip meter: the first `TIER_PIPS[level]` pips take the tier color,
 * the rest are muted. Decorative (`aria-hidden`) — the meaning is carried by the
 * sibling level word; the meter is the redundant non-color signal.
 */
export function Pips({ className, level }: PipsProps): ReactNode {
  const filled = TIER_PIPS[level];
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className ?? ""}`}
      aria-hidden
      data-pips={level}
    >
      {[1, 2, 3, 4].map((i) => {
        const on = i <= filled;
        return <span key={i} className={pip({ level, on })} />;
      })}
    </span>
  );
}

// ---- TierScale: the four-zone scale with the active tier marked ----

const zone = tv({
  base: "flex flex-1 flex-col items-center gap-1 rounded-sm border px-2 py-1.5 text-center",
  variants: {
    level: {
      low: "",
      base: "",
      good: "",
      elite: "",
    } satisfies Record<TierLevel, string>,
    active: {
      true: "",
      false: "border-border-1 bg-surface-1",
    },
  },
  compoundVariants: [
    { level: "low", active: true, class: "bg-loss-weak text-loss border-loss-border" },
    { level: "base", active: true, class: "bg-warn-weak text-warn border-warn-border" },
    { level: "good", active: true, class: "bg-info-weak text-info border-info-border" },
    { level: "elite", active: true, class: "bg-win-weak text-win border-win-border" },
  ],
});

type TierScaleProps = {
  className?: string;
  /** The player's current resolved tier level — the active zone. */
  active: TierLevel;
  /** Localized level names per level (RU/EN), e.g. `{ low: "ниже", … }`. */
  names: Readonly<Record<TierLevel, string>>;
  /** Accessible label for the active zone (e.g. «Уровень: хорошо»). */
  activeAriaLabel: string;
};

export function TierScale({
  className,
  active,
  names,
  activeAriaLabel,
}: TierScaleProps): ReactNode {
  return (
    <div
      className={`flex items-stretch gap-1 ${className ?? ""}`}
      role="group"
      aria-label={activeAriaLabel}
      data-tier-scale={active}
    >
      {SCALE.map((level) => {
        const isActive = level === active;
        return (
          <span
            key={level}
            className={zone({ level, active: isActive })}
            aria-current={isActive ? "true" : undefined}
            data-zone={level}
          >
            {/* Only the active zone carries the pip meter — pairing the tier color +
                the level word + the filled pips + aria-current (never color-alone).
                Inactive zones are muted label-only legend entries. */}
            {isActive ? <Pips level={level} /> : null}
            <span
              className={`font-body text-2xs font-semibold uppercase tracking-label ${isActive ? "" : "text-text-muted"}`}
            >
              {names[level]}
            </span>
          </span>
        );
      })}
    </div>
  );
}
