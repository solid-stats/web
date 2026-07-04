// KIT-08 i18n harness barrel. Re-exports the activated runtime `i18n` instance plus the
// `ru`/`en` catalogs + `Catalog` type for the Ladle GlobalProvider and the stories. The
// `lingui.d.ts` Register augmentation is ambient (no runtime export). The underscore
// `_i18n` segment is internal to uikit — only the PUBLIC seam (the `i18n` instance) is
// graduated into the package barrel (src/index.ts), per the underscore-prefix rule.
export type { Catalog } from "./catalogs";
export { en, ru } from "./catalogs";
export { i18n } from "./i18n";
