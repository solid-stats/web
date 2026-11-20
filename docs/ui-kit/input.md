# Input v1

## Purpose and scope

Input is a native single-line text control for standalone use and composition
inside [Field](field.md). A dedicated read-only visual treatment is deferred.

## API and Ark UI composition

Render one native input through Ark `Field.Input`. Forward the ref and native
input props, including `type`. Support controlled `value` and `onChange`, and
browser-managed values with optional `defaultValue`. Inside Field, use its
label, required and invalid state, and descriptions through Ark context. The
standalone caller supplies the accessible name.

## Layout and states

Use a 44 px height, 12 px inline padding, and a 4 px radius. The parent supplies
the available width. An optional placeholder supplements the label or
instructions. Enabled placeholder text uses `text-muted`.

- Default uses a 1 px `border-control` (`#6A758B`) border. Hover uses a 1 px
  `border-control-hover` (`#7C879E`) border.
- Pointer and keyboard focus show a 2 px `primary` outer ring with a 2 px
  offset.
- Disabled uses `surface-1`, `text-subtle`, and 60% opacity.
- Invalid uses a 1 px `border-control-invalid` (`#B84A59`) border. Invalid +
  Focus keeps that border and uses the 2 px `loss` (`#FF5C6C`) outer ring with a
  2 px offset.

## Interactions and acceptance checks

Preserve native text entry. During implementation, verify controlled and
uncontrolled values, accessible naming in both contexts, native disabled
behavior, unobscured focus from pointer and keyboard, and readable contrast.
Check Empty and Filled across Default, Hover, Focus, Disabled, Invalid, and
Invalid + Focus. Verify error association and announcement in the
[Field acceptance checks](field.md#acceptance-checks).

## Sources

[Input master and matrix](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=64-3)
· [SolidStats Input and Field recipe](../../DESIGN.md#input-and-field-v1) ·
[Ark UI Field](https://ark-ui.com/docs/components/field) ·
[W3C Labeling Controls](https://www.w3.org/WAI/tutorials/forms/labels/) ·
[WCAG 2.2](https://www.w3.org/TR/WCAG22/) ·
[Checklist Design Input Field](https://www.checklist.design/design-system/input-field)
