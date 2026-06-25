// Ladle GlobalProvider — the ONE place app-wide CSS is imported (styling.md
// import-once). fonts.css before theme.css so the self-hosted @font-face is
// registered before the @theme that references the families. theme.css carries
// `@import "tailwindcss"`, so this single import emits the @theme tokens and the
// utilities Tailwind v4 source-scans from the colocated stories. Dark-only: the
// root wrapper paints the gunmetal base surface using @theme utilities.
import type { GlobalProvider } from "@ladle/react";
import { I18nProvider } from "@lingui/react";
import { useEffect } from "react";
// The fonts.css → tailwind.css side-effect imports (import-once order) live in the
// sibling `styles.mjs`: the type-aware tsgolint gate flags a relative `.css` side-effect
// import as TS2882 and ignores ambient `*.css` decls, so routing them through a `.mjs`
// (a resolvable module) keeps the gate green while this file stays fully type-checked.
// tailwind.css `@import`s the generated theme.css token source + the @source Ladle needs.
import "./styles.mjs";
import { i18n } from "../src/shared/uikit/_i18n";

/** The supported UI locales — RU primary (D-03). Any other control value falls back to RU. */
type Locale = "ru" | "en";

/** Narrow an arbitrary control value to a real {@link Locale} (fallback RU), not an unchecked `as`. */
function toLocale(value: unknown): Locale {
  return value === "en" ? "en" : "ru";
}

// KIT-08 language switch (RESEARCH Pattern 4): the GlobalProvider reads the `locale`
// global control declared in config.mjs (the global-control-arg path, D-04 — mirrors the
// disabled `theme` addon precedent, no custom addon-button file), re-activates that locale
// on the shared runtime instance, and wraps every story in `<I18nProvider>` so a story's
// `i18n._({ id, message, values })` resolves in the chosen language. Toggling the control
// re-renders every catalogued story bilingually (SC#2). The control value is narrowed with a
// real runtime guard (`toLocale` — non-ru/en falls back to RU, never an unchecked `as` that
// could `activate` an unloaded locale), and `i18n.activate` runs in an effect keyed on the
// locale (a render-body mutation React may run/discard/re-run freely). The instance + the
// fonts.css → tailwind.css import-once order are untouched; I18nProvider wraps, never reorders.
export const Provider: GlobalProvider = ({ globalState, children }) => {
  const locale = toLocale(globalState.control?.["locale"]?.value);
  useEffect(() => {
    i18n.activate(locale);
  }, [locale]);
  return (
    <I18nProvider i18n={i18n}>
      <div className="bg-bg-0 text-text-primary font-body min-h-screen p-4">{children}</div>
    </I18nProvider>
  );
};
