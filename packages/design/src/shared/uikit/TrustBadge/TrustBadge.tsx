// TrustBadge (KIT-04) — an honest aggregate data-state badge: Known / Unknown /
// Conflict. Unknown and Conflict are amber and ALWAYS render the literal word
// («Неизвестно» / «Конфликт») with a Lucide icon — NEVER a bare `0` or `—`
// (.design/CLAUDE.md L108-137; D-05). Known is the quiet surface-2 badge with
// `circle-check`. Meaning is never carried by color alone (a11y.md): every kind
// pairs an icon + the word.
//
// The `--color-{known,unknown,conflict}-{fill,text,border}` tokens are compound
// custom properties (the `-border` is the full `1px solid …` shorthand) consumed
// via inline `style` reading the custom property — the sanctioned escape hatch
// (the FreshnessPill / Smoke precedent), NOT an arbitrary Tailwind value. Badge
// (not pill) corner: `rounded-xs` per recipe `badge-known/unknown/conflict`.
import type { CSSProperties, ReactNode } from "react";
import { CircleCheck, CircleHelp, TriangleAlert } from "lucide-react";
import { tv } from "tailwind-variants/lite";

/** The three aggregate data-trust states (frontend-owned finite union). */
export type TrustKind = "known" | "unknown" | "conflict";

type Props = {
  className?: string;
  kind: TrustKind;
  /** The literal display word (RU/EN), from `_fixtures/STRINGS` — never `0`/`—`. */
  label: string;
};

const badge = tv({
  base: "inline-flex items-center gap-1.5 rounded-xs px-2 py-1 font-body text-xs",
  variants: {
    // Known is medium-weight quiet; the amber states are semibold to read as a flag.
    kind: {
      known: "font-medium",
      unknown: "font-semibold",
      conflict: "font-semibold",
    },
  },
});

const ICONS = {
  known: CircleCheck,
  unknown: CircleHelp,
  conflict: TriangleAlert,
} as const satisfies Record<TrustKind, typeof CircleCheck>;

/** Inline-style triplet reading the compound `--color-<kind>-*` custom properties. */
function tokenStyle(kind: TrustKind): CSSProperties {
  return {
    backgroundColor: `var(--color-${kind}-fill)`,
    color: `var(--color-${kind}-text)`,
    border: `var(--color-${kind}-border)`,
  };
}

export function TrustBadge({ className, kind, label }: Props): ReactNode {
  const Icon = ICONS[kind];

  return (
    <span className={badge({ kind, className })} style={tokenStyle(kind)}>
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}
