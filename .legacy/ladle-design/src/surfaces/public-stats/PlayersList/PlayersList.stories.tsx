import type { Story, StoryDefault } from "@ladle/react";
import { PUBLIC_STATS, PUBLIC_STATS_VOLUMES } from "../_fixtures";
import { PublicStatsStoryFrame } from "../_harness";
import type { PublicStatsHarnessState, PublicStatsLang } from "../_harness";
import { PlayersList } from "./PlayersList";
import type { PlayersListPeriod } from "./PlayersList";

export default {
  title: "public-stats / players-list",
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

export const Success: Story = () => <PlayersList lang="en" players={PUBLIC_STATS.players} />;

export const LoadingModel: Story<{ readonly lang: PublicStatsLang }> = ({ lang }) => (
  <PublicStatsStoryFrame lang={lang}>
    <div className="grid gap-4 bg-bg-0 p-4 @5xl:grid-cols-2">
      <PlayersList lang={lang} players={PUBLIC_STATS.players} period="rotation" mode="ready" />
      <PlayersList lang={lang} players={PUBLIC_STATS.players} period="alltime" mode="ready" />
      <PlayersList lang={lang} players={PUBLIC_STATS.players} period="alltime" mode="cold" />
      <PlayersList lang={lang} players={PUBLIC_STATS.players} period="alltime" mode="inSession" />
    </div>
  </PublicStatsStoryFrame>
);

LoadingModel.args = { lang: "en" };
LoadingModel.argTypes = {
  lang: {
    options: ["ru", "en"],
    control: { type: "inline-radio" },
  },
};

export const ScenarioEndings: Story = () => (
  <PublicStatsStoryFrame lang="en">
    <div className="grid gap-4 bg-bg-0 p-4 @5xl:grid-cols-2">
      {STATES.map((state) => (
        <div key={state} className="overflow-hidden rounded-md border border-border-1">
          <PlayersList
            lang="en"
            state={state}
            players={state === "empty" ? PUBLIC_STATS_VOLUMES.players.empty : PUBLIC_STATS.players}
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
          <PlayersList lang="en" players={PUBLIC_STATS_VOLUMES.players[volume]} volume={volume} />
        </div>
      ))}
    </div>
  </PublicStatsStoryFrame>
);

type ResponsiveArgs = {
  readonly lang: PublicStatsLang;
  readonly period: PlayersListPeriod;
};

export const Responsive: Story<ResponsiveArgs> = ({ lang, period }) => (
  <PlayersList
    lang={lang}
    period={period}
    players={
      period === "alltime" ? PUBLIC_STATS_VOLUMES.players.limitReached : PUBLIC_STATS.players
    }
    volume={period === "alltime" ? "limitReached" : "few"}
  />
);

Responsive.args = { lang: "en", period: "rotation" };
Responsive.argTypes = {
  lang: {
    options: ["ru", "en"],
    control: { type: "inline-radio" },
  },
  period: {
    options: ["rotation", "alltime"],
    control: { type: "inline-radio" },
  },
};

export const Cls: Story = () => (
  <PublicStatsStoryFrame lang="en">
    <div className="grid gap-4 bg-bg-0 p-4">
      <div data-players-cls-table-loading>
        <PlayersList lang="en" players={PUBLIC_STATS.players} period="alltime" mode="cold" />
      </div>
      <div data-players-cls-table-ready>
        <PlayersList lang="en" players={PUBLIC_STATS.players} />
      </div>
      <div className="max-w-sm" data-players-cls-compact-loading>
        <PlayersList lang="en" players={PUBLIC_STATS.players} period="alltime" mode="inSession" />
      </div>
      <div className="max-w-sm" data-players-cls-compact-ready>
        <PlayersList lang="en" players={PUBLIC_STATS.players} />
      </div>
    </div>
  </PublicStatsStoryFrame>
);
