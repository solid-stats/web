// KIT-05 — `FileUpload`, the image-evidence + external-link upload control over Ark
// `FileUpload` (Plan 03-04, Wave 4). The heaviest form-family slice + the one genuine
// CLIENT-SECURITY surface in this no-app phase. It is a KEYBOARD-ACCESSIBLE dropzone (Ark
// `FileUpload.Dropzone` is focusable, Enter/Space opens the picker) with an EXPLICIT Browse
// button (the shared `Button` via `FileUpload.Trigger asChild`) — NOT a div-only drag
// target (security.md; UI-SPEC KIT-05; SC#1). Drag-over is announced structurally (the
// `data-dragging` border/surface lift in the recipe), never color-alone (a11y.md).
//
// Per-file state: Ark's `FileUpload.Context` render-prop exposes `acceptedFiles` (the
// success rows — preview + name + remove) and `rejectedFiles` (the rejection rows — each
// with its `errors` mapped to a why+fix reason). The accept default EXCLUDES SVG
// (`ACCEPT_DEFAULT` = png/jpeg/webp; the XSS gate — fileUpload.ts) and `maxFileSize` drives
// the oversize rejection. Client validation here is defense-in-depth UX; the authoritative
// gate is `server-2` in v1.0 (security.md — "the client check is UX, never trust it").
//
// Object-URL lifecycle: Ark OWNS it. `ItemPreviewImage` creates the preview blob URL in a
// `useEffect` (`createFileUrl`) and returns zag's `revokeObjectURL` callback as that effect's
// cleanup, so each preview URL is revoked on unmount / when its row leaves — the slice neither
// creates nor revokes a preview URL, and Ark never hands the per-file URL to the consumer
// (RESEARCH Pitfall 5; performance.md object-URL cleanup). No custom tracker: a parallel
// create→revoke ledger here would be dead code dressed as a guard.
//
// Composes under the `Field` wrapper (label/error/required/disabled). The external-link
// evidence field is a sibling `Input` the STORY renders under the same `Field` (the brief's
// "image uploads + external links"); the slice does not own it — it stays a thin upload
// primitive. Icon-only delete/retry controls take resolved aria-label string props the
// slice never invents (component-shape.md; a11y.md). NO i18n import — all copy
// (`dropzoneLabel`, `browseLabel`, the rejection sentence, the aria names) arrives as plain
// string props resolved in the story (architecture.md uikit boundary). `data-file-upload`
// slice hook.
import type { ReactNode } from "react";
import { FileUpload as ArkFileUpload } from "@ark-ui/react/file-upload";
import { CircleAlert, ImageUp, RotateCcw, UploadCloud, X } from "lucide-react";
import { Button } from "../Button";
import { ACCEPT_DEFAULT, fileUpload, firstRejectReason, type RejectReason } from "./fileUpload";

const styles = fileUpload();

/**
 * A stable React key for a file row. `file.name` alone collides when two files share a basename
 * (different folders) or a file is re-added after removal; the size + lastModified composite keeps
 * each row distinct (component-shape.md — stable keys).
 */
function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

type Props = {
  // system props first
  className?: string;
  // values
  /** The dropzone prompt copy (resolved string — e.g. «Перетащите изображение или выберите файл»). */
  dropzoneLabel: string;
  /** The Browse button label (resolved string). */
  browseLabel: string;
  /** Accessible name for each per-file remove control (resolved string). */
  removeAria: string;
  /** Accessible name for the retry control on a failed row (resolved string). */
  retryAria: string;
  /** Maps a rejection reason → the resolved why+fix sentence the rejection row shows. */
  rejectedCopy: Record<RejectReason, string>;
  /** The allowlisted MIME types — defaults to PNG/JPEG/WebP (SVG excluded — the XSS gate). */
  accept?: string;
  /** Per-file size ceiling in bytes (client-side UX limit; server-2 is the real gate). */
  maxFileSize?: number;
  /** Max number of evidence files (the data-volume limit-reached state). */
  maxFiles?: number;
  /** Controlled accepted files (the v1.0 TanStack Form layer drives this). */
  files?: File[];
  // booleans
  disabled?: boolean;
  // callbacks
  /** Called with the accepted file list whenever the selection changes. */
  onFilesChange?: (files: File[]) => void;
  /** Retry a failed upload row (v1.0 wires the real mutation; presentational here). */
  onRetry?: (file: File) => void;
};

export function FileUpload({
  className,
  dropzoneLabel,
  browseLabel,
  removeAria,
  retryAria,
  rejectedCopy,
  accept = ACCEPT_DEFAULT,
  maxFileSize,
  maxFiles,
  files,
  disabled = false,
  onFilesChange,
  onRetry,
}: Props): ReactNode {
  // No object-URL bookkeeping here: Ark's `ItemPreviewImage` creates the preview blob URL and
  // revokes it in its own effect cleanup (see head comment), so the slice owns no URL lifecycle.
  return (
    <ArkFileUpload.Root
      className={styles.root({ className })}
      accept={accept}
      maxFileSize={maxFileSize}
      maxFiles={maxFiles}
      acceptedFiles={files}
      disabled={disabled}
      onFileChange={
        onFilesChange === undefined ? undefined : (details) => onFilesChange(details.acceptedFiles)
      }
      data-file-upload
    >
      <ArkFileUpload.Dropzone className={styles.dropzone()}>
        <span className={styles.dropzoneLabel()}>
          <UploadCloud className="size-5 shrink-0" aria-hidden />
          {dropzoneLabel}
        </span>
        <ArkFileUpload.Trigger asChild>
          <Button variant="secondary" size="sm" disabled={disabled}>
            <ImageUp className="size-4 shrink-0" aria-hidden />
            {browseLabel}
          </Button>
        </ArkFileUpload.Trigger>
      </ArkFileUpload.Dropzone>

      <ArkFileUpload.HiddenInput />

      {/* Accepted rows — preview + name + remove. Ark's ItemPreviewImage owns the preview
          blob URL's create+revoke; the row is a success state paired with no color-only cue. */}
      <ArkFileUpload.ItemGroup className={styles.itemGroup()}>
        <ArkFileUpload.Context>
          {(api) =>
            api.acceptedFiles.map((file) => (
              <ArkFileUpload.Item key={fileKey(file)} file={file} className={styles.item()}>
                {/* Exactly ONE preview per accepted file, branched on `file.type` — NOT on Ark's
                    `match(props.type)` filter, whose `.*` is a catch-all that also matches images
                    (GAP-05: the two-sibling shape double-rendered the img + the fallback). An image
                    file renders the `<img>` via `ItemPreviewImage` (Ark keeps its object-URL
                    create+revoke lifecycle); any non-image file renders the icon fallback alone. */}
                {file.type.startsWith("image/") ? (
                  <ArkFileUpload.ItemPreview type="image/*" className={styles.itemPreview()}>
                    <ArkFileUpload.ItemPreviewImage className={styles.itemPreviewImage()} />
                  </ArkFileUpload.ItemPreview>
                ) : (
                  <ArkFileUpload.ItemPreview type=".*" className={styles.itemPreview()}>
                    <ImageUp className="size-4 shrink-0" aria-hidden />
                  </ArkFileUpload.ItemPreview>
                )}
                <ArkFileUpload.ItemName className={styles.itemName()} />
                <span className={styles.itemControls()}>
                  {onRetry === undefined ? null : (
                    <button
                      type="button"
                      className={styles.itemDeleteTrigger()}
                      aria-label={retryAria}
                      onClick={() => onRetry(file)}
                    >
                      <RotateCcw className="size-4 shrink-0" aria-hidden />
                    </button>
                  )}
                  <ArkFileUpload.ItemDeleteTrigger
                    className={styles.itemDeleteTrigger()}
                    aria-label={removeAria}
                  >
                    <X className="size-4 shrink-0" aria-hidden />
                  </ArkFileUpload.ItemDeleteTrigger>
                </span>
              </ArkFileUpload.Item>
            ))
          }
        </ArkFileUpload.Context>
      </ArkFileUpload.ItemGroup>

      {/* Rejected rows — the why+fix sentence (type/size), paired with the alert icon so the
          rejection is never color-alone (a11y.md; security.md "states why … and how to fix"). */}
      <ArkFileUpload.Context>
        {(api) =>
          api.rejectedFiles.length === 0 ? null : (
            <ul className={styles.itemGroup()}>
              {api.rejectedFiles.map((rejection) => (
                <li key={fileKey(rejection.file)} className={styles.rejectedItem()}>
                  <span className={styles.rejectedRow()}>
                    <span className={styles.itemPreview()}>
                      <CircleAlert className="size-4 shrink-0" aria-hidden />
                    </span>
                    <span className={styles.itemName()}>{rejection.file.name}</span>
                  </span>
                  <span className={styles.rejectedReason()}>
                    <CircleAlert className="size-4 shrink-0" aria-hidden />
                    {rejectedCopy[firstRejectReason(rejection.errors)]}
                  </span>
                </li>
              ))}
            </ul>
          )
        }
      </ArkFileUpload.Context>
    </ArkFileUpload.Root>
  );
}
