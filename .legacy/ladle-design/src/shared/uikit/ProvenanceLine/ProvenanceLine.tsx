// ProvenanceLine (KIT-04 / model A) — the always-present trust line under a headline
// stat: «посчитано из N реплеев · <freshness> · Как считается». Recipe `provenance-line`
// (DESIGN.md L406): `text-muted` `2xs`, `·` separators, an embedded freshness segment
// (the literal freshness word), and a focusable cyan `Как считается` link
// (`--color-provenance-link` = the cyan primary). The link is a real `type="button"`
// control so it is keyboard-reachable; its hit area is padded to ≥44px (a11y.md).
//
// The per-player coverage panel ("B") is deliberately NOT built — it is not in the data
// model (D-05). Copy + the `N реплеев` pluralization come from `_fixtures/STRINGS`
// (D-07 manual RU one/few/many), never hardcoded here.
import type { ReactNode } from "react";
// `/lite` — the tailwind-merge-free build (see FreshnessPill for the rationale).
import { tv } from "tailwind-variants/lite";

type Locale = "ru" | "en";

type Props = {
  className?: string;
  /** Number of replays the stat was computed from. */
  replayCount: number;
  /** The literal freshness word for the middle segment (RU/EN), from `_fixtures/STRINGS`. */
  freshnessLabel: string;
  /** The «посчитано из {n} реплеев · {freshness} · Как считается» template (RU/EN). */
  template: string;
  /** Which language the noun-form + link label resolve in. */
  locale: Locale;
  /** The cyan link label («Как считается» / «How it's computed»). */
  linkLabel: string;
  onExplain?: () => void;
};

const root = tv({
  base: "inline-flex flex-wrap items-center gap-1.5 font-body text-2xs text-text-muted",
});

const link = tv({
  base: "inline-flex min-h-11 items-center rounded-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
});

// RU plural noun form for «реплей» (one / few / many), the D-07 manual rule. EN keeps a
// simple singular/plural — both forms live with the template, never auto-derived from a lib.
function replayNoun(count: number, locale: Locale): string {
  if (locale === "en") return count === 1 ? "replay" : "replays";
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return "реплеев";
  if (mod10 === 1) return "реплей";
  if (mod10 >= 2 && mod10 <= 4) return "реплея";
  return "реплеев";
}

export function ProvenanceLine({
  className,
  replayCount,
  freshnessLabel,
  template,
  locale,
  linkLabel,
  onExplain,
}: Props): ReactNode {
  // The template has a fixed three-segment shape — `<head> · {freshness} · {linkLabel}` —
  // so split on the literal `·` separator and render each segment as a real node: the head
  // prose (with `{n} <noun>` interpolated), the freshness word, and the cyan link. This
  // keeps the freshness segment and the link as elements (not interpolated into a string)
  // and keeps the `·` separators decorative (`aria-hidden`).
  const formattedCount = `${replayCount} ${replayNoun(replayCount, locale)}`;
  const [headSegment = ""] = template.split("·");
  const head = headSegment
    .replace("{n} реплеев", formattedCount)
    .replace("{n} replays", formattedCount)
    .trim();

  return (
    <p className={root({ className })}>
      <span>{head}</span>
      <span aria-hidden>·</span>
      <span className="font-medium text-text-primary">{freshnessLabel}</span>
      <span aria-hidden>·</span>
      <button type="button" className={link()} onClick={onExplain}>
        {linkLabel}
      </button>
    </p>
  );
}
