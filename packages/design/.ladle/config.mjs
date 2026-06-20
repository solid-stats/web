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
    width: { enabled: true },
  },
};
