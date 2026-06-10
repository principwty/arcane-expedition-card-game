export function card(id, name, cost, type, faction, rarity, stats, text, tags, effects) {
  return { id, name, cost, type, faction, rarity, stats, text, tags, effects, evolutionTier: 0 };
}

export function evo(id, name, cost, type, faction, rarity, text, effects, immediate = false, stats = null, tags = []) {
  return { id, name, cost, type, faction, rarity, stats, text, tags, effects, evolutionTier: 1, immediate };
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

export const EVOLUTION_THRESHOLDS = [3, 6, 9, 12, 15];

export const KEYWORD_LABELS = {
  guard: "守護",
  swift: "迅捷",
  ward: "護盾",
  lifesteal: "吸血",
  overwhelm: "踐踏",
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

export const EVOLUTION_CARDS = [
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

export const TOKENS = {
  fawn: card("token-fawn", "小鹿", 0, "minion", "forest", "token", { attack: 1, health: 1, speed: 1 }, "可愛但認真。", ["beast"], []),
  wraith: card("token-wraith", "亡魂", 0, "minion", "moon", "token", { attack: 1, health: 1, speed: 1 }, "短暫回到戰場。", ["undead"], []),
  fireling: card("token-fireling", "幼火龍", 0, "minion", "dragon", "token", { attack: 4, health: 3, speed: 1 }, "火翼剛展，已經很兇。", ["dragon"], []),
};

export const COIN_CARD = card("coin", "星砂硬幣", 0, "spell", "neutral", "token", null, "本回合獲得 1 點法力。", ["resource"], [{ type: "gainMana", amount: 1 }]);
export const SECOND_SUPPLY_CARD = card("second-supply", "後手補給", 0, "spell", "neutral", "token", null, "抽 1 張牌，本回合獲得 1 點法力。", ["resource"], [{ type: "draw", amount: 1 }, { type: "gainMana", amount: 1 }]);

export const DEFAULT_DECK_RECIPES = Object.fromEntries(
  SUMMONERS.map((summoner) => [
    summoner.id,
    {
      id: `default-${summoner.id}`,
      name: `${FACTION_LABELS[summoner.faction]} 預設牌組`,
      summonerId: summoner.id,
      cardIds: defaultDeckCardIds(summoner.faction),
      updatedAt: "2026-06-11T00:00:00.000Z",
    },
  ]),
);

function defaultDeckCardIds(faction) {
  const factionCards = BASE_CARDS.filter((item) => item.faction === faction);
  const neutralCards = BASE_CARDS.filter((item) => item.faction === "neutral");
  const cardIds = [];
  for (const item of factionCards) cardIds.push(item.id, item.id, item.id);
  for (const item of neutralCards) cardIds.push(item.id, item.id);
  let index = 0;
  while (cardIds.length < DECK_RULES.size) {
    cardIds.push(factionCards[index % factionCards.length].id);
    index += 1;
  }
  return cardIds.slice(0, DECK_RULES.size);
}
