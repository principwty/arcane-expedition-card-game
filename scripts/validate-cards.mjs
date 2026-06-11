import {
  ART_MANIFEST,
  BASE_CARDS,
  DECK_ARCHETYPES,
  DEFAULT_DECK_RECIPES,
  EVOLUTION_CARDS,
  FACTION_THEMES,
  FACTION_LABELS,
  QUEST_LINES,
  SUMMONERS,
  TOKENS,
  TYPE_LABELS,
} from "../outputs/src/data.js";
import { validateDeckRecipe } from "../outputs/src/deck-utils.js";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const SUPPORTED_EFFECTS = new Set([
  "ambushGuard",
  "beastHealArtifact",
  "bonusAttackDamage",
  "buffAll",
  "buffAllIfArtifact",
  "buffAlly",
  "buffAllyHealth",
  "buffAllyOrDraw",
  "buffIfArtifact",
  "damage",
  "damageAllEnemies",
  "damageAllyMinion",
  "damageHero",
  "deathExpedition",
  "destroyArtifact",
  "dragonJudgment",
  "draw",
  "drawIfArtifact",
  "drawIfDeaths",
  "drawIfLowHand",
  "drawIfNoEnemyArtifact",
  "drawIfSpellThisTurn",
  "drawOnDeath",
  "drawThenDiscard",
  "expedition",
  "expeditionIfTargetDies",
  "expeditionOnKill",
  "firstAttackBuff",
  "firstAttackExpedition",
  "firstDeathWraith",
  "firstSpellDraw",
  "flameCounter",
  "gainMana",
  "gainShield",
  "healHero",
  "healOnBeast",
  "healTarget",
  "redirectAttack",
  "revive",
  "reviveOnDeath",
  "sacrificeDraw",
  "silenceMinion",
  "silenceSummoned",
  "spellDamage",
  "spellDamageAura",
  "spellPing",
  "spellShield",
  "summonIfDeaths",
  "summonOnDeath",
  "summonToken",
  "upgradeHeroPower",
  "wardSpellTarget",
]);

const SUPPORTED_TARGETS = new Set(["ally", "allyMinion", "anyMinion", "enemy", "hero", "none"]);
const FACTIONS = new Set(Object.keys(FACTION_LABELS));
const TYPES = new Set(Object.keys(TYPE_LABELS));
const RARITIES = new Set(["common", "rare", "token", "強化", "發現", "覺醒"]);
const QUEST_TRIGGERS = new Set(["artifact", "death", "dragonSummon", "guardOrWardSummon", "heal", "heroDamage", "secretOrSilence", "spell", "summon", "undeadSummon"]);
const QUEST_REWARD_TYPES = new Set(["buffAll", "damageHero", "draw", "shield", "summonToken"]);
const OUTPUTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../outputs");

export function validateCards() {
  const errors = [];
  const allCards = [...BASE_CARDS, ...EVOLUTION_CARDS, ...Object.values(TOKENS)];
  const ids = new Map();

  for (const card of allCards) {
    if (!card.id) errors.push(`${card.name ?? "(unnamed)"} 缺少 id`);
    if (ids.has(card.id)) errors.push(`重複 card id: ${card.id}`);
    ids.set(card.id, card);

    if (!card.name) errors.push(`${card.id} 缺少 name`);
    if (!Number.isInteger(card.cost) || card.cost < 0) errors.push(`${card.id} cost 必須是非負整數`);
    if (!TYPES.has(card.type)) errors.push(`${card.id} type 不支援: ${card.type}`);
    if (!FACTIONS.has(card.faction)) errors.push(`${card.id} faction 不支援: ${card.faction}`);
    if (!RARITIES.has(card.rarity)) errors.push(`${card.id} rarity 不支援: ${card.rarity}`);
    if (!Array.isArray(card.tags)) errors.push(`${card.id} tags 必須是陣列`);
    if (!Array.isArray(card.effects)) errors.push(`${card.id} effects 必須是陣列`);

    if (card.type === "minion") {
      const stats = card.stats ?? {};
      for (const key of ["attack", "health", "speed"]) {
        if (!Number.isInteger(stats[key])) errors.push(`${card.id} 召喚物 stats.${key} 必須是整數`);
      }
    } else if (card.stats) {
      errors.push(`${card.id} 只有召喚物應該有 stats`);
    }

    for (const effect of card.effects ?? []) {
      if (!SUPPORTED_EFFECTS.has(effect.type)) errors.push(`${card.id} effect 不支援: ${effect.type}`);
      if (effect.target && !SUPPORTED_TARGETS.has(effect.target)) errors.push(`${card.id} target 不支援: ${effect.target}`);
      if (effect.token && !TOKENS[effect.token]) errors.push(`${card.id} token 不存在: ${effect.token}`);
    }
  }

  for (const summoner of SUMMONERS) {
    if (!FACTIONS.has(summoner.faction) || summoner.faction === "neutral") errors.push(`${summoner.id} 召喚師 faction 不合法`);
    if (!summoner.heroPower?.effects?.length) errors.push(`${summoner.id} 缺少 heroPower effects`);
    for (const effect of summoner.heroPower?.effects ?? []) {
      if (!SUPPORTED_EFFECTS.has(effect.type)) errors.push(`${summoner.id} heroPower effect 不支援: ${effect.type}`);
      if (effect.target && !SUPPORTED_TARGETS.has(effect.target)) errors.push(`${summoner.id} heroPower target 不支援: ${effect.target}`);
    }
  }

  for (const summoner of SUMMONERS) {
    const choices = EVOLUTION_CARDS.filter((card) => card.faction === summoner.faction || card.faction === "neutral");
    if (choices.length < 3) errors.push(`${summoner.name} 可用進化牌少於 3 張`);
  }

  for (const summoner of SUMMONERS) {
    const recipe = DEFAULT_DECK_RECIPES[summoner.id];
    if (!recipe) {
      errors.push(`${summoner.name} 缺少預設牌組`);
      continue;
    }
    const validation = validateDeckRecipe(recipe);
    if (!validation.ok) errors.push(...validation.errors.map((error) => `${recipe.name}: ${error}`));
  }

  for (const summoner of SUMMONERS) {
    const quests = QUEST_LINES.filter((quest) => quest.summonerId === summoner.id);
    const archetypes = DECK_ARCHETYPES.filter((archetype) => archetype.summonerId === summoner.id);
    if (quests.length !== 2) errors.push(`${summoner.name} 任務數量必須為 2，目前 ${quests.length}`);
    if (archetypes.length !== 2) errors.push(`${summoner.name} 打法模板數量必須為 2，目前 ${archetypes.length}`);
  }

  for (const quest of QUEST_LINES) {
    if (!SUMMONERS.some((summoner) => summoner.id === quest.summonerId)) errors.push(`${quest.id} 任務召喚師不存在`);
    if (!QUEST_TRIGGERS.has(quest.trigger)) errors.push(`${quest.id} 任務 trigger 不支援: ${quest.trigger}`);
    if (!Number.isInteger(quest.threshold) || quest.threshold <= 0) errors.push(`${quest.id} 任務 threshold 必須是正整數`);
    if (!Array.isArray(quest.tags) || !quest.tags.length) errors.push(`${quest.id} 任務缺少打法 tags`);
    if (!QUEST_REWARD_TYPES.has(quest.reward?.type)) errors.push(`${quest.id} 任務 reward 不支援: ${quest.reward?.type}`);
    if (quest.reward?.token && !TOKENS[quest.reward.token]) errors.push(`${quest.id} 任務 token 不存在: ${quest.reward.token}`);
  }

  for (const archetype of DECK_ARCHETYPES) {
    const validation = validateDeckRecipe(archetype);
    if (!validation.ok) errors.push(...validation.errors.map((error) => `${archetype.name}: ${error}`));
    const quest = QUEST_LINES.find((item) => item.id === archetype.questId);
    if (!quest) errors.push(`${archetype.name} 指定不存在的任務 ${archetype.questId}`);
    if (quest && quest.summonerId !== archetype.summonerId) errors.push(`${archetype.name} 指定跨職業任務 ${quest.name}`);
  }

  validateArtManifest(errors);

  return { ok: errors.length === 0, errors, counts: { base: BASE_CARDS.length, evolution: EVOLUTION_CARDS.length, tokens: Object.keys(TOKENS).length, decks: Object.keys(DEFAULT_DECK_RECIPES).length, quests: QUEST_LINES.length, archetypes: DECK_ARCHETYPES.length, artAssets: collectArtPaths().length } };
}

function validateArtManifest(errors) {
  for (const faction of Object.keys(FACTION_LABELS)) {
    const theme = FACTION_THEMES[faction];
    if (!theme) {
      errors.push(`${faction} 缺少 FACTION_THEMES`);
      continue;
    }
    for (const key of ["primary", "accent", "surface", "summonerPortrait", "battlefieldArt", "cardBackArt", "emblem"]) {
      if (!theme[key]) errors.push(`${faction} theme 缺少 ${key}`);
    }
    if (!ART_MANIFEST.fallbackCards[faction]) errors.push(`${faction} 缺少 fallback card art`);
  }
  for (const type of Object.keys(TYPE_LABELS)) {
    if (!ART_MANIFEST.icons.types[type]) errors.push(`${type} 缺少 type icon`);
  }
  for (const tag of ["guard", "swift", "ward", "lifesteal", "overwhelm"]) {
    if (!ART_MANIFEST.icons.keywords[tag]) errors.push(`${tag} 缺少 keyword icon`);
  }
  for (const assetPath of collectArtPaths()) {
    if (!existsSync(resolveAsset(assetPath))) errors.push(`美術資產不存在: ${assetPath}`);
  }
  const representativeCards = [...BASE_CARDS, ...EVOLUTION_CARDS].filter((card) => card.art?.image);
  if (representativeCards.length !== 15) errors.push(`代表卡專屬 art 必須為 15 張，目前 ${representativeCards.length}`);
  for (const card of representativeCards) {
    if (!existsSync(resolveAsset(card.art.image))) errors.push(`${card.id} 專屬 art 不存在: ${card.art.image}`);
  }
}

function collectArtPaths() {
  const paths = new Set([
    ART_MANIFEST.cardBack,
    ...Object.values(ART_MANIFEST.effects),
    ...Object.values(ART_MANIFEST.fallbackCards),
    ...Object.values(ART_MANIFEST.cardArt),
    ...Object.values(ART_MANIFEST.icons.types),
    ...Object.values(ART_MANIFEST.icons.keywords),
    ...Object.values(ART_MANIFEST.icons.rarities),
  ]);
  for (const theme of Object.values(FACTION_THEMES)) {
    paths.add(theme.summonerPortrait);
    paths.add(theme.battlefieldArt);
    paths.add(theme.cardBackArt);
    paths.add(theme.emblem);
  }
  return [...paths].filter(Boolean);
}

function resolveAsset(assetPath) {
  return resolve(OUTPUTS_DIR, assetPath.replace(/^\.\//, ""));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = validateCards();
  if (!result.ok) {
    console.error(result.errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`Card validation passed: ${result.counts.base} base, ${result.counts.evolution} evolution, ${result.counts.tokens} tokens, ${result.counts.decks} default decks, ${result.counts.quests} quests, ${result.counts.archetypes} archetypes, ${result.counts.artAssets} art assets.`);
}
