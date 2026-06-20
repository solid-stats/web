// NavBar catalog stories (KIT-01). `Matrix` lays the ×7 nav-item states out via
// forced `data-state` (RESEARCH Pattern 2) — enabled / hover / pressed / focused /
// selected / disabled (loading n/a for nav) — plus a roles ×4 demonstration
// (signed-out / player / moderator / admin item lists) in RU + EN. `Playground`
// exposes `activeKey` + `role` + `lang` via Ladle args. The active item is cyan +
// `aria-current="page"` + a cyan inset edge marker (never color-alone). Copy +
// role lists come from `_fixtures` / `navFixtures`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { NavBar, type NavItemState } from "./NavBar";
import { NAV_ROLES, type NavRole, navItemsFor } from "./navFixtures";

export default {
  title: "KIT-01 Nav shell / NavBar",
} satisfies StoryDefault;

// The ×7 nav-item states (loading n/a for nav). `selected` is shown via the active
// item, `disabled` via a disabled item — the rest via the forced `data-state`.
const FORCED_STATES: readonly NavItemState[] = ["enabled", "hover", "pressed", "focused"];

// A single-section list to isolate one nav item per forced-state cell.
const ONE = navItemsFor("signed-out").slice(0, 1);

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="NavBar — состояния пункта ×7 (forced data-state)">
      {FORCED_STATES.map((state) => (
        <StateCell key={state} label={state}>
          <NavBar
            items={ONE}
            activeKey="none"
            ariaLabel={`${STRINGS.navPrimaryAria.ru} — ${state}`}
            forcedState={state}
          />
        </StateCell>
      ))}
      <StateCell label="selected">
        <NavBar
          items={ONE}
          activeKey="overview"
          ariaLabel={`${STRINGS.navPrimaryAria.ru} — selected`}
        />
      </StateCell>
      <StateCell label="disabled">
        <NavBar
          items={[
            { key: "squads", label: STRINGS.navSquads.ru, icon: ONE[0].icon, disabled: true },
          ]}
          activeKey="none"
          ariaLabel={`${STRINGS.navPrimaryAria.ru} — disabled`}
        />
      </StateCell>
    </StateMatrix>

    <StateMatrix title="NavBar — роли ×4 (RU)">
      {NAV_ROLES.map((role) => (
        <StateCell key={role} label={role}>
          <NavBar
            items={navItemsFor(role, "ru")}
            activeKey="overview"
            ariaLabel={`${STRINGS.navPrimaryAria.ru} — ${role}`}
          />
        </StateCell>
      ))}
    </StateMatrix>

    <StateMatrix title="NavBar — roles ×4 (EN)">
      {NAV_ROLES.map((role) => (
        <StateCell key={`${role}-en`} label={`${role}-en`}>
          <NavBar
            items={navItemsFor(role, "en")}
            activeKey="overview"
            ariaLabel={`${STRINGS.navPrimaryAria.en} — ${role}`}
          />
        </StateCell>
      ))}
    </StateMatrix>
  </div>
);

type PlaygroundArgs = {
  role: NavRole;
  activeKey: string;
  lang: "ru" | "en";
};

export const Playground: Story<PlaygroundArgs> = ({ role, activeKey, lang }) => (
  <div className="bg-bg-1 p-4">
    <NavBar
      items={navItemsFor(role, lang)}
      activeKey={activeKey}
      ariaLabel={STRINGS.navPrimaryAria[lang]}
    />
  </div>
);

Playground.args = { role: "player", activeKey: "overview", lang: "ru" };
Playground.argTypes = {
  role: {
    options: NAV_ROLES,
    control: { type: "inline-radio" },
  },
  activeKey: {
    options: ["overview", "players", "bounty", "replays"],
    control: { type: "inline-radio" },
  },
  lang: {
    options: ["ru", "en"],
    control: { type: "inline-radio" },
  },
};
