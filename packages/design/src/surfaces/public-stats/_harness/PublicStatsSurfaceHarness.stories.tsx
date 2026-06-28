import type { Story, StoryDefault } from "@ladle/react";
import {
  PublicStatsStateMatrix,
  PublicStatsSurfaceHarness,
  PublicStatsStoryFrame,
} from "./PublicStatsSurfaceHarness";
import type { PublicStatsHarnessState, PublicStatsLang } from "./PublicStatsSurfaceHarness";

export default {
  title: "public-stats shared / Surface harness",
} satisfies StoryDefault;

function Content({ lang }: { readonly lang: PublicStatsLang }) {
  return (
    <div className="rounded-md border border-border-1 bg-surface-1 p-4">
      <p className="font-body text-sm text-text-primary">
        {lang === "ru"
          ? "Единый shell, freshness, provenance и AsyncBoundary для Phase 4 поверхностей."
          : "Shared shell, freshness, provenance, and AsyncBoundary for Phase 4 surfaces."}
      </p>
    </div>
  );
}

export const Success: Story = () => (
  <PublicStatsSurfaceHarness lang="ru" activeKey="players" state="success">
    <Content lang="ru" />
  </PublicStatsSurfaceHarness>
);

export const Matrix: Story = () => <PublicStatsStateMatrix lang="ru" />;

type PlaygroundArgs = {
  readonly lang: PublicStatsLang;
  readonly state: PublicStatsHarnessState;
  readonly activeKey: string;
};

export const Playground: Story<PlaygroundArgs> = ({ lang, state, activeKey }) => (
  <PublicStatsStoryFrame lang={lang}>
    <PublicStatsSurfaceHarness lang={lang} activeKey={activeKey} state={state}>
      <Content lang={lang} />
    </PublicStatsSurfaceHarness>
  </PublicStatsStoryFrame>
);

Playground.args = { lang: "ru", state: "success", activeKey: "players" };
Playground.argTypes = {
  lang: {
    options: ["ru", "en"],
    control: { type: "inline-radio" },
  },
  state: {
    options: ["success", "loading", "empty", "error", "offline", "reconnecting", "stale"],
    control: { type: "inline-radio" },
  },
  activeKey: {
    options: ["overview", "players", "bounty", "replays"],
    control: { type: "inline-radio" },
  },
};
