// The shared state-matrix story helper (RESEARCH Pattern 1) — the DRY mechanism
// every later family story reuses to lay out its ×7 component states / ×4
// data-volume cells uniformly. Each `StateCell` carries a visible `label` so the
// Playwright catalog spec can assert that named cells exist, and the grid is the
// durable, screenshot-and-axe-friendly surface (one labelled cell per state).
//
// Generic primitive: tokens-only utilities (mirrors the Smoke grid discipline —
// no arbitrary values), imports nothing page/business/localization
// (architecture.md "Uikit vs feature UI").
import type { ReactNode } from "react";

type StateMatrixProps = {
  readonly children: ReactNode;
  /** Optional matrix caption (e.g. the component name / state axis). */
  readonly title?: string;
};

/**
 * A labelled grid wrapper. Lays its `StateCell` children out in a responsive,
 * gap-separated grid on the gunmetal base surface — the uniform container the
 * catalog and the Playwright spec assert against.
 */
export function StateMatrix({ children, title }: StateMatrixProps): ReactNode {
  return (
    <section className="flex flex-col gap-4" data-state-matrix>
      {title === undefined ? null : (
        <h2 className="font-display text-lg font-semibold text-text-primary tracking-tight">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{children}</div>
    </section>
  );
}

type StateCellProps = {
  readonly label: string;
  readonly children: ReactNode;
};

/**
 * One labelled cell of the matrix: the state's visible `label` above the demo
 * content. The `label` text is the hook the Playwright spec uses to assert a
 * named state is present in a story.
 */
export function StateCell({ label, children }: StateCellProps): ReactNode {
  return (
    <div
      className="flex flex-col gap-2 rounded-md border border-border-1 bg-surface-1 p-3"
      data-state-cell={label}
    >
      <span className="font-body text-xs font-semibold uppercase text-text-muted">{label}</span>
      <div className="flex min-h-11 items-center">{children}</div>
    </div>
  );
}
