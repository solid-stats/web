import type { Story, StoryDefault } from "@ladle/react";
import { PUBLIC_STATS, PUBLIC_STATS_VOLUMES } from "../_fixtures";
import { PublicStatsStoryFrame } from "../_harness";
import type { PublicStatsHarnessState, PublicStatsLang } from "../_harness";
import { PlayerProfile } from "./PlayerProfile";
import type { PlayerProfileTab } from "./PlayerProfile";

export default {
  title: "public-stats / player-profile",
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

export const Success: Story = () => <PlayerProfile lang="en" profile={PUBLIC_STATS.profile} />;

export const ScenarioEndings: Story = () => (
  <PublicStatsStoryFrame lang="en">
    <div className="grid gap-4 bg-bg-0 p-4 @5xl:grid-cols-2">
      {STATES.map((state) => (
        <div key={state} className="overflow-hidden rounded-md border border-border-1">
          <PlayerProfile
            lang="en"
            state={state}
            profile={state === "empty" ? PUBLIC_STATS_VOLUMES.profile.empty : PUBLIC_STATS.profile}
            mode={state === "loading" ? "loading" : "ready"}
          />
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
          <PlayerProfile lang="en" profile={PUBLIC_STATS_VOLUMES.profile[volume]} />
        </div>
      ))}
    </div>
  </PublicStatsStoryFrame>
);

type ResponsiveArgs = {
  readonly lang: PublicStatsLang;
  readonly tab: PlayerProfileTab;
};

export const Responsive: Story<ResponsiveArgs> = ({ lang, tab }) => (
  <PlayerProfile lang={lang} profile={PUBLIC_STATS_VOLUMES.profile.limitReached} activeTab={tab} />
);

Responsive.args = { lang: "en", tab: "replays" };
Responsive.argTypes = {
  lang: {
    options: ["ru", "en"],
    control: { type: "inline-radio" },
  },
  tab: {
    options: ["rotation", "bounty", "history", "replays"],
    control: { type: "inline-radio" },
  },
};

export const Cls: Story = () => (
  <PublicStatsStoryFrame lang="en">
    <div className="grid gap-4 bg-bg-0 p-4">
      <div data-profile-cls-loading>
        <PlayerProfile lang="en" profile={PUBLIC_STATS.profile} mode="loading" />
      </div>
      <div data-profile-cls-ready>
        <PlayerProfile lang="en" profile={PUBLIC_STATS.profile} />
      </div>
    </div>
  </PublicStatsStoryFrame>
);
