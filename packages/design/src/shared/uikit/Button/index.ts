// GAP-19 base primitives slice barrel. `control` stays internal (the shared recipe);
// `Button` / `Link` + the `ButtonVariant` / `ButtonSize` finite-union types graduate.
export type { ButtonVariant, ButtonSize, ButtonJustify } from "./control";
export { Button } from "./Button";
export { Link } from "./Link";
