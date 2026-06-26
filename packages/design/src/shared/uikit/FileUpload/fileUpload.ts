// KIT-05 — the `fileUpload` recipe + its pure validation/lifecycle logic (Plan 03-04,
// Wave 4). One `tv({ slots })` per Ark FileUpload anatomy part used (RESEARCH
// Don't-Hand-Roll; PATTERNS tv-recipe-per-part) — `className` per part, NEVER `asChild`
// for styling (RESEARCH Anti-Patterns). Same discipline as `Input/input.ts` +
// `Select/select.ts` + `Stepper/stepper.ts`: `/lite` (the tailwind-merge-free build),
// literal class strings so Tailwind's static `@source` scan picks them up (portal-free
// here — FileUpload renders inline, no Portal), ONLY emitted `@theme` tokens, NO arbitrary
// values (styling.md).
//
// SECURITY (the one genuine threat surface this no-app phase carries — threat_model
// T-03-04-01/03): the accept default + the reject-reason mapper are exported as PURE logic so
// they are pinned by `fileUpload.test.ts` as a regression guard, not only via a render. The
// preview object-URL lifecycle (T-03-04-02) is owned ENTIRELY by Ark's `ItemPreviewImage`
// (create + revoke in its effect) — the slice holds no URL ledger. Client validation is
// defense-in-depth UX — the authoritative gate is `server-2` in v1.0 (security.md "the client
// check is UX, never trust it").
import type { FileUploadFileError } from "@ark-ui/react/file-upload";
import { tv } from "tailwind-variants/lite";

// ── Pure validation contract (T-03-04-01 SVG exclusion) ──────────────────────────────
//
// The default accept allowlist: PNG / JPEG / WebP ONLY. `image/svg+xml` is DELIBERATELY
// absent — an uploaded SVG is a stored-XSS vector (a script-carrying vector; security.md
// "never preview an SVG … disallow SVG for evidence"; RESEARCH Pitfall 5). Kept as an
// `as const` tuple so the test can assert the exact membership, and joined to the
// comma-string shape Ark's `accept` prop + the native `<input accept>` want.

/** The allowlisted evidence image MIME types — PNG/JPEG/WebP. SVG is excluded (XSS gate). */
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

/** The default `accept` value passed to Ark FileUpload — the allowlist as a comma string. */
export const ACCEPT_DEFAULT: string = ACCEPTED_IMAGE_TYPES.join(",");

/** The why a file was rejected — drives which `uploadRejected`-family copy the UI names. */
export type RejectReason = "wrong-type" | "too-large" | "too-many" | "other";

/**
 * Map an Ark/zag `FileUploadFileError` to the rejection reason the UI explains (the *why*
 * the rejection copy names — security.md "a rejected file states why (type/size) and how to
 * fix"). Pure + total: every Ark error code folds into one of the four reasons, so a new
 * code can never silently render an empty rejection. Exported for the contract test.
 */
export function mapRejectReason(error: FileUploadFileError): RejectReason {
  switch (error) {
    case "FILE_INVALID_TYPE":
      return "wrong-type";
    case "FILE_TOO_LARGE":
    case "FILE_TOO_SMALL":
      return "too-large";
    case "TOO_MANY_FILES":
      return "too-many";
    default:
      // FILE_INVALID / FILE_EXISTS / any forward-compatible AnyString code.
      return "other";
  }
}

/**
 * The first, most specific rejection reason for a file's error list — the one the rejection
 * row surfaces. Wrong-type (the SVG/XSS gate) wins over size when both fire, so the security
 * reason is the one shown. Pure; exported for the contract test.
 */
export function firstRejectReason(errors: readonly FileUploadFileError[]): RejectReason {
  const reasons = errors.map(mapRejectReason);
  return (
    reasons.find((r) => r === "wrong-type") ??
    reasons.find((r) => r === "too-large") ??
    reasons.find((r) => r === "too-many") ??
    reasons[0] ??
    "other"
  );
}

// ── Object-URL lifecycle (T-03-04-02) — owned by Ark, not the slice ──────────────────
//
// Image previews go through `URL.createObjectURL`, which would leak a blob URL until
// `URL.revokeObjectURL` is called. Ark's `ItemPreviewImage` does BOTH internally: it calls
// `createObjectURL` in a `useEffect` and returns zag's `revokeObjectURL` as that effect's
// cleanup, so each preview URL is revoked on unmount / row removal (verified against
// @zag-js/file-upload `createFileUrl` + @ark-ui/react `FileUploadItemPreviewImage`). The
// per-file URL is never exposed to the consumer, so there is nothing for the slice to track —
// no custom ledger lives here (a parallel tracker would be unreachable dead code).

// ── The recipe ───────────────────────────────────────────────────────────────────────
//
// Slots:
//   root             — the vertical stack: dropzone → item rows (gap-2 rhythm).
//   dropzone         — the FOCUSABLE drop region (NOT a div-only drag target): `min-h-11`
//                      (≥44px floor), the canonical `focus-visible:shadow-(--shadow-ring)`
//                      ring (the control-family ring), a DASHED `border-border-2` that
//                      brightens to `primary-border` on drag-over. The drag-over cue is
//                      STRUCTURAL (border brightening + a surface lift via `data-dragging`),
//                      never color-alone (a11y.md; UI-SPEC KIT-05).
//   dropzoneLabel    — the «Перетащите изображение или выберите файл» prompt copy + icon row.
//   trigger          — wraps the shared `Button` (the explicit Browse affordance); the slot
//                      only positions it, the Button owns the ring + ≥44px floor.
//   itemGroup        — the per-file rows list (ul); reset list styling.
//   item             — one file row: preview + name + per-state cue + delete/retry, on one
//                      inline row with the input-family hairline.
//   itemPreview      — the thumbnail frame (fixed size → CLS-0 reserved box).
//   itemPreviewImage — the <img> preview, object-fit cover within the frame.
//   itemName         — the file name, truncating (one line, ellipsis).
//   itemControls     — the trailing control cluster. The row delete + retry route through the
//                      shared icon-only `Button` (control recipe) — no bespoke hit-area/ring
//                      recipe lives here (GAP-06: the duplicate `itemDeleteTrigger` slot was deleted).
//   rejectedItem     — a rejected-file row (wrong-type/oversize): `loss`-toned hairline,
//                      paired with the row's alert icon (never color-alone).
//   rejectedReason   — the why+fix rejection sentence (`text-loss`, inline with its icon).
export const fileUpload = tv({
  slots: {
    root: "flex flex-col gap-2",
    dropzone:
      "flex min-h-11 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border-2 bg-surface-2 px-4 py-6 text-center transition-colors hover:border-primary-border data-[dragging]:border-primary-border data-[dragging]:bg-surface-3 focus-visible:shadow-(--shadow-ring) focus-visible:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-60",
    dropzoneLabel:
      "inline-flex items-center gap-2 font-body text-sm text-text-muted data-[disabled]:text-text-subtle",
    trigger: "inline-flex",
    itemGroup: "flex list-none flex-col gap-2",
    item: "flex min-h-11 items-center gap-3 rounded-sm border border-border-1 bg-surface-1 px-3 py-2",
    itemPreview:
      "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border-1 bg-surface-2 text-text-subtle",
    itemPreviewImage: "size-full object-cover",
    itemName: "min-w-0 flex-1 truncate font-body text-sm text-text-primary",
    itemStatus: "inline-flex shrink-0 items-center gap-1.5 font-body text-xs",
    itemControls: "inline-flex shrink-0 items-center gap-1",
    rejectedItem:
      "flex min-h-11 flex-col gap-1 rounded-sm border border-loss bg-surface-1 px-3 py-2",
    rejectedRow: "flex items-center gap-3",
    rejectedReason: "inline-flex items-center gap-1.5 font-body text-xs text-loss",
  },
});
