/* hifi/data-squads.js — full squad roster for the Squads list page.
   SYNCED with the Overview: the 10 Overview squads are included VERBATIM (same
   name / tag / side / members / kills / games / tk / score) and augmented with a
   `deaths` field (from a K/D target) so squad K/D can be shown, plus a weekly
   `spark` trend. The rest of the roster is REAL SolidGames squads lifted from the
   live sg.zone/squads directory (name / tag / side / leader / roster size) with
   deterministically-generated stats, then a generated tail of disbanded squads so
   "all-time" reaches the full historical community (~180).
   Period drives the VOLUME: a rotation = the currently-active squads (~50–70);
   "all-time" = every squad that ever competed (~180).
   Score & K/D use the SAME formulas as players; tiers use a SQUAD-specific
   population baseline (aggregate ratios sit lower than star players).
     Счёт = (kills − TK) ÷ (games + deaths-from-TK)
     K/D  = (kills − TK) ÷ (deaths + deaths-from-TK)
   Loaded AFTER data-overview.js. */

/* squad-specific tier baseline — aggregate squad ratios are compressed vs star
   players, so reuse of the player baseline would flatten every squad to "base".
   A backend would fill this from the squad population for the active period. */
window.SS_SQ_BASELINE = {
  by: {
    rotation: { score: { base: 1.00, good: 2.20, elite: 3.40 }, kd: { base: 1.00, good: 2.00, elite: 3.20 } },
    alltime:  { score: { base: 1.00, good: 2.60, elite: 4.00 }, kd: { base: 1.00, good: 2.40, elite: 3.80 } },
  },
};

window.SS_SQUADS = (function () {
  const OV = window.SS_OV;
  const fScore = (kills, games, tk, dtk) => +((kills - tk) / (games + dtk)).toFixed(2);
  const fKd = (kills, deaths, tk, dtk) => +((kills - tk) / Math.max(deaths + dtk, 1)).toFixed(2);

  let seed = 20260616;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const sparkOf = (s) => Array.from({ length: 10 }, () => Math.max(+(s + (rnd() - 0.5) * 0.9).toFixed(2), 0));

  // ----- the 10 Overview squads, VERBATIM + K/D target → deaths + spark -----
  const OV_LEADER = { DKK: 'Psycho', inTeam: 'DonMiguel', '7th': 'Uho', Wagner: 'Van', GROM: 'Gram',
    KSK: 'Tundra', '31st': 'T1BeR', DD: 'Aomine', RAF: 'Kiker', SEAL: 'Apostol' };
  const OV_KD = { DKK: 3.6, inTeam: 3.2, '7th': 2.9, Wagner: 2.5, GROM: 2.2, KSK: 2.1, '31st': 1.8, DD: 1.7, RAF: 1.4, SEAL: 1.05 };

  const top = OV.squads.map(s => {
    const deaths = Math.max(Math.round((s.kills - s.tk) / OV_KD[s.tag]) - s.deathsTk, 1);
    return {
      name: s.name, tag: s.tag, side: s.side, leader: OV_LEADER[s.tag] || '—',
      members: s.members, kills: s.kills, games: s.games, tk: s.tk, deaths, deathsTk: s.deathsTk,
      bounty: s.bounty, score: s.score, kd: fKd(s.kills, deaths, s.tk, s.deathsTk),
      spark: sparkOf(s.score), active: true, synced: true,
    };
  });
  const usedTag = new Set(top.map(s => s.tag));

  // ----- the rest of the REAL sg.zone squads: [tag, name, side, leader, members] -----
  const REAL = [
    // red
    ['FB', 'Fighting Brothers', 'red', 'Walrus', 18], ['AXE', 'AXE Group', 'red', 'Verstappen', 15],
    ['SGYR', 'SGYR', 'red', 'Fallen', 13], ['CBR', 'COBRA', 'red', 'Lalotap', 39],
    ['DSHB', 'Диверсионно-штурмовой батальон', 'red', 'shotnik', 21], ['FREAK', 'FREAKS', 'red', 'RONDO', 23],
    ['520th', 'Окопы 520', 'red', 'wigeance', 19], ['NT', 'Neko Team', 'red', 'ykcul', 14],
    // blue
    ['WD', 'Windir', 'blue', 'G-Virus', 16], ['AS', 'AS VDV', 'blue', 'Romb1k', 22],
    ['RON', '47 Ronin', 'blue', 'Grivus', 29], ['FNX', 'Phoenix', 'blue', 'Puma', 33],
    ['AV', 'Avangard', 'blue', 'Wecker', 16], ['FDB', 'Federation Block', 'blue', 'Patr1ot', 15],
    ['Weak', "Weak`s", 'blue', 'Haskoev', 24], ['SKF', 'Special Counter-Forces', 'blue', 'Pash', 13],
    ['RIP', 'Rapid Intervention Platoon', 'blue', 'Pauk', 15],
    // yellow
    ['OT', 'Old Team', 'yellow', 'beda', 34], ['PS', 'ОГСР «Пересвет»', 'yellow', 'Kambala', 14],
    ['TRUM', 'TRAUMA Reapers', 'yellow', 'Zoom', 20], ['Oz', 'Oketz', 'yellow', 'KeknyT', 12],
    ['SWR', 'Служба внешней разведки', 'yellow', 'Ksut', 34], ['13th', '13th', 'yellow', 'Evgen', 17],
    ['SHK', 'ЧВК «Шакалы»', 'yellow', 'Sota', 12],
    // green
    ['A', 'Apex', 'green', 'Markovnik', 17], ['CU', 'Cobra Unit', 'green', 'HaskiLove', 20],
    ['RL', 'Red Lynx', 'green', 'Bear', 28], ['JTF2', 'Joint Task Force 2', 'green', 'Bas', 26],
    ['ESP', 'Elite Strike Platoon', 'green', 'Loza', 22], ['RBK', 'Рубикон', 'green', 'Sen0vaL', 19],
    ['SMERSH', 'СМЕРШ', 'green', 'Traktor', 15], ['AGG', 'Altis Guard Group', 'green', 'Sandman', 15],
    ['URAL', 'URAL Squad', 'green', 'Flandern', 10],
    // independent
    ['RT', 'Revolution Team', 'gray', 'NikoFir', 14], ['VOG', 'Vityaz Operational Group', 'gray', 'Renno', 13],
    ['UNS', 'Unnamed Squad', 'gray', 'Stariy', 8], ['IT', 'Internal Troops', 'gray', 'Lukoil', 11],
    ['ORK', 'ORK', 'gray', 'Zero', 20], ['SUB7', 'SUB7', 'gray', 'Seny', 11],
    ['NPC', 'Night Patrol Command', 'gray', 'KIRrv', 6],
  ];

  /* derive plausible stats for a squad of `members`, scaled & seeded.
     stronger squads = higher score target; K/D target tracks score, compressed. */
  const statsFor = (members, lowBias) => {
    const gpm = ri(16, 30);                                  // games per member this period
    const games = Math.max(members * gpm, 40);
    const tk = ri(7, Math.max(10, Math.round(members * 0.9)));
    const deathsTk = ri(6, 20);
    const scoreT = lowBias
      ? +(0.3 + Math.pow(rnd(), 2.1) * 2.0).toFixed(2)        // disbanded tail skews low (0.3–2.3)
      : +(0.5 + Math.pow(rnd(), 1.8) * 2.45).toFixed(2);      // active real squads (0.5–2.95), capped
                                                              // below the Overview top-3 so DKK/inTeam/7th lead
    const kills = Math.max(Math.round(scoreT * (games + deathsTk)) + tk, 0);
    const kdT = clamp(scoreT * (0.7 + rnd() * 0.28), 0.55, 4.0);
    const deaths = Math.max(Math.round((kills - tk) / kdT) - deathsTk, 1);
    const bounty = Math.max(Math.round(kills * (38 + rnd() * 70)), 0);
    return {
      members, kills, games, tk, deaths, deathsTk, bounty,
      score: fScore(kills, games, tk, deathsTk), kd: fKd(kills, deaths, tk, deathsTk),
      spark: sparkOf(scoreT),
    };
  };

  const real = REAL.map(([tag, name, side, leader, members]) => {
    usedTag.add(tag);
    return { name, tag, side, leader, active: true, ...statsFor(members, false) };
  });

  // ----- generated disbanded tail (all-time only) -----
  const SIDES = ['red', 'blue', 'yellow', 'green', 'gray'];
  const NAME_A = ['Iron', 'Black', 'Red', 'Night', 'Steel', 'Ghost', 'Silent', 'Rapid', 'Lost', 'Frost',
    'Storm', 'Shadow', 'Crimson', 'Arctic', 'Desert', 'Granite', 'Savage', 'Rogue', 'Vanguard', 'Phantom'];
  const NAME_B = ['Wolves', 'Reapers', 'Guard', 'Legion', 'Company', 'Battalion', 'Platoon', 'Brigade',
    'Hunters', 'Lancers', 'Rangers', 'Corps', 'Division', 'Cell', 'Unit', 'Pack', 'Squadron', 'Crew'];
  const NAME_CYR = ['Гвардия', 'Заслон', 'Рубеж', 'Дозор', 'Барьер', 'Эшелон', 'Авангард', 'Редут',
    'Гарнизон', 'Форпост', 'Застава', 'Бастион', 'Кордон', 'Дружина', 'Сотня'];
  const LEAD = ['Gром', 'Snayper', 'Volkov', 'Tihiy', 'Kombat', 'Sych', 'Leshiy', 'Bars', 'Veter', 'Sever',
    'Orel', 'Kaban', 'Loki', 'Nomad', 'Echo', 'Delta', 'Bravo', 'Granit', 'Burya', 'Vepr', 'Drozd', 'Strizh'];
  const mkTag = () => {
    for (let i = 0; i < 50; i++) {
      const r = rnd();
      const t = r < 0.4 ? (pick(['I', 'B', 'R', 'N', 'S', 'G', 'V', 'K', 'D', 'F', 'A', 'X', 'Z']) + pick(['T', 'G', 'F', 'X', 'S', 'R', 'K', 'V', 'C', 'D']))
        : r < 0.72 ? ('' + ri(2, 99) + pick(['th', 'st', 'nd']))
        : (pick(['SG', 'VG', 'RT', 'OP', 'KS', 'DV', 'BR', 'FX', 'NK']) + ri(1, 9));
      if (!usedTag.has(t)) { usedTag.add(t); return t; }
    }
    const t = 'SQ' + ri(100, 9999); usedTag.add(t); return t;
  };
  const mkName = () => rnd() < 0.34 ? pick(NAME_CYR) + (rnd() < 0.4 ? ' ' + ri(2, 90) : '')
    : pick(NAME_A) + ' ' + pick(NAME_B);

  const tail = Array.from({ length: 130 }, () => {
    const members = ri(5, 30);
    const recent = rnd() < 0.14;                              // a few generated squads are freshly active
    return { name: mkName(), tag: mkTag(), side: pick(SIDES), leader: pick(LEAD), active: recent, ...statsFor(members, true) };
  });

  const byScore = (a, b) => b.score - a.score;
  const allTime = top.concat(real, tail).sort(byScore);
  const activeAll = allTime.filter(s => s.active);            // ~real(50) + a few generated
  const realActive = top.concat(real).sort(byScore);          // the canonical 50

  return {
    allTime,
    // rotation shows the active cohort. typical = the 50 canonical real squads;
    // heavy = real + recently-formed generated squads (a busier rotation) for edge demos.
    rotation: (dataset) => (dataset === 'heavy' ? activeAll : realActive),
    // "last 4 weeks" window applied ON TOP of a rotation (squad mechanic). Recent form:
    // score = mean of the last 4 weekly points; volume stats scaled to a recent slice.
    window4w: (squads) => squads.map(s => {
      const recent = s.spark.slice(-4);
      const score = +(recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(2);
      const games = Math.max(Math.round(s.games * 0.34), 4);
      const tk = Math.round(s.tk * 0.34);
      const deathsTk = Math.round(s.deathsTk * 0.34);
      const kills = Math.max(Math.round(score * (games + deathsTk)) + tk, 0);
      const deaths = Math.max(Math.round(s.deaths * 0.34), 1);
      const kd = +((kills - tk) / Math.max(deaths + deathsTk, 1)).toFixed(2);
      return { ...s, games, kills, tk, deaths, deathsTk, score, kd, spark: recent, bounty: Math.round(s.bounty * 0.34) };
    }).sort((a, b) => b.score - a.score),
    replaysFor: (kind) => (kind === 'alltime' ? 21750 : 1842),
    updatedMin: 6,
  };
})();
