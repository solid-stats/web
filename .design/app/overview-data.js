/* Stats Overview — sample data (fictional) extended for the SCORE metric.
   SCORE = kills ÷ games  (primary headline metric; K/D demoted to full list/profile).
   Rankings are pre-sorted by score (players/squads) and by bounty points (bounty). */
window.OV_DATA = (function () {
  // raw: [slug, name, squad, kills, games, kd, bounty]
  const rawPlayers = [
    ['vasiliy', 'Vasiliy',  '7th Guards',  1284, 92,  4.11, 14208],
    ['strelok', 'Strelok',  'Vympel',      1102, 84,  3.78, 12940],
    ['kobra',   'Kobra',    'Vympel',       944, 76,  2.35,  8820],
    ['medved',  'Медведь',  'Iron Wolves',  870, 72,  2.38,  7995],
    ['viper',   'Viper',    'Vympel',       760, 64,  2.38,  6980],
    ['ghost-9', 'Ghost_9',  '7th Guards',   901, 88,  1.77,  8110],
    ['sokol',   'Sokol',    'Iron Wolves',  812, 80,  1.66,  7240],
    ['prizrak', 'Призрак',  null,           988, 110, 0.92,  9415],
  ];
  const players = rawPlayers
    .map(([slug, name, squad, kills, games, kd, bounty]) => ({
      slug, name, squad, kills, games, kd, bounty,
      score: +(kills / games).toFixed(2),
    }))
    .sort((a, b) => b.score - a.score);

  // raw: [slug, name, tag, members, kills, games]
  const rawSquads = [
    ['7th-guards',  '7th Guards',  '7GD', 24, 9840, 712],
    ['vympel',      'Vympel',      'VYM', 19, 8720, 690],
    ['iron-wolves', 'Iron Wolves', 'IRW', 21, 7110, 648],
    ['nightjar',    'Nightjar',    'NJR', 16, 5240, 560],
  ];
  const squads = rawSquads
    .map(([slug, name, tag, members, kills, games]) => ({
      slug, name, tag, members, kills, games,
      score: +(kills / games).toFixed(2),
    }))
    .sort((a, b) => b.score - a.score);

  // bounty leaderboard — points, weighted by prev-rotation effectiveness
  const bounty = players
    .map(p => ({ ...p, veff: 1 + ((p.kills % 7) / 10 + 0.3), seff: 1 + ((p.games % 5) / 10 + 0.2) }))
    .sort((a, b) => b.bounty - a.bounty)
    .map(p => ({
      slug: p.slug, name: p.name, squad: p.squad, bounty: p.bounty,
      veff: +p.veff.toFixed(1), seff: +p.seff.toFixed(1),
    }));

  const replays = [
    { id: '48213', mission: 'Op. Northwind',   map: 'Chernarus', date: '2026-05-28', rotation: 14, players: 64, status: 'parsed',  kills: 412, top: 'Vasiliy', winner: 'WEST' },
    { id: '48198', mission: 'Op. Iron Veil',   map: 'Takistan',  date: '2026-05-26', rotation: 14, players: 58, status: 'parsed',  kills: 388, top: 'Kobra',   winner: 'unknown' },
    { id: '48171', mission: 'Op. Red Dawn',    map: 'Altis',     date: '2026-05-24', rotation: 14, players: 60, status: 'parsing', kills: 0,   top: '—',       winner: 'unknown' },
    { id: '48150', mission: 'Op. Cold Harbor', map: 'Livonia',   date: '2026-05-22', rotation: 14, players: 52, status: 'parsed',  kills: 333, top: 'Медведь', winner: 'EAST' },
    { id: '48142', mission: 'Op. Salt & Iron', map: 'Tanoa',     date: '2026-05-20', rotation: 14, players: 56, status: 'parsed',  kills: 357, top: 'Strelok', winner: 'WEST' },
  ];

  return { players, squads, bounty, replays };
})();
