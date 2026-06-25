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
    // KIT-08 language switch (GAP-01): the RU↔EN locale source is the `?locale=` URL query
    // param read by the GlobalProvider (.ladle/components.tsx → `readLocaleFromUrl`), NOT a
    // Ladle `control` addon. In Ladle 5.1.1 `addons.control.defaultState` is only a per-STORY
    // args seed — it is never merged into `globalState.control` — so the prior `control.locale`
    // declaration here was dead (it implied a working toggle that never injected the locale,
    // leaving every story stuck on RU). The URL param is persistent (survives a story switch)
    // and global (independent of any story's args), so it drives bilingual re-render on every
    // story including no-args stories (SC#2). No `control` addon block is needed.
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
