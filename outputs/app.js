const TYPE_LABELS = {
  minion: "召喚物",
  spell: "法術",
  secret: "秘儀",
  artifact: "遺物",
};

const FACTION_LABELS = {
  star: "星穹學派",
  forest: "古林契約",
  dragon: "龍焰王庭",
  moon: "墓月教團",
  iron: "鐵誓遠征軍",
  neutral: "中立遠征者",
};

const EVOLUTION_THRESHOLDS = [3, 6, 9, 12, 15];

const KEYWORD_LABELS = {
  guard: "守護",
  swift: "迅捷",
  ward: "護盾",
  lifesteal: "吸血",
  overwhelm: "踐踏",
};

const SUMMONERS = [
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

const BASE_CARDS = [
  card("star-apprentice", "星火學徒", 2, "minion", "star", "common", { attack: 2, health: 3, speed: 1 }, "戰吼：若你本回合施放過法術，抽 1 張牌。", ["mage"], [{ type: "drawIfSpellThisTurn", amount: 1 }]),
  card("astral-bolt", "星屑箭", 1, "spell", "star", "common", null, "對一個敵方目標造成 2 點傷害。推進遠征軌 +1。", ["damage"], [{ type: "damage", amount: 2, target: "enemy" }, { type: "expedition", amount: 1, target: "none" }]),
  card("mirror-rune", "鏡面符文", 2, "secret", "star", "rare", null, "秘儀：敵方法術造成傷害時，抵銷 2 點並抽 1 張牌。", ["secret"], [{ type: "spellShield", amount: 2 }]),
  card("comet-scholar", "彗星學者", 4, "minion", "star", "rare", { attack: 3, health: 5, speed: 1 }, "你每施放法術，隨機敵人受到 1 點傷害。", ["mage"], [{ type: "spellPing", amount: 1 }]),
  card("rune-curator", "符文策展人", 3, "minion", "star", "common", { attack: 2, health: 4, speed: 1 }, "戰吼：抽 1 張牌，然後棄 1 張牌。", ["mage"], [{ type: "drawThenDiscard", amount: 1 }]),
  card("starlit-aegis", "星幕庇護", 2, "spell", "star", "common", null, "為一個友方角色恢復 3 點生命。若目標是召喚物，賦予護盾。", ["heal"], [{ type: "healTarget", amount: 3, target: "ally" }, { type: "gainShield", target: "allyMinion" }]),
  card("null-glyph", "無效刻印", 3, "spell", "star", "rare", null, "沉默一個召喚物。", ["control"], [{ type: "silenceMinion", target: "anyMinion" }]),
  card("meteor-study", "流星研習", 5, "spell", "star", "rare", null, "對全部敵方召喚物造成 2 點傷害。", ["damage"], [{ type: "damageAllEnemies", amount: 2 }]),
  card("summon-snare", "召喚拘束", 2, "secret", "star", "rare", null, "秘儀：敵方召喚召喚物後，沉默它。", ["secret"], [{ type: "silenceSummoned" }]),

  card("forest-oathkeeper", "森林守誓者", 3, "minion", "forest", "common", { attack: 3, health: 4, speed: 1 }, "每當你召喚野獸，為你的英雄恢復 1 點生命。", ["beast-ally"], [{ type: "healOnBeast", amount: 1 }]),
  card("antler-guardian", "鹿角守衛", 2, "minion", "forest", "common", { attack: 1, health: 4, speed: 1 }, "守護：敵方必須優先攻擊它。", ["beast", "guard"], []),
  card("wild-growth", "野性滋長", 2, "spell", "forest", "common", null, "恢復 4 點生命，並召喚 1 個 1/1 小鹿。", ["heal"], [{ type: "healHero", amount: 4 }, { type: "summonToken", token: "fawn" }]),
  card("elder-bear", "古林巨熊", 5, "minion", "forest", "rare", { attack: 5, health: 6, speed: 1 }, "登場：推進遠征軌 +1。", ["beast"], [{ type: "expedition", amount: 1 }]),
  card("sapling-circle", "幼樹之環", 3, "spell", "forest", "common", null, "召喚 2 個 1/1 小鹿。", ["beast"], [{ type: "summonToken", token: "fawn" }, { type: "summonToken", token: "fawn" }]),
  card("thorn-mender", "棘藤療者", 2, "minion", "forest", "common", { attack: 2, health: 3, speed: 1 }, "戰吼：為一個友方角色恢復 2 點生命。", ["beast-ally"], [{ type: "healTarget", amount: 2, target: "ally" }]),
  card("pack-chant", "群獸頌歌", 4, "spell", "forest", "rare", null, "使全部友方召喚物 +1/+1。", ["buff"], [{ type: "buffAll", attack: 1, health: 1 }]),
  card("great-stag", "聖角巨鹿", 6, "minion", "forest", "rare", { attack: 4, health: 7, speed: 1 }, "守護、吸血。登場：為你的英雄恢復 4 點生命。", ["beast", "guard", "lifesteal"], [{ type: "healHero", amount: 4 }]),
  card("root-ambush", "根鬚伏擊", 2, "secret", "forest", "rare", null, "秘儀：敵方召喚物攻擊時，召喚 1 個 1/1 小鹿並賦予它守護。", ["secret"], [{ type: "ambushGuard" }]),

  card("dragon-judgment", "龍焰裁決", 4, "spell", "dragon", "rare", null, "對一個敵方目標造成 5 點傷害；若本局已進化 2 次，改為造成 7 點。", ["damage"], [{ type: "dragonJudgment", target: "enemy" }]),
  card("ember-squire", "餘燼侍從", 1, "minion", "dragon", "common", { attack: 2, health: 1, speed: 2 }, "迅捷。", ["soldier", "swift"], []),
  card("flame-lance", "烈焰長槍", 2, "spell", "dragon", "common", null, "對一個敵方目標造成 3 點傷害。", ["damage"], [{ type: "damage", amount: 3, target: "enemy" }]),
  card("young-drake", "幼龍", 5, "minion", "dragon", "rare", { attack: 6, health: 4, speed: 1 }, "擊敗敵方召喚物時，推進遠征軌 +1。", ["dragon"], [{ type: "expeditionOnKill", amount: 1 }]),
  card("ash-runner", "灰燼奔襲者", 2, "minion", "dragon", "common", { attack: 3, health: 2, speed: 2 }, "迅捷。", ["soldier", "swift"], []),
  card("scorching-breath", "灼熱吐息", 3, "spell", "dragon", "common", null, "對全部敵方召喚物造成 1 點傷害。", ["damage"], [{ type: "damageAllEnemies", amount: 1 }]),
  card("dragon-banneret", "龍旗騎士", 3, "minion", "dragon", "rare", { attack: 3, health: 3, speed: 1 }, "你的傷害法術額外造成 1 點傷害。", ["soldier"], [{ type: "spellDamageAura", amount: 1 }]),
  card("molten-egg", "熔核龍卵", 2, "minion", "dragon", "rare", { attack: 0, health: 4, speed: 1 }, "死亡：召喚 1 個 4/3 幼火龍。", ["dragon"], [{ type: "summonOnDeath", token: "fireling" }]),
  card("flame-ward", "火幕反擊", 2, "secret", "dragon", "rare", null, "秘儀：敵方攻擊你的英雄時，對攻擊者造成 3 點傷害。", ["secret"], [{ type: "flameCounter" }]),

  card("moon-echo", "月墓回聲", 2, "secret", "moon", "rare", null, "秘儀：當敵方召喚物攻擊時，召喚 1 個 1/1 亡魂並使攻擊目標改為它。", ["secret"], [{ type: "redirectAttack" }]),
  card("bone-acolyte", "白骨侍祭", 2, "minion", "moon", "common", { attack: 2, health: 2, speed: 1 }, "死亡：抽 1 張牌。", ["undead"], [{ type: "drawOnDeath", amount: 1 }]),
  card("grave-offering", "墓月獻祭", 1, "spell", "moon", "common", null, "對一個友方召喚物造成 1 點傷害，抽 1 張牌，推進遠征軌 +1。", ["sacrifice"], [{ type: "sacrificeDraw", target: "allyMinion" }, { type: "expedition", amount: 1, target: "none" }]),
  card("night-revenant", "夜幕歸魂", 4, "minion", "moon", "rare", { attack: 4, health: 4, speed: 1 }, "若本局有 3 個友方召喚物死亡，登場時召喚 1 個 1/1 亡魂。", ["undead"], [{ type: "summonIfDeaths", deaths: 3, token: "wraith" }]),
  card("hollow-butcher", "空骸屠夫", 3, "minion", "moon", "common", { attack: 4, health: 3, speed: 1 }, "戰吼：對一個友方召喚物造成 1 點傷害。", ["undead"], [{ type: "damageAllyMinion", amount: 1 }]),
  card("crypt-bell", "墓穴喪鐘", 3, "artifact", "moon", "common", null, "友方召喚物死亡時，推進遠征軌 +1；每回合一次。", ["relic"], [{ type: "deathExpedition", amount: 1 }]),
  card("soul-siphon", "汲魂術", 3, "spell", "moon", "rare", null, "吸血。對一個敵方目標造成 2 點傷害。", ["damage", "lifesteal"], [{ type: "damage", amount: 2, target: "enemy" }]),
  card("grave-swarm", "墓群甦動", 5, "spell", "moon", "rare", null, "召喚 3 個 1/1 亡魂。", ["undead"], [{ type: "summonToken", token: "wraith" }, { type: "summonToken", token: "wraith" }, { type: "summonToken", token: "wraith" }]),

  card("expedition-banner", "遠征旗印", 3, "artifact", "iron", "rare", null, "你的召喚物每回合首次進攻後，遠征軌 +1。", ["banner"], [{ type: "firstAttackExpedition", amount: 1 }]),
  card("iron-vanguard", "鐵誓先鋒", 2, "minion", "iron", "common", { attack: 2, health: 3, speed: 1 }, "若你控制遺物，獲得 +1/+1。", ["soldier"], [{ type: "buffIfArtifact", amount: 1 }]),
  card("relic-hammer", "遺跡戰錘", 3, "artifact", "iron", "common", null, "你的第一個召喚物攻擊時，額外造成 1 點傷害。", ["weapon"], [{ type: "bonusAttackDamage", amount: 1 }]),
  card("shield-engineer", "盾紋工匠", 4, "minion", "iron", "common", { attack: 3, health: 5, speed: 1 }, "登場：使另一個友方召喚物 +0/+2。", ["soldier"], [{ type: "buffAllyHealth", amount: 2 }]),
  card("bulwark-sentinel", "壁壘哨衛", 3, "minion", "iron", "common", { attack: 2, health: 5, speed: 1 }, "守護、護盾。", ["soldier", "guard", "ward"], []),
  card("relic-breaker", "遺物破砧", 2, "spell", "iron", "common", null, "摧毀一個敵方遺物；若沒有可摧毀目標，抽 1 張牌。", ["tool"], [{ type: "destroyArtifact" }, { type: "drawIfNoEnemyArtifact", amount: 1 }]),
  card("formation-drill", "陣型操演", 3, "spell", "iron", "rare", null, "使一個友方召喚物 +1/+3。", ["buff"], [{ type: "buffAlly", attack: 1, health: 3, target: "allyMinion" }]),
  card("steel-captain", "鋼誓隊長", 5, "minion", "iron", "rare", { attack: 4, health: 6, speed: 1 }, "若你控制遺物，登場時使全部友方召喚物 +1/+1。", ["soldier"], [{ type: "buffAllIfArtifact", attack: 1, health: 1 }]),
  card("aegis-protocol", "護盾協定", 2, "secret", "iron", "rare", null, "秘儀：敵方法術指定友方召喚物時，賦予該召喚物護盾。", ["secret"], [{ type: "wardSpellTarget" }]),

  card("wandering-sprite", "流浪小精", 1, "minion", "neutral", "common", { attack: 1, health: 2, speed: 2 }, "迅捷。", ["beast", "swift"], []),
  card("arcane-rations", "奧術乾糧", 1, "spell", "neutral", "common", null, "抽 1 張牌。", ["draw"], [{ type: "draw", amount: 1 }]),
  card("road-guard", "旅道守衛", 2, "minion", "neutral", "common", { attack: 2, health: 2, speed: 1 }, "守護。", ["guard"], []),
  card("field-medic", "戰地醫者", 3, "minion", "neutral", "common", { attack: 2, health: 4, speed: 1 }, "戰吼：為你的英雄恢復 3 點生命。", ["healer"], [{ type: "healHero", amount: 3 }]),
];

const EVOLUTION_CARDS = [
  evo("astral-ascension", "星界升格", 3, "spell", "star", "覺醒", "抽 2 張牌。你的遠征軌 +1。覺醒：你的召喚師技能改為抽 2 張牌。", [{ type: "draw", amount: 2 }, { type: "expedition", amount: 1 }, { type: "upgradeHeroPower", mode: "star" }], true),
  evo("infinite-archive", "無盡典藏", 5, "artifact", "star", "強化", "每回合第一次施放法術後，抽 1 張牌。", [{ type: "firstSpellDraw", amount: 1 }]),
  evo("prismatic-silence", "稜光靜默", 2, "spell", "star", "強化", "沉默一個召喚物，抽 1 張牌。", [{ type: "silenceMinion", target: "anyMinion" }, { type: "draw", amount: 1 }], true),
  evo("starfall-conclave", "星隕議會", 6, "spell", "star", "發現", "對全部敵方召喚物造成 3 點傷害。", [{ type: "damageAllEnemies", amount: 3 }]),
  evo("worldroot-blessing", "世界根祝福", 3, "spell", "forest", "強化", "使全部友方召喚物 +1/+2，恢復 3 點生命。", [{ type: "buffAll", attack: 1, health: 2 }, { type: "healHero", amount: 3 }], true),
  evo("ancient-pack", "太古獸群", 6, "minion", "forest", "發現", "6/7。登場：召喚 2 個 1/1 小鹿。", [{ type: "summonToken", token: "fawn" }, { type: "summonToken", token: "fawn" }], false, { attack: 6, health: 7, speed: 1 }, ["beast"]),
  evo("verdant-sanctuary", "翠綠聖域", 4, "artifact", "forest", "覺醒", "每回合第一次召喚野獸時，為你的英雄恢復 2 點生命。覺醒：滋養額外賦予護盾。", [{ type: "beastHealArtifact", amount: 2 }, { type: "upgradeHeroPower", mode: "forest" }]),
  evo("overgrowth", "萬木蔓生", 5, "spell", "forest", "強化", "召喚 2 個 1/1 小鹿，並使全部友方召喚物 +1/+1。", [{ type: "summonToken", token: "fawn" }, { type: "summonToken", token: "fawn" }, { type: "buffAll", attack: 1, health: 1 }], true),
  evo("dragon-crown", "龍王冠冕", 6, "artifact", "dragon", "覺醒", "你的傷害法術額外造成 2 點傷害。覺醒：龍息改為 3 點傷害。", [{ type: "spellDamage", amount: 2 }, { type: "upgradeHeroPower", mode: "dragon" }]),
  evo("apex-dragon", "終焰巨龍", 8, "minion", "dragon", "發現", "8/8。迅捷、踐踏。登場：對敵方英雄造成 4 點傷害。", [{ type: "damageHero", amount: 4 }], false, { attack: 8, health: 8, speed: 2 }, ["dragon", "swift", "overwhelm"]),
  evo("inferno-chain", "煉獄連鎖", 4, "spell", "dragon", "強化", "對一個敵方目標造成 4 點傷害。若擊敗召喚物，推進遠征軌 +1。", [{ type: "damage", amount: 4, target: "enemy" }, { type: "expeditionIfTargetDies", amount: 1 }], true),
  evo("dragonflight", "龍群降臨", 7, "spell", "dragon", "發現", "召喚 2 個 4/3 幼火龍。", [{ type: "summonToken", token: "fireling" }, { type: "summonToken", token: "fireling" }]),
  evo("grave-covenant", "墓園契約", 4, "artifact", "moon", "覺醒", "每回合第一次友方召喚物死亡時，召喚 1 個 1/1 亡魂。覺醒：血契改為抽 2 張牌。", [{ type: "firstDeathWraith" }, { type: "upgradeHeroPower", mode: "moon" }]),
  evo("deathless-choir", "不死合唱", 5, "spell", "moon", "發現", "復活本局死亡的兩個友方召喚物。", [{ type: "revive", amount: 2 }], true),
  evo("bone-legion", "骨軍敕令", 4, "spell", "moon", "強化", "召喚 2 個 1/1 亡魂。若本局已有 3 個友方召喚物死亡，再抽 1 張牌。", [{ type: "summonToken", token: "wraith" }, { type: "summonToken", token: "wraith" }, { type: "drawIfDeaths", deaths: 3, amount: 1 }], true),
  evo("eclipse-reaper", "月蝕收割者", 6, "minion", "moon", "發現", "5/6。死亡：復活本局死亡的一個友方召喚物。", [{ type: "reviveOnDeath", amount: 1 }], false, { attack: 5, health: 6, speed: 1 }, ["undead"]),
  evo("forge-directive", "鍛爐指令", 2, "spell", "iron", "強化", "使一個友方召喚物 +2/+2。若你控制遺物，抽 1 張牌。", [{ type: "buffAlly", attack: 2, health: 2, target: "allyMinion" }, { type: "drawIfArtifact", amount: 1, target: "none" }], true),
  evo("colossus-frame", "巨像框架", 7, "minion", "iron", "發現", "7/9。守護、護盾。你的遺物不會被摧毀。", [], false, { attack: 7, health: 9, speed: 1 }, ["guard", "ward"]),
  evo("arsenal-awakening", "軍械覺醒", 4, "artifact", "iron", "覺醒", "你的召喚物每回合首次攻擊後，使其 +1/+1。覺醒：鍛造改為 +2/+2。", [{ type: "firstAttackBuff", attack: 1, health: 1 }, { type: "upgradeHeroPower", mode: "iron" }]),
  evo("siege-protocol", "攻城協定", 5, "spell", "iron", "強化", "摧毀一個敵方遺物，並使全部友方召喚物 +1/+1。", [{ type: "destroyArtifact" }, { type: "buffAll", attack: 1, health: 1 }]),
  evo("expedition-map", "遠征星圖", 2, "spell", "neutral", "發現", "抽 1 張牌，推進遠征軌 +1。", [{ type: "draw", amount: 1 }, { type: "expedition", amount: 1, target: "none" }], true),
  evo("veteran-summoner", "老練召喚師", 4, "minion", "neutral", "強化", "4/5。登場：召喚 1 個 1/1 小鹿。", [{ type: "summonToken", token: "fawn" }], false, { attack: 4, health: 5, speed: 1 }, ["mage"]),
  evo("aegis-relic", "庇護遺物", 3, "artifact", "neutral", "覺醒", "你的第一個召喚物攻擊時，額外造成 1 點傷害。", [{ type: "bonusAttackDamage", amount: 1 }]),
  evo("emergency-rift", "緊急裂隙", 3, "spell", "neutral", "強化", "抽 2 張牌，然後棄 1 張牌。", [{ type: "drawThenDiscard", amount: 2 }], true),
  evo("neutralizer-orb", "中和寶珠", 2, "spell", "neutral", "發現", "沉默一個召喚物。若你手牌少於 4 張，抽 1 張牌。", [{ type: "silenceMinion", target: "anyMinion" }, { type: "drawIfLowHand", amount: 1, threshold: 4 }], true),
];

const TOKENS = {
  fawn: card("token-fawn", "小鹿", 0, "minion", "forest", "token", { attack: 1, health: 1, speed: 1 }, "可愛但認真。", ["beast"], []),
  wraith: card("token-wraith", "亡魂", 0, "minion", "moon", "token", { attack: 1, health: 1, speed: 1 }, "短暫回到戰場。", ["undead"], []),
  fireling: card("token-fireling", "幼火龍", 0, "minion", "dragon", "token", { attack: 4, health: 3, speed: 1 }, "火翼剛展，已經很兇。", ["dragon"], []),
};

const COIN_CARD = card("coin", "星砂硬幣", 0, "spell", "neutral", "token", null, "本回合獲得 1 點法力。", ["resource"], [{ type: "gainMana", amount: 1 }]);
const SECOND_SUPPLY_CARD = card("second-supply", "後手補給", 0, "spell", "neutral", "token", null, "抽 1 張牌，本回合獲得 1 點法力。", ["resource"], [{ type: "draw", amount: 1 }, { type: "gainMana", amount: 1 }]);

let state;
let uid = 0;

const els = {
  start: document.querySelector("#startScreen"),
  game: document.querySelector("#gameScreen"),
  summonerGrid: document.querySelector("#summonerGrid"),
  matchTitle: document.querySelector("#matchTitle"),
  opponentArea: document.querySelector("#opponentArea"),
  playerArea: document.querySelector("#playerArea"),
  opponentBoard: document.querySelector("#opponentBoard"),
  playerBoard: document.querySelector("#playerBoard"),
  opponentArtifacts: document.querySelector("#opponentArtifacts"),
  playerArtifacts: document.querySelector("#playerArtifacts"),
  hand: document.querySelector("#hand"),
  log: document.querySelector("#log"),
  metrics: document.querySelector("#metrics"),
  balanceSummary: document.querySelector("#balanceSummary"),
  endTurn: document.querySelector("#endTurnBtn"),
  newGame: document.querySelector("#newGameBtn"),
  simulate: document.querySelector("#simulateBtn"),
  evoModal: document.querySelector("#evolutionModal"),
  evoChoices: document.querySelector("#evolutionChoices"),
  resultModal: document.querySelector("#resultModal"),
  resultTitle: document.querySelector("#resultTitle"),
  resultText: document.querySelector("#resultText"),
  resultNewGame: document.querySelector("#resultNewGameBtn"),
};

function card(id, name, cost, type, faction, rarity, stats, text, tags, effects) {
  return { id, name, cost, type, faction, rarity, stats, text, tags, effects, evolutionTier: 0 };
}

function evo(id, name, cost, type, faction, rarity, text, effects, immediate = false, stats = null, tags = []) {
  return { id, name, cost, type, faction, rarity, stats, text, tags, effects, evolutionTier: 1, immediate };
}

function cloneCard(template) {
  return {
    ...template,
    uid: `c${uid++}`,
    currentHealth: template.stats?.health ?? null,
    currentAttack: template.stats?.attack ?? null,
    shield: template.tags?.includes("ward") ?? false,
    canAttack: false,
    attackedThisTurn: false,
  };
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createPlayer(kind, summonerId) {
  const summoner = SUMMONERS.find((item) => item.id === summonerId);
  const deckTemplates = buildDeckTemplates(summoner);
  return {
    kind,
    summoner,
    hp: 28,
    maxMana: 0,
    mana: 0,
    deck: shuffle(deckTemplates.map(cloneCard)),
    hand: [],
    board: [],
    artifacts: [],
    secrets: [],
    discard: [],
    deadMinions: [],
    expedition: 0,
    evolutionCount: 0,
    selectedEvolutions: [],
    pendingEvolution: null,
    heroPowerUsed: false,
    awakenedPowers: [],
    counters: {
      spellsThisTurn: 0,
      summonsThisGame: 0,
      summonsSinceReward: 0,
      deathsThisGame: 0,
      firstAttackExpeditionUsed: false,
      firstAttackBuffUsed: false,
      firstSpellDrawUsed: false,
      firstDeathWraithUsed: false,
      dragonBonusUsed: false,
      deathExpeditionUsed: false,
      beastHealUsed: false,
    },
  };
}

function buildDeckTemplates(summoner) {
  const factionCards = BASE_CARDS.filter((item) => item.faction === summoner.faction);
  const neutralCards = BASE_CARDS.filter((item) => item.faction === "neutral");
  const deck = [];
  for (const item of factionCards) deck.push(item, item, item);
  for (const item of neutralCards) deck.push(item, item);
  let index = 0;
  while (deck.length < 30) {
    deck.push(factionCards[index % factionCards.length]);
    index += 1;
  }
  return shuffle(deck).slice(0, 30);
}

function startMatch(playerSummonerId) {
  const aiOptions = SUMMONERS.filter((item) => item.id !== playerSummonerId);
  const aiSummonerId = aiOptions[Math.floor(Math.random() * aiOptions.length)].id;
  state = {
    players: [createPlayer("玩家", playerSummonerId), createPlayer("對手", aiSummonerId)],
    active: 0,
    turn: 1,
    logs: [],
    gameOver: false,
    waitingForEvolution: false,
    pendingAction: null,
    simulating: false,
  };
  drawCards(0, 4);
  drawCards(1, 4);
  state.players[1].hp = 30;
  state.players[1].hand.push(cloneCard(COIN_CARD), cloneCard(SECOND_SUPPLY_CARD));
  startTurn(0);
  els.start.classList.add("hidden");
  els.game.classList.remove("hidden");
  log(`對局開始：${state.players[0].summoner.name} 對 ${state.players[1].summoner.name}`);
  render();
}

function startTurn(playerIndex) {
  const player = state.players[playerIndex];
  state.active = playerIndex;
  player.maxMana = Math.min(10, player.maxMana + 1);
  player.mana = player.maxMana;
  player.counters.spellsThisTurn = 0;
  player.counters.firstAttackExpeditionUsed = false;
  player.counters.firstAttackBuffUsed = false;
  player.counters.firstSpellDrawUsed = false;
  player.counters.dragonBonusUsed = false;
  player.counters.deathExpeditionUsed = false;
  player.counters.beastHealUsed = false;
  player.heroPowerUsed = false;
  player.board.forEach((minion) => {
    minion.canAttack = true;
    minion.attackedThisTurn = false;
  });
  drawCards(playerIndex, 1);
  if (playerIndex === 1 && !state.simulating) {
    render();
    setTimeout(aiTurn, 700);
  }
}

function endTurn() {
  if (state.gameOver || state.waitingForEvolution || state.pendingAction || state.active !== 0) return;
  const next = state.active === 0 ? 1 : 0;
  if (next === 0) state.turn += 1;
  startTurn(next);
  render();
}

function currentHeroPower(playerIndex) {
  const player = state.players[playerIndex];
  if (player.awakenedPowers.includes("star")) return { name: "星界洞察", cost: 2, text: "抽 2 張牌。", effects: [{ type: "draw", amount: 2 }] };
  if (player.awakenedPowers.includes("forest")) return { name: "翠綠庇護", cost: 2, text: "恢復 4 點生命，並賦予一個友方召喚物護盾。", effects: [{ type: "healHero", amount: 4 }, { type: "gainShieldBestAlly" }] };
  if (player.awakenedPowers.includes("dragon")) return { name: "王庭龍息", cost: 2, text: "對敵方英雄造成 3 點傷害。", effects: [{ type: "damageHero", amount: 3 }] };
  if (player.awakenedPowers.includes("moon")) return { name: "深墓血契", cost: 2, text: "對一個友方召喚物造成 1 點傷害，抽 2 張牌。", effects: [{ type: "damageAllyMinion", amount: 1 }, { type: "draw", amount: 2 }] };
  if (player.awakenedPowers.includes("iron")) return { name: "巨像鍛造", cost: 2, text: "使一個友方召喚物 +2/+2；若沒有目標，抽 1 張牌。", effects: [{ type: "buffAllyOrDraw", attack: 2, health: 2 }] };
  return player.summoner.heroPower;
}

function canUseHeroPower(playerIndex) {
  const player = state.players[playerIndex];
  const power = currentHeroPower(playerIndex);
  return !state.gameOver && !state.waitingForEvolution && state.active === playerIndex && !player.heroPowerUsed && player.mana >= power.cost;
}

function useHeroPower(playerIndex, target = null) {
  if (!canUseHeroPower(playerIndex)) return;
  const power = currentHeroPower(playerIndex);
  const requiredTarget = getRequiredTarget(power);
  if (requiredTarget && !hasAnyLegalTarget(playerIndex, requiredTarget)) return;
  if (requiredTarget && !target && playerIndex === 0) {
    state.pendingAction = { type: "heroPowerTarget", playerIndex, target: requiredTarget };
    log(`選擇 ${power.name} 的目標。`);
    render();
    return;
  }
  if (requiredTarget && !isLegalTarget(playerIndex, requiredTarget, target)) return;
  const player = state.players[playerIndex];
  player.mana -= power.cost;
  player.heroPowerUsed = true;
  state.pendingAction = null;
  log(`${player.kind}使用召喚師技能：${power.name}。`);
  resolveEffects(playerIndex, power.effects, { ...power, type: "heroPower", tags: [] }, target);
  checkGameOver();
  render();
}

function aiEndTurn() {
  if (state.gameOver) return;
  state.turn += 1;
  startTurn(0);
  log("輪到你了。");
  render();
}

function drawCards(playerIndex, amount) {
  const player = state.players[playerIndex];
  for (let i = 0; i < amount; i++) {
    if (!player.deck.length) {
      player.hp -= 2;
      log(`${player.kind}牌庫耗盡，受到 2 點疲勞傷害。`);
      continue;
    }
    if (player.hand.length < 10) player.hand.push(player.deck.shift());
  }
  checkGameOver();
}

function playCard(playerIndex, cardUid, target = null) {
  if (state.gameOver || state.waitingForEvolution || state.active !== playerIndex) return;
  const player = state.players[playerIndex];
  const index = player.hand.findIndex((item) => item.uid === cardUid);
  if (index < 0) return;
  const played = player.hand[index];
  if (played.cost > player.mana) return;
  if (played.type === "minion" && player.board.length >= 5) return;
  if (played.type === "artifact" && player.artifacts.length >= 2) return;
  const requiredTarget = getRequiredTarget(played);
  if (requiredTarget && !hasAnyLegalTarget(playerIndex, requiredTarget)) return;
  if (requiredTarget && !target) {
    if (playerIndex !== 0) return;
    state.pendingAction = { type: "cardTarget", playerIndex, cardUid, target: requiredTarget };
    log(`選擇 ${played.name} 的目標。`);
    render();
    return;
  }
  if (requiredTarget && !isLegalTarget(playerIndex, requiredTarget, target)) return;
  player.hand.splice(index, 1);
  player.mana -= played.cost;
  state.pendingAction = null;
  log(`${player.kind}使用了 ${played.name}。`);

  if (played.type === "minion") {
    summonMinion(playerIndex, played, target);
  } else if (played.type === "spell") {
    player.counters.spellsThisTurn += 1;
    resolveEffects(playerIndex, played.effects, played, target);
    triggerSpellPassives(playerIndex);
    if (player.summoner.faction === "star" && player.counters.spellsThisTurn % 3 === 0) {
      drawCards(playerIndex, 1);
      addExpedition(playerIndex, 1, "星穹學派能力");
    }
  } else if (played.type === "secret") {
    player.secrets.push(played);
  } else if (played.type === "artifact") {
    player.artifacts.push(played);
    resolveEffects(playerIndex, played.effects.filter((effect) => ["damageHero", "upgradeHeroPower"].includes(effect.type)), played, target);
    if (player.summoner.faction === "iron") buffRandomAlly(playerIndex, 1, 1);
  }
  player.discard.push(played.type === "secret" || played.type === "artifact" ? null : played);
  cleanupDiscard(player);
  checkEvolution(playerIndex);
  checkGameOver();
  render();
}

function summonMinion(playerIndex, minion, target = null) {
  const player = state.players[playerIndex];
  if (minion.effects.some((effect) => effect.type === "buffIfArtifact") && player.artifacts.length) {
    minion.currentAttack += 1;
    minion.currentHealth += 1;
  }
  minion.canAttack = minion.stats.speed >= 2 || minion.tags.includes("swift");
  player.board.push(minion);
  triggerSummonSecrets(playerIndex, minion);
  player.counters.summonsThisGame += 1;
  player.counters.summonsSinceReward += 1;
  resolveEffects(playerIndex, minion.effects, minion, target);
  triggerSummonPassives(playerIndex, minion);
  if (player.counters.summonsSinceReward >= 2) {
    player.counters.summonsSinceReward = 0;
    addExpedition(playerIndex, 1, "召喚節點");
  }
  if (player.summoner.faction === "forest" && player.counters.summonsThisGame % 3 === 0) {
    healHero(playerIndex, 2);
  }
}

function getRequiredTarget(cardToCheck) {
  const effect = cardToCheck.effects.find((item) => item.target && item.target !== "none");
  return effect?.target ?? null;
}

function hasAnyLegalTarget(playerIndex, targetRule) {
  const candidates = [
    { type: "hero", ownerIndex: 0 },
    { type: "hero", ownerIndex: 1 },
    ...state.players.flatMap((player, ownerIndex) => player.board.map((minion) => ({ type: "minion", ownerIndex, uid: minion.uid }))),
  ];
  return candidates.some((target) => isLegalTarget(playerIndex, targetRule, target));
}

function isLegalTarget(playerIndex, targetRule, target) {
  if (!target || typeof target.ownerIndex !== "number") return false;
  const owner = state.players[target.ownerIndex];
  if (!owner) return false;
  if (targetRule === "enemy") {
    if (target.ownerIndex !== 1 - playerIndex) return false;
    if (target.type === "hero") return true;
    return target.type === "minion" && owner.board.some((item) => item.uid === target.uid);
  }
  if (targetRule === "allyMinion") {
    return target.ownerIndex === playerIndex && target.type === "minion" && owner.board.some((item) => item.uid === target.uid);
  }
  if (targetRule === "ally") {
    if (target.ownerIndex !== playerIndex) return false;
    if (target.type === "hero") return true;
    return target.type === "minion" && owner.board.some((item) => item.uid === target.uid);
  }
  if (targetRule === "anyMinion") {
    return target.type === "minion" && owner.board.some((item) => item.uid === target.uid);
  }
  if (targetRule === "hero") {
    return target.type === "hero";
  }
  return false;
}

function selectTarget(target) {
  if (!state.pendingAction || state.gameOver) return;
  if (state.pendingAction.type === "cardTarget") {
    const action = state.pendingAction;
    if (!isLegalTarget(action.playerIndex, action.target, target)) return;
    playCard(action.playerIndex, action.cardUid, target);
  } else if (state.pendingAction.type === "heroPowerTarget") {
    const action = state.pendingAction;
    if (!isLegalTarget(action.playerIndex, action.target, target)) return;
    useHeroPower(action.playerIndex, target);
  } else if (state.pendingAction.type === "attackTarget") {
    const action = state.pendingAction;
    if (!isLegalAttackTarget(action.playerIndex, target)) return;
    state.pendingAction = null;
    resolveAttack(action.playerIndex, action.attackerUid, target.type === "minion" ? target.uid : null);
    render();
  }
}

function resolveEffects(playerIndex, effects, source, target = null) {
  for (const effect of effects) {
    if (effect.type === "damage") damageTarget(playerIndex, target, effect.amount, source);
    if (effect.type === "damageAllyMinion") damageFirstAllyMinion(playerIndex, effect.amount, source);
    if (effect.type === "damageAllEnemies") damageAllEnemies(playerIndex, effect.amount, source);
    if (effect.type === "damageHero") damageHero(1 - playerIndex, effect.amount, source);
    if (effect.type === "dragonJudgment") damageTarget(playerIndex, target, state.players[playerIndex].evolutionCount >= 2 ? 7 : 5, source);
    if (effect.type === "draw") drawCards(playerIndex, effect.amount);
    if (effect.type === "drawThenDiscard") drawThenDiscard(playerIndex, effect.amount);
    if (effect.type === "drawIfDeaths" && state.players[playerIndex].counters.deathsThisGame >= effect.deaths) drawCards(playerIndex, effect.amount);
    if (effect.type === "drawIfLowHand" && state.players[playerIndex].hand.length < effect.threshold) drawCards(playerIndex, effect.amount);
    if (effect.type === "drawIfSpellThisTurn" && state.players[playerIndex].counters.spellsThisTurn > 0) drawCards(playerIndex, effect.amount);
    if (effect.type === "drawIfArtifact" && state.players[playerIndex].artifacts.length) drawCards(playerIndex, effect.amount);
    if (effect.type === "drawIfNoEnemyArtifact" && !state.players[1 - playerIndex].artifacts.length) drawCards(playerIndex, effect.amount);
    if (effect.type === "healHero") healHero(playerIndex, effect.amount);
    if (effect.type === "healTarget") healTarget(playerIndex, target, effect.amount);
    if (effect.type === "gainMana") state.players[playerIndex].mana += effect.amount;
    if (effect.type === "gainShield") gainShield(target);
    if (effect.type === "gainShieldBestAlly") gainShieldBestAlly(playerIndex);
    if (effect.type === "expedition") addExpedition(playerIndex, effect.amount, source.name);
    if (effect.type === "expeditionIfTargetDies" && target?.type === "minion" && !state.players[target.ownerIndex].board.some((item) => item.uid === target.uid)) addExpedition(playerIndex, effect.amount, source.name);
    if (effect.type === "summonToken") summonToken(playerIndex, effect.token);
    if (effect.type === "summonIfDeaths" && state.players[playerIndex].counters.deathsThisGame >= effect.deaths) summonToken(playerIndex, effect.token);
    if (effect.type === "buffAllyHealth") buffRandomAlly(playerIndex, 0, effect.amount, source.uid);
    if (effect.type === "buffAll") buffAll(playerIndex, effect.attack, effect.health);
    if (effect.type === "buffAllIfArtifact" && state.players[playerIndex].artifacts.length) buffAll(playerIndex, effect.attack, effect.health);
    if (effect.type === "buffAlly") buffTarget(playerIndex, target, effect.attack, effect.health);
    if (effect.type === "buffAllyOrDraw") buffAllyOrDraw(playerIndex, effect.attack, effect.health);
    if (effect.type === "sacrificeDraw") sacrificeDraw(playerIndex, target);
    if (effect.type === "revive") reviveMinions(playerIndex, effect.amount);
    if (effect.type === "silenceMinion") silenceMinion(target);
    if (effect.type === "destroyArtifact") destroyEnemyArtifact(playerIndex);
    if (effect.type === "upgradeHeroPower") upgradeHeroPower(playerIndex, effect.mode);
  }
}

function damageAllEnemies(playerIndex, amount, source) {
  const bonus = spellDamageBonus(playerIndex, source);
  for (const minion of [...state.players[1 - playerIndex].board]) {
    damageMinion(1 - playerIndex, minion.uid, amount + bonus, source);
  }
}

function damageFirstAllyMinion(playerIndex, amount, source) {
  const target = state.players[playerIndex].board[0];
  if (target) damageMinion(playerIndex, target.uid, amount, source);
}

function healTarget(playerIndex, target, amount) {
  if (!target || target.type === "hero") {
    healHero(target?.ownerIndex ?? playerIndex, amount);
    return;
  }
  const minion = state.players[target.ownerIndex].board.find((item) => item.uid === target.uid);
  if (!minion) return;
  minion.currentHealth = Math.min(minion.stats.health, minion.currentHealth + amount);
}

function gainShield(target) {
  if (!target || target.type !== "minion") return;
  const minion = state.players[target.ownerIndex].board.find((item) => item.uid === target.uid);
  if (minion) minion.shield = true;
}

function gainShieldBestAlly(playerIndex) {
  const minion = [...state.players[playerIndex].board].sort((a, b) => b.currentAttack + b.currentHealth - (a.currentAttack + a.currentHealth))[0];
  if (minion) minion.shield = true;
}

function drawThenDiscard(playerIndex, amount) {
  drawCards(playerIndex, amount);
  const player = state.players[playerIndex];
  if (player.hand.length) {
    const discarded = player.hand.pop();
    player.discard.push(discarded);
    log(`${player.kind}棄掉了 ${discarded.name}。`);
  }
}

function silenceMinion(target) {
  if (!target || target.type !== "minion") return;
  const minion = state.players[target.ownerIndex].board.find((item) => item.uid === target.uid);
  if (!minion) return;
  minion.effects = [];
  minion.tags = minion.tags.filter((tag) => tag !== "guard");
  minion.text = "已被沉默。";
  log(`${minion.name} 被沉默。`);
}

function destroyEnemyArtifact(playerIndex) {
  const opponent = state.players[1 - playerIndex];
  if (!opponent.artifacts.length) return;
  const [destroyed] = opponent.artifacts.splice(0, 1);
  opponent.discard.push(destroyed);
  log(`${opponent.kind}的 ${destroyed.name} 被摧毀。`);
}

function damageTarget(playerIndex, target, amount, source) {
  if (!target) {
    damageEnemy(playerIndex, amount, source);
    return;
  }
  const finalAmount = amount + spellDamageBonus(playerIndex, source);
  state.lastSpellTargetUid = target.type === "minion" ? target.uid : null;
  if (target.type === "hero") {
    applySpellShieldThenDamageHero(playerIndex, target.ownerIndex, finalAmount, source);
  } else if (target.type === "minion") {
    applySpellShieldThenDamageMinion(playerIndex, target.ownerIndex, target.uid, finalAmount, source);
  }
  if (source.tags?.includes("lifesteal")) healHero(playerIndex, finalAmount);
}

function applySpellShieldThenDamageHero(sourcePlayerIndex, targetPlayerIndex, amount, source) {
  const finalAmount = consumeSpellShield(sourcePlayerIndex, targetPlayerIndex, amount, source);
  damageHero(targetPlayerIndex, finalAmount, source);
}

function applySpellShieldThenDamageMinion(sourcePlayerIndex, targetPlayerIndex, targetUid, amount, source) {
  const finalAmount = consumeSpellShield(sourcePlayerIndex, targetPlayerIndex, amount, source);
  damageMinion(targetPlayerIndex, targetUid, finalAmount, source);
}

function consumeSpellShield(sourcePlayerIndex, targetPlayerIndex, amount, source) {
  const targetPlayer = state.players[targetPlayerIndex];
  if (sourcePlayerIndex !== targetPlayerIndex && source.type === "spell") {
    const wardSecret = targetPlayer.secrets.find((secret) => secret.effects.some((effect) => effect.type === "wardSpellTarget"));
    if (wardSecret) {
      targetPlayer.secrets = targetPlayer.secrets.filter((item) => item.uid !== wardSecret.uid);
      const targetMinion = targetPlayer.board.find((item) => item.uid === state.lastSpellTargetUid);
      if (targetMinion) {
        targetMinion.shield = true;
        log(`${targetPlayer.kind}的 ${wardSecret.name} 賦予了護盾。`);
      }
    }
  }
  const shield = targetPlayer.secrets.find((secret) => secret.effects.some((effect) => effect.type === "spellShield"));
  if (shield && sourcePlayerIndex !== targetPlayerIndex && source.type === "spell") {
    targetPlayer.secrets = targetPlayer.secrets.filter((item) => item.uid !== shield.uid);
    drawCards(targetPlayerIndex, 1);
    log(`${targetPlayer.kind}的 ${shield.name} 抵銷了傷害。`);
    return Math.max(0, amount - 2);
  }
  return amount;
}

function damageEnemy(playerIndex, amount, source) {
  const opponent = state.players[1 - playerIndex];
  let finalAmount = amount + spellDamageBonus(playerIndex, source);
  finalAmount = consumeSpellShield(playerIndex, 1 - playerIndex, finalAmount, source);
  const guard = opponent.board.find((minion) => minion.tags.includes("guard"));
  if (guard) damageMinion(1 - playerIndex, guard.uid, finalAmount, source);
  else damageHero(1 - playerIndex, finalAmount, source);
}

function spellDamageBonus(playerIndex, source) {
  const player = state.players[playerIndex];
  let bonus = 0;
  for (const artifact of player.artifacts) {
    const effect = artifact.effects.find((item) => item.type === "spellDamage");
    if (effect && source.type === "spell") bonus += effect.amount;
  }
  for (const minion of player.board) {
    const effect = minion.effects.find((item) => item.type === "spellDamageAura");
    if (effect && source.type === "spell") bonus += effect.amount;
  }
  if (player.summoner.faction === "dragon" && source.type === "spell" && !player.counters.dragonBonusUsed) {
    bonus += 1;
    player.counters.dragonBonusUsed = true;
  }
  return bonus;
}

function triggerSummonSecrets(playerIndex, summoned) {
  const opponentIndex = 1 - playerIndex;
  const opponent = state.players[opponentIndex];
  const snare = opponent.secrets.find((secret) => secret.effects.some((effect) => effect.type === "silenceSummoned"));
  if (!snare) return;
  opponent.secrets = opponent.secrets.filter((item) => item.uid !== snare.uid);
  silenceMinion({ type: "minion", ownerIndex: playerIndex, uid: summoned.uid });
  log(`${opponent.kind}的 ${snare.name} 拘束了 ${summoned.name}。`);
}

function damageHero(playerIndex, amount) {
  state.players[playerIndex].hp -= amount;
  checkGameOver();
}

function healHero(playerIndex, amount) {
  state.players[playerIndex].hp = Math.min(30, state.players[playerIndex].hp + amount);
}

function damageMinion(ownerIndex, uidToDamage, amount, source = null) {
  const owner = state.players[ownerIndex];
  const minion = owner.board.find((item) => item.uid === uidToDamage);
  if (!minion) return;
  if (minion.shield && amount > 0) {
    minion.shield = false;
    log(`${minion.name} 的護盾抵銷了傷害。`);
    return;
  }
  minion.currentHealth -= amount;
  if (minion.currentHealth <= 0) killMinion(ownerIndex, minion.uid, source);
}

function killMinion(ownerIndex, minionUid, source) {
  const owner = state.players[ownerIndex];
  const index = owner.board.findIndex((item) => item.uid === minionUid);
  if (index < 0) return;
  const [dead] = owner.board.splice(index, 1);
  owner.deadMinions.push(dead);
  owner.discard.push(dead);
  owner.counters.deathsThisGame += 1;
  log(`${dead.name} 被擊敗。`);
  const drawOnDeath = dead.effects.find((effect) => effect.type === "drawOnDeath");
  if (drawOnDeath) drawCards(ownerIndex, drawOnDeath.amount);
  const summonOnDeath = dead.effects.find((effect) => effect.type === "summonOnDeath");
  if (summonOnDeath) summonToken(ownerIndex, summonOnDeath.token);
  const reviveOnDeath = dead.effects.find((effect) => effect.type === "reviveOnDeath");
  if (reviveOnDeath) reviveMinions(ownerIndex, reviveOnDeath.amount);
  if (owner.summoner.faction === "moon" && owner.counters.deathsThisGame % 3 === 0) summonToken(ownerIndex, "wraith");
  for (const artifact of owner.artifacts) {
    if (artifact.effects.some((effect) => effect.type === "firstDeathWraith") && !owner.counters.firstDeathWraithUsed) {
      owner.counters.firstDeathWraithUsed = true;
      summonToken(ownerIndex, "wraith");
    }
    const deathExpedition = artifact.effects.find((effect) => effect.type === "deathExpedition");
    if (deathExpedition && !owner.counters.deathExpeditionUsed) {
      owner.counters.deathExpeditionUsed = true;
      addExpedition(ownerIndex, deathExpedition.amount, artifact.name);
    }
  }
  if (source?.effects?.some((effect) => effect.type === "expeditionOnKill")) {
    addExpedition(1 - ownerIndex, 1, source.name);
  }
}

function summonToken(playerIndex, tokenId) {
  const player = state.players[playerIndex];
  if (player.board.length >= 5) return;
  const token = cloneCard(TOKENS[tokenId]);
  token.canAttack = false;
  player.board.push(token);
  triggerSummonPassives(playerIndex, token);
}

function triggerSummonPassives(playerIndex, minion) {
  const player = state.players[playerIndex];
  if (minion.tags.includes("beast")) {
    for (const ally of player.board) {
      if (ally.effects.some((effect) => effect.type === "healOnBeast")) healHero(playerIndex, 1);
    }
    for (const artifact of player.artifacts) {
      const effect = artifact.effects.find((item) => item.type === "beastHealArtifact");
      if (effect && !player.counters.beastHealUsed) {
        player.counters.beastHealUsed = true;
        healHero(playerIndex, effect.amount);
      }
    }
  }
}

function triggerSpellPassives(playerIndex) {
  const player = state.players[playerIndex];
  for (const minion of player.board) {
    const effect = minion.effects.find((item) => item.type === "spellPing");
    if (effect) damageEnemy(playerIndex, effect.amount, minion);
  }
  for (const artifact of player.artifacts) {
    const effect = artifact.effects.find((item) => item.type === "firstSpellDraw");
    if (effect && !player.counters.firstSpellDrawUsed) {
      player.counters.firstSpellDrawUsed = true;
      drawCards(playerIndex, effect.amount);
    }
  }
}

function sacrificeDraw(playerIndex, target = null) {
  const player = state.players[playerIndex];
  if (!player.board.length) {
    drawCards(playerIndex, 1);
    return;
  }
  const targetUid = target?.type === "minion" && target.ownerIndex === playerIndex ? target.uid : player.board[0].uid;
  damageMinion(playerIndex, targetUid, 1);
  drawCards(playerIndex, 1);
}

function reviveMinions(playerIndex, amount) {
  const player = state.players[playerIndex];
  const candidates = player.deadMinions.filter((item) => item.rarity !== "token").slice(-amount);
  for (const dead of candidates) {
    if (player.board.length >= 5) return;
    const revived = cloneCard(BASE_CARDS.concat(EVOLUTION_CARDS).find((item) => item.id === dead.id) || dead);
    revived.canAttack = false;
    player.board.push(revived);
  }
}

function buffRandomAlly(playerIndex, attack, health, exceptUid = null) {
  const player = state.players[playerIndex];
  const target = player.board.find((item) => item.uid !== exceptUid);
  if (!target) return;
  target.currentAttack += attack;
  target.currentHealth += health;
}

function buffTarget(playerIndex, target, attack, health) {
  if (!target || target.ownerIndex !== playerIndex || target.type !== "minion") {
    buffRandomAlly(playerIndex, attack, health);
    return;
  }
  const minion = state.players[playerIndex].board.find((item) => item.uid === target.uid);
  if (!minion) return;
  minion.currentAttack += attack;
  minion.currentHealth += health;
}

function buffAllyOrDraw(playerIndex, attack, health) {
  const target = [...state.players[playerIndex].board].sort((a, b) => b.currentAttack - a.currentAttack || b.currentHealth - a.currentHealth)[0];
  if (!target) {
    drawCards(playerIndex, 1);
    return;
  }
  target.currentAttack += attack;
  target.currentHealth += health;
}

function upgradeHeroPower(playerIndex, mode) {
  const player = state.players[playerIndex];
  if (!player.awakenedPowers.includes(mode)) player.awakenedPowers.push(mode);
  log(`${player.kind}的召喚師技能覺醒了。`);
}

function buffAll(playerIndex, attack, health) {
  state.players[playerIndex].board.forEach((minion) => {
    minion.currentAttack += attack;
    minion.currentHealth += health;
  });
}

function attack(attackerUid, targetUid = null) {
  if (state.gameOver || state.waitingForEvolution || state.active !== 0) return;
  const attacker = state.players[0].board.find((item) => item.uid === attackerUid);
  if (!attacker || !attacker.canAttack || attacker.attackedThisTurn) return;
  if (!targetUid) {
    state.pendingAction = { type: "attackTarget", playerIndex: 0, attackerUid };
    log(`選擇 ${attacker.name} 的攻擊目標。`);
    render();
    return;
  }
  state.pendingAction = null;
  resolveAttack(0, attackerUid, targetUid);
  render();
}

function resolveAttack(playerIndex, attackerUid, targetUid = null) {
  const player = state.players[playerIndex];
  const opponent = state.players[1 - playerIndex];
  const attacker = player.board.find((item) => item.uid === attackerUid);
  if (!attacker || !attacker.canAttack || attacker.attackedThisTurn) return;

  const flameCounter = !targetUid ? opponent.secrets.find((secret) => secret.effects.some((effect) => effect.type === "flameCounter")) : null;
  if (flameCounter) {
    opponent.secrets = opponent.secrets.filter((item) => item.uid !== flameCounter.uid);
    damageMinion(playerIndex, attacker.uid, 3, flameCounter);
    log(`${opponent.kind}的 ${flameCounter.name} 反擊了攻擊者。`);
    if (!player.board.some((item) => item.uid === attacker.uid)) return;
  }

  const ambush = opponent.secrets.find((secret) => secret.effects.some((effect) => effect.type === "ambushGuard"));
  if (ambush) {
    opponent.secrets = opponent.secrets.filter((item) => item.uid !== ambush.uid);
    summonToken(1 - playerIndex, "fawn");
    const guardToken = opponent.board[opponent.board.length - 1];
    if (guardToken) {
      guardToken.tags.push("guard");
      targetUid = guardToken.uid;
    }
    log(`${opponent.kind}的 ${ambush.name} 召喚守護伏兵。`);
  }

  const redirect = opponent.secrets.find((secret) => secret.effects.some((effect) => effect.type === "redirectAttack"));
  if (redirect) {
    opponent.secrets = opponent.secrets.filter((item) => item.uid !== redirect.uid);
    summonToken(1 - playerIndex, "wraith");
    const wraith = opponent.board[opponent.board.length - 1];
    targetUid = wraith?.uid ?? targetUid;
    log(`${opponent.kind}的 ${redirect.name} 轉移了攻擊。`);
  }

  const guard = opponent.board.find((item) => item.tags.includes("guard"));
  if (guard && targetUid !== guard.uid) targetUid = guard.uid;

  triggerFirstAttackBuff(playerIndex, attacker);
  const bonus = artifactAttackBonus(playerIndex);
  const totalAttack = attacker.currentAttack + bonus;
  attacker.attackedThisTurn = true;
  attacker.canAttack = false;

  if (targetUid) {
    const target = opponent.board.find((item) => item.uid === targetUid);
    if (!target) return;
    const hadShield = target.shield;
    const beforeHealth = target.currentHealth;
    damageMinion(1 - playerIndex, target.uid, totalAttack, attacker);
    damageMinion(playerIndex, attacker.uid, target.currentAttack, target);
    if (!hadShield && attacker.tags.includes("overwhelm") && totalAttack > beforeHealth) opponent.hp -= totalAttack - beforeHealth;
    if (attacker.currentHealth <= 0) killMinion(playerIndex, attacker.uid, target);
  } else {
    opponent.hp -= totalAttack;
  }
  if (attacker.tags.includes("lifesteal")) healHero(playerIndex, totalAttack);

  for (const artifact of player.artifacts) {
    const effect = artifact.effects.find((item) => item.type === "firstAttackExpedition");
    if (effect && !player.counters.firstAttackExpeditionUsed) {
      player.counters.firstAttackExpeditionUsed = true;
      addExpedition(playerIndex, effect.amount, artifact.name);
    }
  }
  checkGameOver();
}

function isLegalAttackTarget(playerIndex, target) {
  if (!target || target.ownerIndex !== 1 - playerIndex) return false;
  const opponent = state.players[1 - playerIndex];
  const guard = opponent.board.find((item) => item.tags.includes("guard"));
  if (guard) return target.type === "minion" && target.uid === guard.uid;
  if (target.type === "hero") return true;
  return target.type === "minion" && opponent.board.some((item) => item.uid === target.uid);
}

function artifactAttackBonus(playerIndex) {
  const player = state.players[playerIndex];
  for (const artifact of player.artifacts) {
    const effect = artifact.effects.find((item) => item.type === "bonusAttackDamage");
    if (effect) return effect.amount;
  }
  return 0;
}

function triggerFirstAttackBuff(playerIndex, attacker) {
  const player = state.players[playerIndex];
  for (const artifact of player.artifacts) {
    const effect = artifact.effects.find((item) => item.type === "firstAttackBuff");
    if (effect && !player.counters.firstAttackBuffUsed) {
      player.counters.firstAttackBuffUsed = true;
      attacker.currentAttack += effect.attack;
      attacker.currentHealth += effect.health;
    }
  }
}

function addExpedition(playerIndex, amount, source) {
  const player = state.players[playerIndex];
  player.expedition += amount;
  log(`${player.kind}因 ${source} 推進遠征軌 +${amount}。`);
  checkEvolution(playerIndex);
}

function checkEvolution(playerIndex) {
  const player = state.players[playerIndex];
  const needed = (player.evolutionCount + 1) * 3;
  if (player.evolutionCount >= 5 || player.expedition < needed || player.pendingEvolution) return;
  const choices = buildEvolutionChoices(playerIndex);
  if (!choices.length) return;
  player.pendingEvolution = choices;
  if (playerIndex === 0 && !state.simulating) {
    state.waitingForEvolution = true;
    showEvolutionChoices(choices);
  } else {
    chooseEvolution(playerIndex, choices[0].id);
  }
}

function buildEvolutionChoices(playerIndex) {
  const player = state.players[playerIndex];
  const available = EVOLUTION_CARDS.filter((item) => {
    const factionMatch = item.faction === player.summoner.faction || item.faction === "neutral";
    const notPicked = !player.selectedEvolutions.includes(item.id);
    return factionMatch && notPicked;
  });
  return shuffle(available)
    .map((item) => ({ item, score: scoreEvolutionChoice(playerIndex, item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);
}

function scoreEvolutionChoice(playerIndex, choice) {
  const player = state.players[playerIndex];
  const opponent = state.players[1 - playerIndex];
  let score = 10 - Math.max(0, choice.cost - player.maxMana);
  const effectTypes = choice.effects.map((effect) => effect.type);
  if (player.hp <= 14 && (effectTypes.includes("healHero") || effectTypes.includes("healTarget") || choice.tags.includes("guard"))) score += 6;
  if (player.hand.length <= 3 && effectTypes.some((type) => type.includes("draw"))) score += 5;
  if (boardAttack(player) < boardAttack(opponent) && (choice.type === "minion" || effectTypes.includes("summonToken") || effectTypes.includes("damageAllEnemies"))) score += 5;
  if (player.artifacts.length && (effectTypes.includes("buffAll") || effectTypes.includes("buffAlly"))) score += 2;
  if (player.summoner.faction === choice.faction) score += 3;
  return score;
}

function showEvolutionChoices(choices) {
  els.evoChoices.innerHTML = "";
  for (const choice of choices) {
    const button = document.createElement("button");
    button.className = "card evolution";
    button.innerHTML = cardMarkup(choice);
    button.addEventListener("click", () => chooseEvolution(0, choice.id));
    els.evoChoices.append(button);
  }
  els.evoModal.classList.remove("hidden");
}

function chooseEvolution(playerIndex, cardId) {
  const player = state.players[playerIndex];
  const selected = EVOLUTION_CARDS.find((item) => item.id === cardId);
  if (!selected) return;
  player.selectedEvolutions.push(selected.id);
  player.evolutionCount += 1;
  player.pendingEvolution = null;
  const newCard = cloneCard(selected);
  if (selected.immediate && player.hand.length < 10) player.hand.push(newCard);
  else player.deck.splice(Math.floor(Math.random() * (player.deck.length + 1)), 0, newCard);
  log(`${player.kind}選擇進化：${selected.name}。`);
  state.waitingForEvolution = false;
  if (!state.simulating) els.evoModal.classList.add("hidden");
  render();
  if (!state.simulating && state.active === 1) setTimeout(aiTurn, 500);
}

function aiTurn() {
  if (state.gameOver || state.waitingForEvolution || state.active !== 1) return;
  runAiActions(1);
  render();
  setTimeout(aiEndTurn, 650);
}

function runAiActions(playerIndex) {
  let acted = true;
  let safety = 0;
  while (acted && safety < 12) {
    safety += 1;
    acted = false;
    const play = chooseAiPlay(playerIndex);
    if (play) {
      playCard(playerIndex, play.card.uid, play.target);
      acted = true;
    }
  }
  const powerTarget = chooseAiHeroPowerTarget(playerIndex);
  if (canUseHeroPower(playerIndex) && powerTarget !== false) useHeroPower(playerIndex, powerTarget);
  const ai = state.players[playerIndex];
  for (const minion of [...ai.board]) {
    if (!minion.canAttack || minion.attackedThisTurn) continue;
    const target = chooseAiAttackTarget(playerIndex, minion);
    resolveAttack(playerIndex, minion.uid, target?.type === "minion" ? target.uid : null);
  }
}

function chooseAiHeroPowerTarget(playerIndex) {
  const power = currentHeroPower(playerIndex);
  const player = state.players[playerIndex];
  const opponent = state.players[1 - playerIndex];
  const requiredTarget = getRequiredTarget(power);
  if (player.mana < power.cost || player.heroPowerUsed) return false;
  if (!requiredTarget) {
    if (player.summoner.faction === "dragon" && opponent.hp <= 16) return null;
    if (player.summoner.faction === "forest" && player.hp <= 22) return null;
    if (player.summoner.faction === "star" && player.hand.length <= 5) return null;
    if (player.summoner.faction === "iron" && (!player.board.length || player.awakenedPowers.includes("iron"))) return null;
    return player.mana >= 4 ? null : false;
  }
  if (requiredTarget === "allyMinion") {
    const ally = [...player.board].sort((a, b) => a.currentHealth - b.currentHealth || b.currentAttack - a.currentAttack)[0];
    return ally ? { type: "minion", ownerIndex: playerIndex, uid: ally.uid } : false;
  }
  if (requiredTarget === "ally") {
    if (player.hp <= 22) return { type: "hero", ownerIndex: playerIndex };
    const damaged = player.board.find((item) => item.currentHealth < item.stats.health);
    return damaged ? { type: "minion", ownerIndex: playerIndex, uid: damaged.uid } : false;
  }
  if (requiredTarget === "enemy") {
    return { type: "hero", ownerIndex: 1 - playerIndex };
  }
  return null;
}

function chooseAiPlay(playerIndex = 1) {
  const ai = state.players[playerIndex];
  const candidates = ai.hand
    .filter((item) => canPlayCard(playerIndex, item))
    .map((item) => ({ card: item, target: chooseAiTargetForCard(playerIndex, item), score: scoreAiCard(playerIndex, item) }))
    .filter((item) => !getRequiredTarget(item.card) || item.target)
    .sort((a, b) => b.score - a.score || b.card.cost - a.card.cost);
  return candidates[0] ?? null;
}

function canPlayCard(playerIndex, cardToPlay) {
  const player = state.players[playerIndex];
  if (cardToPlay.cost > player.mana) return false;
  if (cardToPlay.type === "minion" && player.board.length >= 5) return false;
  if (cardToPlay.type === "artifact" && player.artifacts.length >= 2) return false;
  return true;
}

function scoreAiCard(playerIndex, cardToScore) {
  const player = state.players[playerIndex];
  const opponent = state.players[1 - playerIndex];
  let score = cardToScore.cost;
  if (cardToScore.type === "minion") score += 2;
  if (cardToScore.type === "artifact") score += 1;
  if (cardToScore.effects.some((effect) => effect.type === "damage" || effect.type === "dragonJudgment")) score += 3;
  if (cardToScore.effects.some((effect) => effect.type === "damageAllEnemies") && opponent.board.length >= 2) score += 5;
  if (cardToScore.effects.some((effect) => effect.type === "healHero" || effect.type === "healTarget") && player.hp <= 15) score += 4;
  if (cardToScore.effects.some((effect) => effect.type === "expedition") && player.expedition < nextEvolutionThreshold(player)) score += 2;
  if (cardToScore.effects.some((effect) => effect.type === "destroyArtifact") && opponent.artifacts.length) score += 4;
  return score;
}

function chooseAiTargetForCard(playerIndex, cardToPlay) {
  const targetRule = getRequiredTarget(cardToPlay);
  if (!targetRule) return null;
  const opponent = state.players[1 - playerIndex];
  if (targetRule === "enemy") {
    const damage = estimateCardDamage(playerIndex, cardToPlay);
    const guard = opponent.board.find((item) => item.tags.includes("guard"));
    if (guard) return { type: "minion", ownerIndex: 1 - playerIndex, uid: guard.uid };
    if (opponent.hp <= 14 || boardAttack(state.players[playerIndex]) >= boardAttack(opponent)) return { type: "hero", ownerIndex: 1 - playerIndex };
    const killable = [...opponent.board]
      .filter((item) => item.currentHealth <= damage)
      .sort((a, b) => b.currentAttack - a.currentAttack || b.currentHealth - a.currentHealth)[0];
    if (killable && (killable.currentAttack >= 4 || state.players[playerIndex].hp <= 12)) return { type: "minion", ownerIndex: 1 - playerIndex, uid: killable.uid };
    const threat = [...opponent.board].sort((a, b) => b.currentAttack - a.currentAttack)[0];
    if (state.players[playerIndex].hp <= 12 && threat) return { type: "minion", ownerIndex: 1 - playerIndex, uid: threat.uid };
    return { type: "hero", ownerIndex: 1 - playerIndex };
  }
  if (targetRule === "allyMinion") {
    const ally = [...state.players[playerIndex].board].sort((a, b) => b.currentAttack - a.currentAttack || b.currentHealth - a.currentHealth)[0];
    return ally ? { type: "minion", ownerIndex: playerIndex, uid: ally.uid } : null;
  }
  if (targetRule === "ally") {
    const damaged = state.players[playerIndex].board.find((item) => item.currentHealth < item.stats.health);
    if (damaged) return { type: "minion", ownerIndex: playerIndex, uid: damaged.uid };
    return { type: "hero", ownerIndex: playerIndex };
  }
  if (targetRule === "anyMinion") {
    const enemy = [...opponent.board].sort((a, b) => b.currentAttack - a.currentAttack)[0];
    const ally = [...state.players[playerIndex].board].sort((a, b) => b.currentAttack - a.currentAttack)[0];
    const target = enemy || ally;
    return target ? { type: "minion", ownerIndex: enemy ? 1 - playerIndex : playerIndex, uid: target.uid } : null;
  }
  return null;
}

function estimateCardDamage(playerIndex, cardToPlay) {
  const damageEffect = cardToPlay.effects.find((effect) => effect.type === "damage");
  if (damageEffect) return damageEffect.amount + spellDamageBonusPreview(playerIndex, cardToPlay);
  if (cardToPlay.effects.some((effect) => effect.type === "dragonJudgment")) {
    return (state.players[playerIndex].evolutionCount >= 2 ? 7 : 5) + spellDamageBonusPreview(playerIndex, cardToPlay);
  }
  return 0;
}

function spellDamageBonusPreview(playerIndex, source) {
  const player = state.players[playerIndex];
  let bonus = 0;
  for (const artifact of player.artifacts) {
    const effect = artifact.effects.find((item) => item.type === "spellDamage");
    if (effect && source.type === "spell") bonus += effect.amount;
  }
  for (const minion of player.board) {
    const effect = minion.effects.find((item) => item.type === "spellDamageAura");
    if (effect && source.type === "spell") bonus += effect.amount;
  }
  if (player.summoner.faction === "dragon" && source.type === "spell" && !player.counters.dragonBonusUsed) bonus += 1;
  return bonus;
}

function chooseAiAttackTarget(playerIndex, attacker) {
  const opponent = state.players[1 - playerIndex];
  if (opponent.hp <= attacker.currentAttack + artifactAttackBonus(playerIndex)) return { type: "hero" };
  const guard = opponent.board.find((item) => item.tags.includes("guard"));
  if (guard) return { type: "minion", uid: guard.uid };
  const killable = [...opponent.board]
    .filter((item) => item.currentHealth <= attacker.currentAttack)
    .sort((a, b) => b.currentAttack - a.currentAttack || b.currentHealth - a.currentHealth)[0];
  if (killable && (killable.currentAttack >= 4 || state.players[playerIndex].hp <= 12)) return { type: "minion", uid: killable.uid };
  if (state.players[playerIndex].hp <= 12) {
    const threat = [...opponent.board].sort((a, b) => b.currentAttack - a.currentAttack)[0];
    if (threat) return { type: "minion", uid: threat.uid };
  }
  return { type: "hero" };
}

function checkGameOver() {
  if (!state || state.gameOver) return;
  const [player, opponent] = state.players;
  if (player.hp <= 0 || opponent.hp <= 0) {
    state.gameOver = true;
    if (state.simulating) return;
    const won = player.hp > opponent.hp;
    els.resultTitle.textContent = won ? "勝利" : "敗北";
    els.resultText.textContent = won ? "你的遠征隊完成了奧術突破。" : "對手的召喚師奪下了這次遠征。";
    els.resultModal.classList.remove("hidden");
  }
}

function cleanupDiscard(player) {
  player.discard = player.discard.filter(Boolean);
}

function log(message) {
  if (state?.simulating) return;
  state.logs.unshift(message);
  state.logs = state.logs.slice(0, 80);
}

function runBalanceSimulation(gameCount = 50) {
  const previousState = state;
  const results = [];
  for (let i = 0; i < gameCount; i++) {
    const first = SUMMONERS[i % SUMMONERS.length].id;
    const second = SUMMONERS[(i + 2) % SUMMONERS.length].id;
    results.push(simulateGame(first, second));
  }
  state = previousState;
  renderBalanceSummary(results);
  render();
}

function simulateGame(firstSummonerId, secondSummonerId) {
  state = {
    players: [createPlayer("先手", firstSummonerId), createPlayer("後手", secondSummonerId)],
    active: 0,
    turn: 1,
    logs: [],
    gameOver: false,
    waitingForEvolution: false,
    pendingAction: null,
    simulating: true,
  };
  drawCards(0, 4);
  drawCards(1, 4);
  state.players[1].hp = 30;
  state.players[1].hand.push(cloneCard(COIN_CARD), cloneCard(SECOND_SUPPLY_CARD));
  startTurn(0);
  let safety = 0;
  while (!state.gameOver && state.turn <= 30 && safety < 120) {
    safety += 1;
    runAiActions(state.active);
    if (state.gameOver) break;
    const next = state.active === 0 ? 1 : 0;
    if (next === 0) state.turn += 1;
    startTurn(next);
  }
  const winner = state.players[0].hp === state.players[1].hp ? -1 : state.players[0].hp > state.players[1].hp ? 0 : 1;
  return {
    winner,
    turns: state.turn,
    evolutions: state.players[0].evolutionCount + state.players[1].evolutionCount,
    handCards: state.players[0].hand.length + state.players[1].hand.length,
    firstFaction: state.players[0].summoner.faction,
    secondFaction: state.players[1].summoner.faction,
    stalled: safety >= 120 || state.turn > 30,
  };
}

function renderBalanceSummary(results) {
  const total = results.length || 1;
  const firstWins = results.filter((item) => item.winner === 0).length;
  const secondWins = results.filter((item) => item.winner === 1).length;
  const stalled = results.filter((item) => item.stalled).length;
  const avgTurns = average(results.map((item) => item.turns));
  const avgEvolutions = average(results.map((item) => item.evolutions));
  const avgHand = average(results.map((item) => item.handCards / 2));
  els.balanceSummary.innerHTML = `
    <div><strong>${total}</strong><span>模擬場數</span></div>
    <div><strong>${avgTurns.toFixed(1)}</strong><span>平均回合</span></div>
    <div><strong>${avgEvolutions.toFixed(1)}</strong><span>平均總進化</span></div>
    <div><strong>${avgHand.toFixed(1)}</strong><span>平均手牌</span></div>
    <div><strong>${Math.round((firstWins / total) * 100)}%</strong><span>先手勝率</span></div>
    <div><strong>${Math.round((secondWins / total) * 100)}%</strong><span>後手勝率</span></div>
    <div class="wide"><strong>${stalled}</strong><span>卡死或超時局</span></div>
  `;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

function render() {
  if (!state || state.simulating) return;
  const [player, opponent] = state.players;
  els.matchTitle.textContent = `${FACTION_LABELS[player.summoner.faction]} 對 ${FACTION_LABELS[opponent.summoner.faction]}`;
  renderPlayerArea(els.playerArea, player);
  renderPlayerArea(els.opponentArea, opponent, true);
  renderBoard(els.playerBoard, player, 0);
  renderBoard(els.opponentBoard, opponent, 1);
  renderArtifacts(els.playerArtifacts, player);
  renderArtifacts(els.opponentArtifacts, opponent);
  renderHand();
  renderMetrics();
  els.log.innerHTML = state.logs.map((item) => `<div>${item}</div>`).join("");
  els.endTurn.disabled = state.active !== 0 || state.waitingForEvolution || state.pendingAction || state.gameOver;
}

function renderPlayerArea(container, player, isOpponent = false) {
  const ownerIndex = isOpponent ? 1 : 0;
  const heroTargetClass = getHeroTargetClass(ownerIndex);
  const power = currentHeroPower(ownerIndex);
  const powerDisabled = ownerIndex !== 0 || !canUseHeroPower(ownerIndex);
  const awakened = player.awakenedPowers.length ? `<div class="awakened">覺醒：${player.awakenedPowers.map((mode) => FACTION_LABELS[mode]).join("、")}</div>` : "";
  container.innerHTML = `
    <button class="hero-panel ${heroTargetClass}" type="button">
      <strong>${player.summoner.name}</strong>
      <div class="eyebrow">${FACTION_LABELS[player.summoner.faction]}</div>
      <span>${isOpponent ? "敵方英雄" : "我方英雄"}</span>
      ${awakened}
    </button>
    <button class="power-panel" type="button" ${powerDisabled ? "disabled" : ""}>
      <strong>${power.name}</strong>
      <span>${power.cost} 法力 · ${player.heroPowerUsed ? "已使用" : power.text}</span>
    </button>
    <div class="stat-panel"><strong>${player.hp}</strong><span>生命</span></div>
    <div class="stat-panel"><strong>${player.mana}/${player.maxMana}</strong><span>法力</span></div>
    <div class="stat-panel"><strong>${player.deck.length}</strong><span>牌庫</span></div>
    <div class="stat-panel"><strong>${player.expedition}/${nextEvolutionThreshold(player)}</strong><span>遠征 ${player.evolutionCount}/5</span></div>
    ${isOpponent ? `<div class="stat-panel"><strong>${player.hand.length}</strong><span>手牌</span></div>` : ""}
    <div class="stat-panel"><strong>${player.secrets.length}</strong><span>秘儀</span></div>
  `;
  const hero = container.querySelector(".hero-panel");
  if (heroTargetClass.includes("legal-target")) {
    hero.addEventListener("click", () => selectTarget({ type: "hero", ownerIndex }));
  }
  const powerButton = container.querySelector(".power-panel");
  if (!powerDisabled) powerButton.addEventListener("click", () => useHeroPower(ownerIndex));
}

function renderBoard(container, player, ownerIndex) {
  container.innerHTML = "";
  for (const minion of player.board) {
    const node = document.createElement("button");
    node.className = `card board-card minion ${getMinionClasses(ownerIndex, minion)}`;
    node.innerHTML = boardMarkup(minion);
    if (isPendingMinionTarget(ownerIndex, minion)) {
      node.addEventListener("click", () => selectTarget({ type: "minion", ownerIndex, uid: minion.uid }));
    } else if (ownerIndex === 0 && minion.canAttack && !state.pendingAction) {
      node.addEventListener("click", () => attack(minion.uid));
    } else if (ownerIndex === 1 && !state.pendingAction) {
      node.addEventListener("click", () => {
        const attacker = state.players[0].board.find((item) => item.canAttack && !item.attackedThisTurn);
        if (attacker) attack(attacker.uid, minion.uid);
      });
    }
    container.append(node);
  }
}

function renderArtifacts(container, player) {
  container.innerHTML = "";
  for (const artifact of player.artifacts) {
    const node = document.createElement("div");
    node.className = "card artifact";
    node.innerHTML = cardMarkup(artifact);
    container.append(node);
  }
}

function renderHand() {
  els.hand.innerHTML = "";
  for (const handCard of state.players[0].hand) {
    const requiredTarget = getRequiredTarget(handCard);
    const hasTarget = !requiredTarget || hasAnyLegalTarget(0, requiredTarget);
    const playable = state.active === 0 && !state.waitingForEvolution && !state.pendingAction && handCard.cost <= state.players[0].mana && hasTarget;
    const node = document.createElement("button");
    node.className = `card ${handCard.type} ${playable ? "playable" : "disabled"}`;
    node.innerHTML = cardMarkup(handCard);
    node.disabled = !playable;
    node.addEventListener("click", () => playCard(0, handCard.uid));
    els.hand.append(node);
  }
}

function renderMetrics() {
  const [player, opponent] = state.players;
  const playerAttack = boardAttack(player);
  const opponentAttack = boardAttack(opponent);
  const pendingText = state.pendingAction
    ? state.pendingAction.type === "attackTarget"
      ? "選擇攻擊目標"
      : "選擇卡牌目標"
    : state.active === 0
      ? "玩家回合"
      : "對手回合";
  els.metrics.innerHTML = `
    <div><strong>${state.turn}</strong><span>回合</span></div>
    <div><strong>${player.evolutionCount}/${opponent.evolutionCount}</strong><span>進化 我/敵</span></div>
    <div><strong>${player.hand.length}/${opponent.hand.length}</strong><span>手牌 我/敵</span></div>
    <div><strong>${player.deck.length}/${opponent.deck.length}</strong><span>牌庫 我/敵</span></div>
    <div><strong>${playerAttack}/${opponentAttack}</strong><span>場攻 我/敵</span></div>
    <div class="wide"><strong>${pendingText}</strong><span>狀態</span></div>
  `;
}

function boardAttack(player) {
  return player.board.reduce((sum, minion) => sum + Math.max(0, minion.currentAttack), 0);
}

function nextEvolutionThreshold(player) {
  return EVOLUTION_THRESHOLDS[player.evolutionCount] ?? EVOLUTION_THRESHOLDS[EVOLUTION_THRESHOLDS.length - 1];
}

function getHeroTargetClass(ownerIndex) {
  if (!state.pendingAction) return "";
  const target = { type: "hero", ownerIndex };
  if (state.pendingAction.type === "cardTarget" && isLegalTarget(state.pendingAction.playerIndex, state.pendingAction.target, target)) return "legal-target";
  if (state.pendingAction.type === "attackTarget" && isLegalAttackTarget(state.pendingAction.playerIndex, target)) return "legal-target";
  return "illegal-target";
}

function isPendingMinionTarget(ownerIndex, minion) {
  if (!state.pendingAction) return false;
  const target = { type: "minion", ownerIndex, uid: minion.uid };
  if (state.pendingAction.type === "cardTarget") return isLegalTarget(state.pendingAction.playerIndex, state.pendingAction.target, target);
  if (state.pendingAction.type === "attackTarget") return isLegalAttackTarget(state.pendingAction.playerIndex, target);
  return false;
}

function getMinionClasses(ownerIndex, minion) {
  const classes = [];
  if (ownerIndex === 0 && minion.canAttack && !minion.attackedThisTurn && !state.pendingAction) classes.push("can-attack");
  if (state.pendingAction?.type === "attackTarget" && state.pendingAction.attackerUid === minion.uid) classes.push("selected-attacker");
  if (isPendingMinionTarget(ownerIndex, minion)) classes.push("legal-target");
  else if (state.pendingAction) classes.push("illegal-target");
  return classes.join(" ");
}

function cardMarkup(item) {
  const stats = item.stats ? `<div class="stats"><span>攻 ${item.stats.attack}</span><span>速 ${item.stats.speed}</span><span>命 ${item.stats.health}</span></div>` : "";
  const keywords = keywordMarkup(item.tags);
  return `
    <div class="cost">${item.cost}</div>
    <h4>${item.name}</h4>
    <div class="type">${TYPE_LABELS[item.type]} · ${FACTION_LABELS[item.faction] ?? item.faction} · ${item.rarity}</div>
    ${keywords}
    <div class="text">${item.text}</div>
    ${stats}
  `;
}

function boardMarkup(item) {
  return `
    <h4>${item.name}</h4>
    ${keywordMarkup(item.tags, item.shield)}
    <div class="text">${item.text}</div>
    <div class="stats"><span>攻 ${item.currentAttack}</span><span>速 ${item.stats.speed}</span><span>命 ${item.currentHealth}</span></div>
  `;
}

function keywordMarkup(tags = [], shield = false) {
  const keywords = tags.filter((tag) => KEYWORD_LABELS[tag]).map((tag) => KEYWORD_LABELS[tag]);
  if (shield && !keywords.includes("護盾")) keywords.push("護盾");
  if (!keywords.length) return "";
  return `<div class="keywords">${keywords.map((word) => `<span title="${keywordHelp(word)}">${word}</span>`).join("")}</div>`;
}

function keywordHelp(word) {
  const help = {
    "守護": "敵方必須優先攻擊守護召喚物。",
    "迅捷": "登場回合即可攻擊。",
    "護盾": "抵銷下一次受到的傷害。",
    "吸血": "造成傷害後為控制者恢復生命。",
    "踐踏": "攻擊召喚物時，溢出傷害會打到敵方英雄。",
  };
  return help[word] ?? word;
}

function renderSummoners() {
  els.summonerGrid.innerHTML = "";
  for (const summoner of SUMMONERS) {
    const node = document.createElement("button");
    node.className = "summoner-card";
    node.innerHTML = `
      <div class="faction">${FACTION_LABELS[summoner.faction]}</div>
      <h2>${summoner.name}</h2>
      <p>${summoner.style}</p>
      <p><strong>召喚師能力</strong><br>${summoner.ability}</p>
    `;
    node.addEventListener("click", () => startMatch(summoner.id));
    els.summonerGrid.append(node);
  }
}

els.endTurn.addEventListener("click", endTurn);
els.newGame.addEventListener("click", () => location.reload());
els.simulate.addEventListener("click", () => runBalanceSimulation(50));
els.resultNewGame.addEventListener("click", () => location.reload());
renderSummoners();

if (new URLSearchParams(location.search).has("simulate")) {
  runBalanceSimulation(50);
}
