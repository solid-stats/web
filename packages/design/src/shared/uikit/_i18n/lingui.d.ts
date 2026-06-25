// KIT-08 typed message ids (SC#4, localization.md typed-key rule). Augments Lingui's
// `Register` interface so its `messageIds` is exactly `keyof typeof STRINGS` — the same
// single source the `StringKey` union derives from. Effect: every `i18n._({ id })` call
// narrows `id` to a real catalogued key, so a missing or renamed id is a `tsc` error,
// never a silent runtime miss. `interface` (not `type`) is mandatory here — module
// augmentation only works on an interface declaration.
import type { STRINGS } from "../_fixtures/strings";

declare module "@lingui/core" {
  interface Register {
    messageIds: keyof typeof STRINGS;
  }
}
