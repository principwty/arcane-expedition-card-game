import { BASE_CARDS, DECK_RULES, DEFAULT_DECK_RECIPES, FACTION_LABELS, SUMMONERS, TYPE_LABELS } from "./data.js";

const baseCardById = new Map(BASE_CARDS.map((card) => [card.id, card]));
const summonerById = new Map(SUMMONERS.map((summoner) => [summoner.id, summoner]));

export function normalizeDeckRecipe(recipe) {
  return {
    id: recipe?.id || `deck-${Date.now()}`,
    name: recipe?.name || "未命名牌組",
    summonerId: recipe?.summonerId || SUMMONERS[0].id,
    cardIds: Array.isArray(recipe?.cardIds) ? recipe.cardIds.filter((id) => typeof id === "string") : [],
    updatedAt: recipe?.updatedAt || new Date().toISOString(),
  };
}

export function defaultDeckRecipe(summonerId) {
  const fallback = DEFAULT_DECK_RECIPES[SUMMONERS[0].id];
  return cloneRecipe(DEFAULT_DECK_RECIPES[summonerId] ?? fallback);
}

export function cloneRecipe(recipe, overrides = {}) {
  return {
    id: recipe.id,
    name: recipe.name,
    summonerId: recipe.summonerId,
    cardIds: [...recipe.cardIds],
    updatedAt: recipe.updatedAt,
    ...overrides,
  };
}

export function validateDeckRecipe(recipe) {
  const normalized = normalizeDeckRecipe(recipe);
  const errors = [];
  const summoner = summonerById.get(normalized.summonerId);
  const counts = cardCounts(normalized.cardIds);

  if (!summoner) errors.push("召喚師不存在。");
  if (normalized.cardIds.length !== DECK_RULES.size) errors.push(`牌組必須剛好 ${DECK_RULES.size} 張，目前 ${normalized.cardIds.length} 張。`);

  for (const [cardId, count] of counts) {
    const card = baseCardById.get(cardId);
    if (!card) {
      errors.push(`${cardId} 不是可構築的基礎牌。`);
      continue;
    }
    if (count > DECK_RULES.maxCopies) errors.push(`${card.name} 超過 ${DECK_RULES.maxCopies} 張上限。`);
    if (summoner && card.faction !== summoner.faction && card.faction !== "neutral") {
      errors.push(`${card.name} 不屬於 ${FACTION_LABELS[summoner.faction]} 或中立。`);
    }
    if (card.rarity === "token" || card.evolutionTier > 0) errors.push(`${card.name} 不能放入起始牌組。`);
  }

  return { ok: errors.length === 0, errors, recipe: normalized, counts };
}

export function buildDeckTemplatesFromRecipe(recipe) {
  const validation = validateDeckRecipe(recipe);
  if (!validation.ok) throw new Error(validation.errors.join(" "));
  return validation.recipe.cardIds.map((cardId) => baseCardById.get(cardId));
}

export function cardCounts(cardIds) {
  const result = new Map();
  for (const id of cardIds) result.set(id, (result.get(id) ?? 0) + 1);
  return result;
}

export function legalCardsForSummoner(summonerId) {
  const summoner = summonerById.get(summonerId);
  if (!summoner) return [];
  return BASE_CARDS.filter((card) => card.faction === summoner.faction || card.faction === "neutral");
}

export function deckStats(recipe) {
  const cards = recipe.cardIds.map((cardId) => baseCardById.get(cardId)).filter(Boolean);
  const curve = Object.fromEntries(Array.from({ length: 9 }, (_, cost) => [cost, 0]));
  const types = Object.fromEntries(Object.keys(TYPE_LABELS).map((type) => [type, 0]));
  for (const card of cards) {
    const bucket = Math.min(8, card.cost);
    curve[bucket] = (curve[bucket] ?? 0) + 1;
    types[card.type] = (types[card.type] ?? 0) + 1;
  }
  return { total: cards.length, curve, types };
}

export function summarizeDeck(recipe) {
  const validation = validateDeckRecipe(recipe);
  const stats = deckStats(validation.recipe);
  return { ...validation, stats };
}
