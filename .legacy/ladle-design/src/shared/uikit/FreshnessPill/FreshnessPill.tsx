// FreshnessPill (KIT-04 / model C) — the live data-freshness state as a pill:
// «Актуально / Данные устаревают / Связь потеряна / Переподключение», each pairing
// a Lucide icon + the literal word so meaning is NEVER carried by color alone
// (a11y.md). Reconnecting spins refresh-cw behind `motion-reduce:` so reduced-motion
// users get a static icon (a11y.md / performance.md Motion).
//
// The `--color-freshness-<state>-{fill,text,border}` tokens are compound custom
// properties — the `-border` value is the full `1px solid …` shorthand — so they are
// consumed via inline `style` reading the custom property (the sanctioned escape
// hatch, the Smoke.stories precedent), NOT an arbitrary Tailwind value [styling.md;
// 01-04-SUMMARY key-decisions]. Class strings stay literal inside `tv()` so the
// Tailwind v4 `@source ../src` scan emits them.
import type { CSSProperties, ReactNode } from "react";
import { Circle, CircleDot, RefreshCw, WifiOff } from "lucide-react";
// `/lite` is the tailwind-merge-free build — we hold every class literal in `tv()`
// and never produce conflicting utilities, so the merge pass (and its optional
// `tailwind-merge` peer) is unnecessary; importing it would pull an uninstalled dep.
import { tv } from "tailwind-variants/lite";

/** The four live-connection states (model C). Frontend-owned finite union. */
export type FreshnessState = "up-to-date" | "stale" | "offline" | "reconnecting";

type Props = {
  className?: string;
  state: FreshnessState;
  /** The literal display word (RU primary / EN mirror), pulled from `_fixtures/STRINGS`. */
  label: string;
};

const pill = tv({
  base: "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-medium",
});

const ICONS = {
  "up-to-date": Circle,
  stale: CircleDot,
  offline: WifiOff,
  reconnecting: RefreshCw,
} as const satisfies Record<FreshnessState, typeof Circle>;

/** Inline-style triplet reading the compound `--color-freshness-*` custom properties. */
function tokenStyle(state: FreshnessState): CSSProperties {
  return {
    backgroundColor: `var(--color-freshness-${state}-fill)`,
    color: `var(--color-freshness-${state}-text)`,
    border: `var(--color-freshness-${state}-border)`,
  };
}

export function FreshnessPill({ className, state, label }: Props): ReactNode {
  const Icon = ICONS[state];

  return (
    <span className={pill({ className })} style={tokenStyle(state)}>
      <Icon
        className={state === "reconnecting" ? "size-3.5 motion-safe:animate-spin" : "size-3.5"}
        aria-hidden
      />
      {label}
    </span>
  );
}
