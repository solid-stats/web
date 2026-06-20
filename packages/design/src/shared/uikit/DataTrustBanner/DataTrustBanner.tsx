// DataTrustBanner (KIT-04) — the Stale / Offline / Reconnecting connection banner.
// It RESERVES a fixed height at every breakpoint so toggling it on/off causes zero
// layout shift (CLS = 0, performance.md): the `reserved` (absent) state renders the
// same-height empty box, so the surface never jumps when the banner appears. Each
// kind pairs a Lucide icon + the literal banner text — never color alone (a11y.md);
// reconnecting spins behind `motion-safe:`. The banner is a polite live region
// (`role="status"`) so the connection change is announced without stealing focus
// (a11y.md / realtime.md).
//
// Colors reuse the compound `--color-freshness-*` tokens via inline-style `var()`
// (the sanctioned escape hatch — the `-border` is a `1px solid …` shorthand), NOT
// arbitrary Tailwind values.
import type { CSSProperties, ReactNode } from "react";
import { CircleDot, RefreshCw, WifiOff } from "lucide-react";
import { tv } from "tailwind-variants/lite";

/**
 * Banner kinds. `reserved` is the absent/empty state that still occupies the
 * banner's height (the CLS = 0 proof), so it carries no icon or text.
 */
export type BannerKind = "stale" | "offline" | "reconnecting" | "reserved";

type Props = {
  className?: string;
  kind: BannerKind;
  /** The literal banner text (RU/EN), from `_fixtures/STRINGS`. Ignored for `reserved`. */
  label?: string;
};

// Fixed height (`h-10` = 40px) reserved for every kind incl. `reserved` → CLS = 0.
const banner = tv({
  base: "flex h-10 items-center gap-2 rounded-md px-3 font-body text-xs font-medium",
});

// `reserved` maps to the freshness "stale" geometry but renders transparent (no
// fill/text/border), so it occupies the box without showing a banner.
const TOKEN_STATE = {
  stale: "stale",
  offline: "offline",
  reconnecting: "reconnecting",
} as const;

function tokenStyle(kind: Exclude<BannerKind, "reserved">): CSSProperties {
  const state = TOKEN_STATE[kind];
  return {
    backgroundColor: `var(--color-freshness-${state}-fill)`,
    color: `var(--color-freshness-${state}-text)`,
    border: `var(--color-freshness-${state}-border)`,
  };
}

export function DataTrustBanner({ className, kind, label }: Props): ReactNode {
  if (kind === "reserved") {
    // Same-height empty box (CLS proof): no role, no content, transparent.
    return <div className={banner({ className })} aria-hidden data-banner-reserved />;
  }

  const ICONS = { stale: CircleDot, offline: WifiOff, reconnecting: RefreshCw } as const;
  const Icon = ICONS[kind];
  const spin = kind === "reconnecting" ? "size-4 motion-safe:animate-spin" : "size-4";

  return (
    <div className={banner({ className })} style={tokenStyle(kind)} role="status">
      <Icon className={spin} aria-hidden />
      {label}
    </div>
  );
}
