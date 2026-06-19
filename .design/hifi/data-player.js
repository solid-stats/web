/* hifi/data-player.js — Player profile sample data for "Sonr".
   Numbers mirror the real legacy page (solid-stats.web.app/player/Sonr).
   SCORE = (kills − tk) ÷ (games + deathsTk) · K/D = (kills − tk) ÷ (deaths + deathsTk).
   Tier boundaries live in the shared tiers.js (SS_BASELINE / SS_TIER). */

// per-GAME derived metrics (one match = one game). Same formula shape as career:
//   score = (kills − tk) ÷ (1 + deathsTk)   ·   K/D = (kills − tk) ÷ (deaths + deathsTk)
window.SS_MATCH = {
  score(m) { return (m.kills - m.tk) / (1 + m.deathsTk); },
  kd(m) { const d = m.deaths + m.deathsTk; return d ? (m.kills - m.tk) / d : (m.kills - m.tk); },
};

window.SS_PLAYER = (function () {
  // recent WEEKLY rows — most recent first. [s,e] = date range [year, monthIdx, day]
  const wk = (s, e, games, kills, deaths, vehK, tk, deathsTk, kd, score) =>
    ({ s, e, games, kills, deaths, vehK, tk, deathsTk, kd, score });

  const weeks = [
    wk([2026, 5, 1],  [2026, 5, 7],  4, 6,  4, 6, 0, 0, 1.50, 1.50),
    wk([2026, 4, 25], [2026, 4, 31], 4, 18, 3, 4, 0, 0, 6.00, 4.50),
    wk([2026, 4, 18], [2026, 4, 24], 4, 3,  4, 0, 0, 0, 0.75, 0.75),
    wk([2026, 4, 11], [2026, 4, 17], 4, 5,  4, 4, 0, 0, 1.25, 1.25),
    wk([2026, 4, 4],  [2026, 4, 10], 2, 1,  2, 0, 2, 0, -0.50, -0.50),
    wk([2026, 3, 27], [2026, 4, 3],  4, 9,  3, 7, 0, 0, 3.00, 2.25),
    wk([2026, 3, 20], [2026, 3, 26], 4, 1,  4, 1, 2, 0, -0.25, -0.25),
    wk([2026, 3, 13], [2026, 3, 19], 4, 5,  3, 0, 0, 1, 1.25, 1.00),
    wk([2026, 2, 30], [2026, 3, 5],  4, 11, 2, 3, 0, 0, 5.50, 2.75),
    wk([2026, 2, 23], [2026, 2, 29], 4, 9,  3, 5, 0, 0, 3.00, 2.25),
  ];

  // ---- per-GAME breakdown for each week (deterministic; sums match the week) ----
  const MAPS = ['Chernarus', 'Altis', 'Takistan', 'Livonia', 'Malden', 'Tanoa'];
  const SIDES = ['SG', 'MACE', 'SM'];
  const RESULTS = ['W', 'L', 'W', 'L', 'Unknown', 'W'];
  const split = (total, n, seed) => {
    const arr = new Array(n).fill(Math.floor(total / n));
    let rem = total - arr[0] * n, i = seed % n;
    while (rem > 0) { arr[i % n]++; rem--; i += 2; }
    return arr;
  };
  weeks.forEach((w, wi) => {
    const K = split(w.kills, w.games, wi + 1), D = split(w.deaths, w.games, wi + 3);
    const V = split(w.vehK, w.games, wi + 2), T = split(w.tk, w.games, wi + 5), DT = split(w.deathsTk, w.games, wi + 7);
    w.matches = Array.from({ length: w.games }, (_, gi) => ({
      replay: 48000 + wi * 17 + gi * 3,
      date: [w.e[0], w.e[1], Math.min(w.e[2], w.s[2] + gi * 2)],
      map: MAPS[(wi * 2 + gi) % MAPS.length],
      side: SIDES[(wi + gi) % SIDES.length],
      result: RESULTS[(wi * 3 + gi) % RESULTS.length],
      kills: K[gi], deaths: D[gi], vehK: V[gi], tk: T[gi], deathsTk: DT[gi],
    }));
  });

  // ---- heavy / edge-case dataset (toggle via Tweaks → Data) to exercise overflow ----
  const monthsBack = (n) => { let y = 2025, m = 10 - n; while (m < 0) { m += 12; y--; } return [y, m]; };
  const WPOOL = ['AK-12 (2018)', 'AK-74M', 'M4A1 PIP', 'RPK-16', 'PKP Pecheneg', 'SVDS', 'M3 MAAWS', 'RPG-7V2',
    'Mk18 Mod1', 'HK416 A5', 'AKS-74U', 'PKM', 'SR-25', 'M249 PIP', 'Vintorez', 'AS Val', 'M110 SASS', 'Saiga-12',
    'Glock 17', 'MP5A3', 'FN Minimi', 'M320', 'Kord', 'NSV'];
  const heavyWeapons = Array.from({ length: 200 }, (_, i) => ({
    name: i < WPOOL.length ? WPOOL[i] : `${WPOOL[i % WPOOL.length]} (#${Math.floor(i / WPOOL.length) + 1})`,
    kills: 240 - i, dist: 180 + ((i * 37) % 820),
  }));
  const VPOOL = ['BMP-2 (obr. 1986g.)', 'BMD-2M', 'BTR-80', 'T-72B3', 'Mi-8MTV', 'BRDM-2', 'T-80U', '2S3 Akatsiya',
    'BTR-82A', 'Mi-24P', 'UAZ-469', 'Ural-4320'];
  const heavyVehicles = VPOOL.map((name, i) => ({ name, kills: 24 - i * 2, dist: 600 + ((i * 53) % 1300) }));
  const NPOOL = ['Sonr', '[A]Sonr', 'Sonr_', 'S0nr', 'Sonar', 'xSonr', 'Sonr|GST', 'Son.r', 'SONR', 'Sonr2',
    'Sonr_ru', '[KRG]Sonr', 'sonr', 'Sonrrr', 'Son'];
  const heavyNicks = NPOOL.map((name, i) => ({ name, from: monthsBack((i + 1) * 4), to: i === 0 ? null : monthsBack(i * 4) }));
  const heavySquads = [
    { squad: 'Alpha',        tag: 'A',   from: monthsBack(2),  to: null,           cur: true },
    { squad: 'Krieg Group',  tag: 'KRG', from: monthsBack(16), to: monthsBack(2),  cur: false },
    { squad: 'Reaper',       tag: 'RPR', from: monthsBack(24), to: monthsBack(16), cur: false },
    { squad: '7th Cavalry',  tag: '7CV', from: monthsBack(33), to: monthsBack(24), cur: false },
    { squad: 'Iron Wolves',  tag: 'IW',  from: monthsBack(41), to: monthsBack(33), cur: false },
    { squad: 'Vanguard',     tag: 'VGD', from: monthsBack(52), to: monthsBack(41), cur: false },
    { squad: 'Recruits',     tag: 'REC', from: monthsBack(60), to: monthsBack(52), cur: false },
  ];
  const heavySteam = [
    { id: '••••3071', kind: 'primary', since: monthsBack(35) },
    { id: '••••8842', kind: 'linked',  since: monthsBack(8) },
    { id: '••••5520', kind: 'linked',  since: monthsBack(20) },
    { id: '••••1097', kind: 'linked',  since: monthsBack(48) },
  ];

  return {
    id: 'sonr',
    nick: 'Sonr',
    tag: 'A',
    squad: 'Alpha',
    side: 'blue',
    canonical: true,
    rank: 141,
    sinceRotation: 6,
    // provenance (A): how the headline aggregate was derived
    provenance: { replays: 198, updatedMin: 4 },
    aka: ['[A]Sonr', 'Sonr_', 'S0nr', 'Sonar'],
    // nickname history with the period each name was in use (dates, not rotations)
    nickHistory: [
      { name: 'Sonr',    from: [2025, 10], to: null },
      { name: '[A]Sonr', from: [2025, 5],  to: [2025, 10] },
      { name: 'Sonr_',   from: [2024, 8],  to: [2025, 5] },
      { name: 'S0nr',    from: [2024, 1],  to: [2024, 8] },
      { name: 'Sonar',   from: [2023, 7],  to: [2024, 1] },
    ],
    steam: [
      { id: '••••3071', kind: 'primary', since: [2023, 6] },
      { id: '••••8842', kind: 'linked',  since: [2025, 8] },
    ],
    timeline: [
      { squad: 'Alpha',       tag: 'A',   from: [2025, 8], to: null,        cur: true },
      { squad: 'Krieg Group', tag: 'KRG', from: [2024, 0], to: [2025, 8],   cur: false },
    ],
    mergeUnderReview: true,
    pendingLink: { req: 4471, steam: '••••6643' },
    // CAREER totals (all-time). SCORE = (kills − tk) ÷ (games + deathsTk);
    // K/D = (kills − tk) ÷ (deaths + deathsTk). Both penalise teamkills and being teamkilled.
    career: {
      games: 506, kills: 608, deaths: 427, kd: 1.31, score: 1.12,
      vehKills: 99, vehPct: 16, vehDestroyed: 67, tk: 15, deathsTk: 25,
    },
    weeks,
    commander: { games: 12, w: 7, l: 3, unk: 2 },
    bounty: { pts: 312, vmul: 1.8, smul: 1.3, rotation: 92 },
    weapons: [
      { name: 'AK-12 (2018)',          kills: 22, dist: 393 },
      { name: 'AK-74M',                kills: 17, dist: 309 },
      { name: 'M4A1 PIP',              kills: 15, dist: 326 },
      { name: 'AK-74M (Zenitco/B-33)', kills: 13, dist: 258 },
      { name: 'M3 MAAWS',              kills: 10, dist: 593 },
    ],
    vehicles: [
      { name: 'BMP-2 (obr. 1986g.)', kills: 10, dist: 1223 },
      { name: 'BMD-2M',              kills: 8,  dist: 1377 },
      { name: 'BTR-80',              kills: 6,  dist: 980 },
    ],
    // edge-case bundle (200 weapons, 12 vehicles, 15 nicks, 7 squads, 4 SteamIDs)
    heavy: {
      weapons: heavyWeapons, vehicles: heavyVehicles,
      nickHistory: heavyNicks, timeline: heavySquads, steam: heavySteam,
    },
  };
})();
