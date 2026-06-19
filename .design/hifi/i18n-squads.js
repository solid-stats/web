/* hifi/i18n-squads.js — extends SS_I18N (EN/RU) with Squads-list strings.
   Loaded AFTER i18n.js. Reuses shared keys (c_rank, c_games, c_kills, c_tk,
   c_deaths, c_kd, c_score, c_trendN, side_*, per_*, sortBy, kills_n, games_n,
   plist_clear, plist_showMore, plist_collapse, provReplays, provHow, fresh_*).
   Full Cyrillic per DS. */
(function () {
  const EN = {
    slist_title: 'Squads',
    slist_filterPh: 'Filter by name or tag',
    slist_levels: 'tier levels vs all squads',
    c_members: 'Members', c_squadName: 'Squad',
    slist_count: '{n} squads', slist_filtered: '{n} of {total}',
    slist_empty: 'No squads match these filters.',
    slist_loading: 'Aggregating all squads…',
    slist_recompute: 'Recomputing the all-time squad aggregate… this can take a moment',
    per_last4w: 'Last 4 weeks',
    trend_cur: 'this week', trend_ago: '{n} wk ago',
    members_n: '{n} members', members_sh: '{n} mem.', led_by: 'led by {n}',
    slist_showMore: 'Show {n} more · {rem} left',
  };
  const RU = {
    slist_title: 'Отряды',
    slist_filterPh: 'Фильтр по названию или тегу',
    slist_levels: 'уровни по всем отрядам',
    c_members: 'Состав', c_squadName: 'Отряд',
    slist_count: '{n} отрядов', slist_filtered: '{n} из {total}',
    slist_empty: 'Нет отрядов по этим фильтрам.',
    slist_loading: 'Собираем статистику отрядов…',
    slist_recompute: 'Пересчитываем агрегат отрядов за всё время… это может занять немного времени',
    per_last4w: 'Последние 4 недели',
    trend_cur: 'текущая', trend_ago: '{n} нед. назад',
    members_n: '{n} участников', members_sh: '{n} уч.', led_by: 'лидер {n}',
    slist_showMore: 'Ещё {n} · осталось {rem}',
  };
  Object.assign(window.SS_I18N.EN, EN);
  Object.assign(window.SS_I18N.RU, RU);
})();
