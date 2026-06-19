/* hifi/i18n.js — EN/RU dictionary for Stats Overview (full Cyrillic per DS). */
window.SS_I18N = {
  EN: {
    nav_overview: 'Overview', nav_players: 'Players', nav_squads: 'Squads',
    nav_bounty: 'Bounty', nav_commanders: 'Commanders', nav_replays: 'Replays',
    tab_stats: 'Stats', tab_account: 'Profile',
    signin: 'Sign in with Steam', moderation: 'Moderation', search: 'Search',
    signinShort: 'Sign in', myAccount: 'Profile',
    pageTitle: 'Overview',
    pageSub: 'SolidGames operational statistics',
    rotation: 'Rotation',
    upToDate: 'Up to date', updated: 'updated {n} min ago',
    outOfDate: 'Out of date',
    stale: 'Showing cached data — reconnecting to live stats…',
    density: 'Density', compact: 'Compact', comfortable: 'Comfortable',
    topPlayers: 'Top players', topSquads: 'Top squads',
    bountyBoard: 'Bounty leaderboard', recentReplays: 'Recent replays',
    viewAll: 'View all', sortScore: 'Sort: Score',
    c_rank: '#', c_player: 'Player', c_squad: 'Squad', c_kills: 'Kills',
    c_games: 'Games', c_score: 'Score', c_pts: 'Bounty', c_trend: '4-wk trend',
    c_mission: 'Mission', c_map: 'Map', c_result: 'Result', c_when: 'When', c_top: 'Top frag',
    scoreHint: 'Score = (kills − TK) ÷ (games + deaths from TK)',
    players_n: '{n} players', games_n: '{n} games', kills_n: '{n} kills',
    noSquad: '— no squad', pts: 'pts', m_victim: 'victim', m_squad: 'squad',
    side_red: 'Red side', side_blue: 'Blue side', side_yellow: 'Yellow side', side_green: 'Green side', side_gray: 'Independent',
    bountyFormula: 'Points weighted by victim value × squad multiplier. Teamkills & non-enemy kills score 0.',
    win: 'Win', loss: 'Loss', unknown: 'Unknown', parsing: 'Parsing', failed: 'Failed',
    seg_players: 'Players', seg_squads: 'Squads', seg_bounty: 'Bounty',
    searchPh: 'Search players, squads, replays…',
    searchTop: 'Top results', noResults: 'No matches', searchNavHint: 'to navigate', searchOpenHint: 'to open',
    footer: 'SolidStats — community statistics · not affiliated with Valve.',
    footerR: 'Public stats · no login required',
  },
  RU: {
    nav_overview: 'Обзор', nav_players: 'Игроки', nav_squads: 'Отряды',
    nav_bounty: 'Bounty', nav_commanders: 'Командиры', nav_replays: 'Реплеи',
    tab_stats: 'Статы', tab_account: 'Профиль',
    signin: 'Войти через Steam', moderation: 'Модерация', search: 'Поиск',
    signinShort: 'Войти', myAccount: 'Профиль',
    pageTitle: 'Обзор',
    pageSub: 'Боевая статистика SolidGames',
    rotation: 'Ротация',
    upToDate: 'Актуально', updated: 'обновлено {n} мин назад',
    outOfDate: 'Не актуально',
    stale: 'Показаны сохранённые данные — переподключение к серверу…',
    density: 'Плотность', compact: 'Плотно', comfortable: 'Свободно',
    topPlayers: 'Лучшие игроки', topSquads: 'Лучшие отряды',
    bountyBoard: 'Bounty', recentReplays: 'Последние реплеи',
    viewAll: 'Все', sortScore: 'Сорт.: Счёт',
    c_rank: '#', c_player: 'Игрок', c_squad: 'Отряд', c_kills: 'Убийства',
    c_games: 'Игры', c_score: 'Счёт', c_pts: 'Награда', c_trend: 'Тренд 4 нед',
    c_mission: 'Миссия', c_map: 'Карта', c_result: 'Исход', c_when: 'Когда', c_top: 'Лучший',
    scoreHint: 'Счёт = (убийства − ТК) ÷ (игры + смерти от ТК)',
    players_n: '{n} игроков', games_n: '{n} игр', kills_n: '{n} уб.',
    noSquad: '— без отряда', pts: 'очк.', m_victim: 'жертва', m_squad: 'отряд',
    side_red: 'Красная сторона', side_blue: 'Синяя сторона', side_yellow: 'Жёлтая сторона', side_green: 'Зелёная сторона', side_gray: 'Независимые',
    bountyFormula: 'Очки: ценность жертвы × множитель отряда. Тимкиллы и не-вражеские = 0.',
    win: 'Победа', loss: 'Пораж.', unknown: 'Неизв.', parsing: 'Парсинг', failed: 'Ошибка',
    seg_players: 'Игроки', seg_squads: 'Отряды', seg_bounty: 'Bounty',
    searchPh: 'Поиск игроков, отрядов, реплеев…',
    searchTop: 'Подсказки', noResults: 'Ничего не найдено', searchNavHint: 'навигация', searchOpenHint: 'открыть',
    footer: 'SolidStats — статистика сообщества · не связано с Valve.',
    footerR: 'Открытая статистика · вход не нужен',
  },
};
window.SS_T = (lang, key, vars) => {
  let s = (window.SS_I18N[lang] || window.SS_I18N.EN)[key] || key;
  if (vars) for (const k in vars) s = s.replace('{' + k + '}', vars[k]);
  return s;
};
// localized month abbreviations + date-range formatter
window.SS_MONTHS = {
  EN: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  RU: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
};
// date-range formatter. s/e = [year, monthIndex, day]. Year shown on each side
// only when the range crosses into a different year; otherwise once at the end.
window.SS_RANGE = (lang, s, e) => {
  const M = window.SS_MONTHS[lang] || window.SS_MONTHS.EN;
  const cross = s[0] !== e[0];
  const fmt = (d, withYear) => lang === 'RU'
    ? `${d[2]} ${M[d[1]]}${withYear ? ' ' + d[0] : ''}`
    : `${M[d[1]]} ${d[2]}${withYear ? ', ' + d[0] : ''}`;
  return `${fmt(s, cross)} – ${fmt(e, true)}`;
};
