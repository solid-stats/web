// InlineReviewRow (KIT-04) — the quiet «на проверке» workflow footnote that lives
// INSIDE the SteamID list it describes (recipe `inline-review-row`, DESIGN.md L433).
// It is deliberately NOT a filled banner and not a box pinned to the bottom of a
// stretched column: transparent background, amber `triangle-alert` + the literal
// «на проверке» word (never color alone — a11y.md), and a cyan request link. The
// request data itself belongs to the authenticated surfaces (Phase 8); this is the
// visual footnote only (D-05).
//
// Amber text uses the `text-warn` token utility; the cyan link uses `text-primary`
// — both are token utilities (no arbitrary values, no inline style needed here:
// these tokens are simple colors, not the compound `1px solid …` borders).
import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { tv } from "tailwind-variants/lite";

type Props = {
  className?: string;
  /** The literal «на проверке» / «under review» word, from `_fixtures/STRINGS`. */
  label: string;
  /** The cyan request-link label. */
  requestLabel: string;
  onRequest?: () => void;
};

const row = tv({
  base: "flex items-center gap-1.5 bg-transparent font-body text-xs text-warn",
});

const link = tv({
  base: "inline-flex min-h-11 items-center rounded-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
});

export function InlineReviewRow({ className, label, requestLabel, onRequest }: Props): ReactNode {
  return (
    <p className={row({ className })}>
      <TriangleAlert className="size-3.5" aria-hidden />
      <span>{label}</span>
      <span aria-hidden>·</span>
      <button type="button" className={link()} onClick={onRequest}>
        {requestLabel}
      </button>
    </p>
  );
}
