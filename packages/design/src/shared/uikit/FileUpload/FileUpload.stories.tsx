// KIT-05 FileUpload catalog stories (Plan 03-04, Wave 4). Two D-02 modes: a static `Matrix`
// grid (`StateCell` from `_state-matrix`) laying out the ×4 data-volume file states (empty /
// few / many / limit-reached) AND dedicated REJECTION cells (wrong-type SVG, oversize) that
// render the why+fix copy, plus an interactive `Playground` (the live Ark dropzone — real
// Browse + keyboard, the surface `keyboard.spec` drives). Every cell composes under the
// `Field` wrapper, and the evidence external-link `Input` sits as a sibling under the same
// Field (the brief's "image uploads + external links").
//
// The ×4 data-volume + the rejection rows are rendered from author-controlled fixture Files
// (v0.1 Ladle — no network/server-2; controlled `files` drives the accepted rows; the
// rejection cells use a tiny `<FileUpload>`-shaped row built from the fixtures so the static
// axe gate sees a real why+fix sentence without depending on a live drop event).
//
// Strings resolve in the STORY via `i18n._({ id })` (active locale from the Ladle language
// control) and pass as plain props — the primitive stays i18n-free (architecture.md uikit
// boundary). `uploadRejected` carries the `{max}` interpolation. The dropzone prompt is the
// QUAL-05 RU-longest target («Перетащите изображение или выберите файл») exercised at the
// 360 floor.
import type { Story, StoryDefault } from "@ladle/react";
import { i18n } from "../_i18n";
import { Field } from "../Field";
import { Input } from "../Input";
import { StateCell, StateMatrix } from "../_state-matrix";
import type { RejectReason } from "./fileUpload";
import { FileUpload } from "./FileUpload";

export default {
  title: "KIT-05 Form / FileUpload",
} satisfies StoryDefault;

const MAX_LABEL = "5 МБ";

/** Author-controlled fixture image Files (v0.1 — no network). Names drive the row labels. */
function imageFile(name: string): File {
  return new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], name, { type: "image/png" });
}

const FEW_FILES = [imageFile("altis-killcam.png")];
// GAP-13: a REALISTIC evidence list (~30 files, some long names) so the catalog actually
// demonstrates the bounded, height-capped, internally-scrolling `itemGroup` + the row truncate —
// the prior 3-file fixture masked the unbounded-list defect.
const MANY_FILES = Array.from({ length: 30 }, (_, i) =>
  imageFile(`evidence-${String(i + 1).padStart(2, "0")}-altis-killcam-long-frame-name.png`),
);
// The limit-reached cell needs `files.length === maxFiles`; kept at 3 (its own small fixture) so
// bumping `MANY_FILES` does not break the limit semantics.
const LIMIT_FILES = [
  imageFile("altis-killcam.png"),
  imageFile("stratis-teamkill.jpg"),
  imageFile("tanoa-evidence.webp"),
];

/** Resolve the per-reason rejection sentence map the slice's `rejectedCopy` prop wants. */
function rejectedCopy(): Record<RejectReason, string> {
  const wrongType = i18n._({ id: "uploadRejected", values: { max: MAX_LABEL } });
  return {
    "wrong-type": wrongType,
    "too-large": i18n._({ id: "uploadOversize", values: { max: MAX_LABEL } }),
    "too-many": i18n._({ id: "uploadTooMany" }),
    other: wrongType,
  };
}

/** The shared resolved-string prop bundle every cell passes (the i18n boundary lives here). */
function copy() {
  return {
    dropzoneLabel: i18n._({ id: "uploadDropzone" }),
    browseLabel: i18n._({ id: "uploadBrowse" }),
    removeAria: i18n._({ id: "uploadRemoveAria" }),
    retryAria: i18n._({ id: "uploadRetryAria" }),
    rejectedCopy: rejectedCopy(),
  };
}

export const Matrix: Story = () => {
  const label = i18n._({ id: "selectLabel" });
  const linkLabel = i18n._({ id: "fieldLabelLongest" });
  const props = copy();

  return (
    <div className="flex flex-col gap-6 bg-bg-1 p-4">
      <StateMatrix title="FileUpload — data-volume (empty / few / many / limit)">
        <StateCell label="empty">
          <Field label={label}>
            <FileUpload {...props} />
          </Field>
        </StateCell>

        <StateCell label="few">
          <Field label={label}>
            <FileUpload {...props} files={FEW_FILES} maxFiles={5} />
          </Field>
        </StateCell>

        <StateCell label="many">
          <Field label={label}>
            <FileUpload {...props} files={MANY_FILES} maxFiles={30} />
          </Field>
        </StateCell>

        {/* Limit-reached: files === maxFiles; Ark marks the dropzone maxFilesReached. */}
        <StateCell label="limit">
          <Field label={label}>
            <FileUpload {...props} files={LIMIT_FILES} maxFiles={3} />
          </Field>
        </StateCell>
      </StateMatrix>

      <StateMatrix title="FileUpload — per-file + rejection states">
        {/* With a retry affordance on the accepted rows (the error→retry per-file control). */}
        <StateCell label="retry">
          <Field label={label}>
            <FileUpload {...props} files={FEW_FILES} maxFiles={5} onRetry={() => undefined} />
          </Field>
        </StateCell>

        {/* Wrong-type (SVG) rejection — the why+fix copy names the PNG/JPEG/WebP allowlist. */}
        <StateCell label="reject-type">
          <div className="font-body text-loss inline-flex items-center gap-1.5 text-xs">
            {props.rejectedCopy["wrong-type"]}
          </div>
        </StateCell>

        {/* Oversize rejection — the why+fix copy names the size ceiling. */}
        <StateCell label="reject-size">
          <div className="font-body text-loss inline-flex items-center gap-1.5 text-xs">
            {props.rejectedCopy["too-large"]}
          </div>
        </StateCell>

        {/* Disabled WITH accepted rows — exercises `disabled` forwarding to the row controls
            (the retry + delete are non-interactive when the FileUpload is disabled). */}
        <StateCell label="disabled">
          <Field label={label} disabled>
            <FileUpload
              {...props}
              files={FEW_FILES}
              maxFiles={5}
              onRetry={() => undefined}
              disabled
            />
          </Field>
        </StateCell>
      </StateMatrix>

      {/* Evidence external link + the QUAL-05 RU-longest dropzone prompt at the 360 floor. */}
      <div className="flex w-full max-w-90 flex-col gap-4">
        <Field label={linkLabel}>
          <FileUpload {...props} />
        </Field>
        <Field label={i18n._({ id: "fieldLabelLongest" })}>
          <Input type="url" placeholder="https://" />
        </Field>
      </div>
    </div>
  );
};

type PlaygroundArgs = {
  disabled: boolean;
};

export const Playground: Story<PlaygroundArgs> = ({ disabled }) => (
  <div className="w-full max-w-90 bg-bg-1 p-4" data-floor-demo>
    <Field label={i18n._({ id: "selectLabel" })} disabled={disabled}>
      <FileUpload {...copy()} maxFiles={5} disabled={disabled} />
    </Field>
  </div>
);

Playground.args = { disabled: false };
Playground.argTypes = {
  disabled: { control: { type: "boolean" } },
};
