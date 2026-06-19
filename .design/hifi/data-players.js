/* hifi/data-players.js — full player roster for the Players list page.
   SYNCED with the Overview: the 10 Overview players are included VERBATIM (same
   nick / squad / kills / games / score / spark) and augmented with a `deaths`
   field so K/D can be shown. The rest is a deterministically generated long tail.
   Period drives the VOLUME: a rotation = the active players (hundreds); "all-time"
   = the full community roster (~2040, matching legacy), with a long tail down to
   NEGATIVE Score / K/D (more teamkills than kills) just like the live site.
   Score & K/D use the SAME formulas and tier scale as Overview + Player profile.
     Счёт = (kills − TK) ÷ (games + deaths-from-TK)
     K/D  = (kills − TK) ÷ (deaths + deaths-from-TK)
   Loaded AFTER data-overview.js + tiers.js. */
window.SS_ROSTER = (function () {
  const OV = window.SS_OV;
  const SIDE = (OV.squads || []).reduce((m, s) => { m[s.tag] = s.side; return m; }, {});
  const sideOf = (tag) => (tag && SIDE[tag]) || 'gray';

  const fScore = (kills, games, tk, dtk) => +((kills - tk) / (games + dtk)).toFixed(2);
  const fKd = (kills, deaths, tk, dtk) => +((kills - tk) / Math.max(deaths + dtk, 1)).toFixed(2);

  // Overview tracks no deaths — supply them here so the 10 synced players carry K/D.
  const OV_DEATHS = {
    Vasiliy: 27, Strelok: 24, Kobra: 31, Tundra: 20, 'Медведь': 33,
    Ghost_9: 28, Rikom: 22, Sokol: 29, Viper: 31, 'Призрак': 25,
  };

  // ----- synced top: the Overview's players, verbatim + deaths/kd/side -----
  const top = OV.players.map(p => {
    const deaths = OV_DEATHS[p.name] != null ? OV_DEATHS[p.name] : Math.round(p.kills * 0.4) + 8;
    return {
      name: p.name, squad: p.squad, side: sideOf(p.squad),
      kills: p.kills, games: p.games, tk: p.tk, deaths, deathsTk: p.deathsTk,
      bounty: p.bounty, spark: p.spark.slice(),
      score: p.score, kd: fKd(p.kills, deaths, p.tk, p.deathsTk),
      synced: true,
    };
  });

  // ----- deterministic generated long tail (seeded, stable across reloads) -----
  let seed = 20260614;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));

  const STEMS = [
    'Sokol', 'Volk', 'Bear', 'Reaper', 'Shadow', 'Snayper', 'Tankist', 'Orel', 'Tigr',
    'Bars', 'Sever', 'Veter', 'Buran', 'Vityaz', 'Raptor', 'Falcon', 'Hawk', 'Fox',
    'Lynx', 'Puma', 'Hunter', 'Gunner', 'Scout', 'Recon', 'Sapsan', 'Krechet', 'Berkut',
    'Zubr', 'Rys', 'Kayman', 'Drozd', 'Strizh', 'Vepr', 'Kaban', 'Loki', 'Odin', 'Thor',
    'Nomad', 'Vortex', 'Echo', 'Delta', 'Bravo', 'Tabac', 'Granit', 'Kremen', 'Burya',
  ];
  const SUFFIX = ['', '', '', '_RU', '77', '_61', 'XX', '_pro', '99', '_TT', '13', '_z', '08', 'rus', '_ttv', '45', '_one', '23'];
  const CYR = [
    'Дед', 'Батя', 'Хан', 'Боец', 'Снайпер', 'Танкист', 'Связист', 'Сапёр', 'Комбат',
    'Беркут', 'Филин', 'Сыч', 'Леший', 'Кот', 'Барсук', 'Ворон', 'Сокол_61', 'Метла',
    'Дядя_Ваня', 'Зверь', 'Тихий', 'Кощей', 'Гром_77', 'Сухпай', 'Прапор', 'Лютый',
  ];
  const SQUAD_TAGS = OV.squads.map(s => s.tag);

  const used = new Set(top.map(p => p.name.toLowerCase()));
  const mkName = () => {
    for (let tries = 0; tries < 60; tries++) {
      const r = rnd();
      const n = r < 0.16 ? pick(CYR) : r < 0.52 ? (pick(STEMS) + pick(SUFFIX)) : (pick(STEMS) + ri(2, 499));
      if (!used.has(n.toLowerCase())) { used.add(n.toLowerCase()); return n; }
    }
    const n = pick(STEMS) + '_' + ri(1000, 99999);
    used.add(n.toLowerCase());
    return n;
  };

  const genOne = () => {
    const squad = rnd() < 0.12 ? null : pick(SQUAD_TAGS);
    const games = ri(4, 60);
    let kills, tk, dtk;
    const bad = rnd() < 0.025;                       // ~2.5% net-negative (TK > kills)
    if (bad) {
      kills = ri(0, 3);
      tk = kills + ri(1, 5);
      dtk = rnd() < 0.4 ? 1 : 0;
    } else {
      const sTarget = +(0.15 + Math.pow(rnd(), 2.0) * 3.0).toFixed(2);  // 0.15–3.15, skewed low
      tk = rnd() < 0.12 ? ri(1, 3) : 0;
      dtk = rnd() < 0.15 ? 1 : 0;
      kills = Math.max(Math.round(sTarget * (games + dtk)) + tk, 0);
    }
    // deaths scale with games (realistic respawn milsim: ~0.6–2.6 deaths per game)
    const deaths = Math.max(Math.round(games * (0.6 + rnd() * 2.0)) + dtk, 1);
    const score = fScore(kills, games, tk, dtk);
    const kd = fKd(kills, deaths, tk, dtk);
    const spark = Array.from({ length: 10 }, () => +(score + (rnd() - 0.5) * 1.1).toFixed(2));
    const bounty = Math.max(Math.round(kills * (50 + rnd() * 95)), 0);
    return { name: mkName(), squad, side: sideOf(squad), kills, games, tk, deaths, deathsTk: dtk, bounty, spark, score, kd };
  };

  // synced players carry only 4 weekly points from the Overview — extend to 10 so the
  // trend can widen on bigger screens (older weeks prepended, recent 4 kept verbatim).
  top.forEach(p => {
    const older = Array.from({ length: 6 }, () => Math.max(+(p.score + (rnd() - 0.5) * 1.0).toFixed(2), 0));
    p.spark = older.concat(p.spark);
  });

  const byScore = (a, b) => b.score - a.score;
  // full all-time community roster (~2040, matching the live site)
  const allTime = top.concat(Array.from({ length: 2030 }, genOne)).sort(byScore);

  return {
    allTime,
    // a rotation shows its active players — the more frequent / stronger cohort.
    // typical ≈160 active, heavy ≈420 (Tweaks → Data) to demo a busy rotation.
    rotation: (dataset) => allTime.slice(0, dataset === 'heavy' ? 420 : 160),
    replaysFor: (kind) => (kind === 'alltime' ? 21750 : 1842),
    updatedMin: 6,
  };
})();
