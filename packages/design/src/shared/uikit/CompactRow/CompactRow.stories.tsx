// CompactRow catalog stories (KIT-02) — the mobile (`< md`) table layout. `Mobile`
// renders the `CompactList` (top-N + «показать ещё · N») from the single roster
// (Vasiliy #1) at the 360px floor — the `responsive.spec` asserts no horizontal /
// nested scroll there. `DataVolumes` walks the ×4 list volumes; `Playground` drives
// the top-N + show-more via Ladle args. Copy is RU primary / EN mirror from STRINGS.
import type { Story, StoryDefault } from "@ladle/react";
import { ROSTER, SS_BASELINE, STRINGS, type TierMetric, tierFor, type Player } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import type { TierCell } from "../Table";
import { CompactList, type CompactRowData } from "./CompactRow";

export default {
  title: "KIT-02 Data-table / CompactRow",
} satisfies StoryDefault;

type Lang = "ru" | "en";

function tierCell(metric: TierMetric, value: number): TierCell {
  return { value: value.toFixed(2), metric, level: tierFor(metric, value, SS_BASELINE).level };
}

function toRow(p: Player, rank: number): CompactRowData {
  return {
    rank,
    name: p.name,
    squad: p.squad,
    href: `#player-${rank}`,
    score: tierCell("score", p.score),
    kd: tierCell("kd", p.kd),
  };
}

const ROWS: readonly CompactRowData[] = ROSTER.map((p, i) => toRow(p, i + 1));

function metricLabels(lang: Lang): { score: string; kd: string } {
  return {
    score: lang === "ru" ? STRINGS.statScore.ru : STRINGS.statScore.en,
    kd: lang === "ru" ? STRINGS.statKd.ru : STRINGS.statKd.en,
  };
}

function showMore(lang: Lang, n: number): string {
  const tpl = lang === "ru" ? STRINGS.mobileShowMore.ru : STRINGS.mobileShowMore.en;
  return tpl.replace("{n}", String(n));
}

function caption(lang: Lang, total: number): string {
  return lang === "ru" ? `Игроки · ${total}` : `Players · ${total}`;
}

// The headline mobile story — top-6 of the full roster + «показать ещё · N». The
// containing div is the 360px floor the responsive spec checks (the page scrolls).
export const Mobile: Story = () => {
  const topN = 6;
  return (
    <div className="mx-auto w-full max-w-sm bg-bg-1 p-3" data-compact-mobile>
      <CompactList
        rows={ROWS}
        topN={topN}
        metricLabels={metricLabels("ru")}
        showMoreLabel={showMore("ru", ROWS.length - topN)}
        caption={caption("ru", ROWS.length)}
      />
    </div>
  );
};

export const MobileEn: Story = () => {
  const topN = 6;
  return (
    <div className="mx-auto w-full max-w-sm bg-bg-1 p-3" data-compact-mobile-en>
      <CompactList
        rows={ROWS}
        topN={topN}
        metricLabels={metricLabels("en")}
        showMoreLabel={showMore("en", ROWS.length - topN)}
        caption={caption("en", ROWS.length)}
      />
    </div>
  );
};

// ×4 data-volume states for the mobile list.
export const DataVolumes: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="CompactList — объёмы данных (×4)">
      <StateCell label="few">
        <CompactList
          rows={ROWS.slice(0, 3)}
          topN={3}
          metricLabels={metricLabels("ru")}
          showMoreLabel={showMore("ru", 0)}
          caption={caption("ru", 3)}
        />
      </StateCell>
      <StateCell label="many">
        <CompactList
          rows={ROWS}
          topN={6}
          metricLabels={metricLabels("ru")}
          showMoreLabel={showMore("ru", ROWS.length - 6)}
          caption={caption("ru", ROWS.length)}
        />
      </StateCell>
      <StateCell label="limit">
        <CompactList
          rows={ROWS.slice(0, 4)}
          topN={4}
          metricLabels={metricLabels("ru")}
          showMoreLabel={showMore("ru", 0)}
          caption={caption("ru", 4)}
          expandable={false}
        />
      </StateCell>
      <StateCell label="single">
        <CompactList
          rows={ROWS.slice(0, 1)}
          topN={1}
          metricLabels={metricLabels("ru")}
          showMoreLabel={showMore("ru", 0)}
          caption={caption("ru", 1)}
        />
      </StateCell>
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  topN: number;
};

export const Playground: Story<PlaygroundArgs> = ({ topN }) => (
  <div className="mx-auto w-full max-w-sm bg-bg-1 p-3">
    <CompactList
      rows={ROWS}
      topN={topN}
      metricLabels={metricLabels("ru")}
      showMoreLabel={showMore("ru", Math.max(ROWS.length - topN, 0))}
      caption={caption("ru", ROWS.length)}
    />
  </div>
);

Playground.args = { topN: 6 };
Playground.argTypes = {
  topN: { control: { type: "range", min: 1, max: 20, step: 1 } },
};
