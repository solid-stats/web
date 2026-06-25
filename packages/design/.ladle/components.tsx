// Ladle GlobalProvider — the ONE place app-wide CSS is imported (styling.md
// import-once). fonts.css before theme.css so the self-hosted @font-face is
// registered before the @theme that references the families. theme.css carries
// `@import "tailwindcss"`, so this single import emits the @theme tokens and the
// utilities Tailwind v4 source-scans from the colocated stories. Dark-only: the
// root wrapper paints the gunmetal base surface using @theme utilities.
import type { GlobalProvider } from "@ladle/react";
import { I18nProvider } from "@lingui/react";
import "../src/styles/fonts.css";
// tailwind.css is the single Tailwind root: it `@import`s ../src/styles/theme.css
// (the one generated token source) and adds the @source Ladle needs because its
// Vite root is the bundled app dir in node_modules, not this package — see the file.
import "./tailwind.css";
import { i18n } from "../src/shared/uikit/_i18n";

// KIT-08 language switch (RESEARCH Pattern 4): the GlobalProvider reads the `locale`
// global control declared in config.mjs (the global-control-arg path, D-04 — mirrors the
// disabled `theme` addon precedent, no custom addon-button file), re-activates that locale
// on the shared runtime instance per render, and wraps every story in `<I18nProvider>` so a
// story's `i18n._({ id, message, values })` resolves in the chosen language. Toggling the
// control re-renders every catalogued story bilingually (SC#2). The instance + the
// fonts.css → tailwind.css import-once order are untouched; I18nProvider wraps, never reorders.
export const Provider: GlobalProvider = ({ globalState, children }) => {
  const locale = (globalState.control?.["locale"]?.value as "ru" | "en") ?? "ru";
  i18n.activate(locale);
  return (
    <I18nProvider i18n={i18n}>
      <div className="bg-bg-0 text-text-primary font-body min-h-screen p-4">{children}</div>
    </I18nProvider>
  );
};
