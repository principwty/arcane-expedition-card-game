import { BASE_CARDS, EVOLUTION_CARDS, FACTION_LABELS, KEYWORD_LABELS } from "../outputs/src/data.js";
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
console.log(`Evolution cards: ${EVOLUTION_CARDS.length}\n`);

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
