// ErrorState catalog stories (KIT-07). `Matrix` lays the two kinds out via StateMatrix
// in RU + EN — `system` (server failure: ref id `{id}` interpolated + a contact path)
// vs `user` (action error naming the fix). Both carry an inert recovery action button
// (≥44px, keyboard-operable) — never a blank screen. Copy comes from `_fixtures/STRINGS`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { ErrorState, type ErrorKind } from "./ErrorState";

export default {
  title: "KIT-07 Feedback / ErrorState",
} satisfies StoryDefault;

const REF_ID = "E-7F3A";

const interpolate = (s: string, id: string): string => s.replace("{id}", id);

// An inert recovery action — a real focusable button (≥44px) the catalog gate checks.
const RetryButton = ({ label }: { label: string }) => (
  <button
    type="button"
    className="inline-flex min-h-11 items-center rounded-sm border border-border-1 bg-surface-2 px-4 font-body text-sm font-semibold text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
  >
    {label}
  </button>
);

const CONTACT = { ru: "Написать в поддержку", en: "Contact support" } as const;
const RETRY = { ru: "Повторить", en: "Retry" } as const;
const USER_MSG = {
  ru: "Проверьте значение в поле и попробуйте снова.",
  en: "Check the field value and try again.",
} as const;

const KINDS: readonly ErrorKind[] = ["system", "user"];

const SystemError = ({ lang }: { lang: "ru" | "en" }) => (
  <ErrorState
    kind="system"
    message={interpolate(STRINGS.errorSystem[lang], REF_ID)}
    contact={CONTACT[lang]}
    action={<RetryButton label={RETRY[lang]} />}
  />
);

const UserError = ({ lang }: { lang: "ru" | "en" }) => (
  <ErrorState kind="user" message={USER_MSG[lang]} action={<RetryButton label={RETRY[lang]} />} />
);

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="ErrorState — виды (RU)">
      <StateCell label="system">
        <SystemError lang="ru" />
      </StateCell>
      <StateCell label="user">
        <UserError lang="ru" />
      </StateCell>
    </StateMatrix>
    <StateMatrix title="ErrorState — kinds (EN)">
      <StateCell label="system-en">
        <SystemError lang="en" />
      </StateCell>
      <StateCell label="user-en">
        <UserError lang="en" />
      </StateCell>
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  kind: ErrorKind;
};

export const Playground: Story<PlaygroundArgs> = ({ kind }) => (
  <div className="bg-bg-1 p-4">
    {kind === "system" ? <SystemError lang="ru" /> : <UserError lang="ru" />}
  </div>
);

Playground.args = { kind: "system" };
Playground.argTypes = {
  kind: {
    options: KINDS,
    control: { type: "inline-radio" },
  },
};
