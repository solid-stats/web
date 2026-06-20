// InlineReviewRow catalog stories (KIT-04). `Matrix` shows the footnote in RU + EN,
// and — to prove it is a footnote, NOT a banner — renders it inside a mock SteamID
// list cell. `Playground` exposes nothing variant-wise (single shape). The «на
// проверке» word comes from `_fixtures/STRINGS`; the request-link label is supplied
// by the consumer (the request surface is Phase-8 authenticated, D-05 — it is not in
// the Phase-2 Copywriting Contract).
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { InlineReviewRow } from "./InlineReviewRow";

export default {
  title: "KIT-04 Data-trust / InlineReviewRow",
} satisfies StoryDefault;

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="InlineReviewRow — footnote (RU)">
      <StateCell label="ru">
        <InlineReviewRow label={STRINGS.inlineReviewRow.ru} requestLabel="запросить пересчёт" />
      </StateCell>
      <StateCell label="ru-in-list">
        {/* Proof it reads as a footnote INSIDE a SteamID list, not a filled banner. */}
        <ul className="flex flex-col gap-1">
          <li className="font-mono text-xs tabular-nums text-text-primary">7656119800000001</li>
          <li className="font-mono text-xs tabular-nums text-text-primary">7656119800000002</li>
          <li>
            <InlineReviewRow label={STRINGS.inlineReviewRow.ru} requestLabel="запросить пересчёт" />
          </li>
        </ul>
      </StateCell>
    </StateMatrix>
    <StateMatrix title="InlineReviewRow — footnote (EN)">
      <StateCell label="en">
        <InlineReviewRow label={STRINGS.inlineReviewRow.en} requestLabel="request recompute" />
      </StateCell>
    </StateMatrix>
  </div>
);

export const Playground: Story = () => (
  <div className="bg-bg-1 p-4">
    <InlineReviewRow label={STRINGS.inlineReviewRow.ru} requestLabel="запросить пересчёт" />
  </div>
);
