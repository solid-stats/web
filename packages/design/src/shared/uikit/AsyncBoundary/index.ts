// AsyncBoundary slice barrel (SURF-18, D-05). Graduates the `AsyncBoundary` seam + its public
// `AsyncState` union (the shape Phases 4–9 import to drive a surface's global state) and the
// `AsyncKind`/`ASYNC_PRIMITIVE` routing contract. The slice rebuilds NO primitive — it routes
// to the existing Skeleton / EmptyState / ErrorState / DataTrustBanner.
export type { AsyncKind, AsyncState } from "./AsyncBoundary";
export { ASYNC_PRIMITIVE, AsyncBoundary } from "./AsyncBoundary";
