// NavBar catalog stories (KIT-01, reworked GAP-01/02). The bar is now a THREE-ZONE
// shell: [Brand] [section links] [right cluster: search · language · account/sign-in].
// `Matrix` lays the ×7 nav-item states out via forced `data-state` (RESEARCH
// Pattern 2) — enabled / hover / pressed / focused / selected / disabled (loading n/a
// for nav) — plus a roles ×4 demonstration in RU + EN proving GAP-02: every signed-in
// role (player / moderator / admin) shows the UNIVERSAL account entry; signed-out
// shows the Steam sign-in; role extras (queue / admin) ADD to the cluster.
// `Playground` exposes `activeKey` + `role` + `lang`. Copy + role model come from
// `_fixtures` / `navFixtures`.
import type { Story, StoryDefault } from "@ladle/react";
import { BarChart3 } from "lucide-react";
import { STRINGS } from "../_fixtures";
import { StateCell, StateMatrix } from "../_state-matrix";
import { NavBar, type NavItemState } from "./NavBar";
import { accountFor, NAV_ROLES, type NavRole, navItemsFor, roleExtrasFor } from "./navFixtures";

export default {
  title: "KIT-01 Nav shell / NavBar",
} satisfies StoryDefault;

// A small word-mark brand node (a Lucide glyph + the product name) — the consumer
// passes this into the LEFT slot; the catalog supplies one so the three zones render.
function Brand({ lang }: { lang: "ru" | "en" }) {
  return (
    <span className="inline-flex items-center gap-2 font-display font-semibold tracking-tight text-text-primary">
      <BarChart3 className="size-5 shrink-0 text-primary" aria-hidden />
      {lang === "ru" ? "Солид Статс" : "Solid Stats"}
    </span>
  );
}

// The ×7 nav-item states (loading n/a for nav). `selected` is shown via the active
// item, `disabled` via a disabled item — the rest via the forced `data-state`.
const FORCED_STATES: readonly NavItemState[] = ["enabled", "hover", "pressed", "focused"];

// A single-section list to isolate one nav item per forced-state cell.
const ONE = navItemsFor("signed-out").slice(0, 1);

// Shared right-cluster props for a role + language (account + extras + the two
// icon-only control labels + the language code).
function clusterProps(role: NavRole, lang: "ru" | "en") {
  return {
    account: accountFor(role, lang),
    roleExtras: roleExtrasFor(role, lang),
    langCode: lang === "ru" ? "RU" : "EN",
    searchAriaLabel: STRINGS.navSearchAria[lang],
    languageAriaLabel: STRINGS.navLanguageAria[lang],
  };
}

export const Matrix: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    <StateMatrix title="NavBar — состояния пункта ×7 (forced data-state)">
      {FORCED_STATES.map((state) => (
        <StateCell key={state} label={state}>
          <NavBar
            items={ONE}
            activeKey="none"
            ariaLabel={`${STRINGS.navPrimaryAria.ru} — ${state}`}
            {...clusterProps("signed-out", "ru")}
            forcedState={state}
          />
        </StateCell>
      ))}
      <StateCell label="selected">
        <NavBar
          items={ONE}
          activeKey="overview"
          ariaLabel={`${STRINGS.navPrimaryAria.ru} — selected`}
          {...clusterProps("signed-out", "ru")}
        />
      </StateCell>
      <StateCell label="disabled">
        <NavBar
          items={[
            { key: "squads", label: STRINGS.navSquads.ru, icon: ONE[0].icon, disabled: true },
          ]}
          activeKey="none"
          ariaLabel={`${STRINGS.navPrimaryAria.ru} — disabled`}
          {...clusterProps("signed-out", "ru")}
        />
      </StateCell>
    </StateMatrix>

    <StateMatrix title="NavBar — три зоны · роли ×4 (RU)">
      {NAV_ROLES.map((role) => (
        <StateCell key={role} label={role}>
          <NavBar
            items={navItemsFor(role, "ru")}
            activeKey="overview"
            ariaLabel={`${STRINGS.navPrimaryAria.ru} — ${role}`}
            brand={<Brand lang="ru" />}
            {...clusterProps(role, "ru")}
          />
        </StateCell>
      ))}
    </StateMatrix>

    <StateMatrix title="NavBar — three zones · roles ×4 (EN)">
      {NAV_ROLES.map((role) => (
        <StateCell key={`${role}-en`} label={`${role}-en`}>
          <NavBar
            items={navItemsFor(role, "en")}
            activeKey="overview"
            ariaLabel={`${STRINGS.navPrimaryAria.en} — ${role}`}
            brand={<Brand lang="en" />}
            {...clusterProps(role, "en")}
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
      brand={<Brand lang={lang} />}
      {...clusterProps(role, lang)}
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
