// AppShell catalog stories (KIT-01). `Shell` renders the full composed frame —
// SkipLink → <header> (NavBar) → <main id="main"> → <nav> (MobileTabBar) — with a
// placeholder page content slot; the page (not the shell) owns the meaningful <h1>.
// `Roles` demonstrates the role-aware slots ×4. The landmark order is asserted by
// `tests/keyboard.spec.ts`-adjacent DOM checks in `tests/responsive.spec.ts`, which
// also proves no horizontal scroll at the 360px floor and the container-keyed reflow
// (desktop top nav ≥ @md, MobileTabBar primary below). Copy + role lists come from
// `_fixtures` / `navFixtures`.
import type { Story, StoryDefault } from "@ladle/react";
import { STRINGS } from "../_fixtures";
import { NAV_ROLES, type NavRole, navItemsFor } from "../NavBar";
import { AppShell } from "./AppShell";

export default {
  title: "KIT-01 Nav shell / AppShell",
} satisfies StoryDefault;

// Mobile tabs = the public sections that have a page (the bottom-bar subset).
const tabsFor = (role: NavRole, lang: "ru" | "en" = "ru") =>
  navItemsFor(role, lang)
    .filter((item) => item.disabled !== true)
    .slice(0, 4);

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
    <AppShell
      items={navItemsFor("player", "ru")}
      tabs={tabsFor("player", "ru")}
      activeKey="overview"
      skipLabel={STRINGS.skipToContent.ru}
      navAriaLabel={STRINGS.navPrimaryAria.ru}
      tabsAriaLabel={STRINGS.navMobileAria.ru}
      className="h-full"
    >
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
          <AppShell
            items={navItemsFor(role, "ru")}
            tabs={tabsFor(role, "ru")}
            activeKey="overview"
            skipLabel={STRINGS.skipToContent.ru}
            navAriaLabel={`${STRINGS.navPrimaryAria.ru} — ${role}`}
            tabsAriaLabel={`${STRINGS.navMobileAria.ru} — ${role}`}
            className="h-full"
          >
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
    <AppShell
      items={navItemsFor(role, lang)}
      tabs={tabsFor(role, lang)}
      activeKey={activeKey}
      skipLabel={STRINGS.skipToContent[lang]}
      navAriaLabel={STRINGS.navPrimaryAria[lang]}
      tabsAriaLabel={STRINGS.navMobileAria[lang]}
      className="h-full"
    >
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
