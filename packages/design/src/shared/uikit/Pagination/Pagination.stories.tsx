// Pagination catalog stories (KIT-02) — the inert cursor affordance (Назад / Дальше
// + end-of-list). `Matrix` walks the cursor states (start / middle / end-of-list)
// in RU + EN; `Playground` drives hasPrev/hasNext via Ladle args. Presentational-
// only (D-01): no server, the buttons are inert; the active chevron is cyan paired
// with the label word (never icon/color-alone). Copy from `_fixtures/STRINGS`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { Pagination } from "./Pagination";

export default {
  title: "KIT-02 Data-table / Pagination",
} satisfies StoryDefault;

type Lang = "ru" | "en";

function copy(lang: Lang) {
  return {
    prevLabel: lang === "ru" ? STRINGS.paginationPrev.ru : STRINGS.paginationPrev.en,
    nextLabel: lang === "ru" ? STRINGS.paginationNext.ru : STRINGS.paginationNext.en,
    endLabel: lang === "ru" ? STRINGS.paginationEnd.ru : STRINGS.paginationEnd.en,
  };
}

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="Pagination — состояния курсора (RU)">
      <StateCell label="start">
        <Pagination {...copy("ru")} hasPrev={false} hasNext />
      </StateCell>
      <StateCell label="middle">
        <Pagination {...copy("ru")} hasPrev hasNext />
      </StateCell>
      <StateCell label="end-of-list">
        <Pagination {...copy("ru")} hasPrev hasNext={false} />
      </StateCell>
    </StateMatrix>
    <StateMatrix title="Pagination — cursor states (EN)">
      <StateCell label="start-en">
        <Pagination {...copy("en")} hasPrev={false} hasNext />
      </StateCell>
      <StateCell label="middle-en">
        <Pagination {...copy("en")} hasPrev hasNext />
      </StateCell>
      <StateCell label="end-of-list-en">
        <Pagination {...copy("en")} hasPrev hasNext={false} />
      </StateCell>
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  hasPrev: boolean;
  hasNext: boolean;
};

export const Playground: Story<PlaygroundArgs> = ({ hasPrev, hasNext }) => (
  <div className="max-w-md bg-bg-1 p-4">
    <Pagination {...copy("ru")} hasPrev={hasPrev} hasNext={hasNext} />
  </div>
);

Playground.args = { hasPrev: true, hasNext: true };
Playground.argTypes = {
  hasPrev: { control: { type: "boolean" } },
  hasNext: { control: { type: "boolean" } },
};
