// KIT-05 FileUpload slice barrel (Plan 03-04, Wave 4). `FileUpload` (the keyboard-dropzone
// evidence-upload control) graduates with its public `RejectReason` type (callers type the
// `rejectedCopy` map by it). The `fileUpload` tv() recipe + the `ACCEPT_DEFAULT` /
// `createPreviewUrlTracker` / reject-mapper logic stay internal to the slice (consumed by the
// component + pinned by `fileUpload.test.ts`), NOT graduated.
export type { RejectReason } from "./fileUpload";
export { FileUpload } from "./FileUpload";
