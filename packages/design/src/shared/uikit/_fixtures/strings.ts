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
  // GAP-06: the DensityToggle was removed (density now auto-derives from the @container),
  // so its copy keys (densityToggle/densityGroup/densityComfortable/densityCompact) are
  // dropped — no consumer remained.
  sortHeaderAria: { ru: "сортировать по {col}", en: "sort by {col}" },
  paginationPrev: { ru: "Назад", en: "Prev" },
  paginationNext: { ru: "Дальше", en: "Next" },
  // GAP-07: the real-pager range/page indicator — «N–M из total» (e.g. «1–8 из 200»).
  // The end-of-list is now a DISABLED Next button (the bare «Это всё» text marker is
  // dropped). RU primary / EN mirror at parity. Interpolated at render by the story.
  paginationRange: { ru: "{from}–{to} из {total}", en: "{from}–{to} of {total}" },
  tierLevels: { ru: "ниже / норма / хорошо / отлично", en: "below / normal / good / excellent" },
  // GAP-18 / QUAL-05: the outcome badge copy is the W/L gaming shorthand in BOTH
  // languages — an INTENTIONAL non-translation. The DESIGN.md `badge-outcome-*` recipes
  // already name "W"/"L" as the paired label, and W/L is the universal community shorthand
  // (the prior asymmetric RU «П» / «пор.» read as awkward and unbalanced against the EN
  // W/L). QUAL-05 parity is satisfied: both locales carry the same shorthand by design —
  // the `ru === en` value here is deliberate, not a missing translation.
  outcomeWin: { ru: "W", en: "W" },
  outcomeLoss: { ru: "L", en: "L" },
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
  // GAP-02 nav-shell rework — the right-cluster utility controls. `navAccount` is
  // the UNIVERSAL signed-in account/profile entry (every signed-in role gets it,
  // independent of role); `navSignInSteam` is the signed-out Steam OAuth control.
  // `navSearchAria`/`navLanguageAria` name the two icon-only right-cluster controls
  // (icon-only ⇒ needs an accessible name — a11y.md). `tabAccount`/`tabSignIn` are
  // the short labels for the MobileTabBar 5th account/sign-in tab (GAP-04). RU
  // primary / EN mirror at parity (QUAL-05).
  navAccount: { ru: "Профиль", en: "Account" },
  navSignInSteam: { ru: "Войти через Steam", en: "Sign in with Steam" },
  navSearchAria: { ru: "Поиск", en: "Search" },
  navLanguageAria: { ru: "Сменить язык", en: "Switch language" },
  tabAccount: { ru: "Профиль", en: "Account" },
  tabSignIn: { ru: "Войти", en: "Sign in" },
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
  // KIT-05 form-family copy (UI-SPEC Copywriting Contract). `selectPlaceholder` is the
  // shared placeholder; `fieldRequired` is the required hint; `fieldErrorRequired` is the
  // generic by-field validation error shown in the forced-invalid cell. `fieldLabelLongest`
  // is the QUAL-05 RU-longest field label exercised at the 360 floor (RU runs longer than
  // EN). RU primary / EN mirror at parity.
  selectPlaceholder: { ru: "Выберите…", en: "Select…" },
  fieldRequired: { ru: "Обязательное поле", en: "Required" },
  fieldErrorRequired: { ru: "Заполните это поле", en: "Fill in this field" },
  fieldLabelLongest: {
    ru: "Идентификатор реплея для пересчёта",
    en: "Replay identifier for recompute",
  },
  // KIT-05 Select/Stepper copy (Plan 03-03, UI-SPEC Copywriting Contract). The
  // `stepper{Increment,Decrement}` keys are the accessible NAMES for the icon-only
  // NumberInput triggers (a11y.md — icon-only controls need an accessible name); the story
  // injects them as plain props (the slice never invents them). `selectLabel` labels the
  // demo Select field; `selectOption*` are the option-list fixtures the ×4 data-volume cells
  // populate (few / many lists) — author-controlled copy, RU primary / EN mirror at parity.
  stepperIncrement: { ru: "Увеличить", en: "Increase" },
  stepperDecrement: { ru: "Уменьшить", en: "Decrease" },
  selectLabel: { ru: "Карта", en: "Map" },
  // KIT-05 Select GAP-09/GAP-10 copy (Plan 03-13). `selectEmpty` is the in-listbox empty-state
  // message shown (with an icon, never blank) when a Select has no options; `selectClear` is the
  // accessible NAME for the icon-only clear control (a11y.md — icon-only controls need a name; the
  // story injects both, the slice never invents them). RU primary / EN mirror at parity (QUAL-05).
  selectEmpty: { ru: "Ничего не найдено", en: "Nothing found" },
  selectClear: { ru: "Очистить", en: "Clear" },
  selectOptionAltis: { ru: "Алтис", en: "Altis" },
  selectOptionStratis: { ru: "Стратис", en: "Stratis" },
  selectOptionTanoa: { ru: "Таноа", en: "Tanoa" },
  selectOptionMalden: { ru: "Малден", en: "Malden" },
  selectOptionLivonia: { ru: "Ливония", en: "Livonia" },
  selectOptionChernarus: { ru: "Черноруссия", en: "Chernarus" },
  // KIT-05 FileUpload copy (Plan 03-04, UI-SPEC Copywriting Contract). `uploadDropzone` is
  // the focusable-dropzone prompt — the QUAL-05 RU-longest target («Перетащите изображение
  // или выберите файл») exercised at the 360 floor; `uploadBrowse` is the explicit Browse
  // button label. `uploadRejected` is the why+fix rejection sentence with the `{max}`
  // interpolation (PNG/JPEG/WebP allowlist + size ceiling — the SVG/oversize reasons the
  // story names per RejectReason). `uploadOversize`/`uploadTooMany` name the size/count
  // rejection reasons. `uploadRemoveAria`/`uploadRetryAria` are the accessible NAMES for the
  // icon-only per-file remove/retry controls (a11y.md — icon-only controls need a name; the
  // story injects them, the slice never invents them). RU primary / EN mirror at parity.
  uploadDropzone: {
    ru: "Перетащите изображение или выберите файл",
    en: "Drop an image or browse",
  },
  uploadBrowse: { ru: "Выбрать файл", en: "Browse" },
  uploadRejected: { ru: "Только PNG/JPEG/WebP до {max}", en: "PNG/JPEG/WebP only, up to {max}" },
  uploadOversize: { ru: "Файл больше {max}", en: "File exceeds {max}" },
  uploadTooMany: { ru: "Слишком много файлов", en: "Too many files" },
  uploadRemoveAria: { ru: "Удалить файл", en: "Remove file" },
  uploadRetryAria: { ru: "Повторить загрузку", en: "Retry upload" },
  // GAP-17 RESERVED (v1.0 FU7 — NOT consumed in v0.1): the four-state per-file server-sync
  // vocabulary the `itemStatus` slot will surface once the upload pipeline lands. Added now (RU
  // primary / EN mirror at parity, QUAL-05) so the v1.0 sync model wires the slot against a
  // ready vocabulary; no v0.1 story renders these (there is no sync state yet — reserve only).
  uploadSyncPending: { ru: "Ожидает синхронизации", en: "Awaiting sync" },
  uploadSyncInProgress: { ru: "Идёт синхронизация", en: "Syncing" },
  uploadSyncPendingDelete: { ru: "Ожидает после удаления", en: "Pending after delete" },
  uploadSynced: { ru: "Синхронизировано", en: "Synced" },
  // KIT-06 Overlay family (Plan 03-05) — the Dialog + Popover story copy, resolved in the
  // STORY via `i18n._` and passed as plain string props (the primitives are i18n-free —
  // architecture.md uikit boundary). `dialogClose` is the icon-only close affordance's
  // accessible NAME (a11y.md; 03-UI-SPEC Copywriting Contract); `formSubmit`/`formCancel`
  // are the demo confirm/cancel actions. The `dialog*` keys carry the neutral Dialog story
  // copy; the `confirmDelete*` keys are the destructive-confirmation pattern (WCAG 3.3.6) —
  // `confirmDeleteConfirm` is the explicit verb+noun label on the `loss`-coloured confirm,
  // focus defaults to the safe cancel. `popover*` keys carry the non-modal Popover copy.
  dialogClose: { ru: "Закрыть", en: "Close" },
  formSubmit: { ru: "Сохранить", en: "Save changes" },
  formCancel: { ru: "Отмена", en: "Go back" },
  dialogTitle: { ru: "Подтвердите изменения", en: "Confirm changes" },
  dialogBody: {
    ru: "Проверьте данные перед тем, как продолжить.",
    en: "Review the details before you continue.",
  },
  confirmDeleteTitle: { ru: "Удалить заявку?", en: "Delete request?" },
  confirmDeleteBody: {
    ru: "Заявка и приложенные файлы будут удалены без возможности восстановления.",
    en: "The request and its attachments will be permanently removed.",
  },
  confirmDeleteConfirm: { ru: "Удалить заявку", en: "Delete request" },
  popoverTrigger: { ru: "Что это значит?", en: "What does this mean?" },
  popoverTitle: { ru: "Как считается", en: "How it's computed" },
  popoverBody: {
    ru: "Показатель пересчитывается из последних реплеев игрока.",
    en: "The figure is recomputed from the player's latest replays.",
  },
  // KIT-06 Overlay family — Menu + Tabs + Tooltip story copy (Plan 03-06), resolved in the
  // STORY via `i18n._` and passed as plain string props (the primitives are i18n-free —
  // architecture.md uikit boundary). `menuTrigger` labels the trigger button; the `menuItem*`
  // keys are the typed item labels (the highlighted/active item is cyan paired with the
  // highlight). `menuItemLongest` is the QUAL-05 RU-longest menu row exercised at the 360 floor.
  // The `tabsLabel*` keys label the tabs; `tabsPanel*` carry each panel's body. `tooltipTrigger`
  // is the VISIBLE, already-meaningful label the tooltip supplements (never the only carrier);
  // `tooltipContent` is the supplementary hint. RU primary / EN mirror at parity (QUAL-05).
  menuTrigger: { ru: "Действия", en: "Actions" },
  menuItemView: { ru: "Открыть профиль", en: "View profile" },
  menuItemCompare: { ru: "Сравнить игроков", en: "Compare players" },
  menuItemLongest: {
    ru: "Пожаловаться на этого игрока модератору",
    en: "Report this player to a moderator",
  },
  tabsLabelOverview: { ru: "Обзор", en: "Overview" },
  tabsLabelMatches: { ru: "Матчи", en: "Matches" },
  tabsLabelSquads: { ru: "Отряды", en: "Squads" },
  tabsPanelOverview: {
    ru: "Сводная статистика игрока за последние реплеи.",
    en: "The player's summary stats across recent replays.",
  },
  tabsPanelMatches: {
    ru: "История матчей с результатом и счётом.",
    en: "Match history with outcome and score.",
  },
  tabsPanelSquads: {
    ru: "Отряды, за которые играл игрок.",
    en: "Squads the player has fought with.",
  },
  tooltipTrigger: { ru: "Счёт", en: "Score" },
  tooltipContent: {
    ru: "Взвешенный счёт за последние реплеи.",
    en: "A weighted score over recent replays.",
  },
  // KIT-08 / QUAL-05: the bilingual ICU plural exemplar (D-03 — RU one/few/many must
  // be exercised now). The plural lives INSIDE the message string as ICU
  // `{n, plural, …}` parsed at runtime by Lingui's CLDR rules — never concatenation
  // (localization.md; RESEARCH Pitfall 6). RU carries the full one/few/many/other arms
  // (1 реплей / 2 реплея / 5 реплеев); EN carries one/other. `#` renders the count.
  replayCount: {
    ru: "{n, plural, one{# реплей} few{# реплея} many{# реплеев} other{# реплея}}",
    en: "{n, plural, one{# replay} other{# replays}}",
  },
  // SURF-18 Global state + Toast manager story copy (Plan 03-07), resolved in the STORY via
  // `i18n._` and passed as plain string props (AsyncBoundary + the Toast leaf are i18n-free —
  // architecture.md uikit boundary). `errorSystemContact` is the maintainer-contact path the
  // AsyncBoundary `error` state surfaces below the `errorSystem` ref-id message (errors.md —
  // a system error carries a contact path, never a dead end). `emptyRetry`/`errorRetry` are
  // the recovery actions (never a blank/dead state). `toastDismiss` is the icon-only dismiss
  // control's accessible NAME (a11y.md). `toast{Success,Info,Warn,Error}Trigger` label the
  // Playground trigger buttons; `toast{Saved,Info,Warn,Failed}` are the toast bodies the
  // trigger pushes. RU primary / EN mirror at parity (QUAL-05).
  errorSystemContact: { ru: "Написать в поддержку", en: "Contact support" },
  emptyRetry: { ru: "Сбросить фильтры", en: "Clear filters" },
  errorRetry: { ru: "Повторить", en: "Retry" },
  toastDismiss: { ru: "Закрыть уведомление", en: "Dismiss notification" },
  toastSuccessTrigger: { ru: "Показать успех", en: "Show success" },
  toastInfoTrigger: { ru: "Показать инфо", en: "Show info" },
  toastWarnTrigger: { ru: "Показать предупреждение", en: "Show warning" },
  toastErrorTrigger: { ru: "Показать ошибку", en: "Show error" },
  toastSaved: { ru: "Изменения сохранены", en: "Changes saved" },
  toastInfo: { ru: "Агрегат пересчитан", en: "Aggregate recomputed" },
  toastWarn: { ru: "Данные могут устаревать", en: "Data may be getting stale" },
  toastFailed: { ru: "Не удалось сохранить", en: "Could not save" },
  // Phase 04 public-stats surface copy. These keys are consumed only by the
  // public-stats surface/story layer; UIKIT primitives still receive plain strings.
  publicStatsOverviewTitle: { ru: "Обзор статистики", en: "Stats Overview" },
  publicStatsPlayersTitle: { ru: "Игроки", en: "Players" },
  publicStatsProfileTitle: { ru: "Профиль игрока", en: "Player profile" },
  publicStatsAllPlayersCta: { ru: "Все игроки", en: "All players" },
  publicStatsSquadsEntry: { ru: "Отряды", en: "Squads" },
  publicStatsRotationsEntry: { ru: "Ротации", en: "Rotations" },
  publicStatsCommanderEntry: { ru: "КС", en: "Commander" },
  publicStatsBountyEntry: { ru: "Баунти", en: "Bounty" },
  publicStatsOpenProfile: { ru: "Открыть профиль", en: "Open profile" },
  publicStatsSgProfile: { ru: "Профиль sg.zone", en: "sg.zone profile" },
  publicStatsPeriodLabel: { ru: "Период", en: "Period" },
  publicStatsPeriodRotation: { ru: "Активная ротация", en: "Active rotation" },
  publicStatsPeriodAllTime: { ru: "Всё время", en: "All time" },
  publicStatsSearchLabel: { ru: "Поиск игроков", en: "Search players" },
  publicStatsTierLabel: { ru: "Тир", en: "Tier" },
  publicStatsTierAll: { ru: "Все тиры", en: "All tiers" },
  publicStatsRotationReady: { ru: "Активная ротация готова", en: "Active rotation ready" },
  publicStatsAllTimeWarmReady: { ru: "Всё время готово", en: "All-time warm ready" },
  publicStatsAllTimeRecomputing: { ru: "Пересчитываем агрегат", en: "Recomputing aggregate" },
  publicStatsLoadingInSession: { ru: "Загружаем агрегат…", en: "Loading aggregate…" },
  publicStatsBountyExplanation: {
    ru: "Баунти — очки риска игрока по последним реплеям, отряду и ротации.",
    en: "Bounty is the player's risk score from recent replays, squad, and rotation context.",
  },
  publicStatsTrendSummary: {
    ru: "Лидер {name} · счёт {score} · базовая линия {baseline}",
    en: "Leader {name} · score {score} · baseline {baseline}",
  },
  publicStatsEmptyHeading: {
    ru: "Нет данных по этим условиям",
    en: "No data for these filters",
  },
  publicStatsEmptyBody: {
    ru: "Сбросьте фильтры или выберите другой период.",
    en: "Clear filters or choose another period.",
  },
  publicStatsSystemError: {
    ru: "Не удалось загрузить статистику. Код: {id}. Повторите или сообщите нам, если повторяется.",
    en: "Could not load stats. Ref: {id}. Try again or contact us if it persists.",
  },
  publicStatsSearchEmptyHeading: { ru: "Игроки не найдены", en: "No players found" },
  publicStatsSearchEmptyBody: {
    ru: "Измените запрос или сбросьте фильтры, чтобы увидеть всех игроков.",
    en: "Change the search or clear filters to see all players.",
  },
  publicStatsShowMore: { ru: "Показать ещё · {n}", en: "Show more · {n}" },
  publicStatsPlayersCaption: { ru: "Игроки · {n}", en: "Players · {n}" },
  publicStatsNickHistoryCaption: { ru: "История ников · {n}", en: "Nick history · {n}" },
  publicStatsReplaysCaption: { ru: "Реплеи · {n}", en: "Replays · {n}" },
  publicStatsProvenance: {
    ru: "Посчитано из {n} реплеев · {freshness} · Как считается",
    en: "Computed from {n} replays · {freshness} · How it's computed",
  },
  publicStatsTrustKnown: { ru: "Известно", en: "Known" },
  publicStatsTrustUnknown: { ru: "Неизвестно", en: "Unknown" },
  publicStatsTrustConflict: { ru: "Конфликт", en: "Conflict" },
  publicStatsProfileTabRotation: { ru: "Ротация", en: "Rotation" },
  publicStatsProfileTabBounty: { ru: "Баунти", en: "Bounty" },
  publicStatsProfileTabHistory: { ru: "История", en: "History" },
  publicStatsProfileTabReplays: { ru: "Реплеи", en: "Replays" },
} as const satisfies Readonly<Record<string, Bilingual>>;

/** The set of copy-element keys (derived — never hand-maintained in parallel). */
export type StringKey = keyof typeof STRINGS;
