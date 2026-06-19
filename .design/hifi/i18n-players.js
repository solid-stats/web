/* hifi/i18n-players.js — extends SS_I18N (EN/RU) with Players-list strings.
   Loaded AFTER i18n.js + i18n-player.js. Full Cyrillic per DS. */
(function () {
  const EN = {
    plist_title: 'Players',
    filterPh: 'Filter by nick or squad',
    side_all: 'All',
    sideLabel: 'Side',
    per_rotation: 'Rotation', per_all: 'All-time', per_4w: 'Last 4 weeks',
    plist_levels: 'tier levels vs all players',
    sortBy: 'Sorted by {m}',
    c_tk: 'TK', c_deaths: 'Deaths', c_kd: 'K/D', c_trendN: '{n}-wk trend',
    plist_count: '{n} players', plist_filtered: '{n} of {total}',
    plist_empty: 'No players match these filters.',
    plist_clear: 'Clear filters',
    plist_showAll: 'Show all · {n}',
    plist_showMore: 'Show {n} more · {rem} left',
    plist_collapse: 'Collapse',
    plist_loading: 'Aggregating the all-time roster…',
    plist_recompute: 'Recomputing the all-time aggregate… this can take a moment',
    activeRotation: 'active rotation',
  };
  const RU = {
    plist_title: 'Игроки',
    filterPh: 'Фильтр по нику или отряду',
    side_all: 'Все',
    sideLabel: 'Сторона',
    per_rotation: 'Ротация', per_all: 'Всё время', per_4w: 'За 4 недели',
    plist_levels: 'уровни по всем игрокам',
    sortBy: 'Сортировка: {m}',
    c_tk: 'ТК', c_deaths: 'Смерти', c_kd: 'K/D', c_trendN: 'Тренд {n} нед',
    plist_count: '{n} игроков', plist_filtered: '{n} из {total}',
    plist_empty: 'Нет игроков по этим фильтрам.',
    plist_clear: 'Сбросить фильтры',
    plist_showAll: 'Показать все · {n}',
    plist_showMore: 'Ещё {n} · осталось {rem}',
    plist_collapse: 'Свернуть',
    plist_loading: 'Собираем статистику за всё время…',
    plist_recompute: 'Пересчитываем агрегат за всё время… это может занять немного времени',
    activeRotation: 'активная ротация',
  };
  Object.assign(window.SS_I18N.EN, EN);
  Object.assign(window.SS_I18N.RU, RU);
})();
