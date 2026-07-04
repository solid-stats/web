// ToastManager slice barrel (D-06). Graduates `createToast` (the typed push helper requiring the
// dismiss accessible name) + the `toaster` instance (for `dismiss`/advanced use) + the
// `ToastViewport` (mounted once; it portals its own queue and renders the EXISTING Toast leaf per
// toast) + the `ToastMeta` contract. The leaf is reused, NOT re-expressed.
export type { ToastMeta } from "./ToastManager";
export { ToastViewport, createToast, toaster } from "./ToastManager";
