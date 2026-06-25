// Ladle config (UserConfig). Dark-only: the theme addon toggle is disabled and
// the single gunmetal @theme palette is the only state — there is no light
// variant and no `dark:` class strategy to switch (RESEARCH Pattern 2). Stories
// are colocated `*.stories.tsx` and source-scanned by Tailwind v4.
/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: "src/**/*.stories.{ts,tsx}",
  defaultStory: "smoke--tokens",
  addons: {
    theme: { enabled: false, defaultState: "dark" },
    // KIT-08 language switch (D-04, RESEARCH Open Question 2 — the global-control-arg path,
    // version-stable in 5.1.1). Seeds a `locale` global control (RU primary ↔ EN) into
    // `globalState.control`; the GlobalProvider (components.tsx) reads `control.locale.value`
    // and re-activates the runtime i18n instance, so toggling RU↔EN re-renders every story
    // bilingually (SC#2). `inline-radio` gives the two-value toggle that mirrors the disabled
    // `theme` global-toggle precedent without a custom addon-button component file.
    control: {
      enabled: true,
      defaultState: {
        locale: {
          type: "inline-radio",
          name: "Language",
          options: ["ru", "en"],
          defaultValue: "ru",
          value: "ru",
        },
      },
    },
    // Canonical design/review widths (design-system.md): the 360 mobile floor
    // (QUAL-02) + 390/414 mobile spot-checks, then tablet/laptop/desktop and the
    // large-screen tokens. Ladle's stock presets start at 414, so the 360 floor
    // that responsive.spec pins was never pickable in the UI until now.
    width: {
      enabled: true,
      options: {
        mobile: 360,
        "mobile-390": 390,
        "mobile-414": 414,
        tablet: 768,
        laptop: 1024,
        desktop: 1280,
        "wide-1920": 1920,
        "wide-2560": 2560,
      },
    },
  },
};
