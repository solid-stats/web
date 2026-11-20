# Select v1

## Purpose and scope

Select chooses one value in a toolbar or form field. The caller owns the
selected value, option data, and when the selection takes effect. Players can
fetch options independently of table refresh, filtering, and sorting. See the
[Players brief](../../.visual-prototypes/players-list/BRIEF.md) for
screen-specific policy.

## API and Ark UI composition

- Accept a controlled `value: T | null` and emit `onValueChange(next)`. The
  caller commits the next value. Each option has a unique value, label, and
  optional disabled state.
- When the controlled value leaves the collection, resolve its label in this
  order: current option label, Ark’s last known label, then the placeholder. The
  caller reconciles the controlled value.
- Compose `Select.Trigger` with `asChild` and one Secondary [Button](button.md).
  Preserve the trigger’s accessible name, Ark attributes, and event handlers.
  Ark owns popup interaction, highlight, focus handling, and keyboard behavior.

## Layout and states

Align the trigger label to the start and place the Lucide chevron in Button’s 20
px trailing slot. Added width goes between the label and icon. Inherit Button’s
padding, interaction states, and content-driven height. Trigger and selectable
rows have minimum 44 × 44 CSS px targets and grow when labels wrap.

The popup defaults to the trigger width. Optional `menuWidth` sets a preferred
fixed width constrained by available viewport space. Limit popup height to the
available space and scroll the options internally. Use the same menu surface and
edge in the open specimen and option matrix.

Option Hover and Active share a fill. Keyboard highlight shows a cyan 2 px inset
ring using Ark’s highlighted state and keyboard modality. The selected option
keeps its check mark until selection changes. Preserve the listbox’s
active-descendant relationship.

## Keyboard and Clear

Preserve Ark’s keyboard behavior. Closed typeahead can commit a selection. While
open, arrow keys and typeahead highlight options. Enter or Space commits the
highlighted option and closes the popup. Escape closes the popup and returns
focus to the trigger. Confirm the supported keys and Tab behavior in
implementation.

With `clearable` enabled, reserve a 44 × 44 CSS px area beside the trigger in
both empty and filled states. Keep the empty reservation inert and out of
sequential focus. Place the separate Clear button after the trigger in DOM
order. Give it the localized accessible name «Очистить выбор», an opaque
Secondary Button surface, and space independent of the trigger label. Activating
Clear emits `null` and returns focus to the trigger. The Players period control
has Clear disabled.

## Option loading

| State | Trigger | Open popup |
| --- | --- | --- |
| Initial load | Show «Загружаем варианты…» when no label is known. Use a 20 px spinner in the chevron slot. | Loading status. |
| Same-context refresh | Keep the known label and show the spinner. | Keep caller-supplied options selectable. |
| New option context | Show the spinner. Keep a known label while the caller retains its value. | Loading status until the options for the new context arrive. |
| Empty result | Keep the trigger operable. | «Нет вариантов». |
| Request failure | Keep the trigger operable. | «Не удалось загрузить варианты». The screen owns retry outside the listbox. |

The trigger can open during loading. Reserve the icon footprint and keep
adjacent Players controls stable when initial loading copy changes. Use text
status in place of option skeletons. Announce status through a persistent live
region while preserving focus. Use `aria-busy` for an in-progress update if
required listbox options are temporarily absent. For settled empty and error
states, verify accessible status-only popup semantics and the trigger
relationship. Reserve option semantics for collection entries, including
disabled entries.

## Field and validation

Inside [Field](field.md), use Ark integration for labels, required and invalid
state, and helper and error associations. Use `Select.HiddenSelect` for native
form submission. Supply an accessible name when standalone.

Invalid uses Input’s 1 px `border-control-invalid`. Keyboard focus adds the 2 px
`loss` outline with a 2 px offset. Invalid + Open keeps the invalid border,
selected value, helper, and error visible. The popup remains neutral and its
keyboard highlight stays cyan. Represent request failure with its status
message.

## Acceptance checks

During implementation, verify matching trigger and popup widths, the
narrow-viewport width override, wrapped labels, internal scrolling, visible
focus, contrast, and 44 × 44 CSS px targets. Check Tab, arrows, typeahead,
confirmation, Escape, Clear, disabled options, and form submission. With a
screen reader, check the field name, value, required and invalid state,
highlighted and selected options, and loading, empty, and failure announcements.
Verify that focus and layout stay stable when options refresh and Clear appears
or disappears.

## Sources

[Select master](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=121-166)
·
[Select matrices](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=121-160)
· [SolidStats design recipes](../../DESIGN.md) ·
[Ark UI Select](https://ark-ui.com/docs/components/select) ·
[Ark UI composition](https://ark-ui.com/docs/guides/composition) ·
[Ark 5.37.2 value text](https://raw.githubusercontent.com/chakra-ui/ark/fc62e4e/packages/react/src/components/select/select-value-text.tsx)
·
[Zag 1.41.2 selection cache](https://raw.githubusercontent.com/chakra-ui/zag/91f6bb5/packages/utilities/collection/src/selection-map.ts)
· [APG Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) ·
[WAI-ARIA listbox semantics](https://www.w3.org/TR/wai-aria-1.2/#listbox) ·
[WCAG Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
·
[WCAG Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
· [Checklist Design Loading](https://www.checklist.design/design-system/loading)
