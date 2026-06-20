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
  sortHeaderAria: { ru: "сортировать по {col}", en: "sort by {col}" },
  paginationPrev: { ru: "Назад", en: "Prev" },
  paginationNext: { ru: "Дальше", en: "Next" },
  tierLevels: { ru: "ниже / норма / хорошо / отлично", en: "below / normal / good / excellent" },
  outcomeWin: { ru: "П", en: "W" },
  outcomeLoss: { ru: "пор.", en: "L" },
  // Moderation request status vocabulary (KIT-07 badge-status-*). The fixed set the
  // design-review Pillar 6 asserts; RU primary / EN mirror at parity.
  statusPending: { ru: "На рассмотрении", en: "Pending" },
  statusApproved: { ru: "Одобрено", en: "Approved" },
  statusRejected: { ru: "Отклонено", en: "Rejected" },
} as const satisfies Readonly<Record<string, Bilingual>>;

/** The set of copy-element keys (derived — never hand-maintained in parallel). */
export type StringKey = keyof typeof STRINGS;
