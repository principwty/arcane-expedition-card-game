import {
  BASE_CARDS,
  DEFAULT_DECK_RECIPES,
  EVOLUTION_CARDS,
  FACTION_LABELS,
  SUMMONERS,
  TOKENS,
  TYPE_LABELS,
} from "../outputs/src/data.js";
import { validateDeckRecipe } from "../outputs/src/deck-utils.js";

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

  return { ok: errors.length === 0, errors, counts: { base: BASE_CARDS.length, evolution: EVOLUTION_CARDS.length, tokens: Object.keys(TOKENS).length, decks: Object.keys(DEFAULT_DECK_RECIPES).length } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = validateCards();
  if (!result.ok) {
    console.error(result.errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  console.log(`Card validation passed: ${result.counts.base} base, ${result.counts.evolution} evolution, ${result.counts.tokens} tokens, ${result.counts.decks} default decks.`);
}
