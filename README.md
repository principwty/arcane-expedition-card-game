# 奧術遠征

1v1 奇幻召喚卡牌遊戲原型。玩家選擇召喚師後進行對戰，透過遠征軌在局內選擇進化牌，讓牌組逐步成長。

## Play

Run a local static server:

```sh
python3 -m http.server 4181 --directory outputs
```

Then visit `http://127.0.0.1:4181/`. V1.2 uses ES modules, so local server play is the supported path.

## V1.2 Features

- Five factions with distinct card identities.
- 110 base cards and 57 evolution cards.
- Tactical 3+3 battlefield with front row and back row slots for each player.
- Summoning uses click-to-place slots; melee attacks are blocked by enemy front row.
- New tactical keywords: ranged, vanguard, and support.
- Position-chain gameplay: adjacent buffs, front-row bonuses, back-row bonuses, breakthrough damage, and backline protection.
- Backline protection lets front-row defenders stop ranged attackers from bypassing the line.
- AI now scores summon slots by role, board shape, protected backline threats, and tactical effects.
- Archetype templates include V1.2 position cards so each faction can show its battlefield identity immediately.
- Combat animation queue for play, attack, damage, healing, shield, secret, summon, and evolution feedback.
- Animation speed setting: normal, fast, or off, saved locally and compatible with reduced-motion preferences.
- Mixed art system with faction themes, summoner portraits, battlefield art, card fallback art, type icons, keyword icons, and rarity marks.
- 15 representative cards now use dedicated card art, with the rest falling back to faction art.
- Effect overlay assets for damage, heal, shield break, secret trigger, and evolution.
- Combat UI readability pass for card art windows, legal targets, selected attackers, hero portraits, faction emblems, and evolution card types.
- Two quest lines and two deck archetype templates per summoner.
- Collection and deck builder demo with all cards unlocked.
- Local deck saving through `localStorage`.
- Deck rules: 30 cards, faction plus neutral only, max 3 copies, no tokens or evolution cards in starting decks.
- Quest-aware deck recipes with `questId`, template loading, and archetype tag filtering.
- Targeted spells, attacks, secrets, artifacts, silence, board damage, healing, revive, and artifact destruction.
- Keyword gameplay: guard, swift, ward, lifesteal, overwhelm, ranged, vanguard, and support.
- Summoner hero powers with once-per-turn use and awakening upgrades.
- Deeper secrets and automatic counterplay triggers.
- Improved AI for play, attack, and evolution decisions.
- ES module card data in `outputs/src/data.js`, reused by browser and Node scripts.
- Card, quest, archetype, default deck, and art manifest validation plus deterministic AI-vs-AI simulation scripts.
- Balance simulation panel now reports empty-hand rate and board-attack snowball pressure.
- V1.2 simplified simulation target focuses on no stalled games plus 8-13 turns and 3-6 total evolutions; first/second win rate remains visible as an observation metric.

## Art Pipeline

- Faction themes live in `outputs/src/data.js` as `FACTION_THEMES`.
- Asset paths are centralized in `ART_MANIFEST`; `npm run check` verifies every manifest path exists.
- Assets are organized under `outputs/assets/summoners`, `outputs/assets/factions`, `outputs/assets/icons`, `outputs/assets/cards`, `outputs/assets/effects`, and `outputs/assets/textures`.
- Cards may optionally define `art: { image, focus, fallback }`; cards without custom art use faction fallback art.
- New icons should be SVG and use descriptive names such as `type-spell.svg`, `keyword-guard.svg`, or `rarity-evolution.svg`.
- New combat overlays should be registered in `ART_MANIFEST.effects`; representative card art should be registered in `ART_MANIFEST.cardArt`.

## Validation

```sh
npm run check
npm run content
npm run simulate -- 50
npm run simulate -- 200
```
