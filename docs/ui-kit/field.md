# Field v1

## Purpose and scope

Field supplies the label, helper text, and validation feedback for one nested
UIKit control. The caller supplies a visible label and may pass helper text, a
required state, and `errorText`. The form decides when to validate.

## API and Ark UI composition

Wrap the nested control in `Field.Root`. Use `Field.Label`, `Field.HelperText`,
and `Field.ErrorText` to wire up the visible text. A nonempty `errorText` drives
Ark `invalid` and the control’s `aria-invalid`. Associate the helper and error
through `aria-describedby` when present. Convey the required state through the
control’s native form semantics.

## Layout and interactions

Stack the sentence-case label, control, optional helper, and optional error.
Show a visible asterisk for required fields. Place the error below the helper
and explain what to correct. Preserve the helper and the entered value when the
error appears. A placeholder can supplement the visible label or instructions.

## Acceptance checks

During implementation, verify the accessible label, required and invalid state,
and helper and error associations on the nested control. Check that focus stays
visible and unobscured and that an error appearing while focus stays in place is
announced by a screen reader. If a separate live region is needed, mount it
before inserting the message.

## Sources

[Field master](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=97-44)
·
[Field specimens](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=97-40)
· [SolidStats Input and Field recipe](../../DESIGN.md#input-and-field-v1) ·
[Ark UI Field](https://ark-ui.com/docs/components/field) ·
[W3C Labeling Controls](https://www.w3.org/WAI/tutorials/forms/labels/) ·
[WCAG ARIA19](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA19) ·
[Checklist Design Input Field](https://www.checklist.design/design-system/input-field)
