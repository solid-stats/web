// The hardcoded bilingual RU+EN placeholder string map (D-07) — verbatim from the
// 02-UI-SPEC Copywriting Contract. This is NOT a real i18n harness (KIT-08 /
// Phase 3); it is a co-located fixture so every Phase-2 story renders both
// languages from one source. RU is the primary display language; EN mirrors at
// parity. Rendered via JSX (auto-escaped) — never dangerouslySetInnerHTML (V5).

/** A single copy element in both display languages. */
export type Bilingual = {
  readonly ru: string;
  readonly en: string;
};

/**
 * Every Phase-2 copy element, RU + EN. Keys are stable identifiers; both
 * languages are present for each (the QUAL-05 parity proof). Strings carrying a
 * `{placeholder}` (N, {id}, {col}) are interpolated at render time by the story.
 */
export const STRINGS = {
  freshnessUpToDate: { ru: "Актуально", en: "Up to date" },
  freshnessStale: { ru: "Данные устаревают", en: "Stale" },
  freshnessOffline: { ru: "Связь потеряна", en: "Offline" },
  freshnessReconnecting: { ru: "Переподключение", en: "Reconnecting" },
  provenanceLine: {
    ru: "посчитано из {n} реплеев · {freshness} · Как считается",
    en: "computed from {n} replays · {freshness} · How it's computed",
  },
  unknownBadge: { ru: "Неизвестно", en: "Unknown" },
  conflictBadge: { ru: "Конфликт", en: "Conflict" },
  knownBadge: { ru: "Известно", en: "Known" },
  inlineReviewRow: { ru: "на проверке", en: "under review" },
  staleBanner: { ru: "Данные могут быть устаревшими", en: "Data may be out of date" },
  offlineBanner: {
    ru: "Связь потеряна — показываем последние данные",
    en: "Offline — showing last known data",
  },
  reconnectingBanner: { ru: "Переподключение…", en: "Reconnecting…" },
  emptyTableHeading: { ru: "Нет данных", en: "No data" },
  emptyTableBody: {
    ru: "Игроки появятся здесь после первого пересчёта.",
    en: "Players appear here after the first recompute.",
  },
  emptyFilteredBody: {
    ru: "Никто не подходит под фильтры — сбросьте фильтры, чтобы увидеть всех ({n}).",
    en: "No one matches these filters — clear filters to see all {n}.",
  },
  errorSystem: {
    ru: "Не удалось загрузить. Код: {id}. Сообщите нам, если повторяется.",
    en: "Could not load. Ref: {id}. Contact us if it persists.",
  },
  loadingColdAggregate: { ru: "Пересчитываем агрегат…", en: "Recomputing aggregate…" },
  mobileShowMore: { ru: "показать ещё · {n}", en: "show more · {n}" },
  densityToggle: {
    ru: "Плотность: Обычная / Компактная",
    en: "Density: Comfortable / Compact",
  },
  // The DensityToggle group label + the two per-option labels (the `densityToggle`
  // string above is the combined Copywriting-Contract phrase; the toggle control
  // needs them split into the group name + each option word).
  densityGroup: { ru: "Плотность", en: "Density" },
  densityComfortable: { ru: "Обычная", en: "Comfortable" },
  densityCompact: { ru: "Компактная", en: "Compact" },
  sortHeaderAria: { ru: "сортировать по {col}", en: "sort by {col}" },
  paginationPrev: { ru: "Назад", en: "Prev" },
  paginationNext: { ru: "Дальше", en: "Next" },
  // The Pagination/CursorAffordance end-of-list marker (no more pages this phase —
  // inert, no server). RU primary / EN mirror at parity.
  paginationEnd: { ru: "Это всё", en: "End of list" },
  tierLevels: { ru: "ниже / норма / хорошо / отлично", en: "below / normal / good / excellent" },
  outcomeWin: { ru: "П", en: "W" },
  outcomeLoss: { ru: "пор.", en: "L" },
  // Moderation request status vocabulary (KIT-07 badge-status-*). The fixed set the
  // design-review Pillar 6 asserts; RU primary / EN mirror at parity.
  statusPending: { ru: "На рассмотрении", en: "Pending" },
  statusApproved: { ru: "Одобрено", en: "Approved" },
  statusRejected: { ru: "Отклонено", en: "Rejected" },
  // KIT-01 nav-shell copy (skip link + role-aware nav sections). The public
  // sections mirror the hi-fi shell semantics; the role slots (login / my-requests
  // / queue / admin) are the visual-only role additions (NO RBAC — v1.0). RU
  // primary / EN mirror at parity (QUAL-05).
  skipToContent: { ru: "Перейти к содержимому", en: "Skip to content" },
  navOverview: { ru: "Обзор", en: "Overview" },
  navPlayers: { ru: "Игроки", en: "Players" },
  navSquads: { ru: "Отряды", en: "Squads" },
  navBounty: { ru: "Награды", en: "Bounty" },
  navCommanders: { ru: "Командиры", en: "Commanders" },
  navReplays: { ru: "Реплеи", en: "Replays" },
  navSignIn: { ru: "Войти", en: "Sign in" },
  navMyRequests: { ru: "Мои заявки", en: "My requests" },
  navQueue: { ru: "Очередь", en: "Queue" },
  navAdmin: { ru: "Админка", en: "Admin" },
  // Landmark aria-labels for the two nav regions (distinguished for SR users).
  navPrimaryAria: { ru: "Основная навигация", en: "Primary" },
  navMobileAria: { ru: "Мобильная навигация", en: "Mobile" },
  // KIT-03 stat-primitive copy. The headline metric labels (hero tiles + the even
  // mini-stat grid) in metric-priority order, and the tier-chip threshold template
  // («≥2.4 ХОРОШО»). RU primary / EN mirror at parity (QUAL-05).
  statScore: { ru: "Счёт", en: "Score" },
  statKd: { ru: "K/D", en: "K/D" },
  statGames: { ru: "Игры", en: "Games" },
  statKills: { ru: "Убийства", en: "Kills" },
  statTk: { ru: "ТК", en: "TK" },
  statDeaths: { ru: "Смерти", en: "Deaths" },
  statBounty: { ru: "Награда", en: "Bounty" },
  statDeathsTk: { ru: "Смерти от ТК", en: "Deaths from TK" },
  statEmpty: { ru: "Нет статистики", en: "No stats yet" },
  // Tier threshold chip: «≥{t} {level}» (e.g. «≥2.4 ХОРОШО»). The level word is the
  // UPPERCASED tier name; the chip pairs the tier color with this word + pips.
  tierThreshold: { ru: "≥{t} {level}", en: "≥{t} {level}" },
  tierScaleAria: { ru: "Уровень: {level}", en: "Tier: {level}" },
  // Sparkline accessible summary: the chart is aria-hidden, this figcaption carries
  // the value series for screen readers (never color-alone).
  sparklineSummary: { ru: "Недельный счёт: {values}", en: "Weekly score: {values}" },
} as const satisfies Readonly<Record<string, Bilingual>>;

/** The set of copy-element keys (derived — never hand-maintained in parallel). */
export type StringKey = keyof typeof STRINGS;
