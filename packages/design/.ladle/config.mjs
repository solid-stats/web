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
