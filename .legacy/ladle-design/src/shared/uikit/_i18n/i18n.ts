// KIT-08 runtime i18n instance (Lingui v6 framework-agnostic core). Loads both locale
// catalogs and activates RU as the primary display language (D-03). The Ladle
// GlobalProvider re-activates the chosen locale per render (.ladle/components.tsx);
// stories resolve copy via `i18n._({ id, values })` and pass plain `message: string`
// props into the uikit primitives — NO i18n import inside any primitive
// (architecture.md uikit-vs-feature boundary).
//
// v1.0 graduation seam: this same instance is wrapped under the `/ru` `/en` router
// (D-03) — the runtime catalogs are the migration source for the `@lingui/cli`
// extract/compile pipeline introduced then.
import { i18n } from "@lingui/core";

import { en, ru } from "./catalogs";

i18n.load({ ru, en });
i18n.activate("ru"); // RU primary

export { i18n };
