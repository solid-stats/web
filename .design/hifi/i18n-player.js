/* hifi/i18n-player.js — extends SS_I18N (EN/RU) with Player profile strings.
   Loaded AFTER i18n.js. Full Cyrillic per DS. */
(function () {
  const EN = {
    crumb_players: 'Players',
    pf_rank: 'rank',
    pf_member: 'in project since rotation {r}',
    act_replays: "Player's replays", act_correction: 'Request correction',

    m_score: 'Score', m_kd: 'K/D', m_games: 'Games', m_kills: 'Kills',
    m_tk: 'Teamkills', m_deaths: 'Deaths', m_deathsTk: 'Deaths from TK',
    m_vehK: 'Vehicle kills', m_vehPct: '{n}% from vehicles', m_vehDestroyed: 'Vehicles destroyed',
    m_bounty: 'Bounty',

    tier_low: 'Below baseline', tier_base: 'Baseline', tier_good: 'Good', tier_elite: 'Excellent',
    tierS_low: 'Below', tierS_base: 'Base', tierS_good: 'Good', tierS_elite: 'Top',
    vsBaseline: 'baseline 1.00',
    scoreFormula: 'Score = (kills − TK) ÷ (games + deaths from TK)',
    kdFormula: 'K/D = (kills − TK) ÷ (deaths + deaths from TK)',
    scoreScale: '1 baseline · 3+ good · 5+ excellent',
    kdScale: '1 baseline · 5+ good · 10+ excellent',

    perfTitle: 'Performance by week', perfSub: 'last {n} weeks',
    metric_score: 'Score', metric_kd: 'K/D', metric_kills: 'Kills',
    baselineTag: 'baseline',
    thresholdsBy: 'levels vs all players · {p}', period_rotation: 'rotation {n}', period_alltime: 'all-time',

    provReplays: 'computed from {n} replays', provHow: 'How it’s computed', provSource: 'source: replays',
    fresh_ok: 'Up to date', fresh_stale: 'Data is going stale', fresh_offline: 'Connection lost', fresh_recon: 'Reconnecting…',
    fresh_ago: '{n} min', fresh_cache: 'cached {n} min',

    weeklyTitle: 'By week', c_week: 'Week', c_veh: 'Veh', current: 'current',
    showAll: 'All weeks',
    matchesNote: 'Per-game breakdown', c_replay: 'Replay', c_map: 'Map', c_side: 'Side', c_result: 'Result',
    res_W: 'Win', res_L: 'Loss', res_Unknown: 'Unknown', expandWeek: 'matches', noMatches: 'No recorded games',

    weaponsTitle: 'Weapons', vehiclesTitle: 'Vehicles',
    c_weapon: 'Weapon', c_vehicle: 'Vehicle', c_maxdist: 'Max dist', byKills: 'by kills',

    pf_steamids: '{n} SteamIDs',
    identityTitle: 'Identity',
    steamidsLabel: 'Linked SteamIDs', nicknamesLabel: 'Nickname history', squadHistLabel: 'Squad history',
    primary: 'primary', linked: 'linked', pendingLink: 'pending review', mergeReview: 'SteamID merge under moderator review', reqRef: 'request #{id}', reviewMore: 'Details', showAllN: 'Show all · {n}', collapse: 'Collapse', now: 'now', since: 'since {d}',

    commanderTitle: 'Side commander (KS)', ks_games: 'Games',
    ks_w: 'W', ks_l: 'L', ks_unknown: 'Unknown',
    ks_note: '2 legacy games have no recorded side outcome',

    bountyTitle: 'Bounty', bountyRot: 'Rotation {r}', bountyFormula: 'victim ×{v} · squad ×{s}',
    bountyBreakdown: 'View breakdown',

    seg_weeks: 'Weeks', seg_weapons: 'Arsenal', seg_identity: 'Identity',
    showSecondary: 'Show vehicle · TK · bounty',
  };

  const RU = {
    crumb_players: 'Игроки',
    pf_rank: 'место',
    pf_member: 'на проекте с ротации {r}',
    act_replays: 'Реплеи игрока', act_correction: 'Запросить правку',

    m_score: 'Счёт', m_kd: 'K/D', m_games: 'Игры', m_kills: 'Убийства',
    m_tk: 'Тимкиллы', m_deaths: 'Смерти', m_deathsTk: 'Смерти от ТК',
    m_vehK: 'Уб. из техники', m_vehPct: '{n}% из техники', m_vehDestroyed: 'Выбито техники',
    m_bounty: 'Награда',

    tier_low: 'Ниже нормы', tier_base: 'Норма', tier_good: 'Хорошо', tier_elite: 'Отлично',
    tierS_low: 'Ниже', tierS_base: 'Норма', tierS_good: 'Хорошо', tierS_elite: 'Отлично',
    vsBaseline: 'норма 1.00',
    scoreFormula: 'Счёт = (убийства − ТК) ÷ (игры + смерти от ТК)',
    kdFormula: 'K/D = (убийства − ТК) ÷ (смерти + смерти от ТК)',
    scoreScale: '1 — норма · 3+ — хорошо · 5+ — отлично',
    kdScale: '1 — норма · 5+ — хорошо · 10+ — отлично',

    perfTitle: 'Результативность по неделям', perfSub: 'последние {n} недель',
    metric_score: 'Счёт', metric_kd: 'K/D', metric_kills: 'Убийства',
    baselineTag: 'норма',
    thresholdsBy: 'уровни по всем игрокам · {p}', period_rotation: 'ротация {n}', period_alltime: 'всё время',

    provReplays: 'посчитано из {n} реплеев', provHow: 'Как считается', provSource: 'источник: реплеи',
    fresh_ok: 'Актуально', fresh_stale: 'Данные устаревают', fresh_offline: 'Связь потеряна', fresh_recon: 'Переподключение…',
    fresh_ago: '{n} мин', fresh_cache: 'кэш {n} мин',

    weeklyTitle: 'По неделям', c_week: 'Неделя', c_veh: 'Тех', current: 'текущая',
    showAll: 'Все недели',
    matchesNote: 'По играм', c_replay: 'Реплей', c_map: 'Карта', c_side: 'Сторона', c_result: 'Исход',
    res_W: 'Победа', res_L: 'Поражение', res_Unknown: 'Неизв.', expandWeek: 'игр', noMatches: 'Нет записанных игр',

    weaponsTitle: 'Оружие', vehiclesTitle: 'Техника',
    c_weapon: 'Оружие', c_vehicle: 'Техника', c_maxdist: 'Макс. дист', byKills: 'по убийствам',

    pf_steamids: '{n} SteamID',
    identityTitle: 'Идентификация',
    steamidsLabel: 'Привязанные SteamID', nicknamesLabel: 'История ников', squadHistLabel: 'История отрядов',
    primary: 'основной', linked: 'привязан', pendingLink: 'на проверке', mergeReview: 'Объединение SteamID на проверке у модератора', reqRef: 'заявка #{id}', reviewMore: 'Подробнее', showAllN: 'Показать все · {n}', collapse: 'Свернуть', now: 'сейчас', since: 'с {d}',

    commanderTitle: 'Командир стороны (КС)', ks_games: 'Игры',
    ks_w: 'П', ks_l: 'Пор', ks_unknown: 'Неизв.',
    ks_note: 'У 2 старых игр не записан исход стороны',

    bountyTitle: 'Награда', bountyRot: 'Ротация {r}', bountyFormula: 'жертва ×{v} · отряд ×{s}',
    bountyBreakdown: 'Разбор очков',

    seg_weeks: 'Недели', seg_weapons: 'Арсенал', seg_identity: 'Личность',
    showSecondary: 'Показать технику · ТК · награду',
  };

  Object.assign(window.SS_I18N.EN, EN);
  Object.assign(window.SS_I18N.RU, RU);

  // short axis label for a week's END date: "7 Jun" / "Jun 7"
  window.SS_WEEK_SHORT = (lang, e) => {
    const M = window.SS_MONTHS[lang] || window.SS_MONTHS.EN;
    return lang === 'RU' ? `${e[2]} ${M[e[1]]}` : `${M[e[1]]} ${e[2]}`;
  };

  // compact week range, no year: "25–31 мая" / "May 25–31" · "27 мар – 3 апр" / "Mar 27 – Apr 3"
  window.SS_RANGE_SHORT = (lang, s, e) => {
    const M = window.SS_MONTHS[lang] || window.SS_MONTHS.EN;
    if (s[1] === e[1]) {
      return lang === 'RU' ? `${s[2]}–${e[2]} ${M[s[1]]}` : `${M[s[1]]} ${s[2]}–${e[2]}`;
    }
    return lang === 'RU'
      ? `${s[2]} ${M[s[1]]} – ${e[2]} ${M[e[1]]}`
      : `${M[s[1]]} ${s[2]} – ${M[e[1]]} ${e[2]}`;
  };
})();
