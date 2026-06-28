import type { ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { AppShell } from "../../../shared/uikit/AppShell";
import { AsyncBoundary } from "../../../shared/uikit/AsyncBoundary";
import type { AsyncState } from "../../../shared/uikit/AsyncBoundary";
import { Button } from "../../../shared/uikit/Button";
import { FreshnessPill } from "../../../shared/uikit/FreshnessPill";
import type { FreshnessState } from "../../../shared/uikit/FreshnessPill/FreshnessPill";
import { accountFor, isSignedIn, navItemsFor, roleExtrasFor } from "../../../shared/uikit/NavBar";
import type { NavAccount, NavRole } from "../../../shared/uikit/NavBar";
import { ProvenanceLine } from "../../../shared/uikit/ProvenanceLine";
import { STRINGS } from "../../../shared/uikit/_fixtures";
import { i18n } from "../../../shared/uikit/_i18n";
import { StateCell, StateMatrix } from "../../../shared/uikit/_state-matrix";
import { PUBLIC_STATS } from "../_fixtures";
import type { PublicStatsFreshness, PublicStatsProvenance } from "../_fixtures/publicStats";

export type PublicStatsLang = "ru" | "en";
export type PublicStatsHarnessState =
  | "success"
  | "loading"
  | "empty"
  | "error"
  | "offline"
  | "reconnecting"
  | "stale";

type Props = {
  readonly children: ReactNode;
  readonly lang: PublicStatsLang;
  readonly activeKey: string;
  readonly state: PublicStatsHarnessState;
  readonly provenance?: PublicStatsProvenance;
  readonly showHeaderTrust?: boolean;
  readonly title?: string;
};

type FrameProps = {
  readonly children: ReactNode;
  readonly lang?: PublicStatsLang;
};

const PUBLIC_STATS_STATES: readonly PublicStatsHarnessState[] = [
  "success",
  "loading",
  "empty",
  "error",
  "offline",
  "reconnecting",
  "stale",
];

function t(
  lang: PublicStatsLang,
  id: keyof typeof STRINGS,
  values?: Record<string, string | number>,
): string {
  i18n.activate(lang);
  return values === undefined ? i18n._({ id }) : i18n._({ id, values });
}

function tabsFor(role: NavRole, lang: PublicStatsLang) {
  return navItemsFor(role, lang)
    .filter((item) => item.disabled !== true)
    .slice(0, 4);
}

function accountTabFor(role: NavRole, lang: PublicStatsLang): NavAccount {
  return isSignedIn(role)
    ? { kind: "account", label: STRINGS.tabAccount[lang] }
    : { kind: "signin", label: STRINGS.tabSignIn[lang] };
}

function Brand({ lang }: { readonly lang: PublicStatsLang }): ReactNode {
  return (
    <span className="inline-flex items-center gap-2 font-display font-semibold tracking-tight text-text-primary">
      <BarChart3 className="size-5 shrink-0 text-primary" aria-hidden />
      {t(lang, "publicStatsBrand")}
    </span>
  );
}

function shellSlots(lang: PublicStatsLang) {
  const role: NavRole = "player";
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

function freshnessState(state: PublicStatsFreshness): FreshnessState {
  switch (state) {
    case "upToDate":
      return "up-to-date";
    case "stale":
      return "stale";
    case "offline":
      return "offline";
    case "reconnecting":
      return "reconnecting";
  }
}

function freshnessLabel(lang: PublicStatsLang, state: PublicStatsFreshness): string {
  switch (state) {
    case "upToDate":
      return t(lang, "freshnessUpToDate");
    case "stale":
      return t(lang, "freshnessStale");
    case "offline":
      return t(lang, "freshnessOffline");
    case "reconnecting":
      return t(lang, "freshnessReconnecting");
  }
}

function publicStatsAsyncState(
  lang: PublicStatsLang,
  state: PublicStatsHarnessState,
  children: ReactNode,
): AsyncState {
  switch (state) {
    case "success":
      return { kind: "ready", children };
    case "loading":
      return {
        kind: "loading",
        columns: [72, 176, 112, 112],
        rows: 4,
        label: t(lang, "loadingColdAggregate"),
      };
    case "empty":
      return {
        kind: "empty",
        heading: t(lang, "publicStatsEmptyHeading"),
        body: t(lang, "publicStatsEmptyBody"),
        action: <Button variant="secondary">{t(lang, "emptyRetry")}</Button>,
      };
    case "error":
      return {
        kind: "error",
        message: t(lang, "publicStatsSystemError", { id: "PUB-04-01" }),
        contact: t(lang, "errorSystemContact"),
        action: <Button variant="secondary">{t(lang, "errorRetry")}</Button>,
      };
    case "offline":
      return { kind: "offline", label: t(lang, "offlineBanner") };
    case "reconnecting":
      return { kind: "reconnecting", label: t(lang, "reconnectingBanner") };
    case "stale":
      return { kind: "stale", label: t(lang, "staleBanner") };
  }
}

function trustBar(lang: PublicStatsLang, provenance: PublicStatsProvenance): ReactNode {
  const label = freshnessLabel(lang, provenance.freshness);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-border-1 bg-surface-1 px-3 py-2">
      <div className="flex shrink-0 flex-wrap items-center gap-2" data-public-stats-trust>
        <FreshnessPill state={freshnessState(provenance.freshness)} label={label} />
        <span className="font-body text-xs text-text-muted">
          {t(lang, "publicStatsTrustKnown")}
        </span>
      </div>
      <ProvenanceLine
        replayCount={provenance.replayCount}
        freshnessLabel={label}
        template={t(lang, "publicStatsProvenance", {
          n: provenance.replayCount,
          freshness: label,
        })}
        locale={lang}
        linkLabel={t(lang, "publicStatsProvenanceLinkLabel")}
      />
    </div>
  );
}

function DemoContent({ lang }: { readonly lang: PublicStatsLang }): ReactNode {
  const player = PUBLIC_STATS.profile.player;
  return (
    <div className="grid gap-3 md:grid-cols-3" data-public-stats-demo-content>
      <div className="rounded-md border border-border-1 bg-surface-1 p-4">
        <p className="font-body text-xs font-semibold uppercase tracking-label text-text-muted">
          {t(lang, "publicStatsPlayersTitle")}
        </p>
        <p className="mt-2 font-display text-xl font-semibold text-text-primary">
          #{player.rank} {player.name}
        </p>
      </div>
      <div className="rounded-md border border-border-1 bg-surface-1 p-4">
        <p className="font-body text-xs font-semibold uppercase tracking-label text-text-muted">
          {t(lang, "statScore")}
        </p>
        <p className="mt-2 font-mono text-xl tabular-nums text-text-primary">
          {player.score.toFixed(2)}
        </p>
      </div>
      <div className="rounded-md border border-border-1 bg-surface-1 p-4">
        <p className="font-body text-xs font-semibold uppercase tracking-label text-text-muted">
          {t(lang, "statKd")}
        </p>
        <p className="mt-2 font-mono text-xl tabular-nums text-text-primary">
          {player.kd.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export function PublicStatsStoryFrame({ children, lang = "ru" }: FrameProps): ReactNode {
  return (
    <div className="min-h-screen bg-bg-0" lang={lang} data-public-stats-story-frame>
      {children}
    </div>
  );
}

export function PublicStatsSurfaceHarness({
  children,
  lang,
  activeKey,
  state,
  provenance = PUBLIC_STATS.overview.provenance,
  showHeaderTrust = true,
  title = t(lang, "publicStatsOverviewTitle"),
}: Props): ReactNode {
  return (
    <PublicStatsStoryFrame lang={lang}>
      <AppShell activeKey={activeKey} {...shellSlots(lang)}>
        <div className="flex flex-col gap-4" data-public-stats-surface>
          <header className="flex flex-col gap-3">
            <h1 className="font-display text-xl font-semibold tracking-tight text-text-primary">
              {title}
            </h1>
            {showHeaderTrust ? trustBar(lang, provenance) : null}
          </header>
          <AsyncBoundary state={publicStatsAsyncState(lang, state, children)} />
        </div>
      </AppShell>
    </PublicStatsStoryFrame>
  );
}

export function PublicStatsStateMatrix({ lang }: { readonly lang: PublicStatsLang }): ReactNode {
  return (
    <PublicStatsStoryFrame lang={lang}>
      <div className="flex flex-col gap-6 bg-bg-1 p-4">
        <StateMatrix title="public-stats shared shell states">
          {PUBLIC_STATS_STATES.map((state) => (
            <StateCell key={state} label={state}>
              <div className="h-120 w-full overflow-hidden rounded-md border border-border-1">
                <PublicStatsSurfaceHarness
                  lang={lang}
                  activeKey="players"
                  state={state}
                  title={t(lang, "publicStatsPlayersTitle")}
                >
                  <DemoContent lang={lang} />
                </PublicStatsSurfaceHarness>
              </div>
            </StateCell>
          ))}
        </StateMatrix>
      </div>
    </PublicStatsStoryFrame>
  );
}
