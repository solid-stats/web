// KIT-05 FileUpload slice barrel (Plan 03-04, Wave 4). `FileUpload` (the keyboard-dropzone
// evidence-upload control) graduates with its public `RejectReason` type (callers type the
// `rejectedCopy` map by it). The `fileUpload` tv() recipe + the `ACCEPT_DEFAULT` / reject-mapper
// logic stay internal to the slice (consumed by the component + pinned by `fileUpload.test.ts`),
// NOT graduated. The preview object-URL lifecycle is owned by Ark's `ItemPreviewImage` (create +
// revoke in its effect), so the slice keeps no URL tracker.
export type { RejectReason } from "./fileUpload";
export { FileUpload } from "./FileUpload";
