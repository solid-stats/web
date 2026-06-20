// MobileTabBar catalog stories (KIT-01). `Matrix` lays the ×7 tab states out via
// forced `data-state` (RESEARCH Pattern 2) plus a roles ×4 demonstration in RU + EN.
// Each tab is a ≥44×44 box (asserted by the catalog 44px geometry test + the
// responsive spec). `Playground` exposes `activeKey` + `role` + `lang`. The active
// tab is cyan + `aria-current="page"` + a cyan top marker (never color-alone). Copy
// + role lists come from `_fixtures` / `navFixtures`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { NAV_ROLES, type NavRole, navItemsFor } from "../NavBar";
import type { NavItemState } from "../NavBar";
import { StateCell, StateMatrix } from "../_state-matrix";
import { MobileTabBar } from "./MobileTabBar";

export default {
  title: "KIT-01 Nav shell / MobileTabBar",
} satisfies StoryDefault;

// Mobile shows a focused 4-tab subset (the primary public sections that have a page).
const tabsFor = (role: NavRole, lang: "ru" | "en" = "ru") =>
  navItemsFor(role, lang)
    .filter((item) => item.disabled !== true)
    .slice(0, 4);

const FORCED_STATES: readonly NavItemState[] = ["enabled", "hover", "pressed", "focused"];
const ONE = tabsFor("signed-out").slice(0, 1);

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="MobileTabBar — состояния таба ×7 (forced data-state)">
      {FORCED_STATES.map((state) => (
        <StateCell key={state} label={state}>
          <MobileTabBar
            items={ONE}
            activeKey="none"
            ariaLabel={`${STRINGS.navMobileAria.ru} — ${state}`}
            forcedState={state}
          />
        </StateCell>
      ))}
      <StateCell label="selected">
        <MobileTabBar
          items={ONE}
          activeKey="overview"
          ariaLabel={`${STRINGS.navMobileAria.ru} — selected`}
        />
      </StateCell>
      <StateCell label="disabled">
        <MobileTabBar
          items={[
            { key: "squads", label: STRINGS.navSquads.ru, icon: ONE[0].icon, disabled: true },
          ]}
          activeKey="none"
          ariaLabel={`${STRINGS.navMobileAria.ru} — disabled`}
        />
      </StateCell>
    </StateMatrix>

    <StateMatrix title="MobileTabBar — роли ×4 (RU)">
      {NAV_ROLES.map((role) => (
        <StateCell key={role} label={role}>
          <MobileTabBar
            items={tabsFor(role, "ru")}
            activeKey="overview"
            ariaLabel={`${STRINGS.navMobileAria.ru} — ${role}`}
          />
        </StateCell>
      ))}
    </StateMatrix>

    <StateMatrix title="MobileTabBar — roles ×4 (EN)">
      {NAV_ROLES.map((role) => (
        <StateCell key={`${role}-en`} label={`${role}-en`}>
          <MobileTabBar
            items={tabsFor(role, "en")}
            activeKey="overview"
            ariaLabel={`${STRINGS.navMobileAria.en} — ${role}`}
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
    <MobileTabBar
      items={tabsFor(role, lang)}
      activeKey={activeKey}
      ariaLabel={STRINGS.navMobileAria[lang]}
    />
  </div>
);

Playground.args = { role: "signed-out", activeKey: "overview", lang: "ru" };
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
