// SteamLogo — the Steam OAuth provider wordmark glyph. Lucide ships no brand marks,
// so this provider logo is the ONE sanctioned inline-SVG exception to the Lucide-only
// icon system (DESIGN.md / .design/CLAUDE.md §Voice). Re-created from the binding
// hi-fi `.design/hifi/shell.jsx` SteamLogo (D-11: re-implement, never port) as a
// local `aria-hidden` SVG that inherits color via `fill="currentColor"` (NO raw hex —
// it takes the surrounding control's token color, so it stays on-system).
import type { ReactNode } from "react";

type Props = {
  /** Square edge in px. Defaults to 16 (the right-cluster control glyph size). */
  size?: number;
  className?: string;
};

export function SteamLogo({ size = 16, className }: Props): ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M11.98 2C6.65 2 2.28 6.1 2 11.32l5.35 2.21a2.74 2.74 0 0 1 1.56-.48l.13.01 2.38-3.45v-.05a3.66 3.66 0 1 1 3.66 3.66h-.08l-3.4 2.43.01.1a2.75 2.75 0 1 1-5.47-.18l-3.83-1.58A10 10 0 1 0 11.98 2zM9.4 17.18l-1.23-.51a2.06 2.06 0 0 0 3.82-.27 2.06 2.06 0 0 0-2.7-2.6l1.27.53a1.52 1.52 0 1 1-1.16 2.8l-.01.01zm8.7-7.83a2.44 2.44 0 1 0-4.88 0 2.44 2.44 0 0 0 4.88 0zm-4.27 0a1.84 1.84 0 1 1 3.67 0 1.84 1.84 0 0 1-3.67 0z" />
    </svg>
  );
}
