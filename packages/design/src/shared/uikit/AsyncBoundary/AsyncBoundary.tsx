// AsyncBoundary (SURF-18, D-05) — the ONE state→primitive seam Phases 4–9 compose. It
// maps a discriminated `AsyncState` union to the right EXISTING Phase-2 primitive; it does
// NOT rebuild them (D-05). The seven kinds route as:
//   • loading                      → `Skeleton`        (reserves the final table/tile box)
//   • empty                        → `EmptyState`      (min-h-48 honest "nothing here yet")
//   • error                        → `ErrorState` kind="system" (id + contact, never blank)
//   • offline / reconnecting / stale → `DataTrustBanner` (BannerKind already maps the three)
//   • ready                        → the consumer's `children`
//
// Every branch reserves its FINAL height via the primitive it routes to — AsyncBoundary
// NEVER hardcodes a height of its own (the primitives already encode CLS = 0: DataTrustBanner
// `h-10`, EmptyState/ErrorState `min-h-48`, Skeleton `tableViewportHeight`). Each primitive
// already pairs a Lucide icon + text, so no state is ever color-alone (a11y.md). The wrapper
// is purely presentational and i18n-free: copy arrives as plain `string` props the CONSUMER
// resolves (architecture.md uikit boundary — no `i18n` import inside a `shared/uikit` leaf).
//
// `errors.md`: a system/application error surfaces a debug `id` + a `contact` path (never a raw
// string, never a blank screen) — AsyncBoundary routes the `error` kind to `ErrorState`
// kind="system" carrying both. The `data-async-boundary={kind}` hook lets a catalog/cls spec
// assert which branch rendered.
import type { ReactNode } from "react";
import { DataTrustBanner } from "../DataTrustBanner";
import { EmptyState } from "../EmptyState";
import { ErrorState } from "../ErrorState";
import { Skeleton, type SkeletonDensity } from "../Skeleton";

/**
 * The discriminated global-state union (D-05). Each `kind` carries the plain-string copy +
 * shape the routed primitive needs — resolved in the consumer (i18n-free seam). The six
 * non-ready kinds are the named SURF-18 states; `ready` renders the real content.
 */
export type AsyncState =
  | {
      kind: "loading";
      /** The skeleton column widths (px) — the colgroup the final table reserves. */
      columns: readonly number[];
      /** Number of skeleton body rows to reserve (matches the final row count). */
      rows: number;
      /** Row density → the reserved row height. Defaults to `comfortable`. */
      density?: SkeletonDensity;
      /**
       * GAP-16: the resolved polite-status copy announced to screen readers while loading. The
       * Skeleton itself is `aria-hidden` (an SR skips it), so the load is announced via a
       * visually-hidden `role="status"` region carrying this string (resolved by the consumer —
       * i18n-free seam). Omitted → no announcement (back-compat); supply it to announce the load.
       */
      label?: string;
    }
  | {
      kind: "empty";
      /** The `h3` empty heading (resolved by the consumer). */
      heading: string;
      /** The empty body copy. */
      body: string;
      /** Optional filtered total-count / next-step line. */
      totalCount?: string;
      /** Optional recovery action node. */
      action?: ReactNode;
    }
  | {
      kind: "error";
      /** The headline error copy (resolved by the consumer). */
      message: string;
      /** The contact path surfaced below the message (errors.md: server errors carry it). */
      contact?: string;
      /** Recovery action — never a dead end (errors.md). */
      action: ReactNode;
    }
  | { kind: "offline"; label: string }
  | { kind: "reconnecting"; label: string }
  | { kind: "stale"; label: string }
  | { kind: "ready"; children: ReactNode };

/** The seven global-state kinds — the discriminant of {@link AsyncState}. */
export type AsyncKind = AsyncState["kind"];

/**
 * The pinned routing contract (D-05): each `kind` → the EXISTING Phase-2 primitive it renders
 * (`ready` renders the consumer's children, so it has no primitive). This map is the single
 * source the `switch` below honours and the unit test asserts against — a drift (a kind routed
 * to the wrong primitive, a new kind left unmapped) fails the test instead of shipping. The
 * three connection kinds all route to `DataTrustBanner` (its `BannerKind` already maps them).
 */
export const ASYNC_PRIMITIVE = {
  loading: "Skeleton",
  empty: "EmptyState",
  error: "ErrorState",
  offline: "DataTrustBanner",
  reconnecting: "DataTrustBanner",
  stale: "DataTrustBanner",
  ready: "children",
} as const satisfies Record<AsyncKind, string>;

type Props = {
  className?: string;
  state: AsyncState;
};

/**
 * Route a global state to its EXISTING Phase-2 primitive. Explicit branches returning the
 * primitive (the `DataTrustBanner` kind-switch shape), never a leaked value — the union is
 * exhaustive so a future kind is a tsc error here. AsyncBoundary adds no height of its own.
 */
export function AsyncBoundary({ className, state }: Props): ReactNode {
  switch (state.kind) {
    case "loading":
      return (
        <div className={className} data-async-boundary="loading">
          {/* GAP-16: announce the load to SR users without stealing focus. The Skeleton is
              aria-hidden, so a visually-hidden `role="status"` (polite live region) carries the
              resolved loading copy. `sr-only` is absolutely-positioned → it adds NO measured
              height, so the CLS-0 geometry the routed Skeleton reserves is untouched (Plan 03-09). */}
          {state.label === undefined ? null : (
            <span className="sr-only" role="status">
              {state.label}
            </span>
          )}
          <Skeleton
            variant="table"
            columns={state.columns}
            rows={state.rows}
            density={state.density}
          />
        </div>
      );
    case "empty":
      return (
        <div className={className} data-async-boundary="empty">
          <EmptyState
            heading={state.heading}
            body={state.body}
            totalCount={state.totalCount}
            action={state.action}
          />
        </div>
      );
    case "error":
      // errors.md: a system/application error — the id lives inside `message` (the catalog's
      // `{id}` placeholder), the contact path sits below it. Never blank, never a raw string.
      return (
        <div className={className} data-async-boundary="error">
          <ErrorState
            kind="system"
            message={state.message}
            contact={state.contact}
            action={state.action}
          />
        </div>
      );
    case "offline":
    case "reconnecting":
    case "stale":
      // The three connection states map 1:1 onto DataTrustBanner.BannerKind (already built,
      // h-10 reserved, icon + text — never color-alone). The `kind` IS the BannerKind.
      return (
        <div className={className} data-async-boundary={state.kind}>
          <DataTrustBanner kind={state.kind} label={state.label} />
        </div>
      );
    case "ready":
      return (
        <div className={className} data-async-boundary="ready">
          {state.children}
        </div>
      );
  }
}
