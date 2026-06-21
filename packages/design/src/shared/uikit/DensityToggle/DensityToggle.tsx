// DensityToggle (KIT-02) — a controlled toggle switching the table `ROW_H`
// between comfortable (52) and compact (44). Presentational-only (D-01): the value
// is a CONTROLLED prop (a story arg here; a Nano store in v1.0) — the toggle owns
// no state. Each option is a ≥44px `<button>` (Pitfall 3) in a segmented control;
// the active option is cyan + `aria-pressed` (never color-alone — it carries the
// label word too). Copy is RU primary / EN mirror from `_fixtures/STRINGS`.
//
// `data-state` is unused here (the live `aria-pressed` + cyan fill IS the state);
// `/lite` is the tailwind-merge-free build. Class strings stay literal for the
// `@source` scan.
import type { ReactNode } from "react";
import { Rows2, Rows3 } from "lucide-react";
import { tv } from "tailwind-variants/lite";
import type { TableDensity } from "../Table";

type Props = {
  className?: string;
  /** The controlled active density (parent owns it — D-01). */
  value: TableDensity;
  /** Label per option (RU/EN): `{ comfortable: "Обычная", compact: "Компактная" }`. */
  labels: Readonly<Record<TableDensity, string>>;
  /** Group label (RU/EN), e.g. «Плотность» — the accessible name of the control. */
  groupLabel: string;
  /** Parent intent — switch density. Inert (story arg) if omitted. */
  onChange?: (density: TableDensity) => void;
};

// Each segment is the ≥44px hit area; the active one is cyan + a surface lift,
// paired with aria-pressed (never color-alone). The bidirectional row-density icon
// (Rows3 = comfortable / Rows2 = compact) reinforces the meaning.
const segment = tv({
  base: "inline-flex min-h-11 items-center gap-1.5 rounded-sm px-3 font-body text-xs font-semibold text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:shadow-(--shadow-ring)",
  variants: {
    active: {
      true: "bg-surface-1 text-primary",
      false: "",
    },
  },
});

const ORDER: readonly TableDensity[] = ["comfortable", "compact"];
const ICONS = { comfortable: Rows3, compact: Rows2 } as const;

export function DensityToggle({
  className,
  value,
  labels,
  groupLabel,
  onChange,
}: Props): ReactNode {
  return (
    <div
      role="group"
      aria-label={groupLabel}
      data-density-toggle={value}
      className={`inline-flex items-center gap-1 rounded-md border border-border-1 bg-surface-2 p-1 ${className ?? ""}`}
    >
      {ORDER.map((density) => {
        const isActive = density === value;
        const Icon = ICONS[density];
        return (
          <button
            key={density}
            type="button"
            aria-pressed={isActive}
            data-density-option={density}
            onClick={onChange === undefined ? undefined : () => onChange(density)}
            className={segment({ active: isActive })}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {labels[density]}
          </button>
        );
      })}
    </div>
  );
}
