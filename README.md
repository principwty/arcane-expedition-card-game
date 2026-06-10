# 奧術遠征

1v1 奇幻召喚卡牌遊戲原型。玩家選擇召喚師後進行對戰，透過遠征軌在局內選擇進化牌，讓牌組逐步成長。

## Play

Open `outputs/index.html` directly, or run a local server:

```sh
python3 -m http.server 4181 --directory outputs
```

Then visit `http://127.0.0.1:4181/`.

## V0.3 Features

- Five factions with distinct card identities.
- 40+ base cards and expanded evolution cards.
- Targeted spells, attacks, secrets, artifacts, silence, board damage, healing, revive, and artifact destruction.
- Improved AI for play, attack, and evolution decisions.
- Balance simulation panel for 50 AI-vs-AI games.

## Validation

```sh
node --check outputs/app.js
```
