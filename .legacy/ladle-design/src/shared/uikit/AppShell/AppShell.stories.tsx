// AppShell catalog stories (KIT-01, reworked GAP-01/02/03/04). `Shell` renders the
// full composed three-zone frame — SkipLink → <header> (three-zone NavBar) →
// <main id="main"> → <nav> (5-tab MobileTabBar) — with a placeholder page content
// slot; the page (not the shell) owns the meaningful <h1>. `Roles` demonstrates the
// role-aware slots ×4 (universal account per signed-in role + the role extras + the
// mobile account/sign-in 5th tab). The landmark order + the 360px no-h-scroll + the
// RAISED `@5xl` container-keyed reflow are asserted by `tests/responsive.spec.ts`.
// Copy + role lists come from `_fixtures` / `navFixtures`.
import type { Story, StoryDefault } from "@ladle/react";
import { BarChart3 } from "lucide-react";
import { STRINGS } from "../_fixtures";
import {
  accountFor,
  type NavAccount,
  NAV_ROLES,
  type NavRole,
  navItemsFor,
  roleExtrasFor,
  isSignedIn,
} from "../NavBar";
import { AppShell } from "./AppShell";

export default {
  title: "KIT-01 Nav shell / AppShell",
} satisfies StoryDefault;

// Mobile tabs = the 4 public sections that have a page (the bottom-bar subset).
const tabsFor = (role: NavRole, lang: "ru" | "en" = "ru") =>
  navItemsFor(role, lang)
    .filter((item) => item.disabled !== true)
    .slice(0, 4);

// The mobile 5th account/sign-in tab — SHORT labels (GAP-04).
const accountTabFor = (role: NavRole, lang: "ru" | "en" = "ru"): NavAccount =>
  isSignedIn(role)
    ? { kind: "account", label: STRINGS.tabAccount[lang] }
    : { kind: "signin", label: STRINGS.tabSignIn[lang] };

// The word-mark brand node threaded into the NavBar LEFT slot.
function Brand({ lang }: { lang: "ru" | "en" }) {
  return (
    <span className="inline-flex items-center gap-2 font-display font-semibold tracking-tight text-text-primary">
      <BarChart3 className="size-5 shrink-0 text-primary" aria-hidden />
      {lang === "ru" ? "Солид Статс" : "Solid Stats"}
    </span>
  );
}

// The shared shell slots for a role + language.
function shellSlots(role: NavRole, lang: "ru" | "en") {
  return {
    items: navItemsFor(role, lang),
    tabs: tabsFor(role, lang),
    brand: <Brand lang={lang} />,
    account: accountFor(role, lang),
    roleExtras: roleExtrasFor(role, lang),
    accountTab: accountTabFor(role, lang),
    langCode: lang === "ru" ? "RU" : "EN",
    searchAriaLabel: STRINGS.navSearchAria[lang],
    languageAriaLabel: STRINGS.navLanguageAria[lang],
    skipLabel: STRINGS.skipToContent[lang],
    navAriaLabel: STRINGS.navPrimaryAria[lang],
    tabsAriaLabel: STRINGS.navMobileAria[lang],
  };
}

// A placeholder page body — the PAGE owns the meaningful <h1>, so the demo content
// supplies one to prove the shell does not emit it.
function PageContent({ lang }: { lang: "ru" | "en" }) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-xl font-semibold tracking-tight text-text-primary">
        {lang === "ru" ? "Обзор статистики" : "Stats overview"}
      </h1>
      <p className="font-body text-sm text-text-muted">
        {lang === "ru"
          ? 'Содержимое страницы монтируется в <main id="main"> — каркас не задаёт заголовок.'
          : 'Page content mounts into <main id="main"> — the shell emits no heading.'}
      </p>
    </div>
  );
}

export const Shell: Story = () => (
  <div className="h-120 bg-bg-0">
    <AppShell activeKey="overview" className="h-full" {...shellSlots("player", "ru")}>
      <PageContent lang="ru" />
    </AppShell>
  </div>
);

export const Roles: Story = () => (
  <div className="flex flex-col gap-6 bg-bg-1 p-4">
    {NAV_ROLES.map((role) => (
      <section key={role} className="flex flex-col gap-2" data-role={role}>
        <h2 className="font-body text-xs font-semibold uppercase text-text-muted">{role}</h2>
        <div className="h-80 overflow-hidden rounded-md border border-border-1">
          <AppShell activeKey="overview" className="h-full" {...shellSlots(role, "ru")}>
            <PageContent lang="ru" />
          </AppShell>
        </div>
      </section>
    ))}
  </div>
);

type PlaygroundArgs = {
  role: NavRole;
  activeKey: string;
  lang: "ru" | "en";
};

export const Playground: Story<PlaygroundArgs> = ({ role, activeKey, lang }) => (
  <div className="h-120 bg-bg-0">
    <AppShell activeKey={activeKey} className="h-full" {...shellSlots(role, lang)}>
      <PageContent lang={lang} />
    </AppShell>
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
