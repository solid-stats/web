// ToastManager slice barrel (D-06). Graduates the `toaster` instance (consumers call
// `toaster.create(...)` to push a toast) + the `ToastViewport` (mounted once; it portals its own
// queue and renders the EXISTING Toast leaf per toast). The leaf is reused, NOT re-expressed.
export { ToastViewport, toaster } from "./ToastManager";
