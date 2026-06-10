# 奧術遠征

1v1 奇幻召喚卡牌遊戲原型。玩家選擇召喚師後進行對戰，透過遠征軌在局內選擇進化牌，讓牌組逐步成長。

## Play

Run a local static server:

```sh
python3 -m http.server 4181 --directory outputs
```

Then visit `http://127.0.0.1:4181/`. V0.6 uses ES modules, so local server play is the supported path.

## V0.6 Features

- Five factions with distinct card identities.
- 40+ base cards and expanded evolution cards.
- Collection and deck builder demo with all cards unlocked.
- Local deck saving through `localStorage`.
- Deck rules: 30 cards, faction plus neutral only, max 3 copies, no tokens or evolution cards in starting decks.
- Targeted spells, attacks, secrets, artifacts, silence, board damage, healing, revive, and artifact destruction.
- Keyword gameplay: guard, swift, ward, lifesteal, and overwhelm.
- Summoner hero powers with once-per-turn use and awakening upgrades.
- Deeper secrets and automatic counterplay triggers.
- Improved AI for play, attack, and evolution decisions.
- ES module card data in `outputs/src/data.js`, reused by browser and Node scripts.
- Card and default deck validation, content report, syntax check, and deterministic AI-vs-AI simulation scripts.
- Balance simulation panel now reports empty-hand rate and board-attack snowball pressure.

## Validation

```sh
npm run check
npm run content
npm run simulate -- 50
npm run simulate -- 200
```
