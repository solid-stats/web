// Skeleton (KIT-07) — the loading placeholder that reserves the EXACT final layout
// dimensions so a skeleton→data swap shifts nothing (CLS = 0, performance.md). The
// shimmer animates `opacity` ONLY (never width/height/top/left/margin), and drops to
// a static block under `motion-reduce:` (a11y.md / styling.md Motion). The whole
// surface is `aria-busy` and `aria-hidden` — it is a visual placeholder a screen
// reader skips; the live "loading" intent is the consumer's `role="status"` label.
//
// Three reserved-dimension variants:
//   • `text`  — a single text line (height from the `line` size).
//   • `tile`  — a stat-tile block (reserves the StatTile box).
//   • `table` — reproduces a fixed-`colgroup` + header + N×ROW_H grid, so it pairs
//     1:1 with the KIT-02 data-table loading state (Plan 06) — column widths and the
//     density row height (52 comfortable / 44 compact, D-01) match the real table.
//
// Class strings stay literal inside `tv()` so the Tailwind v4 `@source ../src` scan
// emits them; `/lite` is the tailwind-merge-free build (FreshnessPill precedent).
import type { CSSProperties, ReactNode } from "react";
import { tv } from "tailwind-variants/lite";

/** Table row density → fixed row height (D-01). The skeleton matches the real row. */
export type SkeletonDensity = "comfortable" | "compact";

/** Reserved-dimension row heights per density (px) — mirrors the KIT-02 `ROW_H`. */
export const ROW_H = { comfortable: 52, compact: 44 } as const satisfies Record<
  SkeletonDensity,
  number
>;

// The shimmer block: `surface-2` fill, opacity-only pulse, static under reduced motion.
// `animate-pulse` is the Tailwind keyframe that animates `opacity` ONLY (no
// width/height/top/left/margin) — `motion-reduce:animate-none` drops it to a static block.
const shimmer = "rounded-sm bg-surface-2 motion-safe:animate-pulse motion-reduce:animate-none";

const text = tv({
  base: shimmer,
  variants: {
    line: {
      sm: "h-3",
      md: "h-4",
      lg: "h-5",
    },
  },
});

type TextProps = {
  className?: string;
  variant: "text";
  /** Text-line thickness. */
  line?: "sm" | "md" | "lg";
  /** Reserved width utility (token utility, e.g. `w-24`, `w-full`). */
  widthClassName?: string;
};

type TileProps = {
  className?: string;
  variant: "tile";
};

type TableProps = {
  className?: string;
  variant: "table";
  /** Fixed column widths (px) — the colgroup the real table reserves. */
  columns: readonly number[];
  /** Number of skeleton body rows to reserve. */
  rows: number;
  density?: SkeletonDensity;
};

type Props = TextProps | TileProps | TableProps;

/** A single reserved table cell shimmer, vertically centered in the fixed row. */
function tableCellShimmer(): ReactNode {
  return (
    <div className="flex h-full items-center px-3">
      <div className={`${shimmer} h-3 w-full`} />
    </div>
  );
}

export function Skeleton(props: Props): ReactNode {
  if (props.variant === "text") {
    const { className, line = "md", widthClassName = "w-full" } = props;
    return (
      <div
        className={text({ line, className: `${widthClassName} ${className ?? ""}` })}
        aria-busy
        aria-hidden
        data-skeleton="text"
      />
    );
  }

  if (props.variant === "tile") {
    const { className } = props;
    // Reserves the StatTile box: label line + the stat-xl value block.
    return (
      <div
        className={`flex flex-col gap-3 rounded-md border border-border-1 bg-surface-1 p-4 ${className ?? ""}`}
        aria-busy
        aria-hidden
        data-skeleton="tile"
      >
        <div className={`${shimmer} h-3 w-20`} />
        <div className={`${shimmer} h-12 w-32`} />
      </div>
    );
  }

  // table: fixed colgroup + header + N×ROW_H body rows — the KIT-02 loading mirror.
  const { className, columns, rows, density = "comfortable" } = props;
  const rowHeight = ROW_H[density];
  // Reserve the exact column widths via an inline grid-template (token-free numeric
  // geometry is data, not a themable property — like the banner's reserved height).
  const gridStyle: CSSProperties = {
    gridTemplateColumns: columns.map((w) => `${w}px`).join(" "),
  };

  return (
    <div
      className={`overflow-hidden rounded-md border border-border-1 bg-surface-1 ${className ?? ""}`}
      aria-busy
      aria-hidden
      data-skeleton="table"
    >
      {/* Header row — fixed height, surface-2 (mirrors `table-header`). */}
      <div
        className="grid h-11 items-center border-b border-border-1 bg-surface-2"
        style={gridStyle}
      >
        {columns.map((_, i) => (
          <div key={i} className="flex h-full items-center px-3">
            <div className={`${shimmer} h-3 w-16`} />
          </div>
        ))}
      </div>
      {/* Body rows — each at the fixed density `ROW_H` so the swap is CLS = 0. */}
      {Array.from({ length: rows }, (_, r) => (
        <div
          key={r}
          className="grid items-center border-b border-border-1 last:border-b-0"
          style={{ ...gridStyle, height: `${rowHeight}px` }}
        >
          {columns.map((_, c) => (
            <div key={c}>{tableCellShimmer()}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
