import type { Story, StoryDefault } from "@ladle/react";
import { PUBLIC_STATS, PUBLIC_STATS_VOLUMES } from "../_fixtures";
import { PublicStatsStoryFrame } from "../_harness";
import type { PublicStatsHarnessState, PublicStatsLang } from "../_harness";
import { StatsOverview } from "./StatsOverview";

export default {
  title: "public-stats / stats-overview",
} satisfies StoryDefault;

const STATES: readonly PublicStatsHarnessState[] = [
  "success",
  "loading",
  "empty",
  "error",
  "offline",
  "reconnecting",
  "stale",
];

const VOLUMES = ["empty", "few", "many", "limitReached"] as const;

export const Success: Story = () => <StatsOverview lang="en" overview={PUBLIC_STATS.overview} />;

export const ScenarioEndings: Story = () => (
  <PublicStatsStoryFrame lang="en">
    <div className="grid gap-4 bg-bg-0 p-4 @5xl:grid-cols-2">
      {STATES.map((state) => (
        <div key={state} className="overflow-hidden rounded-md border border-border-1">
          <StatsOverview lang="en" state={state} loading={state === "loading"} />
        </div>
      ))}
    </div>
  </PublicStatsStoryFrame>
);

export const DataVolumes: Story = () => (
  <PublicStatsStoryFrame lang="en">
    <div className="grid gap-4 bg-bg-0 p-4 @5xl:grid-cols-2">
      {VOLUMES.map((volume) => (
        <div key={volume} className="overflow-hidden rounded-md border border-border-1">
          <StatsOverview lang="en" overview={PUBLIC_STATS_VOLUMES.overview[volume]} />
        </div>
      ))}
    </div>
  </PublicStatsStoryFrame>
);

type ResponsiveArgs = {
  readonly lang: PublicStatsLang;
};

export const Responsive: Story<ResponsiveArgs> = ({ lang }) => (
  <StatsOverview lang={lang} overview={PUBLIC_STATS.overview} />
);

Responsive.args = { lang: "en" };
Responsive.argTypes = {
  lang: {
    options: ["ru", "en"],
    control: { type: "inline-radio" },
  },
};

export const Cls: Story = () => (
  <PublicStatsStoryFrame lang="en">
    <div className="grid gap-4 bg-bg-0 p-4">
      <div data-overview-cls-loading>
        <StatsOverview lang="en" overview={PUBLIC_STATS.overview} loading />
      </div>
      <div data-overview-cls-ready>
        <StatsOverview lang="en" overview={PUBLIC_STATS.overview} />
      </div>
    </div>
  </PublicStatsStoryFrame>
);
