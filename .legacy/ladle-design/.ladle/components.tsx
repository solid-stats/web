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

/** The supported UI locales — RU primary (D-03). Any other source value falls back to RU. */
type Locale = "ru" | "en";

/** Narrow an arbitrary locale source value to a real {@link Locale} (fallback RU), not an unchecked `as`. */
function toLocale(value: unknown): Locale {
  return value === "en" ? "en" : "ru";
}

/**
 * Read the active locale from the `?locale=` URL query param — the REAL persistent,
 * global locale source (GAP-01 fix). Unlike the dead `control.defaultState.locale` config
 * block (a per-story args seed in Ladle 5.1.1, never merged into `globalState.control`), the
 * URL survives a story switch and is independent of any story declaring its own args, so the
 * switch works even on no-args stories like `smoke--tokens`. SSR/no-window-safe: if `window`
 * is absent (Ladle building without a DOM), fall back to RU. Junk values fall back to RU via
 * `toLocale` — an unloaded locale can never be activated (T-03-08-01 tampering mitigation).
 */
function readLocaleFromUrl(): Locale {
  if (typeof window === "undefined") return "ru";
  return toLocale(new URLSearchParams(window.location.search).get("locale"));
}

// KIT-08 language switch (GAP-01 fix): the GlobalProvider reads the active locale from the
// `?locale=` URL query param — a real persistent, global source (replacing the dead
// `control.defaultState.locale` declaration that Ladle 5.1.1 never injected into
// `globalState.control`) — re-activates that locale on the shared runtime instance, and wraps
// every story in `<I18nProvider>` so a story's `i18n._({ id, message, values })` resolves in
// the chosen language. The source is global (lives in the URL, independent of any story's
// args), so toggling RU↔EN re-renders every catalogued story bilingually, including no-args
// stories (SC#2). The value is narrowed with a real runtime guard (`toLocale` — non-ru/en
// falls back to RU, never an unchecked `as` that could `activate` an unloaded locale), and
// `i18n.activate` runs in an effect keyed on the locale (a render-body mutation React may
// run/discard/re-run freely). The instance + the fonts.css → tailwind.css import-once order
// are untouched; I18nProvider wraps, never reorders.
export const Provider: GlobalProvider = ({ children }) => {
  const locale = readLocaleFromUrl();
  useEffect(() => {
    i18n.activate(locale);
  }, [locale]);
  return (
    <I18nProvider i18n={i18n}>
      <div className="bg-bg-0 text-text-primary font-body min-h-screen p-4">{children}</div>
    </I18nProvider>
  );
};
