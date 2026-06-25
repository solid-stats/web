// MobileTabBar catalog stories (KIT-01, reworked GAP-04). The bar is now 4 primary
// public section tabs PLUS a dedicated 5th account/sign-in tab. `Matrix` lays the ×7
// tab states out via forced `data-state` (RESEARCH Pattern 2) plus a roles ×4
// demonstration in RU + EN proving the 5th tab is the account entry when signed-in
// and the Steam sign-in when signed-out. Each tab is a ≥44×44 box (asserted by the
// catalog 44px geometry test + the responsive spec). `Playground` exposes `activeKey`
// + `role` + `lang`. Copy + role lists come from `_fixtures` / `navFixtures`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { type NavAccount, NAV_ROLES, type NavRole, navItemsFor, isSignedIn } from "../NavBar";
import type { NavItemState } from "../NavBar";
import { StateCell, StateMatrix } from "../_state-matrix";
import { MobileTabBar } from "./MobileTabBar";

export default {
  title: "KIT-01 Nav shell / MobileTabBar",
} satisfies StoryDefault;

// Mobile shows the 4 primary public sections that have a page (overview · players ·
// bounty · replays — squads/commanders absent on mobile MATCHES the hi-fi).
const tabsFor = (role: NavRole, lang: "ru" | "en" = "ru") =>
  navItemsFor(role, lang)
    .filter((item) => item.disabled !== true)
    .slice(0, 4);

// The dedicated 5th tab — SHORT mobile labels (tabAccount / tabSignIn), the account
// entry when signed-in, the Steam sign-in when signed-out (GAP-04).
const accountTabFor = (role: NavRole, lang: "ru" | "en" = "ru"): NavAccount =>
  isSignedIn(role)
    ? { kind: "account", label: STRINGS.tabAccount[lang] }
    : { kind: "signin", label: STRINGS.tabSignIn[lang] };

const FORCED_STATES: readonly NavItemState[] = ["enabled", "hover", "pressed", "focused"];
// `[TAB_SAMPLE]` destructures the first tab (the disabled-state cell below borrows its
// icon); the guard narrows `NavItem | undefined` to `NavItem` without a non-null assertion.
const ONE = tabsFor("signed-out").slice(0, 1);
const [TAB_SAMPLE] = ONE;
if (TAB_SAMPLE === undefined) throw new Error("tabsFor returned no tabs");

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="MobileTabBar — состояния таба ×7 (forced data-state)">
      {FORCED_STATES.map((state) => (
        <StateCell key={state} label={state}>
          <MobileTabBar
            items={ONE}
            activeKey="none"
            ariaLabel={`${STRINGS.navMobileAria.ru} — ${state}`}
            accountTab={accountTabFor("signed-out", "ru")}
            forcedState={state}
          />
        </StateCell>
      ))}
      <StateCell label="selected">
        <MobileTabBar
          items={ONE}
          activeKey="overview"
          ariaLabel={`${STRINGS.navMobileAria.ru} — selected`}
          accountTab={accountTabFor("signed-out", "ru")}
        />
      </StateCell>
      <StateCell label="disabled">
        <MobileTabBar
          items={[
            { key: "squads", label: STRINGS.navSquads.ru, icon: TAB_SAMPLE.icon, disabled: true },
          ]}
          activeKey="none"
          ariaLabel={`${STRINGS.navMobileAria.ru} — disabled`}
          accountTab={accountTabFor("signed-out", "ru")}
        />
      </StateCell>
    </StateMatrix>

    <StateMatrix title="MobileTabBar — 5 табов · роли ×4 (RU)">
      {NAV_ROLES.map((role) => (
        <StateCell key={role} label={role}>
          <MobileTabBar
            items={tabsFor(role, "ru")}
            activeKey="overview"
            ariaLabel={`${STRINGS.navMobileAria.ru} — ${role}`}
            accountTab={accountTabFor(role, "ru")}
          />
        </StateCell>
      ))}
    </StateMatrix>

    <StateMatrix title="MobileTabBar — 5 tabs · roles ×4 (EN)">
      {NAV_ROLES.map((role) => (
        <StateCell key={`${role}-en`} label={`${role}-en`}>
          <MobileTabBar
            items={tabsFor(role, "en")}
            activeKey="overview"
            ariaLabel={`${STRINGS.navMobileAria.en} — ${role}`}
            accountTab={accountTabFor(role, "en")}
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
      accountTab={accountTabFor(role, lang)}
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
