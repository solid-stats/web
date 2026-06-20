// Skeleton catalog stories (KIT-07). `Matrix` lays the three reserved-dimension
// variants (text / tile / table) out via StateMatrix. `Proof` renders the table
// skeleton beside a real table with the IDENTICAL colgroup + density ROW_H — the
// CLS = 0 proof the `cls.spec` asserts (skeleton box height === final box height).
// `Playground` exposes the variant via Ladle args. The skeleton shimmer animates
// opacity only and is static under reduced-motion (the catalog runs `reducedMotion`).
import type { Story, StoryDefault } from "@ladle/react";
import { ROW_H, Skeleton } from "./Skeleton";

export default {
  title: "KIT-07 Feedback / Skeleton",
} satisfies StoryDefault;

// Shared geometry for the CLS proof: skeleton and final table must agree exactly.
const COLUMNS = [180, 96, 96, 96] as const;
const ROWS = 4;
const DENSITY = "comfortable" as const;

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <section className="flex flex-col gap-4" data-state-matrix>
      <h2 className="font-display text-lg font-semibold text-text-primary tracking-tight">
        Skeleton — варианты
      </h2>
      <div className="flex flex-col gap-4">
        <div
          className="flex flex-col gap-2 rounded-md border border-border-1 bg-surface-1 p-3"
          data-state-cell="text"
        >
          <span className="font-body text-xs font-semibold uppercase text-text-muted">text</span>
          <div className="flex w-64 flex-col gap-2">
            <Skeleton variant="text" line="lg" widthClassName="w-40" />
            <Skeleton variant="text" line="md" widthClassName="w-full" />
            <Skeleton variant="text" line="sm" widthClassName="w-24" />
          </div>
        </div>
        <div
          className="flex flex-col gap-2 rounded-md border border-border-1 bg-surface-1 p-3"
          data-state-cell="tile"
        >
          <span className="font-body text-xs font-semibold uppercase text-text-muted">tile</span>
          <div className="w-48">
            <Skeleton variant="tile" />
          </div>
        </div>
        <div
          className="flex flex-col gap-2 rounded-md border border-border-1 bg-surface-1 p-3"
          data-state-cell="table"
        >
          <span className="font-body text-xs font-semibold uppercase text-text-muted">table</span>
          <Skeleton variant="table" columns={COLUMNS} rows={ROWS} density={DENSITY} />
        </div>
      </div>
    </section>
  </div>
);

// A real fixed-geometry table cloning the skeleton's colgroup + ROW_H — the
// skeleton-vs-final box-height equality is the CLS = 0 invariant (cls.spec).
function FinalTable(): ReturnType<Story> {
  const rowHeight = ROW_H[DENSITY];
  const gridStyle = { gridTemplateColumns: COLUMNS.map((w) => `${w}px`).join(" ") };
  return (
    <div className="overflow-hidden rounded-md border border-border-1 bg-surface-1">
      <div
        className="grid h-11 items-center border-b border-border-1 bg-surface-2"
        style={gridStyle}
      >
        {COLUMNS.map((_, i) => (
          <div key={i} className="px-3 font-body text-xs font-semibold uppercase text-text-muted">
            COL
          </div>
        ))}
      </div>
      {Array.from({ length: ROWS }, (_, r) => (
        <div
          key={r}
          className="grid items-center border-b border-border-1 last:border-b-0"
          style={{ ...gridStyle, height: `${rowHeight}px` }}
        >
          {COLUMNS.map((_, c) => (
            <div key={c} className="px-3 font-mono text-sm text-text-primary">
              data
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export const Proof: Story = () => (
  <div className="flex flex-col gap-4 bg-bg-1 p-4">
    <div data-cls-skeleton>
      <Skeleton variant="table" columns={COLUMNS} rows={ROWS} density={DENSITY} />
    </div>
    <div data-cls-final>
      <FinalTable />
    </div>
  </div>
);

type PlaygroundArgs = {
  variant: "text" | "tile" | "table";
};

export const Playground: Story<PlaygroundArgs> = ({ variant }) => (
  <div className="bg-bg-1 p-4">
    {variant === "text" ? <Skeleton variant="text" line="md" widthClassName="w-48" /> : null}
    {variant === "tile" ? (
      <div className="w-48">
        <Skeleton variant="tile" />
      </div>
    ) : null}
    {variant === "table" ? (
      <Skeleton variant="table" columns={COLUMNS} rows={ROWS} density={DENSITY} />
    ) : null}
  </div>
);

Playground.args = { variant: "table" };
Playground.argTypes = {
  variant: {
    options: ["text", "tile", "table"],
    control: { type: "inline-radio" },
  },
};
