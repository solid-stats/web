// MiniStatGrid catalog stories (KIT-03). Secondary metrics for Vasiliy #1 render
// in metric-priority order (Игры → Убийства → ТК → Смерти, then Награда → Смерти
// от ТК for the "many" volume), each value tabular mono. `Matrix` proves the ×4
// data-volume states (few = 4 even tiles · many = 6 even tiles · empty = reserved
// placeholder) plus the EN parity row. Numbers come from the canonical roster, so
// the mini-grid is internally consistent with the hero tiles. Display-only — no
// interactive states.
import type { ReactNode } from "react";
import type { Story, StoryDefault } from "@ladle/react";
import { ROSTER, STRINGS } from "../_fixtures";
import { MiniStatGrid, type MiniStat } from "./MiniStatGrid";

export default {
  title: "KIT-03 Stat / MiniStatGrid",
} satisfies StoryDefault;

const VASILIY = ROSTER[0]!;
const int = (n: number): string => String(n);

type Lang = "ru" | "en";

// FEW: the 4 even secondary metrics in priority order (Score/K-D are the hero tiles).
const few = (lang: Lang): readonly MiniStat[] => [
  { key: "games", label: STRINGS.statGames[lang], value: int(VASILIY.games) },
  { key: "kills", label: STRINGS.statKills[lang], value: int(VASILIY.kills) },
  { key: "tk", label: STRINGS.statTk[lang], value: int(VASILIY.tk) },
  { key: "deaths", label: STRINGS.statDeaths[lang], value: int(VASILIY.deaths) },
];

// MANY: 6 even tiles — adds Награда + Смерти от ТК below the core four.
const many = (lang: Lang): readonly MiniStat[] => [
  ...few(lang),
  { key: "bounty", label: STRINGS.statBounty[lang], value: VASILIY.bounty.toLocaleString("ru-RU") },
  { key: "deathsTk", label: STRINGS.statDeathsTk[lang], value: int(VASILIY.deathsTk) },
];

// MiniStatGrid is a full-width multi-column block: each data-volume state renders
// in a realistically-wide row (NOT crammed into a narrow StateMatrix cell, which
// would collapse the @container reflow and overlap the tiles). The labelled row
// is the same `data-state-cell` hook the catalog spec asserts against.
function VolumeRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2" data-state-cell={label}>
      <span className="font-body text-xs font-semibold uppercase text-text-muted">{label}</span>
      {children}
    </div>
  );
}

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
      MiniStatGrid — объём данных (RU)
    </h2>
    <VolumeRow label="few">
      <MiniStatGrid stats={few("ru")} />
    </VolumeRow>
    <VolumeRow label="many">
      <MiniStatGrid stats={many("ru")} />
    </VolumeRow>
    <VolumeRow label="empty">
      <div className="max-w-sm">
        <MiniStatGrid stats={[]} emptyLabel={STRINGS.statEmpty.ru} />
      </div>
    </VolumeRow>
    <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
      MiniStatGrid — data volume (EN)
    </h2>
    <VolumeRow label="few-en">
      <MiniStatGrid stats={few("en")} />
    </VolumeRow>
    <VolumeRow label="many-en">
      <MiniStatGrid stats={many("en")} />
    </VolumeRow>
    <VolumeRow label="empty-en">
      <div className="max-w-sm">
        <MiniStatGrid stats={[]} emptyLabel={STRINGS.statEmpty.en} />
      </div>
    </VolumeRow>
  </div>
);

type PlaygroundArgs = {
  volume: "few" | "many" | "empty";
};

export const Playground: Story<PlaygroundArgs> = ({ volume }) => (
  <div className="max-w-xl bg-bg-1 p-4">
    {volume === "empty" ? (
      <MiniStatGrid stats={[]} emptyLabel={STRINGS.statEmpty.ru} />
    ) : (
      <MiniStatGrid stats={volume === "few" ? few("ru") : many("ru")} />
    )}
  </div>
);

Playground.args = { volume: "many" };
Playground.argTypes = {
  volume: {
    options: ["few", "many", "empty"],
    control: { type: "inline-radio" },
  },
};
