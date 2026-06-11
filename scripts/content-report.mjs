import { BASE_CARDS, DECK_ARCHETYPES, DEFAULT_DECK_RECIPES, EVOLUTION_CARDS, FACTION_LABELS, KEYWORD_LABELS, QUEST_LINES, TYPE_LABELS } from "../outputs/src/data.js";
import { deckStats, validateDeckRecipe } from "../outputs/src/deck-utils.js";
import { validateCards } from "./validate-cards.mjs";

const factions = Object.keys(FACTION_LABELS);
const baseByFaction = groupBy(BASE_CARDS, "faction");
const evoByFaction = groupBy(EVOLUTION_CARDS, "faction");
const effectCounts = countBy([...BASE_CARDS, ...EVOLUTION_CARDS].flatMap((card) => card.effects.map((effect) => effect.type)));
const keywordCounts = countBy([...BASE_CARDS, ...EVOLUTION_CARDS].flatMap((card) => card.tags.filter((tag) => KEYWORD_LABELS[tag])));
const validation = validateCards();

console.log("# Arcane Expedition Content Report\n");
console.log(`Validation: ${validation.ok ? "passed" : "failed"}`);
console.log(`Base cards: ${BASE_CARDS.length}`);
console.log(`Evolution cards: ${EVOLUTION_CARDS.length}`);
console.log(`Art assets: ${validation.counts.artAssets}\n`);

console.log("## Faction Curves");
for (const faction of factions) {
  const cards = baseByFaction.get(faction) ?? [];
  const curve = Array.from({ length: 9 }, (_, cost) => `${cost}:${cards.filter((card) => card.cost === cost).length}`).join(" ");
  console.log(`${FACTION_LABELS[faction]} - base ${cards.length}, evo ${(evoByFaction.get(faction) ?? []).length}, curve ${curve}`);
}

console.log("\n## Top Effects");
for (const [effect, count] of [...effectCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16)) {
  console.log(`${effect}: ${count}`);
}

console.log("\n## Keywords");
for (const [keyword, count] of [...keywordCounts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`${KEYWORD_LABELS[keyword]} (${keyword}): ${count}`);
}

console.log("\n## Default Decks");
for (const recipe of Object.values(DEFAULT_DECK_RECIPES)) {
  const validation = validateDeckRecipe(recipe);
  const stats = deckStats(recipe);
  const curve = Object.entries(stats.curve).map(([cost, count]) => `${cost}:${count}`).join(" ");
  const types = Object.entries(stats.types)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => `${TYPE_LABELS[type]}:${count}`)
    .join(" ");
  console.log(`${recipe.name} - ${validation.ok ? "legal" : "illegal"} - curve ${curve} - ${types}`);
}

console.log("\n## Quest Lines");
for (const quest of QUEST_LINES) {
  const support = BASE_CARDS.filter((card) => card.faction === quest.summonerId || card.faction === "neutral").filter((card) => card.tags.some((tag) => quest.tags.includes(tag))).length;
  console.log(`${FACTION_LABELS[quest.summonerId]} / ${quest.name} - ${quest.conditionText} - support ${support}`);
}

console.log("\n## Archetype Templates");
for (const archetype of DECK_ARCHETYPES) {
  const validation = validateDeckRecipe(archetype);
  const stats = deckStats(archetype);
  const curve = Object.entries(stats.curve).map(([cost, count]) => `${cost}:${count}`).join(" ");
  console.log(`${archetype.name} - ${validation.ok ? "legal" : "illegal"} - ${QUEST_LINES.find((quest) => quest.id === archetype.questId)?.name ?? archetype.questId} - curve ${curve}`);
}

if (!validation.ok) {
  console.log("\n## Validation Errors");
  for (const error of validation.errors) console.log(`- ${error}`);
  process.exitCode = 1;
}

function groupBy(items, key) {
  const result = new Map();
  for (const item of items) {
    const value = item[key];
    result.set(value, [...(result.get(value) ?? []), item]);
  }
  return result;
}

function countBy(items) {
  const result = new Map();
  for (const item of items) result.set(item, (result.get(item) ?? 0) + 1);
  return result;
}
