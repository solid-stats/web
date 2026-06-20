// SkipLink catalog stories (KIT-01). `Matrix` shows the link in RU + EN; because
// the link is `sr-only` until focused it sits off-screen — the dedicated
// `tests/keyboard.spec.ts` asserts it becomes visible + focus-ringed on Tab and
// targets `#main`. `Playground` exposes the label language via Ladle args. Copy
// comes from `_fixtures/STRINGS`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { SkipLink } from "./SkipLink";

export default {
  title: "KIT-01 Nav shell / SkipLink",
} satisfies StoryDefault;

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    {/* A real `#main` target so the keyboard spec can assert the jump destination. */}
    <StateMatrix title="SkipLink — RU + EN (Tab to reveal)">
      <StateCell label="ru">
        <SkipLink label={STRINGS.skipToContent.ru} />
      </StateCell>
      <StateCell label="en">
        <SkipLink label={STRINGS.skipToContent.en} />
      </StateCell>
    </StateMatrix>
    <main id="main" className="rounded-md border border-border-1 bg-surface-1 p-4">
      <p className="font-body text-sm text-text-muted">#main — skip-link destination</p>
    </main>
  </div>
);

type PlaygroundArgs = {
  lang: "ru" | "en";
};

export const Playground: Story<PlaygroundArgs> = ({ lang }) => (
  <div className="bg-bg-1 p-4">
    <SkipLink label={STRINGS.skipToContent[lang]} />
    <main id="main" className="rounded-md border border-border-1 bg-surface-1 p-4">
      <p className="font-body text-sm text-text-muted">#main</p>
    </main>
  </div>
);

Playground.args = { lang: "ru" };
Playground.argTypes = {
  lang: {
    options: ["ru", "en"],
    control: { type: "inline-radio" },
  },
};
