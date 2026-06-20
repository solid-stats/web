// Toast catalog stories (KIT-07). `Matrix` lays the 4 semantic variants out via
// StateMatrix in RU + EN — each pairing a Lucide icon + message (never color-alone).
// The `info` variant also carries an inert focusable action (≥44px, keyboard-operable)
// to exercise the action ring. The toast is the VISUAL primitive only — no queue /
// portal / trigger. `Playground` exposes the variant via Ladle args. Copy comes from
// `_fixtures/STRINGS`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Toast, type ToastVariant } from "./Toast";

export default {
  title: "KIT-07 Feedback / Toast",
} satisfies StoryDefault;

// Representative copy per variant, all from STRINGS (presentational demo pairings).
const VARIANT_STRING = {
  success: STRINGS.freshnessUpToDate,
  error: STRINGS.offlineBanner,
  warn: STRINGS.staleBanner,
  info: STRINGS.loadingColdAggregate,
} as const satisfies Record<ToastVariant, { readonly ru: string; readonly en: string }>;

const RETRY = { ru: "Повторить", en: "Retry" } as const;

const VARIANTS: readonly ToastVariant[] = ["success", "error", "warn", "info"];

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="Toast — варианты (RU)">
      {VARIANTS.map((variant) => (
        <StateCell key={variant} label={variant}>
          <Toast
            variant={variant}
            message={VARIANT_STRING[variant].ru}
            action={variant === "info" ? { label: RETRY.ru } : undefined}
          />
        </StateCell>
      ))}
    </StateMatrix>
    <StateMatrix title="Toast — variants (EN)">
      {VARIANTS.map((variant) => (
        <StateCell key={variant} label={`${variant}-en`}>
          <Toast
            variant={variant}
            message={VARIANT_STRING[variant].en}
            action={variant === "info" ? { label: RETRY.en } : undefined}
          />
        </StateCell>
      ))}
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  variant: ToastVariant;
  withAction: boolean;
};

export const Playground: Story<PlaygroundArgs> = ({ variant, withAction }) => (
  <div className="bg-bg-1 p-4">
    <Toast
      variant={variant}
      message={VARIANT_STRING[variant].ru}
      action={withAction ? { label: RETRY.ru } : undefined}
    />
  </div>
);

Playground.args = { variant: "success", withAction: false };
Playground.argTypes = {
  variant: {
    options: VARIANTS,
    control: { type: "inline-radio" },
  },
};
