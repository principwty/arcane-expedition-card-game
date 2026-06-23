export function card(id, name, cost, type, faction, rarity, stats, text, tags, effects) {
  return { id, name, cost, type, faction, rarity, stats, text, tags, effects, evolutionTier: 0, art: null };
}

export function evo(id, name, cost, type, faction, rarity, text, effects, immediate = false, stats = null, tags = []) {
  return { id, name, cost, type, faction, rarity, stats, text, tags, effects, evolutionTier: 1, immediate, art: null };
}

export const TYPE_LABELS = {
  minion: "召喚物",
  spell: "法術",
  secret: "秘儀",
  artifact: "遺物",
};

export const FACTION_LABELS = {
  star: "星穹學派",
  forest: "古林契約",
  dragon: "龍焰王庭",
  moon: "墓月教團",
  iron: "鐵誓遠征軍",
  neutral: "中立遠征者",
};

export const ART_MANIFEST = {
  cardBack: "./assets/textures/card-back.svg",
  effects: {
    damage: "./assets/effects/damage.svg",
    heal: "./assets/effects/heal.svg",
    shieldBreak: "./assets/effects/shield-break.svg",
    secret: "./assets/effects/secret.svg",
    evolution: "./assets/effects/evolution.svg",
  },
  icons: {
    types: {
      minion: "./assets/icons/type-minion.svg",
      spell: "./assets/icons/type-spell.svg",
      secret: "./assets/icons/type-secret.svg",
      artifact: "./assets/icons/type-artifact.svg",
    },
    keywords: {
      guard: "./assets/icons/keyword-guard.svg",
      swift: "./assets/icons/keyword-swift.svg",
      ward: "./assets/icons/keyword-ward.svg",
      lifesteal: "./assets/icons/keyword-lifesteal.svg",
      overwhelm: "./assets/icons/keyword-overwhelm.svg",
      ranged: "./assets/icons/keyword-ranged.svg",
      vanguard: "./assets/icons/keyword-vanguard.svg",
      support: "./assets/icons/keyword-support.svg",
    },
    rarities: {
      common: "./assets/icons/rarity-common.svg",
      rare: "./assets/icons/rarity-rare.svg",
      evolution: "./assets/icons/rarity-evolution.svg",
    },
  },
  fallbackCards: {
    star: "./assets/factions/star-card.svg",
    forest: "./assets/factions/forest-card.svg",
    dragon: "./assets/factions/dragon-card.svg",
    moon: "./assets/factions/moon-card.svg",
    iron: "./assets/factions/iron-card.svg",
    neutral: "./assets/factions/neutral-card.svg",
  },
  cardArt: {
    "astral-bolt": "./assets/cards/astral-bolt.svg",
    "mirror-rune": "./assets/cards/mirror-rune.svg",
    "astral-ascension": "./assets/cards/astral-ascension.svg",
    "fawncaller-piper": "./assets/cards/fawncaller-piper.svg",
    "great-stag": "./assets/cards/great-stag.svg",
    "worldroot-blessing": "./assets/cards/worldroot-blessing.svg",
    "ember-squire": "./assets/cards/ember-squire.svg",
    "dragon-judgment": "./assets/cards/dragon-judgment.svg",
    "apex-dragon": "./assets/cards/apex-dragon.svg",
    "bone-acolyte": "./assets/cards/bone-acolyte.svg",
    "moon-echo": "./assets/cards/moon-echo.svg",
    "grave-covenant": "./assets/cards/grave-covenant.svg",
    "expedition-banner": "./assets/cards/expedition-banner.svg",
    "bulwark-sentinel": "./assets/cards/bulwark-sentinel.svg",
    "arsenal-awakening": "./assets/cards/arsenal-awakening.svg",
  },
};

export const FACTION_THEMES = {
  star: {
    primary: "#7dd3fc",
    accent: "#c084fc",
    surface: "#111936",
    tone: "星圖、鏡面、連鎖法術與冷色反制。",
    summonerPortrait: "./assets/summoners/star.svg",
    battlefieldArt: "./assets/factions/star-battlefield.svg",
    cardBackArt: ART_MANIFEST.cardBack,
    emblem: "./assets/factions/star-emblem.svg",
  },
  forest: {
    primary: "#86efac",
    accent: "#facc15",
    surface: "#10251c",
    tone: "古林、獸群、治療與生命成長。",
    summonerPortrait: "./assets/summoners/forest.svg",
    battlefieldArt: "./assets/factions/forest-battlefield.svg",
    cardBackArt: ART_MANIFEST.cardBack,
    emblem: "./assets/factions/forest-emblem.svg",
  },
  dragon: {
    primary: "#fb7185",
    accent: "#ffd166",
    surface: "#2a1216",
    tone: "王庭、熔焰、迅捷壓制與龍族終結。",
    summonerPortrait: "./assets/summoners/dragon.svg",
    battlefieldArt: "./assets/factions/dragon-battlefield.svg",
    cardBackArt: ART_MANIFEST.cardBack,
    emblem: "./assets/factions/dragon-emblem.svg",
  },
  moon: {
    primary: "#c084fc",
    accent: "#94a3b8",
    surface: "#1b1428",
    tone: "月墓、亡魂、犧牲與復活消耗。",
    summonerPortrait: "./assets/summoners/moon.svg",
    battlefieldArt: "./assets/factions/moon-battlefield.svg",
    cardBackArt: ART_MANIFEST.cardBack,
    emblem: "./assets/factions/moon-emblem.svg",
  },
  iron: {
    primary: "#f8fafc",
    accent: "#ffd166",
    surface: "#1f2937",
    tone: "鐵誓、遺物、守護與護盾陣線。",
    summonerPortrait: "./assets/summoners/iron.svg",
    battlefieldArt: "./assets/factions/iron-battlefield.svg",
    cardBackArt: ART_MANIFEST.cardBack,
    emblem: "./assets/factions/iron-emblem.svg",
  },
  neutral: {
    primary: "#aab4c8",
    accent: "#7dd3fc",
    surface: "#172033",
    tone: "遠征補給、旅道支援與中立工具。",
    summonerPortrait: "./assets/summoners/neutral.svg",
    battlefieldArt: "./assets/factions/neutral-battlefield.svg",
    cardBackArt: ART_MANIFEST.cardBack,
    emblem: "./assets/factions/neutral-emblem.svg",
  },
};

export const EVOLUTION_THRESHOLDS = [3, 6, 9, 12, 15];

export const KEYWORD_LABELS = {
  guard: "守護",
  swift: "迅捷",
  ward: "護盾",
  lifesteal: "吸血",
  overwhelm: "踐踏",
  ranged: "遠程",
  vanguard: "先鋒",
  support: "支援",
};

export const DECK_RULES = {
  size: 30,
  maxCopies: 3,
  storageKey: "arcane-expedition-decks-v1",
};

export const SUMMONERS = [
  {
    id: "star",
    name: "艾莉亞",
    faction: "star",
    ability: "每施放第 3 張法術，抽 1 張牌並推進遠征軌。",
    style: "法術連打、抽牌、秘儀反制。",
    heroPower: { name: "星讀", cost: 2, text: "抽 1 張牌。", effects: [{ type: "draw", amount: 1 }] },
  },
  {
    id: "forest",
    name: "洛恩",
    faction: "forest",
    ability: "每召喚第 3 個召喚物，恢復 2 點生命。",
    style: "召喚獸、治療、生命成長。",
    heroPower: { name: "滋養", cost: 2, text: "為你的英雄恢復 3 點生命。", effects: [{ type: "healHero", amount: 3 }] },
  },
  {
    id: "dragon",
    name: "瑟拉克",
    faction: "dragon",
    ability: "你的第一張傷害法術每回合額外造成 1 點傷害。",
    style: "高攻擊壓制、直接傷害、龍族終結牌。",
    heroPower: { name: "龍息", cost: 2, text: "對敵方英雄造成 2 點傷害。", effects: [{ type: "damageHero", amount: 2 }] },
  },
  {
    id: "moon",
    name: "彌莎",
    faction: "moon",
    ability: "友方召喚物死亡 3 次後，召喚 1 個 1/1 亡魂。",
    style: "犧牲、復活、消耗戰。",
    heroPower: { name: "血契", cost: 2, text: "對一個友方召喚物造成 1 點傷害，抽 1 張牌。", effects: [{ type: "sacrificeDraw", target: "allyMinion" }] },
  },
  {
    id: "iron",
    name: "卡德倫",
    faction: "iron",
    ability: "你裝備遺物後，使一個友方召喚物 +1/+1。",
    style: "遺物、裝備、穩定中速場面。",
    heroPower: { name: "鍛造", cost: 2, text: "使一個友方召喚物 +1/+1；若沒有目標，抽 1 張牌。", effects: [{ type: "buffAllyOrDraw", attack: 1, health: 1 }] },
  },
];

export const BASE_CARDS = [
  card("lattice-guide", "星格導引者", 2, "minion", "star", "common", { attack: 2, health: 3, speed: 1 }, "部署：若你將它從前排移到後排，抽 1 張牌。成陣：若你前後排皆有召喚物，賦予護盾。", ["spell-chain", "deploy-shift", "v13-deploy"], [{ type: "onDeploy", draw: 1, backRow: true, movedOnly: true }, { type: "formationReward", shield: true }]),
  card("star-apprentice", "星火學徒", 2, "minion", "star", "common", { attack: 2, health: 3, speed: 1 }, "戰吼：若你本回合施放過法術，抽 1 張牌。", ["mage"], [{ type: "drawIfSpellThisTurn", amount: 1 }]),
  card("astral-bolt", "星屑箭", 1, "spell", "star", "common", null, "對一個敵方目標造成 2 點傷害。推進遠征軌 +1。", ["damage"], [{ type: "damage", amount: 2, target: "enemy" }, { type: "expedition", amount: 1, target: "none" }]),
  card("mirror-rune", "鏡面符文", 2, "secret", "star", "rare", null, "秘儀：敵方法術造成傷害時，抵銷 2 點並抽 1 張牌。", ["secret"], [{ type: "spellShield", amount: 2 }]),
  card("comet-scholar", "彗星學者", 4, "minion", "star", "rare", { attack: 3, health: 5, speed: 1 }, "你每施放法術，隨機敵人受到 1 點傷害。", ["mage"], [{ type: "spellPing", amount: 1 }]),
  card("rune-curator", "符文策展人", 3, "minion", "star", "common", { attack: 2, health: 4, speed: 1 }, "戰吼：抽 1 張牌，然後棄 1 張牌。", ["mage"], [{ type: "drawThenDiscard", amount: 1 }]),
  card("starlit-aegis", "星幕庇護", 2, "spell", "star", "common", null, "為一個友方角色恢復 3 點生命。若目標是召喚物，賦予護盾。", ["heal"], [{ type: "healTarget", amount: 3, target: "ally" }, { type: "gainShield", target: "allyMinion" }]),
  card("null-glyph", "無效刻印", 3, "spell", "star", "rare", null, "沉默一個召喚物。", ["control"], [{ type: "silenceMinion", target: "anyMinion" }]),
  card("meteor-study", "流星研習", 5, "spell", "star", "rare", null, "對全部敵方召喚物造成 2 點傷害。", ["damage"], [{ type: "damageAllEnemies", amount: 2 }]),
  card("summon-snare", "召喚拘束", 2, "secret", "star", "rare", null, "秘儀：敵方召喚召喚物後，沉默它。", ["secret"], [{ type: "silenceSummoned" }]),
  card("leyline-scribe", "星脈書吏", 2, "minion", "star", "common", { attack: 1, health: 3, speed: 1 }, "戰吼：抽 1 張牌。", ["mage", "spell-chain"], [{ type: "draw", amount: 1 }]),
  card("counter-orbit", "逆軌星環", 3, "secret", "star", "rare", null, "秘儀：敵方法術造成傷害時，抵銷 2 點並抽 1 張牌。", ["secret", "secret-control"], [{ type: "spellShield", amount: 2 }]),
  card("stellar-lesson", "星課溫習", 1, "spell", "star", "common", null, "抽 1 張牌，推進遠征軌 +1。", ["draw", "spell-chain"], [{ type: "draw", amount: 1 }, { type: "expedition", amount: 1, target: "none" }]),
  card("void-lecturer", "虛空講師", 4, "minion", "star", "rare", { attack: 3, health: 4, speed: 1 }, "登場：沉默一個召喚物。", ["mage", "secret-control"], [{ type: "silenceMinion", target: "anyMinion" }]),
  card("time-lock-adept", "時鎖修士", 3, "minion", "star", "rare", { attack: 2, health: 4, speed: 1 }, "登場：暈眩一個召喚物。", ["mage", "secret-control", "v1-system"], [{ type: "stunTarget", target: "anyMinion" }]),
  card("afterspell-oracle", "後咒占星師", 2, "minion", "star", "common", { attack: 1, health: 3, speed: 1 }, "你每施放法術，隨機敵人受到 1 點傷害。", ["mage", "spell-chain", "v1-system"], [{ type: "spellPing", amount: 1 }]),
  card("astral-marksman", "星軌射手", 2, "minion", "star", "common", { attack: 2, health: 2, speed: 1 }, "遠程。", ["mage", "ranged", "spell-chain", "v11-tactics"], []),
  card("backline-astromancer", "後列占星師", 3, "minion", "star", "rare", { attack: 2, health: 4, speed: 1 }, "支援。你每施放法術，隨機敵人受到 1 點傷害。", ["mage", "support", "spell-chain", "v11-tactics"], [{ type: "spellPing", amount: 1 }]),
  card("starbridge-weaver", "星橋織者", 2, "minion", "star", "common", { attack: 1, health: 3, speed: 1 }, "支援。若在後排登場，抽 1 張牌。", ["mage", "support", "spell-chain", "v12-position"], [{ type: "backlineBonus", draw: 1 }]),
  card("prism-frontguard", "折光前衛", 3, "minion", "star", "rare", { attack: 2, health: 5, speed: 1 }, "守護。保護後排：敵方遠程不能越過它攻擊後排。", ["mage", "guard", "secret-control", "v12-position"], [{ type: "protectBackline" }]),
  card("stellar-alignment", "星位校準", 2, "spell", "star", "common", null, "使一個友方召喚物相鄰的友方召喚物 +1/+1。", ["buff", "spell-chain", "v12-position"], [{ type: "adjacentBuff", attack: 1, health: 1, target: "allyMinion" }]),

  card("grove-strider", "林徑行者", 3, "minion", "forest", "common", { attack: 3, health: 4, speed: 1 }, "部署：若你將它從前排移到後排，為你的英雄恢復 2 點生命。成陣：使此牌 +1/+1。", ["beast-swarm", "deploy-shift", "v13-deploy"], [{ type: "onDeploy", healHero: 2, backRow: true, movedOnly: true }, { type: "formationReward", attack: 1, health: 1 }]),
  card("forest-oathkeeper", "森林守誓者", 3, "minion", "forest", "common", { attack: 3, health: 4, speed: 1 }, "每當你召喚野獸，為你的英雄恢復 1 點生命。", ["beast-ally"], [{ type: "healOnBeast", amount: 1 }]),
  card("antler-guardian", "鹿角守衛", 2, "minion", "forest", "common", { attack: 1, health: 4, speed: 1 }, "守護：敵方必須優先攻擊它。", ["beast", "guard"], []),
  card("wild-growth", "野性滋長", 2, "spell", "forest", "common", null, "恢復 4 點生命，並召喚 1 個 1/1 小鹿。", ["heal"], [{ type: "healHero", amount: 4 }, { type: "summonToken", token: "fawn" }]),
  card("elder-bear", "古林巨熊", 5, "minion", "forest", "rare", { attack: 5, health: 6, speed: 1 }, "登場：推進遠征軌 +1。", ["beast"], [{ type: "expedition", amount: 1 }]),
  card("sapling-circle", "幼樹之環", 3, "spell", "forest", "common", null, "召喚 2 個 1/1 小鹿。", ["beast"], [{ type: "summonToken", token: "fawn" }, { type: "summonToken", token: "fawn" }]),
  card("thorn-mender", "棘藤療者", 2, "minion", "forest", "common", { attack: 2, health: 3, speed: 1 }, "戰吼：為一個友方角色恢復 2 點生命。", ["beast-ally"], [{ type: "healTarget", amount: 2, target: "ally" }]),
  card("pack-chant", "群獸頌歌", 4, "spell", "forest", "rare", null, "使全部友方召喚物 +1/+1。", ["buff"], [{ type: "buffAll", attack: 1, health: 1 }]),
  card("great-stag", "聖角巨鹿", 6, "minion", "forest", "rare", { attack: 4, health: 7, speed: 1 }, "守護、吸血。登場：為你的英雄恢復 4 點生命。", ["beast", "guard", "lifesteal"], [{ type: "healHero", amount: 4 }]),
  card("root-ambush", "根鬚伏擊", 2, "secret", "forest", "rare", null, "秘儀：敵方召喚物攻擊時，召喚 1 個 1/1 小鹿並賦予它守護。", ["secret"], [{ type: "ambushGuard" }]),
  card("fawncaller-piper", "喚鹿笛手", 1, "minion", "forest", "common", { attack: 1, health: 2, speed: 1 }, "登場：召喚 1 個 1/1 小鹿。", ["beast", "beast-swarm"], [{ type: "summonToken", token: "fawn" }]),
  card("canopy-salve", "樹冠藥膏", 2, "spell", "forest", "common", null, "為一個友方角色恢復 3 點生命。", ["heal", "life-growth"], [{ type: "healTarget", amount: 3, target: "ally" }]),
  card("pack-matriarch", "獸群主母", 4, "minion", "forest", "rare", { attack: 3, health: 5, speed: 1 }, "登場：召喚 1 個 1/1 小鹿。", ["beast", "beast-swarm"], [{ type: "summonToken", token: "fawn" }]),
  card("barkhide-elder", "樹皮長老", 5, "minion", "forest", "rare", { attack: 3, health: 7, speed: 1 }, "守護。登場：為你的英雄恢復 3 點生命。", ["guard", "life-growth"], [{ type: "healHero", amount: 3 }]),
  card("dawn-grove-seer", "晨林先知", 3, "minion", "forest", "rare", { attack: 2, health: 5, speed: 1 }, "你的回合開始時，為你的英雄恢復 2 點生命。", ["life-growth", "v1-system"], [{ type: "startTurnHeal", amount: 2 }]),
  card("pack-heart-drum", "群心鼓手", 4, "minion", "forest", "rare", { attack: 2, health: 4, speed: 1 }, "你的回合開始時，全部友方野獸 +1/+1。", ["beast", "beast-swarm", "v1-system"], [{ type: "startTurnBuffBeasts", attack: 1, health: 1 }]),
  card("thornline-stag", "棘線鹿衛", 2, "minion", "forest", "common", { attack: 1, health: 4, speed: 1 }, "先鋒、守護。", ["beast", "guard", "vanguard", "beast-swarm", "v11-tactics"], []),
  card("canopy-archer", "樹冠弓手", 3, "minion", "forest", "common", { attack: 2, health: 3, speed: 1 }, "遠程。登場：為你的英雄恢復 2 點生命。", ["beast", "ranged", "life-growth", "v11-tactics"], [{ type: "healHero", amount: 2 }]),
  card("rootnet-warden", "根網庇護者", 3, "minion", "forest", "rare", { attack: 2, health: 5, speed: 1 }, "守護。保護後排。", ["beast", "guard", "life-growth", "v12-position"], [{ type: "protectBackline" }]),
  card("vine-tactician", "藤蔓調律者", 2, "minion", "forest", "common", { attack: 1, health: 3, speed: 1 }, "支援。登場：相鄰友方召喚物 +0/+1。", ["beast", "support", "beast-swarm", "v12-position"], [{ type: "adjacentBuff", attack: 0, health: 1 }]),
  card("canopy-formation", "林冠陣式", 3, "spell", "forest", "common", null, "使一個友方召喚物相鄰的友方召喚物 +1/+2。", ["buff", "beast-swarm", "v12-position"], [{ type: "adjacentBuff", attack: 1, health: 2, target: "allyMinion" }]),

  card("skyline-rider", "天際巡翼者", 2, "minion", "dragon", "common", { attack: 2, health: 2, speed: 2 }, "遠程。控線：若你控制這條線，它獲得 +1 攻擊。", ["soldier", "ranged", "v13-deploy"], [{ type: "controlLaneBonus", attack: 1 }]),
  card("dragon-judgment", "龍焰裁決", 4, "spell", "dragon", "rare", null, "對一個敵方目標造成 5 點傷害；若本局已進化 2 次，改為造成 7 點。", ["damage"], [{ type: "dragonJudgment", target: "enemy" }]),
  card("ember-squire", "餘燼侍從", 1, "minion", "dragon", "common", { attack: 2, health: 1, speed: 2 }, "迅捷。", ["soldier", "swift"], []),
  card("flame-lance", "烈焰長槍", 2, "spell", "dragon", "common", null, "對一個敵方目標造成 3 點傷害。", ["damage"], [{ type: "damage", amount: 3, target: "enemy" }]),
  card("young-drake", "幼龍", 5, "minion", "dragon", "rare", { attack: 6, health: 4, speed: 1 }, "擊敗敵方召喚物時，推進遠征軌 +1。", ["dragon"], [{ type: "expeditionOnKill", amount: 1 }]),
  card("ash-runner", "灰燼奔襲者", 2, "minion", "dragon", "common", { attack: 3, health: 2, speed: 2 }, "迅捷。", ["soldier", "swift"], []),
  card("scorching-breath", "灼熱吐息", 3, "spell", "dragon", "common", null, "對全部敵方召喚物造成 1 點傷害。", ["damage"], [{ type: "damageAllEnemies", amount: 1 }]),
  card("dragon-banneret", "龍旗騎士", 3, "minion", "dragon", "rare", { attack: 3, health: 3, speed: 1 }, "你的傷害法術額外造成 1 點傷害。", ["soldier"], [{ type: "spellDamageAura", amount: 1 }]),
  card("molten-egg", "熔核龍卵", 2, "minion", "dragon", "rare", { attack: 0, health: 4, speed: 1 }, "死亡：召喚 1 個 4/3 幼火龍。", ["dragon"], [{ type: "summonOnDeath", token: "fireling" }]),
  card("flame-ward", "火幕反擊", 2, "secret", "dragon", "rare", null, "秘儀：敵方攻擊你的英雄時，對攻擊者造成 3 點傷害。", ["secret"], [{ type: "flameCounter" }]),
  card("cinder-duelist", "燼火決鬥者", 1, "minion", "dragon", "common", { attack: 1, health: 2, speed: 2 }, "迅捷。登場：對敵方英雄造成 1 點傷害。", ["soldier", "swift", "aggro-burn"], [{ type: "damageHero", amount: 1 }]),
  card("royal-igniter", "王庭點火師", 2, "minion", "dragon", "common", { attack: 2, health: 2, speed: 1 }, "你的傷害法術額外造成 1 點傷害。", ["soldier", "aggro-burn"], [{ type: "spellDamageAura", amount: 1 }]),
  card("drake-roost", "幼龍棲巢", 4, "artifact", "dragon", "rare", null, "你的第一個召喚物攻擊時，額外造成 1 點傷害。", ["dragon", "dragon-finish"], [{ type: "bonusAttackDamage", amount: 1 }]),
  card("skyfire-whelp", "天火雛龍", 6, "minion", "dragon", "rare", { attack: 5, health: 5, speed: 2 }, "迅捷、踐踏。", ["dragon", "swift", "overwhelm", "dragon-finish"], []),
  card("bloodwing-vanguard", "血翼先鋒", 3, "minion", "dragon", "rare", { attack: 4, health: 2, speed: 2 }, "迅捷、踐踏。", ["soldier", "swift", "overwhelm", "aggro-burn", "v1-system"], []),
  card("battle-fury-edict", "戰怒敕令", 2, "spell", "dragon", "common", null, "使一個友方召喚物本回合 +2/+0。", ["buff", "aggro-burn", "v1-system"], [{ type: "temporaryBuff", attack: 2, health: 0, target: "allyMinion" }]),
  card("spearline-raider", "槍線突襲者", 2, "minion", "dragon", "common", { attack: 2, health: 2, speed: 2 }, "迅捷、先鋒。", ["soldier", "swift", "vanguard", "aggro-burn", "v11-tactics"], []),
  card("skyfire-ballista", "天火弩砲", 4, "minion", "dragon", "rare", { attack: 4, health: 3, speed: 1 }, "遠程、踐踏。", ["dragon", "ranged", "overwhelm", "dragon-finish", "v11-tactics"], []),
  card("linepiercer-lancer", "破陣槍騎", 3, "minion", "dragon", "common", { attack: 3, health: 3, speed: 2 }, "迅捷。突破：攻擊前排後，對同列後排造成 1 點傷害。", ["soldier", "swift", "aggro-burn", "v12-position"], [{ type: "breakthrough", amount: 1 }]),
  card("emberline-horn", "焰線號手", 2, "minion", "dragon", "common", { attack: 2, health: 2, speed: 1 }, "先鋒。若在前排登場，獲得 +1/+0。", ["soldier", "vanguard", "aggro-burn", "v12-position"], [{ type: "frontlineBonus", attack: 1, health: 0 }]),
  card("skyspear-drake", "天矛幼龍", 5, "minion", "dragon", "rare", { attack: 5, health: 4, speed: 1 }, "遠程。突破：攻擊前排後，對同列後排造成 2 點傷害。", ["dragon", "ranged", "dragon-finish", "v12-position"], [{ type: "breakthrough", amount: 2 }]),

  card("grave-route-mender", "墓徑修補者", 3, "minion", "moon", "common", { attack: 2, health: 4, speed: 1 }, "部署：若你將它重新部署，召喚 1 個 1/1 亡魂。成陣：抽 1 張牌。", ["sacrifice-draw", "deploy-shift", "v13-deploy"], [{ type: "onDeploy", token: "wraith", movedOnly: true }, { type: "formationReward", draw: 1 }]),
  card("moon-echo", "月墓回聲", 2, "secret", "moon", "rare", null, "秘儀：當敵方召喚物攻擊時，召喚 1 個 1/1 亡魂並使攻擊目標改為它。", ["secret"], [{ type: "redirectAttack" }]),
  card("bone-acolyte", "白骨侍祭", 2, "minion", "moon", "common", { attack: 2, health: 2, speed: 1 }, "死亡：抽 1 張牌。", ["undead"], [{ type: "drawOnDeath", amount: 1 }]),
  card("grave-offering", "墓月獻祭", 1, "spell", "moon", "common", null, "對一個友方召喚物造成 1 點傷害，抽 1 張牌，推進遠征軌 +1。", ["sacrifice"], [{ type: "sacrificeDraw", target: "allyMinion" }, { type: "expedition", amount: 1, target: "none" }]),
  card("night-revenant", "夜幕歸魂", 4, "minion", "moon", "rare", { attack: 4, health: 4, speed: 1 }, "若本局有 3 個友方召喚物死亡，登場時召喚 1 個 1/1 亡魂。", ["undead"], [{ type: "summonIfDeaths", deaths: 3, token: "wraith" }]),
  card("hollow-butcher", "空骸屠夫", 3, "minion", "moon", "common", { attack: 4, health: 3, speed: 1 }, "戰吼：對一個友方召喚物造成 1 點傷害。", ["undead"], [{ type: "damageAllyMinion", amount: 1 }]),
  card("crypt-bell", "墓穴喪鐘", 3, "artifact", "moon", "common", null, "友方召喚物死亡時，推進遠征軌 +1；每回合一次。", ["relic"], [{ type: "deathExpedition", amount: 1 }]),
  card("soul-siphon", "汲魂術", 3, "spell", "moon", "rare", null, "吸血。對一個敵方目標造成 2 點傷害。", ["damage", "lifesteal"], [{ type: "damage", amount: 2, target: "enemy" }]),
  card("grave-swarm", "墓群甦動", 5, "spell", "moon", "rare", null, "召喚 3 個 1/1 亡魂。", ["undead"], [{ type: "summonToken", token: "wraith" }, { type: "summonToken", token: "wraith" }, { type: "summonToken", token: "wraith" }]),
  card("blood-ledger", "血債簿記", 2, "artifact", "moon", "common", null, "友方召喚物死亡時，推進遠征軌 +1；每回合一次。", ["sacrifice-draw"], [{ type: "deathExpedition", amount: 1 }]),
  card("grave-matron", "墓園主母", 3, "minion", "moon", "rare", { attack: 2, health: 4, speed: 1 }, "登場：召喚 1 個 1/1 亡魂。", ["undead", "revive-grind"], [{ type: "summonToken", token: "wraith" }]),
  card("rite-of-pages", "頁骨儀式", 2, "spell", "moon", "common", null, "對一個友方召喚物造成 1 點傷害，抽 1 張牌。", ["sacrifice", "sacrifice-draw"], [{ type: "sacrificeDraw", target: "allyMinion" }]),
  card("barrow-knight", "古塚騎士", 5, "minion", "moon", "rare", { attack: 4, health: 6, speed: 1 }, "死亡：抽 1 張牌。", ["undead", "revive-grind"], [{ type: "drawOnDeath", amount: 1 }]),
  card("last-rite-censor", "終儀禁書吏", 3, "minion", "moon", "rare", { attack: 3, health: 3, speed: 1 }, "登場：封鎖一個召喚物的死亡效果。", ["undead", "sacrifice-draw", "v1-system"], [{ type: "disableDeathrattle", target: "anyMinion" }]),
  card("bone-tithe", "骨稅徵收", 2, "spell", "moon", "common", null, "對一個友方召喚物造成 1 點傷害，召喚 1 個 1/1 亡魂。", ["sacrifice", "revive-grind", "v1-system"], [{ type: "damageAllyMinion", amount: 1 }, { type: "summonToken", token: "wraith" }]),
  card("gravebow-wraith", "墓弓亡魂", 2, "minion", "moon", "common", { attack: 2, health: 1, speed: 1 }, "遠程。死亡：抽 1 張牌。", ["undead", "ranged", "revive-grind", "v11-tactics"], [{ type: "drawOnDeath", amount: 1 }]),
  card("frontline-revenant", "前線歸魂者", 3, "minion", "moon", "common", { attack: 2, health: 4, speed: 1 }, "先鋒。死亡：召喚 1 個 1/1 亡魂。", ["undead", "vanguard", "sacrifice-draw", "v11-tactics"], [{ type: "summonOnDeath", token: "wraith" }]),
  card("grave-line-summoner", "墓列招魂師", 3, "minion", "moon", "rare", { attack: 2, health: 3, speed: 1 }, "支援。若在後排登場，抽 1 張牌。", ["undead", "support", "revive-grind", "v12-position"], [{ type: "backlineBonus", draw: 1 }]),
  card("bonewall-keeper", "骨牆守衛", 2, "minion", "moon", "common", { attack: 1, health: 4, speed: 1 }, "守護。保護後排。死亡：召喚 1 個 1/1 亡魂。", ["undead", "guard", "sacrifice-draw", "v12-position"], [{ type: "protectBackline" }, { type: "summonOnDeath", token: "wraith" }]),
  card("deadlane-command", "亡陣號令", 2, "spell", "moon", "common", null, "使一個友方召喚物相鄰的友方召喚物 +1/+0。若已有 3 個友方死亡，抽 1 張牌。", ["sacrifice", "revive-grind", "v12-position"], [{ type: "adjacentBuff", attack: 1, health: 0, target: "allyMinion" }, { type: "drawIfDeaths", deaths: 3, amount: 1 }]),

  card("bastion-marshal", "壁壘元帥", 3, "minion", "iron", "common", { attack: 2, health: 5, speed: 1 }, "守護。部署：若你將它移到前排，賦予護盾。控線：若你控制這條線，賦予最佳友方召喚物護盾。", ["guard-wall", "deploy-shift", "v13-deploy"], [{ type: "onDeploy", gainShield: true, frontRow: true, movedOnly: true }, { type: "controlLaneBonus", shieldBestAlly: true }]),
  card("expedition-banner", "遠征旗印", 3, "artifact", "iron", "rare", null, "你的召喚物每回合首次進攻後，遠征軌 +1。", ["banner"], [{ type: "firstAttackExpedition", amount: 1 }]),
  card("iron-vanguard", "鐵誓先鋒", 2, "minion", "iron", "common", { attack: 2, health: 3, speed: 1 }, "若你控制遺物，獲得 +1/+1。", ["soldier"], [{ type: "buffIfArtifact", amount: 1 }]),
  card("relic-hammer", "遺跡戰錘", 3, "artifact", "iron", "common", null, "你的第一個召喚物攻擊時，額外造成 1 點傷害。", ["weapon"], [{ type: "bonusAttackDamage", amount: 1 }]),
  card("shield-engineer", "盾紋工匠", 4, "minion", "iron", "common", { attack: 3, health: 5, speed: 1 }, "登場：使另一個友方召喚物 +0/+2。", ["soldier"], [{ type: "buffAllyHealth", amount: 2 }]),
  card("bulwark-sentinel", "壁壘哨衛", 3, "minion", "iron", "common", { attack: 2, health: 5, speed: 1 }, "守護、護盾。", ["soldier", "guard", "ward"], []),
  card("relic-breaker", "遺物破砧", 2, "spell", "iron", "common", null, "摧毀一個敵方遺物；若沒有可摧毀目標，抽 1 張牌。", ["tool"], [{ type: "destroyArtifact" }, { type: "drawIfNoEnemyArtifact", amount: 1 }]),
  card("formation-drill", "陣型操演", 3, "spell", "iron", "rare", null, "使一個友方召喚物 +1/+3。", ["buff"], [{ type: "buffAlly", attack: 1, health: 3, target: "allyMinion" }]),
  card("steel-captain", "鋼誓隊長", 5, "minion", "iron", "rare", { attack: 4, health: 6, speed: 1 }, "若你控制遺物，登場時使全部友方召喚物 +1/+1。", ["soldier"], [{ type: "buffAllIfArtifact", attack: 1, health: 1 }]),
  card("aegis-protocol", "護盾協定", 2, "secret", "iron", "rare", null, "秘儀：敵方法術指定友方召喚物時，賦予該召喚物護盾。", ["secret"], [{ type: "wardSpellTarget" }]),
  card("supply-caravan", "補給車隊", 2, "minion", "iron", "common", { attack: 1, health: 3, speed: 1 }, "若你控制遺物，抽 1 張牌。", ["soldier", "relic-midrange"], [{ type: "drawIfArtifact", amount: 1 }]),
  card("shield-line", "盾線集結", 3, "spell", "iron", "common", null, "使一個友方召喚物 +1/+3。", ["guard-wall"], [{ type: "buffAlly", attack: 1, health: 3, target: "allyMinion" }]),
  card("oathbound-armory", "誓約軍械庫", 4, "artifact", "iron", "rare", null, "你的第一個召喚物攻擊時，額外造成 1 點傷害。", ["relic-midrange"], [{ type: "bonusAttackDamage", amount: 1 }]),
  card("tower-shield-bearer", "塔盾承誓者", 4, "minion", "iron", "rare", { attack: 2, health: 7, speed: 1 }, "守護、護盾。", ["soldier", "guard", "ward", "guard-wall"], []),
  card("aegis-clockwork", "聖盾機工", 3, "minion", "iron", "rare", { attack: 2, health: 4, speed: 1 }, "守護。登場：賦予最佳友方召喚物護盾。", ["soldier", "guard", "guard-wall", "v1-system"], [{ type: "gainShieldBestAlly" }]),
  card("bastion-chronicle", "壁壘紀事", 3, "artifact", "iron", "rare", null, "你的回合開始時，賦予一個友方召喚物護盾。", ["relic-midrange", "guard-wall", "v1-system"], [{ type: "startTurnShield" }]),
  card("linebreaker-captain", "破線隊長", 3, "minion", "iron", "common", { attack: 2, health: 4, speed: 1 }, "先鋒、守護。", ["soldier", "guard", "vanguard", "guard-wall", "v11-tactics"], []),
  card("relic-crossbow", "遺跡弩手", 2, "minion", "iron", "common", { attack: 2, health: 2, speed: 1 }, "遠程。若你控制遺物，抽 1 張牌。", ["soldier", "ranged", "relic-midrange", "v11-tactics"], [{ type: "drawIfArtifact", amount: 1 }]),
  card("shieldrail-engineer", "盾軌工程師", 2, "minion", "iron", "common", { attack: 1, health: 4, speed: 1 }, "守護。保護後排。", ["soldier", "guard", "guard-wall", "v12-position"], [{ type: "protectBackline" }]),
  card("flank-sergeant", "側翼軍士", 3, "minion", "iron", "common", { attack: 2, health: 4, speed: 1 }, "登場：相鄰友方召喚物 +1/+1。", ["soldier", "relic-midrange", "v12-position"], [{ type: "adjacentBuff", attack: 1, health: 1 }]),
  card("bastion-ballista", "堡壘弩砲", 4, "minion", "iron", "rare", { attack: 3, health: 5, speed: 1 }, "遠程。若在後排登場，獲得護盾。", ["soldier", "ranged", "guard-wall", "v12-position"], [{ type: "backlineBonus", shield: true }]),

  card("road-chorus", "路歌合唱", 2, "minion", "neutral", "common", { attack: 1, health: 3, speed: 1 }, "支援。部署：抽 1 張牌。成陣：推進遠征軌 +1。", ["support", "quest-support", "deploy-shift", "v13-deploy"], [{ type: "onDeploy", draw: 1, movedOnly: true }, { type: "formationReward", expedition: 1 }]),
  card("wandering-sprite", "流浪小精", 1, "minion", "neutral", "common", { attack: 1, health: 2, speed: 2 }, "迅捷。", ["beast", "swift"], []),
  card("arcane-rations", "奧術乾糧", 1, "spell", "neutral", "common", null, "抽 1 張牌。", ["draw"], [{ type: "draw", amount: 1 }]),
  card("road-guard", "旅道守衛", 2, "minion", "neutral", "common", { attack: 2, health: 2, speed: 1 }, "守護。", ["guard"], []),
  card("field-medic", "戰地醫者", 3, "minion", "neutral", "common", { attack: 2, health: 4, speed: 1 }, "戰吼：為你的英雄恢復 3 點生命。", ["healer"], [{ type: "healHero", amount: 3 }]),
  card("questing-page", "遠征見習生", 2, "minion", "neutral", "common", { attack: 2, health: 3, speed: 1 }, "登場：推進遠征軌 +1。", ["quest-support"], [{ type: "expedition", amount: 1 }]),
  card("trail-provisions", "旅途補給", 2, "spell", "neutral", "common", null, "抽 1 張牌，為你的英雄恢復 2 點生命。", ["draw", "quest-support"], [{ type: "draw", amount: 1 }, { type: "healHero", amount: 2 }]),
  card("banner-escort", "旗隊護衛", 3, "minion", "neutral", "common", { attack: 2, health: 5, speed: 1 }, "守護。", ["guard", "quest-support"], []),
  card("relic-surveyor", "遺跡測繪員", 4, "minion", "neutral", "rare", { attack: 3, health: 4, speed: 1 }, "戰吼：抽 1 張牌。", ["relic-midrange", "quest-support"], [{ type: "draw", amount: 1 }]),
  card("field-surveyor", "陣地測量員", 2, "minion", "neutral", "common", { attack: 1, health: 3, speed: 1 }, "支援。若在後排登場，抽 1 張牌。", ["support", "quest-support", "v12-position"], [{ type: "backlineBonus", draw: 1 }]),
  card("frontline-mercenary", "前線佣兵", 2, "minion", "neutral", "common", { attack: 2, health: 3, speed: 1 }, "先鋒。", ["vanguard", "quest-support", "v12-position"], []),
  card("caravan-barricade", "旅團護欄", 3, "minion", "neutral", "common", { attack: 1, health: 5, speed: 1 }, "守護。保護後排。", ["guard", "quest-support", "v12-position"], [{ type: "protectBackline" }]),
];

export const EVOLUTION_CARDS = [
  evo("astral-ascension", "星界升格", 3, "spell", "star", "覺醒", "抽 2 張牌。你的遠征軌 +1。覺醒：你的召喚師技能改為抽 2 張牌。", [{ type: "draw", amount: 2 }, { type: "expedition", amount: 1 }, { type: "upgradeHeroPower", mode: "star" }], true),
  evo("infinite-archive", "無盡典藏", 5, "artifact", "star", "強化", "每回合第一次施放法術後，抽 1 張牌。", [{ type: "firstSpellDraw", amount: 1 }]),
  evo("prismatic-silence", "稜光靜默", 2, "spell", "star", "強化", "沉默一個召喚物，抽 1 張牌。", [{ type: "silenceMinion", target: "anyMinion" }, { type: "draw", amount: 1 }], true),
  evo("starfall-conclave", "星隕議會", 6, "spell", "star", "發現", "對全部敵方召喚物造成 3 點傷害。", [{ type: "damageAllEnemies", amount: 3 }]),
  evo("astral-loop", "星環迴路", 2, "spell", "star", "強化", "抽 1 張牌，推進遠征軌 +1。", [{ type: "draw", amount: 1 }, { type: "expedition", amount: 1, target: "none" }], true, null, ["spell-chain"]),
  evo("grand-nullarium", "大無效館", 4, "artifact", "star", "覺醒", "每回合第一次施放法術後，抽 1 張牌。覺醒：星讀改為抽 2 張牌。", [{ type: "firstSpellDraw", amount: 1 }, { type: "upgradeHeroPower", mode: "star" }], false, null, ["secret-control"]),
  evo("time-prism", "時序稜鏡", 3, "spell", "star", "強化", "暈眩一個召喚物，抽 1 張牌。", [{ type: "stunTarget", target: "anyMinion" }, { type: "draw", amount: 1 }], true, null, ["secret-control", "v1-system"]),
  evo("constellation-snipers", "星座狙擊線", 4, "minion", "star", "發現", "3/4。遠程、支援。登場：抽 1 張牌。", [{ type: "draw", amount: 1 }], false, { attack: 3, health: 4, speed: 1 }, ["ranged", "support", "spell-chain", "v11-tactics"]),
  evo("astral-crossfire", "星盤交叉火力", 3, "spell", "star", "強化", "使一個友方召喚物相鄰的友方召喚物 +2/+1，抽 1 張牌。", [{ type: "adjacentBuff", attack: 2, health: 1, target: "allyMinion" }, { type: "draw", amount: 1 }], true, null, ["spell-chain", "v12-position"]),
  evo("mirror-bastion", "鏡界堡衛", 5, "minion", "star", "發現", "3/7。守護。保護後排。登場：抽 1 張牌。", [{ type: "protectBackline" }, { type: "draw", amount: 1 }], false, { attack: 3, health: 7, speed: 1 }, ["guard", "secret-control", "v12-position"]),
  evo("worldroot-blessing", "世界根祝福", 3, "spell", "forest", "強化", "使全部友方召喚物 +1/+2，恢復 3 點生命。", [{ type: "buffAll", attack: 1, health: 2 }, { type: "healHero", amount: 3 }], true),
  evo("ancient-pack", "太古獸群", 6, "minion", "forest", "發現", "6/7。登場：召喚 2 個 1/1 小鹿。", [{ type: "summonToken", token: "fawn" }, { type: "summonToken", token: "fawn" }], false, { attack: 6, health: 7, speed: 1 }, ["beast"]),
  evo("verdant-sanctuary", "翠綠聖域", 4, "artifact", "forest", "覺醒", "每回合第一次召喚野獸時，為你的英雄恢復 2 點生命。覺醒：滋養額外賦予護盾。", [{ type: "beastHealArtifact", amount: 2 }, { type: "upgradeHeroPower", mode: "forest" }]),
  evo("overgrowth", "萬木蔓生", 5, "spell", "forest", "強化", "召喚 2 個 1/1 小鹿，並使全部友方召喚物 +1/+1。", [{ type: "summonToken", token: "fawn" }, { type: "summonToken", token: "fawn" }, { type: "buffAll", attack: 1, health: 1 }], true),
  evo("pack-horizon", "獸群地平線", 4, "spell", "forest", "發現", "召喚 2 個 1/1 小鹿，抽 1 張牌。", [{ type: "summonToken", token: "fawn" }, { type: "summonToken", token: "fawn" }, { type: "draw", amount: 1 }], true, null, ["beast-swarm"]),
  evo("heartwood-crown", "心木冠冕", 5, "artifact", "forest", "覺醒", "每回合第一次召喚野獸時，為你的英雄恢復 2 點生命。覺醒：滋養額外恢復。", [{ type: "beastHealArtifact", amount: 2 }, { type: "upgradeHeroPower", mode: "forest" }], false, null, ["life-growth"]),
  evo("dawnroot-sanctum", "晨根聖所", 4, "artifact", "forest", "覺醒", "你的回合開始時，為你的英雄恢復 2 點生命。覺醒：滋養額外恢復。", [{ type: "startTurnHeal", amount: 2 }, { type: "upgradeHeroPower", mode: "forest" }], false, null, ["life-growth", "v1-system"]),
  evo("greatwood-front", "巨木前線", 5, "minion", "forest", "發現", "4/7。先鋒、守護。登場：召喚 1 個 1/1 小鹿。", [{ type: "summonToken", token: "fawn" }], false, { attack: 4, health: 7, speed: 1 }, ["guard", "vanguard", "beast-swarm", "v11-tactics"]),
  evo("living-rootwall", "活根護幕", 3, "spell", "forest", "強化", "使一個友方召喚物相鄰的友方召喚物 +1/+3，恢復 2 點生命。", [{ type: "adjacentBuff", attack: 1, health: 3, target: "allyMinion" }, { type: "healHero", amount: 2 }], true, null, ["beast-swarm", "life-growth", "v12-position"]),
  evo("thousand-branch-front", "萬枝戰線", 6, "minion", "forest", "發現", "4/8。守護。保護後排。登場：召喚 1 個 1/1 小鹿。", [{ type: "protectBackline" }, { type: "summonToken", token: "fawn" }], false, { attack: 4, health: 8, speed: 1 }, ["guard", "beast-swarm", "v12-position"]),
  evo("dragon-crown", "龍王冠冕", 6, "artifact", "dragon", "覺醒", "你的傷害法術額外造成 2 點傷害。覺醒：龍息改為 3 點傷害。", [{ type: "spellDamage", amount: 2 }, { type: "upgradeHeroPower", mode: "dragon" }]),
  evo("apex-dragon", "終焰巨龍", 8, "minion", "dragon", "發現", "8/8。迅捷、踐踏。登場：對敵方英雄造成 4 點傷害。", [{ type: "damageHero", amount: 4 }], false, { attack: 8, health: 8, speed: 2 }, ["dragon", "swift", "overwhelm"]),
  evo("inferno-chain", "煉獄連鎖", 4, "spell", "dragon", "強化", "對一個敵方目標造成 4 點傷害。若擊敗召喚物，推進遠征軌 +1。", [{ type: "damage", amount: 4, target: "enemy" }, { type: "expeditionIfTargetDies", amount: 1 }], true),
  evo("dragonflight", "龍群降臨", 7, "spell", "dragon", "發現", "召喚 2 個 4/3 幼火龍。", [{ type: "summonToken", token: "fireling" }, { type: "summonToken", token: "fireling" }]),
  evo("ember-coronation", "餘燼加冕", 3, "spell", "dragon", "強化", "對一個敵方目標造成 3 點傷害，抽 1 張牌。", [{ type: "damage", amount: 3, target: "enemy" }, { type: "draw", amount: 1 }], true, null, ["aggro-burn"]),
  evo("wyrm-king-arrival", "龍王將臨", 7, "minion", "dragon", "發現", "7/7。迅捷、踐踏。登場：對敵方英雄造成 3 點傷害。", [{ type: "damageHero", amount: 3 }], false, { attack: 7, health: 7, speed: 2 }, ["dragon", "swift", "overwhelm", "dragon-finish"]),
  evo("overrun-command", "踏陣號令", 3, "spell", "dragon", "強化", "使一個友方召喚物本回合 +3/+0。", [{ type: "temporaryBuff", attack: 3, health: 0, target: "allyMinion" }], true, null, ["aggro-burn", "v1-system"]),
  evo("skyline-onslaught", "天線猛攻", 5, "minion", "dragon", "發現", "5/4。迅捷、遠程。", [], false, { attack: 5, health: 4, speed: 2 }, ["dragon", "swift", "ranged", "dragon-finish", "v11-tactics"]),
  evo("dragonlance-breaker", "破陣龍槍", 5, "minion", "dragon", "發現", "5/4。迅捷。突破：對同列後排造成 2 點傷害。", [{ type: "breakthrough", amount: 2 }], false, { attack: 5, health: 4, speed: 2 }, ["dragon", "swift", "aggro-burn", "v12-position"]),
  evo("skyrake-line", "天焰穿線", 4, "spell", "dragon", "強化", "對一個敵方目標造成 4 點傷害。若擊敗召喚物，推進遠征軌 +1。", [{ type: "damage", amount: 4, target: "enemy" }, { type: "expeditionIfTargetDies", amount: 1 }], true, null, ["dragon-finish", "v12-position"]),
  evo("grave-covenant", "墓園契約", 4, "artifact", "moon", "覺醒", "每回合第一次友方召喚物死亡時，召喚 1 個 1/1 亡魂。覺醒：血契改為抽 2 張牌。", [{ type: "firstDeathWraith" }, { type: "upgradeHeroPower", mode: "moon" }]),
  evo("deathless-choir", "不死合唱", 5, "spell", "moon", "發現", "復活本局死亡的兩個友方召喚物。", [{ type: "revive", amount: 2 }], true),
  evo("bone-legion", "骨軍敕令", 4, "spell", "moon", "強化", "召喚 2 個 1/1 亡魂。若本局已有 3 個友方召喚物死亡，再抽 1 張牌。", [{ type: "summonToken", token: "wraith" }, { type: "summonToken", token: "wraith" }, { type: "drawIfDeaths", deaths: 3, amount: 1 }], true),
  evo("eclipse-reaper", "月蝕收割者", 6, "minion", "moon", "發現", "5/6。死亡：復活本局死亡的一個友方召喚物。", [{ type: "reviveOnDeath", amount: 1 }], false, { attack: 5, health: 6, speed: 1 }, ["undead"]),
  evo("inkblood-pact", "墨血契文", 3, "spell", "moon", "強化", "對一個友方召喚物造成 1 點傷害，抽 1 張牌，推進遠征軌 +1。", [{ type: "sacrificeDraw", target: "allyMinion" }, { type: "expedition", amount: 1, target: "none" }], true, null, ["sacrifice-draw"]),
  evo("catacomb-procession", "墓道行列", 5, "spell", "moon", "發現", "召喚 3 個 1/1 亡魂，抽 1 張牌。", [{ type: "summonToken", token: "wraith" }, { type: "summonToken", token: "wraith" }, { type: "summonToken", token: "wraith" }, { type: "draw", amount: 1 }], true, null, ["revive-grind"]),
  evo("sealed-epitaph", "封魂墓誌", 2, "spell", "moon", "強化", "封鎖一個召喚物的死亡效果，抽 1 張牌。", [{ type: "disableDeathrattle", target: "anyMinion" }, { type: "draw", amount: 1 }], true, null, ["sacrifice-draw", "v1-system"]),
  evo("midnight-firing-line", "午夜射線", 4, "spell", "moon", "發現", "召喚 2 個 2/1 遠程墓弓亡魂。", [{ type: "summonToken", token: "gravebow" }, { type: "summonToken", token: "gravebow" }], true, null, ["revive-grind", "v11-tactics"]),
  evo("crypt-crossbind", "墓道交縛", 3, "spell", "moon", "強化", "使一個友方召喚物相鄰的友方召喚物 +1/+1，召喚 1 個 1/1 亡魂。", [{ type: "adjacentBuff", attack: 1, health: 1, target: "allyMinion" }, { type: "summonToken", token: "wraith" }], true, null, ["revive-grind", "v12-position"]),
  evo("longnight-bonewall", "長夜骨牆", 5, "minion", "moon", "發現", "3/7。守護。保護後排。死亡：召喚 2 個 1/1 亡魂。", [{ type: "protectBackline" }, { type: "summonOnDeath", token: "wraith" }, { type: "summonOnDeath", token: "wraith" }], false, { attack: 3, health: 7, speed: 1 }, ["guard", "sacrifice-draw", "v12-position"]),
  evo("forge-directive", "鍛爐指令", 2, "spell", "iron", "強化", "使一個友方召喚物 +2/+2。若你控制遺物，抽 1 張牌。", [{ type: "buffAlly", attack: 2, health: 2, target: "allyMinion" }, { type: "drawIfArtifact", amount: 1, target: "none" }], true),
  evo("colossus-frame", "巨像框架", 7, "minion", "iron", "發現", "7/9。守護、護盾。你的遺物不會被摧毀。", [], false, { attack: 7, health: 9, speed: 1 }, ["guard", "ward"]),
  evo("arsenal-awakening", "軍械覺醒", 4, "artifact", "iron", "覺醒", "你的召喚物每回合首次攻擊後，使其 +1/+1。覺醒：鍛造改為 +2/+2。", [{ type: "firstAttackBuff", attack: 1, health: 1 }, { type: "upgradeHeroPower", mode: "iron" }]),
  evo("siege-protocol", "攻城協定", 5, "spell", "iron", "強化", "摧毀一個敵方遺物，並使全部友方召喚物 +1/+1。", [{ type: "destroyArtifact" }, { type: "buffAll", attack: 1, health: 1 }]),
  evo("living-bulwark", "活化壁壘", 5, "minion", "iron", "發現", "4/8。守護、護盾。登場：推進遠征軌 +1。", [{ type: "expedition", amount: 1 }], false, { attack: 4, health: 8, speed: 1 }, ["guard", "ward", "guard-wall"]),
  evo("relic-foundry", "遺物鑄所", 4, "artifact", "iron", "覺醒", "你的第一個召喚物攻擊時，額外造成 1 點傷害。覺醒：鍛造改為 +2/+2。", [{ type: "bonusAttackDamage", amount: 1 }, { type: "upgradeHeroPower", mode: "iron" }], false, null, ["relic-midrange"]),
  evo("fortress-sequence", "要塞序列", 4, "artifact", "iron", "覺醒", "你的回合開始時，賦予一個友方召喚物護盾。覺醒：鍛造改為 +2/+2。", [{ type: "startTurnShield" }, { type: "upgradeHeroPower", mode: "iron" }], false, null, ["guard-wall", "v1-system"]),
  evo("crossfire-bastion", "交叉火力堡壘", 5, "minion", "iron", "發現", "4/6。守護、遠程。登場：賦予最佳友方召喚物護盾。", [{ type: "gainShieldBestAlly" }], false, { attack: 4, health: 6, speed: 1 }, ["guard", "ranged", "relic-midrange", "v11-tactics"]),
  evo("iron-dome-array", "鐵穹陣列", 4, "spell", "iron", "強化", "使一個友方召喚物相鄰的友方召喚物 +2/+2，並賦予最佳友方護盾。", [{ type: "adjacentBuff", attack: 2, health: 2, target: "allyMinion" }, { type: "gainShieldBestAlly" }], true, null, ["guard-wall", "v12-position"]),
  evo("citadel-linebreaker", "城塞破線者", 6, "minion", "iron", "發現", "5/7。守護。保護後排。突破：對同列後排造成 1 點傷害。", [{ type: "protectBackline" }, { type: "breakthrough", amount: 1 }], false, { attack: 5, health: 7, speed: 1 }, ["guard", "relic-midrange", "v12-position"]),
  evo("expedition-map", "遠征星圖", 2, "spell", "neutral", "發現", "抽 1 張牌，推進遠征軌 +1。", [{ type: "draw", amount: 1 }, { type: "expedition", amount: 1, target: "none" }], true),
  evo("veteran-summoner", "老練召喚師", 4, "minion", "neutral", "強化", "4/5。登場：召喚 1 個 1/1 小鹿。", [{ type: "summonToken", token: "fawn" }], false, { attack: 4, health: 5, speed: 1 }, ["mage"]),
  evo("aegis-relic", "庇護遺物", 3, "artifact", "neutral", "覺醒", "你的第一個召喚物攻擊時，額外造成 1 點傷害。", [{ type: "bonusAttackDamage", amount: 1 }]),
  evo("emergency-rift", "緊急裂隙", 3, "spell", "neutral", "強化", "抽 2 張牌，然後棄 1 張牌。", [{ type: "drawThenDiscard", amount: 2 }], true),
  evo("neutralizer-orb", "中和寶珠", 2, "spell", "neutral", "發現", "沉默一個召喚物。若你手牌少於 4 張，抽 1 張牌。", [{ type: "silenceMinion", target: "anyMinion" }, { type: "drawIfLowHand", amount: 1, threshold: 4 }], true),
  evo("shared-campfire", "共燃營火", 2, "spell", "neutral", "強化", "抽 1 張牌，為你的英雄恢復 3 點生命。", [{ type: "draw", amount: 1 }, { type: "healHero", amount: 3 }], true, null, ["quest-support"]),
  evo("trailblazer-captain", "開路隊長", 5, "minion", "neutral", "發現", "5/5。守護。登場：推進遠征軌 +1。", [{ type: "expedition", amount: 1 }], false, { attack: 5, health: 5, speed: 1 }, ["guard", "quest-support"]),
];

export const TOKENS = {
  fawn: card("token-fawn", "小鹿", 0, "minion", "forest", "token", { attack: 1, health: 1, speed: 1 }, "可愛但認真。", ["beast"], []),
  wraith: card("token-wraith", "亡魂", 0, "minion", "moon", "token", { attack: 1, health: 1, speed: 1 }, "短暫回到戰場。", ["undead"], []),
  fireling: card("token-fireling", "幼火龍", 0, "minion", "dragon", "token", { attack: 4, health: 3, speed: 1 }, "火翼剛展，已經很兇。", ["dragon"], []),
  gravebow: card("token-gravebow", "墓弓亡魂", 0, "minion", "moon", "token", { attack: 2, health: 1, speed: 1 }, "遠程。", ["undead", "ranged"], []),
};

applyRepresentativeArt();

export const COIN_CARD = card("coin", "星砂硬幣", 0, "spell", "neutral", "token", null, "本回合獲得 1 點法力。", ["resource"], [{ type: "gainMana", amount: 1 }]);
export const SECOND_SUPPLY_CARD = card("second-supply", "後手補給", 0, "spell", "neutral", "token", null, "抽 1 張牌，本回合獲得 1 點法力。", ["resource"], [{ type: "draw", amount: 1 }, { type: "gainMana", amount: 1 }]);

export const QUEST_LINES = [
  quest("star-spell-chain", "星穹連式", "star", "施放 4 張法術。", "spell", 4, ["spell-chain"], { type: "draw", amount: 1 }, "抽 1 張牌並推進遠征軌 +1。"),
  quest("star-secret-control", "鏡廳戒律", "star", "打出 2 張秘儀或沉默牌。", "secretOrSilence", 2, ["secret-control"], { type: "shield", amount: 1 }, "抽 1 張牌。"),
  quest("forest-beast-swarm", "百獸呼喚", "forest", "召喚 6 個召喚物。", "summon", 6, ["beast-swarm"], { type: "summonToken", token: "fawn" }, "召喚 1 個小鹿並推進遠征軌 +1。"),
  quest("forest-life-growth", "古林年輪", "forest", "恢復 10 點生命。", "heal", 10, ["life-growth"], { type: "buffAll", attack: 1, health: 1 }, "全體友方召喚物 +1/+1。"),
  quest("dragon-aggro-burn", "燼火突襲", "dragon", "對敵方英雄造成 8 點傷害。", "heroDamage", 8, ["aggro-burn"], { type: "damageHero", amount: 2 }, "對敵方英雄造成 2 點傷害並推進遠征軌 +1。"),
  quest("dragon-dragon-finish", "龍裔登極", "dragon", "召喚 3 個龍族。", "dragonSummon", 3, ["dragon-finish"], { type: "summonToken", token: "fireling" }, "召喚 1 個幼火龍。"),
  quest("moon-sacrifice-draw", "血墨帳冊", "moon", "友方召喚物死亡 5 次。", "death", 5, ["sacrifice-draw"], { type: "draw", amount: 2 }, "抽 2 張牌。"),
  quest("moon-revive-grind", "歸魂長歌", "moon", "召喚 5 個亡魂或不死召喚物。", "undeadSummon", 5, ["revive-grind"], { type: "summonToken", token: "wraith" }, "召喚 1 個亡魂並推進遠征軌 +1。"),
  quest("iron-relic-midrange", "鐵誓補給線", "iron", "打出 3 件遺物。", "artifact", 3, ["relic-midrange"], { type: "draw", amount: 1 }, "抽 1 張牌並推進遠征軌 +1。"),
  quest("iron-guard-wall", "盾牆誓約", "iron", "召喚 4 個守護或護盾召喚物。", "guardOrWardSummon", 4, ["guard-wall"], { type: "buffAll", attack: 1, health: 1 }, "全體友方召喚物 +1/+1。"),
];

export const TACTICAL_OBJECTIVES = [
  tacticalObjective("star-deploy-initiative", "星軌部署", "star", "本回合部署 2 次。", "deploy", 2, ["deploy-shift"], { type: "draw", amount: 1 }, "抽 1 張牌。"),
  tacticalObjective("star-lane-control", "星門控線", "star", "在回合結束時控制 2 條戰線。", "controlLane", 2, ["secret-control"], { type: "shield", amount: 1 }, "為最佳友方召喚物賦予護盾。"),
  tacticalObjective("forest-formation", "林冠成陣", "forest", "本回合形成 2 次前後排連動。", "formation", 2, ["beast-swarm"], { type: "buffAll", attack: 1, health: 1 }, "全部友方召喚物 +1/+1。"),
  tacticalObjective("forest-deploy-growth", "藤徑部署", "forest", "本回合部署 3 次。", "deploy", 3, ["life-growth"], { type: "healHero", amount: 3 }, "為你的英雄恢復 3 點生命。"),
  tacticalObjective("dragon-deploy-pressure", "龍線壓迫", "dragon", "本回合部署 2 次。", "deploy", 2, ["aggro-burn"], { type: "damageHero", amount: 2 }, "對敵方英雄造成 2 點傷害。"),
  tacticalObjective("dragon-lane-pressure", "熔線控場", "dragon", "在回合結束時控制 2 條戰線。", "controlLane", 2, ["dragon-finish"], { type: "draw", amount: 1 }, "抽 1 張牌。"),
  tacticalObjective("moon-deploy-grave", "墓徑部署", "moon", "本回合部署 3 次。", "deploy", 3, ["sacrifice-draw"], { type: "summonToken", token: "wraith" }, "召喚 1 個亡魂。"),
  tacticalObjective("moon-lane-grind", "歸魂控線", "moon", "在回合結束時控制 2 條戰線。", "controlLane", 2, ["revive-grind"], { type: "draw", amount: 2 }, "抽 2 張牌。"),
  tacticalObjective("iron-deploy-formation", "鐵誓部署", "iron", "本回合部署 2 次。", "deploy", 2, ["relic-midrange"], { type: "shield", amount: 1 }, "為最佳友方召喚物賦予護盾。"),
  tacticalObjective("iron-lane-fortress", "堡壘控線", "iron", "在回合結束時控制 2 條戰線。", "controlLane", 2, ["guard-wall"], { type: "buffAll", attack: 1, health: 1 }, "全部友方召喚物 +1/+1。"),
];

export const DECK_ARCHETYPES = [
  archetype("star-spell-chain-template", "星穹連式模板", "star", "star-spell-chain", "低費法術與抽牌連動，快速推進遠征。", ["spell-chain"], [["star-apprentice", 3], ["astral-bolt", 3], ["leyline-scribe", 3], ["stellar-lesson", 3], ["rune-curator", 3], ["starlit-aegis", 2], ["backline-astromancer", 2], ["meteor-study", 2], ["astral-marksman", 3], ["starbridge-weaver", 3], ["stellar-alignment", 2], ["trail-provisions", 1]]),
  archetype("star-secret-control-template", "鏡廳控制模板", "star", "star-secret-control", "秘儀與沉默壓制節奏，再靠抽牌拉開資源。", ["secret-control"], [["mirror-rune", 3], ["summon-snare", 3], ["counter-orbit", 3], ["void-lecturer", 3], ["null-glyph", 3], ["rune-curator", 2], ["starlit-aegis", 2], ["meteor-study", 2], ["astral-marksman", 3], ["prism-frontguard", 3], ["relic-surveyor", 3]]),
  archetype("forest-beast-swarm-template", "百獸鋪場模板", "forest", "forest-beast-swarm", "用小鹿與野獸快速鋪場，靠群體增益收束。", ["beast-swarm"], [["fawncaller-piper", 3], ["thornline-stag", 3], ["wild-growth", 3], ["sapling-circle", 3], ["pack-matriarch", 3], ["forest-oathkeeper", 2], ["pack-chant", 3], ["elder-bear", 2], ["vine-tactician", 3], ["canopy-formation", 2], ["questing-page", 3]]),
  archetype("forest-life-growth-template", "年輪成長模板", "forest", "forest-life-growth", "守護與治療拖住節奏，靠大生命場面取勝。", ["life-growth"], [["canopy-salve", 3], ["thorn-mender", 3], ["barkhide-elder", 3], ["great-stag", 3], ["canopy-archer", 3], ["wild-growth", 2], ["forest-oathkeeper", 2], ["pack-chant", 2], ["rootnet-warden", 3], ["canopy-formation", 2], ["banner-escort", 2], ["field-medic", 2]]),
  archetype("dragon-aggro-burn-template", "燼火快攻模板", "dragon", "dragon-aggro-burn", "迅捷單位和直傷壓低血量，逼迫對手解場。", ["aggro-burn"], [["ember-squire", 3], ["cinder-duelist", 3], ["ash-runner", 3], ["flame-lance", 3], ["royal-igniter", 3], ["scorching-breath", 2], ["dragon-banneret", 2], ["dragon-judgment", 2], ["spearline-raider", 3], ["linepiercer-lancer", 3], ["emberline-horn", 3]]),
  archetype("dragon-finish-template", "龍族終結模板", "dragon", "dragon-dragon-finish", "用龍卵與中期遺物支撐，接高費龍族終結。", ["dragon-finish"], [["molten-egg", 3], ["young-drake", 3], ["skyfire-whelp", 3], ["drake-roost", 3], ["dragon-judgment", 3], ["flame-ward", 2], ["scorching-breath", 2], ["dragon-banneret", 2], ["skyfire-ballista", 3], ["skyspear-drake", 3], ["relic-surveyor", 3]]),
  archetype("moon-sacrifice-template", "血墨犧牲模板", "moon", "moon-sacrifice-draw", "用低費犧牲與死亡抽牌換資源，持續推進遠征。", ["sacrifice-draw"], [["grave-offering", 3], ["rite-of-pages", 3], ["bone-acolyte", 3], ["hollow-butcher", 3], ["blood-ledger", 3], ["crypt-bell", 2], ["soul-siphon", 2], ["night-revenant", 2], ["frontline-revenant", 3], ["bonewall-keeper", 3], ["deadlane-command", 3]]),
  archetype("moon-revive-template", "歸魂消耗模板", "moon", "moon-revive-grind", "召喚亡魂並反覆復活，拖長對局耗盡對手。", ["revive-grind"], [["moon-echo", 3], ["grave-matron", 3], ["grave-swarm", 3], ["night-revenant", 3], ["barrow-knight", 3], ["bone-acolyte", 2], ["soul-siphon", 2], ["crypt-bell", 2], ["gravebow-wraith", 3], ["grave-line-summoner", 3], ["deadlane-command", 3]]),
  archetype("iron-relic-template", "鐵誓遺物模板", "iron", "iron-relic-midrange", "多遺物帶動中速場面，穩定滾雪球。", ["relic-midrange"], [["expedition-banner", 3], ["relic-hammer", 3], ["oathbound-armory", 3], ["supply-caravan", 3], ["iron-vanguard", 3], ["relic-breaker", 2], ["steel-captain", 2], ["shield-engineer", 2], ["flank-sergeant", 3], ["relic-crossbow", 3], ["bastion-ballista", 3]]),
  archetype("iron-guard-template", "盾牆護衛模板", "iron", "iron-guard-wall", "守護與護盾建立防線，再用增益逐步反推。", ["guard-wall"], [["bulwark-sentinel", 3], ["tower-shield-bearer", 3], ["shield-line", 3], ["formation-drill", 3], ["aegis-protocol", 3], ["shield-engineer", 2], ["steel-captain", 2], ["expedition-banner", 2], ["linebreaker-captain", 3], ["shieldrail-engineer", 3], ["flank-sergeant", 3]]),
];

export const DEFAULT_DECK_RECIPES = Object.fromEntries(
  SUMMONERS.map((summoner) => [
    summoner.id,
    {
      id: `default-${summoner.id}`,
      name: `${FACTION_LABELS[summoner.faction]} 預設牌組`,
      summonerId: summoner.id,
      questId: firstQuestId(summoner.id),
      cardIds: defaultDeckCardIds(summoner.faction),
      updatedAt: "2026-06-11T00:00:00.000Z",
    },
  ]),
);

function quest(id, name, summonerId, conditionText, trigger, threshold, tags, reward, rewardText) {
  return { id, name, summonerId, conditionText, trigger, threshold, tags, reward, rewardText };
}

function archetype(id, name, summonerId, questId, description, tags, counts) {
  return { id, name, summonerId, questId, description, tags, cardIds: deckFromCounts(counts) };
}

function tacticalObjective(id, name, summonerId, conditionText, trigger, threshold, tags, reward, rewardText) {
  return { id, name, summonerId, conditionText, trigger, threshold, tags, reward, rewardText };
}

function deckFromCounts(counts) {
  return counts.flatMap(([id, count]) => Array(count).fill(id));
}

function firstQuestId(summonerId) {
  return QUEST_LINES.find((questLine) => questLine.summonerId === summonerId)?.id ?? "";
}

function defaultDeckCardIds(faction) {
  const rawFactionCards = BASE_CARDS.filter((item) => item.faction === faction);
  const ordered = uniqueCards([
    ...rawFactionCards.filter((item) => item.tags.includes("v13-deploy")),
    ...rawFactionCards.filter((item) => item.tags.includes("v12-position")),
    ...rawFactionCards.filter((item) => item.tags.includes("v11-tactics")),
    ...rawFactionCards.filter((item) => item.tags.includes("v1-system") && !item.tags.includes("v11-tactics") && !item.tags.includes("v12-position")),
    ...rawFactionCards.filter((item) => !item.tags.includes("v1-system") && !item.tags.includes("v11-tactics") && !item.tags.includes("v12-position")),
    ...BASE_CARDS.filter((item) => item.faction === "neutral"),
  ]);
  const cardIds = [];
  const counts = new Map();
  for (const item of ordered) {
    const limit = item.faction === "neutral" ? 2 : DECK_RULES.maxCopies;
    while ((counts.get(item.id) ?? 0) < limit && cardIds.length < DECK_RULES.size) {
      cardIds.push(item.id);
      counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
    }
  }
  return cardIds.slice(0, DECK_RULES.size);
}

function uniqueCards(cards) {
  const seen = new Set();
  const result = [];
  for (const card of cards) {
    if (seen.has(card.id)) continue;
    seen.add(card.id);
    result.push(card);
  }
  return result;
}

function applyRepresentativeArt() {
  const cards = [...BASE_CARDS, ...EVOLUTION_CARDS];
  for (const [id, image] of Object.entries(ART_MANIFEST.cardArt)) {
    const item = cards.find((candidate) => candidate.id === id);
    if (item) item.art = { image, focus: "center", fallback: item.faction };
  }
}
