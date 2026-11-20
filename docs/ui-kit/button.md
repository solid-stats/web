# Button v1

## Purpose and scope

Button triggers an action or serves as the native trigger for an Ark UI
primitive. It requires a visible action label. Icon-only Button is deferred
until a concrete use case is agreed.

## API and Ark UI composition

- Require an explicit `primary`, `secondary`, or `ghost` variant.
- Provide independent optional leading and trailing icon slots. Both are empty
  by default and may be used together. Each accepts one decorative 20 × 20 px
  Lucide icon that inherits `currentColor` and is hidden from assistive
  technology.
- Render one native button through `ark.button` from `@ark-ui/react/factory`.
  Forward the ref, DOM props, and handlers. Default to `type="button"` and allow
  explicit `type="submit"`.
- Compose an Ark trigger such as `Menu.Trigger` with `asChild`. Preserve its
  attributes and handlers. Ark owns menu state and focus.

## Layout and states

Use the three Button recipes in `DESIGN.md` and the five states in the matrix.
Size to content with a minimum 44 × 44 CSS px target, 16 px inline padding, and
an 8 px gap between present items. A parent may constrain width through
max-width, flex, or grid. Allow the label to wrap and the button to grow
vertically. The screen owns width and space reservation. The 144 px specimen
illustrates one matrix width.

Hover changes the recipe colors. Pressed is momentary, uses `:active`, takes
fill precedence over hover, and keeps the button in place. Preserve the
`:focus-visible` ring during hover and press. Disabled uses 60% opacity. Ghost
is transparent and borderless in Default and Disabled.

## Interactions and acceptance checks

Use native Tab, Enter, Space, submission, and disabled behavior. During
implementation, verify accessible naming, native activation, exclusion from
sequential focus when disabled, visible focus during hover and press, Ark
trigger composition, 44 × 44 CSS px targets, and wrapping with either or both
icons.

## Sources

[Button master and state matrix](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=60-3)
·
[Icon slot examples](https://www.figma.com/design/WVIdd6Mz4aSU1IhuZAx5c6/Web-App?node-id=129-242)
· [SolidStats design recipes](../../DESIGN.md) ·
[Ark UI composition](https://ark-ui.com/docs/guides/composition) ·
[APG Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) ·
[WCAG Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
· [Checklist Design Button](https://www.checklist.design/design-system/button)
