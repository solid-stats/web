// KIT-05 — `Field`, the shared form-control wrapper (Plan 03-02, Wave 2). It owns the
// visible label + optional helper text + the announced, associated inline error region,
// over Ark's headless `Field.Root` (RESEARCH Pattern 2). `Field.Root` broadcasts
// `invalid`/`required`/`disabled` to the nested control via Ark context, so the control
// (the `Input` slice, later `Select`/`Stepper`/`FileUpload`) inherits validation state with
// no prop drilling — `Field` is the ONE reuse seam every other form control nests under
// (D-05 family, planner's call). The forced-invalid StateMatrix cell just passes `invalid`
// (no Ladle hack — RESEARCH Pitfall 2).
//
// Ark wiring this leans on (verified against use-field.ts): `Field.Input` (the control)
// gets `aria-invalid` + `aria-describedby` pointing at the error text id WHEN invalid and an
// error region is mounted; `Field.ErrorText` carries `id` + `aria-live="polite"`. So the
// error is BOTH announced (live region) AND programmatically associated (aria-describedby) —
// WCAG 3.3.1 / 1.3.1. We render `Field.ErrorText` ONLY when `invalid` (Ark associates it
// only then), pairing it with a Lucide `CircleAlert` so the error is never color-alone
// (a11y.md; mirrors `Toast/Toast.tsx` icon+message discipline). `Field.HelperText`'s id is
// ALSO folded into the control's `aria-describedby` by Ark `useField` whenever a helper is
// present (verified against use-field.ts `labelIds` — helper is associated regardless of
// invalid), so the helper is programmatically linked with no extra wiring here.
//
// GAP-07: a `required` field renders a VISIBLE required affordance in the label — the `*` glyph
// (a shape, `text-loss`-tinted) PAIRED with visually-hidden `requiredText` (so it is never the
// asterisk in colour alone, and AT hears "required"), driven by the existing `required` prop.
//
// Boundary: NO i18n import — `label`/`helperText`/`errorText` arrive as plain strings
// resolved in the STORY via `i18n._({ id })` (architecture.md uikit-vs-feature). `data-field`
// test hook on the root; `data-field-error` on the error region (the keyboard spec selector).
import type { ReactNode } from "react";
import { Field as ArkField } from "@ark-ui/react/field";
import { CircleAlert } from "lucide-react";
import { field } from "./field";

const styles = field();

type Props = {
  // system props first
  className?: string;
  // values
  label: string;
  /** Visually-hidden "required" text appended to the marker on a required field (e.g. the
   *  resolved `fieldRequired` copy) — the slice stays i18n-free, so the story passes it. Without
   *  it the marker still shows the `*` glyph; with it the required state is announced to AT. */
  requiredText?: string;
  helperText?: string;
  errorText?: string;
  // booleans
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  // content (the control — Input / Select / Stepper / FileUpload)
  children: ReactNode;
};

export function Field({
  className,
  label,
  requiredText,
  helperText,
  errorText,
  invalid = false,
  required = false,
  disabled = false,
  children,
}: Props): ReactNode {
  return (
    <ArkField.Root
      className={styles.root({ className })}
      invalid={invalid}
      required={required}
      disabled={disabled}
      data-field
    >
      <ArkField.Label className={styles.label()}>
        {label}
        {required ? (
          <span className={styles.requiredMarker()}>
            <span aria-hidden="true">*</span>
            {requiredText === undefined ? null : <span className="sr-only">{requiredText}</span>}
          </span>
        ) : null}
      </ArkField.Label>
      {children}
      {helperText === undefined ? null : (
        <ArkField.HelperText className={styles.helperText()}>{helperText}</ArkField.HelperText>
      )}
      {invalid && errorText !== undefined ? (
        <ArkField.ErrorText className={styles.errorText()} aria-live="polite" data-field-error>
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          <span>{errorText}</span>
        </ArkField.ErrorText>
      ) : null}
    </ArkField.Root>
  );
}
