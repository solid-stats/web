/* hifi/data-overview.js — fictional sample data for Stats Overview.
   PRIMARY metric is SCORE = (kills − tk) ÷ (games + deathsTk) — SAME formula & tier
   scale as the player profile (see tiers.js). K/D omitted here (lives on profile).
   `spark` = last 4 weekly scores for the inline trend. */
window.SS_OV = (function () {
  const mk = (name, squad, kills, games, tk, deathsTk, bounty, outcome, spark) => ({
    name, squad, kills, games, tk, deathsTk, bounty, outcome, spark,
    score: +((kills - tk) / (games + deathsTk)).toFixed(2),
  });

  // ranked by score below. Numbers land in the 0–5 tier range (base 1 / good 2.4 / elite 4).
  let players = [
    mk('Vasiliy',  '7th',     96, 22, 1, 1, 14208, 'win',     [3.1, 4.6, 3.8, 4.2]),
    mk('Strelok',  'inTeam',  74, 20, 0, 1, 12940, 'win',     [2.4, 3.0, 4.1, 3.5]),
    mk('Kobra',    'inTeam',  80, 24, 1, 0,  8820, 'win',     [3.6, 2.9, 3.0, 3.3]),
    mk('Tundra',   'KSK',     52, 18, 0, 0,  9100, 'win',     [2.2, 3.4, 2.6, 2.9]),
    mk('Медведь',  'Wagner',  70, 26, 2, 1,  7995, 'win',     [2.0, 2.8, 2.7, 2.5]),
    mk('Ghost_9',  '7th',     50, 21, 1, 1,  8110, 'loss',    [1.6, 2.5, 2.4, 2.2]),
    mk('Rikom',    'GROM',    32, 16, 0, 0,  6600, 'win',     [1.8, 2.1, 1.9, 2.0]),
    mk('Sokol',    'DKK',     33, 19, 1, 2,  7240, 'loss',    [1.2, 1.8, 1.5, 1.5]),
    mk('Viper',    'inTeam',  30, 23, 0, 1,  6980, 'win',     [1.0, 1.4, 1.2, 1.25]),
    mk('Призрак',  null,      14, 17, 2, 0,  9415, 'unknown', [0.9, 0.6, 0.8, 0.71]),
  ].sort((a, b) => b.score - a.score);

  // real SolidGames squads: full name + variable-length tag + side. Same score formula.
  const sq = (name, tag, side, members, kills, games, tk, deathsTk, bounty) => ({
    name, tag, side, members, kills, games, tk, deathsTk, bounty,
    score: +((kills - tk) / (games + deathsTk)).toFixed(2),
  });
  let squads = [
    sq('Death Korps of Krieg',       'DKK',    'yellow', 24, 2890, 705, 22, 18, 58210),
    sq('inTeam',                     'inTeam', 'blue',   22, 2510, 712, 16, 14, 51400),
    sq('7th Reborn Division SArmaT', '7th',    'yellow', 25, 2360, 744, 20, 16, 55100),
    sq('ЧВК «Wagner»',                 'Wagner', 'yellow', 25, 1980, 690, 24, 20, 44980),
    sq('GROM',                       'GROM',   'green',  40, 1610, 640, 18, 12, 46000),
    sq('Kommando Spezialkräfte',      'KSK',    'green',  26, 1420, 600, 14, 15, 38000),
    sq('31st MEU',                   '31st',   'red',    31, 1290, 611, 22, 13, 41200),
    sq('Diamond Dogs',               'DD',     'blue',   23, 1140, 575, 17, 11, 36500),
    sq('Royal Armed Forces',         'RAF',    'red',    25,  980, 590, 19, 14, 35200),
    sq('NAVY SEAL TEAM SIX',         'SEAL',   'gray',    7,  640, 560, 12,  9, 33120),
  ].sort((a, b) => b.score - a.score);

  // bounty is its own ranking (points), formula-weighted
  let bounty = players
    .map(p => ({ name: p.name, squad: p.squad, pts: p.bounty,
                 vmul: (1.2 + (p.score % 1)).toFixed(1), smul: (1.1 + (p.kills % 5) / 10).toFixed(1) }))
    .sort((a, b) => b.pts - a.pts);

  const replays = [
    { id: '48213', mission: 'Op. Northwind',   map: 'Chernarus', players: 64, kills: 412, status: 'parsed',  outcome: 'win',     top: 'Vasiliy', when: 'Today 21:04' },
    { id: '48198', mission: 'Op. Iron Veil',   map: 'Takistan',  players: 58, kills: 388, status: 'parsed',  outcome: 'unknown', top: 'Kobra',   when: 'Today 19:30' },
    { id: '48171', mission: 'Op. Red Dawn',    map: 'Altis',     players: 60, kills: 0,   status: 'parsing', outcome: 'unknown', top: '—',       when: 'Yest. 22:11' },
    { id: '48164', mission: 'Op. Cold Harbor', map: 'Livonia',   players: 52, kills: 366, status: 'parsed',  outcome: 'win',     top: 'Strelok', when: 'Yest. 20:46' },
    { id: '48150', mission: 'Op. Salt & Iron', map: 'Tanoa',     players: 56, kills: 341, status: 'failed',  outcome: 'loss',    top: 'Viper',   when: 'Wed 21:18' },
  ];

  const rotations = [
    { r: 14, s: [2026, 4, 12], e: [2026, 5, 9] },   // May 12 – Jun 9, 2026
    { r: 13, s: [2026, 3, 14], e: [2026, 4, 11] },  // Apr 14 – May 11, 2026
    { r: 12, s: [2026, 2, 17], e: [2026, 3, 13] },  // Mar 17 – Apr 13, 2026
    { r: 11, s: [2026, 1, 17], e: [2026, 2, 16] },  // Feb 17 – Mar 16, 2026
    { r: 10, s: [2026, 0, 20], e: [2026, 1, 16] },  // Jan 20 – Feb 16, 2026
    { r: 9,  s: [2025, 11, 23], e: [2026, 0, 19] }, // Dec 23, 2025 – Jan 19, 2026 (crosses year)
    { r: 8,  s: [2025, 10, 25], e: [2025, 11, 22] },// Nov 25 – Dec 22, 2025
  ];

  return { players, squads, bounty, replays, rotations,
           totals: { players: '3,182', games: '23,456', kills: '118,204', squads: '1,204' } };
})();
