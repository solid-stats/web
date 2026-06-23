// Pagination catalog stories (KIT-02) — the REAL controlled pager (GAP-07): a «N–M из
// total» range indicator framed by Назад / Дальше. `Matrix` walks the pager states
// (start = Prev disabled / middle = both enabled / end-of-list = Next disabled) in
// RU + EN; `Playground` drives hasPrev/hasNext + the window via Ladle args.
// Presentational-only (D-01): no server, the buttons are inert; the active chevron is
// cyan paired with the label word (never icon/color-alone). Copy from `_fixtures/STRINGS`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Pagination } from "./Pagination";

export default {
  title: "KIT-02 Data-table / Pagination",
} satisfies StoryDefault;

type Lang = "ru" | "en";

// The fixed total the pager walks across (the few/limit cue, GAP-14): 200 results,
// 8 per page, so start = «1–8 из 200», end-of-list = «193–200 из 200».
const TOTAL = 200;
const PAGE = 8;

// Build the controlled pager props for a given page window + language. `from`/`to`/`total`
// drive both the interpolated range STRING and the data hooks; hasPrev/hasNext derive
// from the window position (start has no prev, end has no next).
function pager(lang: Lang, from: number, to: number) {
  const tpl = lang === "ru" ? STRINGS.paginationRange.ru : STRINGS.paginationRange.en;
  const rangeLabel = tpl
    .replace("{from}", String(from))
    .replace("{to}", String(to))
    .replace("{total}", String(TOTAL));
  return {
    prevLabel: lang === "ru" ? STRINGS.paginationPrev.ru : STRINGS.paginationPrev.en,
    nextLabel: lang === "ru" ? STRINGS.paginationNext.ru : STRINGS.paginationNext.en,
    rangeLabel,
    from,
    to,
    total: TOTAL,
    hasPrev: from > 1,
    hasNext: to < TOTAL,
  };
}

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="Pagination — состояния пейджера (RU)">
      <StateCell label="start">
        {/* «1–8 из 200» — Prev disabled at the start. */}
        <Pagination {...pager("ru", 1, PAGE)} />
      </StateCell>
      <StateCell label="middle">
        {/* «97–104 из 200» — both enabled. */}
        <Pagination {...pager("ru", 97, 104)} />
      </StateCell>
      <StateCell label="end-of-list">
        {/* «193–200 из 200» — Next disabled at the end (no bare «Это всё» text, GAP-07). */}
        <Pagination {...pager("ru", TOTAL - PAGE + 1, TOTAL)} />
      </StateCell>
    </StateMatrix>
    <StateMatrix title="Pagination — pager states (EN)">
      <StateCell label="start-en">
        <Pagination {...pager("en", 1, PAGE)} />
      </StateCell>
      <StateCell label="middle-en">
        <Pagination {...pager("en", 97, 104)} />
      </StateCell>
      <StateCell label="end-of-list-en">
        <Pagination {...pager("en", TOTAL - PAGE + 1, TOTAL)} />
      </StateCell>
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  from: number;
  to: number;
};

export const Playground: Story<PlaygroundArgs> = ({ from, to }) => (
  <div className="max-w-md bg-bg-1 p-4">
    <Pagination {...pager("ru", from, to)} />
  </div>
);

Playground.args = { from: 97, to: 104 };
Playground.argTypes = {
  from: { control: { type: "number" } },
  to: { control: { type: "number" } },
};
