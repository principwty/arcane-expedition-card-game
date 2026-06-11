import {
  ART_MANIFEST,
  BASE_CARDS,
  COIN_CARD,
  DECK_RULES,
  DEFAULT_DECK_RECIPES,
  DECK_ARCHETYPES,
  EVOLUTION_CARDS,
  EVOLUTION_THRESHOLDS,
  FACTION_THEMES,
  FACTION_LABELS,
  KEYWORD_LABELS,
  QUEST_LINES,
  SECOND_SUPPLY_CARD,
  SUMMONERS,
  TOKENS,
  TYPE_LABELS,
} from "./src/data.js";
import {
  buildDeckTemplatesFromRecipe,
  cardCounts,
  cloneRecipe,
  defaultDeckRecipe,
  archetypeRecipe,
  archetypesForSummoner,
  legalCardsForSummoner,
  normalizeDeckRecipe,
  questsForSummoner,
  summarizeDeck,
  validateDeckRecipe,
} from "./src/deck-utils.js";

let state;
let uid = 0;
let rng = Math.random;
const hasDom = typeof document !== "undefined";
const ANIMATION_SETTINGS = {
  speedStorageKey: "arcane-expedition-animation-speed-v1",
  detailStorageKey: "arcane-expedition-animation-detail-v1",
  durations: { normal: 320, fast: 130, off: 0 },
  maxSteps: { compact: 3, standard: 5, full: 6 },
};
let animationSpeed = "normal";
let animationDetail = "standard";
let visualQueue = [];
let visualBusy = false;
let visualProcessTimer = null;
let currentTransaction = null;
let transactionUid = 0;
const SUPPORTED_KEYWORDS = new Set(["guard", "swift", "ward", "lifesteal", "overwhelm"]);
const SUPPORTED_STATUSES = new Set(["silenced", "stunned", "cannotAttack", "deathrattleDisabled", "temporaryBuff"]);
const PHASE_LABELS = {
  startTurn: "回合開始",
  main: "主要階段",
  combat: "戰鬥階段",
  endTurn: "回合結束",
  cleanup: "清理階段",
};
const builder = {
  summonerId: "star",
  activeDeckId: null,
  recipe: null,
  filters: { search: "", type: "all", cost: "all", tag: "all" },
  savedDecks: [],
};

const els = hasDom
  ? {
      start: document.querySelector("#startScreen"),
      game: document.querySelector("#gameScreen"),
      summonerGrid: document.querySelector("#summonerGrid"),
      builderScreen: document.querySelector("#builderScreen"),
      builderTitle: document.querySelector("#builderTitle"),
      deckSelect: document.querySelector("#deckSelect"),
      deckNameInput: document.querySelector("#deckNameInput"),
      builderSearch: document.querySelector("#builderSearch"),
      builderType: document.querySelector("#builderType"),
      builderCost: document.querySelector("#builderCost"),
      builderTag: document.querySelector("#builderTag"),
      questSelect: document.querySelector("#questSelect"),
      archetypeList: document.querySelector("#archetypeList"),
      cardPool: document.querySelector("#cardPool"),
      deckList: document.querySelector("#deckList"),
      deckSummary: document.querySelector("#deckSummary"),
      deckStatus: document.querySelector("#deckStatus"),
      saveDeckBtn: document.querySelector("#saveDeckBtn"),
      copyDeckBtn: document.querySelector("#copyDeckBtn"),
      deleteDeckBtn: document.querySelector("#deleteDeckBtn"),
      resetDeckBtn: document.querySelector("#resetDeckBtn"),
      startCustomBtn: document.querySelector("#startCustomBtn"),
      backToSummonersBtn: document.querySelector("#backToSummonersBtn"),
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
      actionHint: document.querySelector("#actionHint"),
      visualOverlay: document.querySelector("#visualOverlay"),
      animationSpeed: document.querySelector("#animationSpeed"),
      animationDetail: document.querySelector("#animationDetail"),
      endTurn: document.querySelector("#endTurnBtn"),
      newGame: document.querySelector("#newGameBtn"),
      simulate: document.querySelector("#simulateBtn"),
      evoModal: document.querySelector("#evolutionModal"),
      evoChoices: document.querySelector("#evolutionChoices"),
      resultModal: document.querySelector("#resultModal"),
      resultTitle: document.querySelector("#resultTitle"),
      resultText: document.querySelector("#resultText"),
      resultNewGame: document.querySelector("#resultNewGameBtn"),
    }
  : {};

function cloneCard(template) {
  const keywords = (template.tags ?? []).filter((tag) => SUPPORTED_KEYWORDS.has(tag));
  return {
    ...template,
    tags: [...(template.tags ?? [])],
    effects: [...(template.effects ?? [])],
    keywords,
    statuses: [],
    temporaryBuffs: [],
    uid: `c${uid++}`,
    currentHealth: template.stats?.health ?? null,
    currentAttack: template.stats?.attack ?? null,
    shield: keywords.includes("ward"),
    canAttack: false,
    attackedThisTurn: false,
  };
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function setRandomSeed(seed) {
  rng = createSeededRandom(seed);
}

function createSeededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function createPlayer(kind, summonerId, recipe = null) {
  const summoner = SUMMONERS.find((item) => item.id === summonerId);
  const normalizedRecipe = recipe ? normalizeDeckRecipe(recipe) : defaultDeckRecipe(summonerId);
  const quest = QUEST_LINES.find((item) => item.id === normalizedRecipe.questId) ?? questsForSummoner(summonerId)[0];
  const deckTemplates = recipe ? buildDeckTemplatesFromRecipe(normalizedRecipe) : buildDeckTemplates(summoner);
  return {
    kind,
    summoner,
    hp: 30,
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
    phase: "main",
    turnFlags: {},
    triggerHistory: [],
    questId: quest?.id ?? "",
    questProgress: 0,
    questCompleted: false,
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
  return buildDeckTemplatesFromRecipe(DEFAULT_DECK_RECIPES[summoner.id]);
}

function startMatch(playerSummonerId, playerRecipe = null) {
  if (playerRecipe) {
    const validation = validateDeckRecipe(playerRecipe);
    if (!validation.ok) {
      showDeckStatus(validation.errors, false);
      return;
    }
  }
  const aiOptions = SUMMONERS.filter((item) => item.id !== playerSummonerId);
  const aiSummonerId = aiOptions[Math.floor(rng() * aiOptions.length)].id;
  state = {
    players: [createPlayer("玩家", playerSummonerId, playerRecipe), createPlayer("對手", aiSummonerId)],
    active: 0,
    turn: 1,
    logs: [],
    gameOver: false,
    waitingForEvolution: false,
    pendingAction: null,
    visualQueue: [],
    transactions: [],
    phase: "main",
    simulating: false,
  };
  visualQueue = [];
  visualBusy = false;
  if (visualProcessTimer) {
    window.clearTimeout(visualProcessTimer);
    visualProcessTimer = null;
  }
  if (els.visualOverlay) els.visualOverlay.innerHTML = "";
  drawCards(0, 4);
  drawCards(1, 4);
  state.players[1].hp = 30;
  state.players[1].hand.push(cloneCard(COIN_CARD), cloneCard(SECOND_SUPPLY_CARD));
  startTurn(0);
  els.start.classList.add("hidden");
  els.builderScreen.classList.add("hidden");
  els.game.classList.remove("hidden");
  log(`對局開始：${state.players[0].summoner.name} 對 ${state.players[1].summoner.name}`);
  render();
}

function startTurn(playerIndex) {
  const player = state.players[playerIndex];
  state.active = playerIndex;
  state.phase = "startTurn";
  player.phase = "startTurn";
  player.turnFlags = {};
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
    const wasStunned = hasStatus(minion, "stunned") || hasStatus(minion, "cannotAttack");
    minion.canAttack = !wasStunned;
    if (wasStunned) {
      removeStatus(minion, "stunned");
      removeStatus(minion, "cannotAttack");
    }
    minion.attackedThisTurn = false;
  });
  drawCards(playerIndex, 1);
  triggerTurnStartPassives(playerIndex);
  state.phase = "main";
  player.phase = "main";
  if (playerIndex === 1 && !state.simulating) {
    render();
    setTimeout(aiTurn, 700);
  }
}

function endTurn() {
  if (state.gameOver || state.waitingForEvolution || state.pendingAction || state.active !== 0) return;
  state.phase = "endTurn";
  state.players[state.active].phase = "endTurn";
  cleanupTemporaryBuffs(state.active);
  state.phase = "cleanup";
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
  withTransaction("heroPower", playerIndex, power, (transaction) => {
    const player = state.players[playerIndex];
    player.mana -= power.cost;
    player.heroPowerUsed = true;
    state.pendingAction = null;
    recordEvent(transaction, "costPaid", { mana: power.cost, source: power.name });
    recordEvent(transaction, "heroPowerUsed", { label: power.name, detail: player.kind, tone: player.summoner.faction, target });
    log(`${player.kind}使用召喚師技能：${power.name}。`);
    resolveEffects(playerIndex, power.effects, { ...power, type: "heroPower", tags: [] }, target);
    checkGameOver();
  });
  render();
}

function aiEndTurn() {
  if (state.gameOver) return;
  state.phase = "endTurn";
  state.players[state.active].phase = "endTurn";
  cleanupTemporaryBuffs(state.active);
  state.phase = "cleanup";
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
  withTransaction("playCard", playerIndex, played, (transaction) => {
    player.hand.splice(index, 1);
    player.mana -= played.cost;
    state.pendingAction = null;
    recordEvent(transaction, "costPaid", { mana: played.cost, source: played.name });
    recordEvent(transaction, "cardPlayed", { label: played.name, detail: TYPE_LABELS[played.type], tone: played.faction, cardId: played.id, target });
    log(`${player.kind}使用了 ${played.name}。`);

    if (played.type === "minion") {
      summonMinion(playerIndex, played, target);
    } else if (played.type === "spell") {
      player.counters.spellsThisTurn += 1;
      triggerQuest(playerIndex, "spell", 1, played);
      resolveEffects(playerIndex, played.effects, played, target);
      triggerSpellPassives(playerIndex);
      if (player.summoner.faction === "star" && player.counters.spellsThisTurn % 3 === 0) {
        drawCards(playerIndex, 1);
        addExpedition(playerIndex, 1, "星穹學派能力");
      }
    } else if (played.type === "secret") {
      player.secrets.push(played);
      triggerQuest(playerIndex, "secretOrSilence", 1, played);
      emitVisualEvent("secretTrigger", { label: "秘儀設置", detail: played.name, tone: "secret" });
    } else if (played.type === "artifact") {
      player.artifacts.push(played);
      triggerQuest(playerIndex, "artifact", 1, played);
      resolveEffects(playerIndex, played.effects.filter((effect) => ["damageHero", "upgradeHeroPower"].includes(effect.type)), played, target);
      if (player.summoner.faction === "iron") buffRandomAlly(playerIndex, 1, 1);
    }
    player.discard.push(played.type === "secret" || played.type === "artifact" ? null : played);
    cleanupDiscard(player);
    checkEvolution(playerIndex);
    checkGameOver();
  });
  render();
}

function summonMinion(playerIndex, minion, target = null) {
  const player = state.players[playerIndex];
  if (minion.effects.some((effect) => effect.type === "buffIfArtifact") && player.artifacts.length) {
    minion.currentAttack += 1;
    minion.currentHealth += 1;
  }
  minion.canAttack = minion.stats.speed >= 2 || hasKeyword(minion, "swift");
  player.board.push(minion);
  emitVisualEvent("summon", { label: minion.name, detail: hasKeyword(minion, "guard") ? "守護登場" : "召喚登場", tone: minion.faction });
  triggerQuest(playerIndex, "summon", 1, minion);
  if (minion.tags.includes("dragon")) triggerQuest(playerIndex, "dragonSummon", 1, minion);
  if (hasKeyword(minion, "guard") || hasKeyword(minion, "ward") || minion.shield) triggerQuest(playerIndex, "guardOrWardSummon", 1, minion);
  if (minion.tags.includes("undead")) triggerQuest(playerIndex, "undeadSummon", 1, minion);
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

function keywordsOf(item) {
  if (!item || hasStatus(item, "silenced")) return [];
  const tags = item.tags ?? [];
  const keywords = item.keywords ?? [];
  return [...new Set([...keywords, ...tags.filter((tag) => SUPPORTED_KEYWORDS.has(tag))])];
}

function hasKeyword(item, keyword) {
  return keywordsOf(item).includes(keyword);
}

function hasStatus(item, status) {
  return Boolean(item?.statuses?.includes(status));
}

function addStatus(item, status) {
  if (!item || !SUPPORTED_STATUSES.has(status)) return;
  item.statuses ??= [];
  if (!item.statuses.includes(status)) item.statuses.push(status);
  if (status === "stunned" || status === "cannotAttack") item.canAttack = false;
  recordEvent(currentTransaction, "statusApplied", { label: statusLabel(status), detail: item.name, tone: "status", status });
}

function removeStatus(item, status) {
  if (!item?.statuses) return;
  item.statuses = item.statuses.filter((entry) => entry !== status);
}

function statusLabel(status) {
  return {
    silenced: "沉默",
    stunned: "暈眩",
    cannotAttack: "不能攻擊",
    deathrattleDisabled: "死亡效果封鎖",
    temporaryBuff: "暫時增益",
  }[status] ?? status;
}

function cleanupTemporaryBuffs(playerIndex) {
  const player = state.players[playerIndex];
  for (const minion of player.board) {
    for (const buff of minion.temporaryBuffs ?? []) {
      minion.currentAttack -= buff.attack ?? 0;
      minion.currentHealth -= buff.health ?? 0;
    }
    minion.temporaryBuffs = [];
    removeStatus(minion, "temporaryBuff");
    if (minion.currentHealth <= 0) killMinion(playerIndex, minion.uid, { name: "臨時增益消退", effects: [] });
  }
}

function resolveEffects(playerIndex, effects, source, target = null) {
  for (const effect of effects) {
    if (effect.type === "damage") damageTarget(playerIndex, target, effect.amount, source);
    if (effect.type === "damageAllyMinion") damageFirstAllyMinion(playerIndex, effect.amount, source);
    if (effect.type === "damageAllEnemies") damageAllEnemies(playerIndex, effect.amount, source);
    if (effect.type === "damageHero") damageHero(1 - playerIndex, effect.amount, playerIndex);
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
    if (effect.type === "stunTarget") stunTarget(target);
    if (effect.type === "disableDeathrattle") disableDeathrattle(target);
    if (effect.type === "temporaryBuff") temporaryBuffTarget(playerIndex, target, effect.attack, effect.health);
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
    if (effect.type === "silenceMinion") {
      silenceMinion(target);
      triggerQuest(playerIndex, "secretOrSilence", 1, source);
    }
    if (effect.type === "destroyArtifact") destroyEnemyArtifact(playerIndex);
    if (effect.type === "startTurnHeal") {
      // Passive artifact effect; resolved from triggerTurnStartPassives.
    }
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
  emitVisualEvent("heal", { label: `+${amount}`, amount, detail: minion.name, tone: "heal", target });
  triggerQuest(target.ownerIndex, "heal", amount);
}

function gainShield(target) {
  if (!target || target.type !== "minion") return;
  const minion = state.players[target.ownerIndex].board.find((item) => item.uid === target.uid);
  if (minion) {
    minion.shield = true;
    emitVisualEvent("shield", { label: "護盾", detail: minion.name, tone: "shield", target });
  }
}

function gainShieldBestAlly(playerIndex) {
  const minion = [...state.players[playerIndex].board].sort((a, b) => b.currentAttack + b.currentHealth - (a.currentAttack + a.currentHealth))[0];
  if (minion) {
    minion.shield = true;
    emitVisualEvent("shield", { label: "護盾", detail: minion.name, tone: "shield", target: { type: "minion", ownerIndex: playerIndex, uid: minion.uid } });
  }
}

function stunTarget(target) {
  if (!target || target.type !== "minion") return;
  const minion = state.players[target.ownerIndex].board.find((item) => item.uid === target.uid);
  if (!minion) return;
  addStatus(minion, "stunned");
  log(`${minion.name} 被暈眩。`);
}

function disableDeathrattle(target) {
  if (!target || target.type !== "minion") return;
  const minion = state.players[target.ownerIndex].board.find((item) => item.uid === target.uid);
  if (!minion) return;
  addStatus(minion, "deathrattleDisabled");
  log(`${minion.name} 的死亡效果被封鎖。`);
}

function temporaryBuffTarget(playerIndex, target, attack = 0, health = 0) {
  if (!target || target.ownerIndex !== playerIndex || target.type !== "minion") return;
  const minion = state.players[playerIndex].board.find((item) => item.uid === target.uid);
  if (!minion) return;
  minion.currentAttack += attack;
  minion.currentHealth += health;
  minion.temporaryBuffs ??= [];
  minion.temporaryBuffs.push({ attack, health });
  addStatus(minion, "temporaryBuff");
  log(`${minion.name} 獲得暫時 +${attack}/+${health}。`);
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
  addStatus(minion, "silenced");
  addStatus(minion, "deathrattleDisabled");
  minion.effects = [];
  minion.tags = minion.tags.filter((tag) => tag !== "guard");
  minion.keywords = [];
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
  damageHero(targetPlayerIndex, finalAmount, sourcePlayerIndex);
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
        emitVisualEvent("secretTrigger", { label: wardSecret.name, detail: "賦予護盾", tone: "secret" });
        log(`${targetPlayer.kind}的 ${wardSecret.name} 賦予了護盾。`);
      }
    }
  }
  const shield = targetPlayer.secrets.find((secret) => secret.effects.some((effect) => effect.type === "spellShield"));
  if (shield && sourcePlayerIndex !== targetPlayerIndex && source.type === "spell") {
    targetPlayer.secrets = targetPlayer.secrets.filter((item) => item.uid !== shield.uid);
    drawCards(targetPlayerIndex, 1);
    emitVisualEvent("secretTrigger", { label: shield.name, detail: "抵銷法術傷害", tone: "secret" });
    log(`${targetPlayer.kind}的 ${shield.name} 抵銷了傷害。`);
    return Math.max(0, amount - 2);
  }
  return amount;
}

function damageEnemy(playerIndex, amount, source) {
  const opponent = state.players[1 - playerIndex];
  let finalAmount = amount + spellDamageBonus(playerIndex, source);
  finalAmount = consumeSpellShield(playerIndex, 1 - playerIndex, finalAmount, source);
  const guard = opponent.board.find((minion) => hasKeyword(minion, "guard"));
  if (guard) damageMinion(1 - playerIndex, guard.uid, finalAmount, source);
  else damageHero(1 - playerIndex, finalAmount, playerIndex);
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
  emitVisualEvent("secretTrigger", { label: snare.name, detail: summoned.name, tone: "secret" });
  log(`${opponent.kind}的 ${snare.name} 拘束了 ${summoned.name}。`);
}

function damageHero(playerIndex, amount, sourcePlayerIndex = null) {
  state.players[playerIndex].hp -= amount;
  if (amount > 0) emitVisualEvent("damage", { label: `-${amount}`, amount, detail: playerIndex === 0 ? "我方英雄" : "敵方英雄", tone: "damage", target: { type: "hero", ownerIndex: playerIndex } });
  if (typeof sourcePlayerIndex === "number" && sourcePlayerIndex !== playerIndex && amount > 0) {
    triggerQuest(sourcePlayerIndex, "heroDamage", amount);
  }
  checkGameOver();
}

function healHero(playerIndex, amount) {
  state.players[playerIndex].hp = Math.min(30, state.players[playerIndex].hp + amount);
  emitVisualEvent("heal", { label: `+${amount}`, amount, detail: playerIndex === 0 ? "我方英雄" : "敵方英雄", tone: "heal", target: { type: "hero", ownerIndex: playerIndex } });
  triggerQuest(playerIndex, "heal", amount);
}

function damageMinion(ownerIndex, uidToDamage, amount, source = null) {
  const owner = state.players[ownerIndex];
  const minion = owner.board.find((item) => item.uid === uidToDamage);
  if (!minion) return;
  if (minion.shield && amount > 0) {
    minion.shield = false;
    emitVisualEvent("shieldBreak", { label: "護盾抵銷", detail: minion.name, tone: "shield", target: { type: "minion", ownerIndex, uid: minion.uid } });
    log(`${minion.name} 的護盾抵銷了傷害。`);
    return;
  }
  minion.currentHealth -= amount;
  if (amount > 0) emitVisualEvent("damage", { label: `-${amount}`, amount, detail: minion.name, tone: "damage", target: { type: "minion", ownerIndex, uid: minion.uid } });
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
  recordEvent(currentTransaction, "minionDied", { label: dead.name, detail: owner.kind, tone: dead.faction, uid: dead.uid });
  triggerQuest(ownerIndex, "death", 1, dead);
  log(`${dead.name} 被擊敗。`);
  const deathrattleEnabled = !hasStatus(dead, "deathrattleDisabled");
  const drawOnDeath = deathrattleEnabled ? dead.effects.find((effect) => effect.type === "drawOnDeath") : null;
  if (drawOnDeath) drawCards(ownerIndex, drawOnDeath.amount);
  const summonOnDeath = deathrattleEnabled ? dead.effects.find((effect) => effect.type === "summonOnDeath") : null;
  if (summonOnDeath) summonToken(ownerIndex, summonOnDeath.token);
  const reviveOnDeath = deathrattleEnabled ? dead.effects.find((effect) => effect.type === "reviveOnDeath") : null;
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
  emitVisualEvent("summon", { label: token.name, detail: "衍生物登場", tone: token.faction });
  triggerQuest(playerIndex, "summon", 1, token);
  if (token.tags.includes("dragon")) triggerQuest(playerIndex, "dragonSummon", 1, token);
  if (hasKeyword(token, "guard") || hasKeyword(token, "ward") || token.shield) triggerQuest(playerIndex, "guardOrWardSummon", 1, token);
  if (token.tags.includes("undead")) triggerQuest(playerIndex, "undeadSummon", 1, token);
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

function triggerTurnStartPassives(playerIndex) {
  withTransaction("turnStart", playerIndex, { name: PHASE_LABELS.startTurn, type: "phase", faction: state.players[playerIndex].summoner.faction }, () => {
    const player = state.players[playerIndex];
    for (const minion of player.board) {
      const heal = minion.effects.find((effect) => effect.type === "startTurnHeal");
      if (heal) healHero(playerIndex, heal.amount);
      const buff = minion.effects.find((effect) => effect.type === "startTurnBuffBeasts");
      if (buff) {
        for (const ally of player.board.filter((item) => item.tags.includes("beast"))) {
          ally.currentAttack += buff.attack;
          ally.currentHealth += buff.health;
          recordEvent(currentTransaction, "statusApplied", { label: "獸群成長", detail: ally.name, tone: player.summoner.faction });
        }
      }
    }
    for (const artifact of player.artifacts) {
      const heal = artifact.effects.find((effect) => effect.type === "startTurnHeal");
      if (heal) healHero(playerIndex, heal.amount);
      const shield = artifact.effects.find((effect) => effect.type === "startTurnShield");
      if (shield) gainShieldBestAlly(playerIndex);
    }
  });
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
    emitVisualEvent("summon", { label: revived.name, detail: "復活登場", tone: revived.faction });
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
  if (!attacker || !attacker.canAttack || attacker.attackedThisTurn || hasStatus(attacker, "stunned") || hasStatus(attacker, "cannotAttack")) return;

  withTransaction("attack", playerIndex, attacker, (transaction) => {
    state.phase = "combat";
    player.phase = "combat";
    recordEvent(transaction, "attackDeclared", { label: attacker.name, detail: targetUid ? "攻擊召喚物" : "攻擊英雄", tone: "damage", attackerUid, targetUid });

    const flameCounter = !targetUid ? opponent.secrets.find((secret) => secret.effects.some((effect) => effect.type === "flameCounter")) : null;
    if (flameCounter) {
      opponent.secrets = opponent.secrets.filter((item) => item.uid !== flameCounter.uid);
      emitVisualEvent("secretTrigger", { label: flameCounter.name, detail: "反擊攻擊者", tone: "secret" });
      damageMinion(playerIndex, attacker.uid, 3, flameCounter);
      log(`${opponent.kind}的 ${flameCounter.name} 反擊了攻擊者。`);
      if (!player.board.some((item) => item.uid === attacker.uid)) return;
    }

    const ambush = opponent.secrets.find((secret) => secret.effects.some((effect) => effect.type === "ambushGuard"));
    if (ambush) {
      opponent.secrets = opponent.secrets.filter((item) => item.uid !== ambush.uid);
      emitVisualEvent("secretTrigger", { label: ambush.name, detail: "召喚伏兵", tone: "secret" });
      summonToken(1 - playerIndex, "fawn");
      const guardToken = opponent.board[opponent.board.length - 1];
      if (guardToken) {
        guardToken.tags.push("guard");
        if (!guardToken.keywords.includes("guard")) guardToken.keywords.push("guard");
        targetUid = guardToken.uid;
        recordEvent(transaction, "targetChanged", { label: "守護改變目標", detail: guardToken.name, tone: "secret", targetUid });
      }
      log(`${opponent.kind}的 ${ambush.name} 召喚守護伏兵。`);
    }

    const redirect = opponent.secrets.find((secret) => secret.effects.some((effect) => effect.type === "redirectAttack"));
    if (redirect) {
      opponent.secrets = opponent.secrets.filter((item) => item.uid !== redirect.uid);
      emitVisualEvent("secretTrigger", { label: redirect.name, detail: "轉移攻擊", tone: "secret" });
      summonToken(1 - playerIndex, "wraith");
      const wraith = opponent.board[opponent.board.length - 1];
      targetUid = wraith?.uid ?? targetUid;
      recordEvent(transaction, "targetChanged", { label: "攻擊目標改變", detail: wraith?.name ?? "亡魂", tone: "secret", targetUid });
      log(`${opponent.kind}的 ${redirect.name} 轉移了攻擊。`);
    }

    const guard = opponent.board.find((item) => hasKeyword(item, "guard"));
    if (guard && targetUid !== guard.uid) {
      targetUid = guard.uid;
      recordEvent(transaction, "targetChanged", { label: "守護強制目標", detail: guard.name, tone: "shield", targetUid });
    }

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
      if (!hadShield && hasKeyword(attacker, "overwhelm") && totalAttack > beforeHealth) damageHero(1 - playerIndex, totalAttack - beforeHealth, playerIndex);
      if (attacker.currentHealth <= 0) killMinion(playerIndex, attacker.uid, target);
    } else {
      damageHero(1 - playerIndex, totalAttack, playerIndex);
    }
    if (hasKeyword(attacker, "lifesteal")) healHero(playerIndex, totalAttack);

    for (const artifact of player.artifacts) {
      const effect = artifact.effects.find((item) => item.type === "firstAttackExpedition");
      if (effect && !player.counters.firstAttackExpeditionUsed) {
        player.counters.firstAttackExpeditionUsed = true;
        addExpedition(playerIndex, effect.amount, artifact.name);
      }
    }
    state.phase = "main";
    player.phase = "main";
    checkGameOver();
  });
}

function isLegalAttackTarget(playerIndex, target) {
  if (!target || target.ownerIndex !== 1 - playerIndex) return false;
  const opponent = state.players[1 - playerIndex];
  const guard = opponent.board.find((item) => hasKeyword(item, "guard"));
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
  recordEvent(currentTransaction, "questAdvanced", { label: `遠征 +${amount}`, detail: source, tone: player.summoner.faction, amount });
  log(`${player.kind}因 ${source} 推進遠征軌 +${amount}。`);
  checkEvolution(playerIndex);
}

function triggerQuest(playerIndex, trigger, amount = 1, source = null) {
  const player = state.players[playerIndex];
  const quest = QUEST_LINES.find((item) => item.id === player.questId);
  if (!quest || player.questCompleted || quest.trigger !== trigger) return;
  player.questProgress = Math.min(quest.threshold, player.questProgress + amount);
  if (player.questProgress < quest.threshold) return;
  player.questCompleted = true;
  addExpedition(playerIndex, 1, quest.name);
  resolveQuestReward(playerIndex, quest.reward, source);
  log(`${player.kind}完成任務：${quest.name}。`);
}

function resolveQuestReward(playerIndex, reward, source = null) {
  if (!reward) return;
  if (reward.type === "draw") drawCards(playerIndex, reward.amount);
  if (reward.type === "damageHero") damageHero(1 - playerIndex, reward.amount, playerIndex);
  if (reward.type === "summonToken") summonToken(playerIndex, reward.token);
  if (reward.type === "buffAll") buffAll(playerIndex, reward.attack, reward.health);
  if (reward.type === "shield") {
    gainShieldBestAlly(playerIndex);
    drawCards(playerIndex, reward.amount ?? 1);
  }
}

function checkEvolution(playerIndex) {
  const player = state.players[playerIndex];
  const needed = nextEvolutionThreshold(player);
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
  if (player.hp <= 14 && (effectTypes.includes("healHero") || effectTypes.includes("healTarget") || hasKeyword(choice, "guard"))) score += 6;
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
    button.className = `card evolution ${evolutionClass(choice)}`;
    button.setAttribute("style", cardVisualStyle(choice));
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
  withTransaction("evolution", playerIndex, selected, (transaction) => {
    player.selectedEvolutions.push(selected.id);
    player.evolutionCount += 1;
    player.pendingEvolution = null;
    const newCard = cloneCard(selected);
    if (selected.immediate && player.hand.length < 10) player.hand.push(newCard);
    else player.deck.splice(Math.floor(rng() * (player.deck.length + 1)), 0, newCard);
    recordEvent(transaction, "evolutionUnlocked", { label: selected.name, detail: selected.immediate ? "加入手牌" : "洗入牌組", tone: selected.faction, cardId: selected.id });
    log(`${player.kind}選擇進化：${selected.name}。`);
    state.waitingForEvolution = false;
    if (!state.simulating) els.evoModal.classList.add("hidden");
  });
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
    const guard = opponent.board.find((item) => hasKeyword(item, "guard"));
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
  const guard = opponent.board.find((item) => hasKeyword(item, "guard"));
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

function beginTransaction(kind, actorIndex, source = null) {
  const transaction = {
    id: `tx${++transactionUid}`,
    kind,
    actorIndex,
    source: source ? { id: source.id, uid: source.uid, name: source.name, type: source.type, faction: source.faction } : null,
    events: [],
    triggerCount: 0,
  };
  currentTransaction = transaction;
  recordEvent(transaction, "start", { label: source?.name ?? eventLabel(kind), tone: source?.faction, kind });
  return transaction;
}

function recordEvent(transaction, type, payload = {}) {
  if (!transaction) return;
  transaction.events.push({ type, payload, order: transaction.events.length });
}

function commitTransaction(transaction) {
  if (!transaction) return;
  recordEvent(transaction, "end", { label: "結算完成", kind: transaction.kind });
  if (state?.transactions) state.transactions = [transaction, ...state.transactions].slice(0, 25);
  if (currentTransaction === transaction) currentTransaction = null;
  if (!hasDom || state?.simulating) return;
  queueVisualTimeline(buildVisualTimeline(transaction));
}

function withTransaction(kind, actorIndex, source, callback) {
  if (currentTransaction) return callback(currentTransaction);
  const transaction = beginTransaction(kind, actorIndex, source);
  try {
    return callback(transaction);
  } finally {
    if (state?.players?.[actorIndex] && ["attack", "heroPower", "playCard"].includes(kind)) {
      if (state.phase !== "endTurn" && state.phase !== "cleanup") {
        state.phase = "main";
        state.players[actorIndex].phase = "main";
      }
    }
    commitTransaction(transaction);
  }
}

function emitVisualEvent(type, payload = {}) {
  if (!state) return;
  const eventType = visualTypeToRuleEvent(type);
  if (currentTransaction) {
    recordEvent(currentTransaction, eventType, { ...payload, visualType: type });
    return;
  }
  if (!hasDom || state.simulating) return;
  const transaction = {
    id: `tx${++transactionUid}`,
    kind: type,
    actorIndex: state.active ?? 0,
    source: null,
    events: [
      { type: "start", payload: { label: payload.label ?? eventLabel(type), tone: payload.tone, kind: type }, order: 0 },
      { type: eventType, payload: { ...payload, visualType: type }, order: 1 },
      { type: "end", payload: { label: "結算完成", kind: type }, order: 2 },
    ],
  };
  queueVisualTimeline(buildVisualTimeline(transaction));
}

function visualTypeToRuleEvent(type) {
  return {
    playCard: "cardPlayed",
    attack: "attackDeclared",
    damage: "damageApplied",
    heal: "healingApplied",
    shield: "shieldGained",
    shieldBreak: "shieldBroken",
    secretTrigger: "secretTriggered",
    summon: "minionSummoned",
    evolution: "evolutionUnlocked",
  }[type] ?? type;
}

function queueVisualTimeline(steps) {
  if (!hasDom || !steps.length || state?.simulating) return;
  for (const step of steps) visualQueue.push({ ...step, id: `${step.transactionId}-${step.index}` });
  if (state) state.visualQueue = visualQueue;
  scheduleVisualQueue();
}

function buildVisualTimeline(transaction) {
  const events = transaction.events.filter((event) => !["start", "end", "costPaid"].includes(event.type));
  if (!events.length) return [];
  const steps = [];
  const pushStep = (type, label, detail, tone, items = []) => {
    steps.push({
      type,
      payload: { label, detail, tone, items, hint: label },
      transactionId: transaction.id,
      index: steps.length,
    });
  };

  const first = events.find((event) => ["cardPlayed", "heroPowerUsed", "attackDeclared"].includes(event.type));
  if (first) {
    const type = first.type === "cardPlayed" ? "playCard" : first.type === "heroPowerUsed" ? "heroPower" : "attack";
    pushStep(type, first.payload.label ?? eventLabel(type), first.payload.detail ?? "", first.payload.tone ?? transaction.source?.faction);
  }

  const secrets = events.filter((event) => ["secretTriggered", "targetChanged"].includes(event.type));
  if (secrets.length) {
    const label = secrets.length === 1 ? secrets[0].payload.label : `${secrets.length} 個反制/改目標`;
    const detail = secrets.map((event) => event.payload.detail || event.payload.label).filter(Boolean).join("、");
    pushStep("secretTrigger", label, detail, "secret", secrets);
  }

  const shields = events.filter((event) => ["shieldBroken", "shieldGained", "statusApplied"].includes(event.type));
  if (shields.length) {
    const broken = shields.filter((event) => event.type === "shieldBroken").length;
    const gained = shields.filter((event) => event.type === "shieldGained").length;
    const label = broken ? `${broken} 次護盾抵銷` : gained ? `${gained} 次護盾` : "狀態變化";
    const detail = shields.map((event) => event.payload.detail || event.payload.label).filter(Boolean).join("、");
    pushStep(broken ? "shieldBreak" : "shield", label, detail, broken ? "shield" : "status", shields);
  }

  const damage = events.filter((event) => event.type === "damageApplied");
  if (damage.length) {
    pushStep("damage", `-${sumTimelineNumbers(damage)}`, `${damage.length} 個傷害目標`, "damage", damage);
  }

  const healing = events.filter((event) => event.type === "healingApplied");
  if (healing.length) {
    pushStep("heal", `+${sumTimelineNumbers(healing)}`, `${healing.length} 個治療目標`, "heal", healing);
  }

  const deaths = events.filter((event) => event.type === "minionDied");
  const summons = events.filter((event) => event.type === "minionSummoned");
  if (deaths.length || summons.length) {
    const label = deaths.length && summons.length ? `${deaths.length} 死亡 / ${summons.length} 召喚` : deaths.length ? `${deaths.length} 個召喚物死亡` : `${summons.length} 次召喚`;
    const detail = [...deaths, ...summons].map((event) => event.payload.label).filter(Boolean).join("、");
    pushStep(summons.length ? "summon" : "death", label, detail, summons[0]?.payload.tone ?? deaths[0]?.payload.tone ?? "summon", [...deaths, ...summons]);
  }

  const progress = events.filter((event) => ["questAdvanced", "evolutionUnlocked"].includes(event.type));
  if (progress.length) {
    const evo = progress.find((event) => event.type === "evolutionUnlocked");
    const label = evo ? evo.payload.label : progress[0].payload.label ?? "遠征推進";
    const detail = progress.map((event) => event.payload.detail || event.payload.label).filter(Boolean).join("、");
    pushStep(evo ? "evolution" : "quest", label, detail, evo?.payload.tone ?? "evolution", progress);
  }

  return compactTimeline(steps, transaction.kind);
}

function scheduleVisualQueue() {
  if (visualBusy || visualProcessTimer) return;
  visualProcessTimer = window.setTimeout(() => {
    visualProcessTimer = null;
    processVisualQueue();
  }, 0);
}

function processVisualQueue() {
  if (visualBusy || !els.visualOverlay) return;
  const event = visualQueue.shift() ?? null;
  if (state) state.visualQueue = visualQueue;
  if (!event) return;
  visualBusy = true;
  renderActionHint(eventHint(event));
  if (currentAnimationDuration() === 0) {
    visualBusy = false;
    if (!visualQueue.length) renderActionHint();
    processVisualQueue();
    return;
  }
  const node = buildVisualNode(event);
  els.visualOverlay.append(node);
  window.setTimeout(() => {
    node.remove();
    visualBusy = false;
    if (!visualQueue.length) renderActionHint();
    scheduleVisualQueue();
  }, currentAnimationDuration());
}

function compactTimeline(steps, kind) {
  const maxSteps = ANIMATION_SETTINGS.maxSteps[animationDetail] ?? ANIMATION_SETTINGS.maxSteps.standard;
  if (steps.length <= maxSteps) return steps.map((step, index) => ({ ...step, index }));
  if (animationDetail === "compact") {
    const first = steps[0];
    const last = steps.find((step) => ["evolution", "quest", "summon"].includes(step.type)) ?? steps[steps.length - 1];
    const middle = mergeTimelineSteps(steps.slice(1, -1), kind);
    return [first, middle, last].filter(Boolean).slice(0, maxSteps).map((step, index) => ({ ...step, index }));
  }
  const head = steps.slice(0, maxSteps - 1);
  const tail = mergeTimelineSteps(steps.slice(maxSteps - 1), kind);
  return [...head, tail].filter(Boolean).map((step, index) => ({ ...step, index }));
}

function mergeTimelineSteps(steps, kind) {
  if (!steps.length) return null;
  const items = steps.flatMap((step) => step.payload.items ?? []);
  return {
    type: "summary",
    payload: {
      label: `${steps.length} 段連鎖結算`,
      detail: steps.map((step) => step.payload.label).join("、"),
      tone: kind,
      items,
      hint: "連鎖結算",
    },
    transactionId: steps[0].transactionId,
    index: steps[0].index,
  };
}

function sumTimelineNumbers(events) {
  return events.reduce((sum, event) => sum + Math.abs(Number(String(event.payload.label ?? "").replace(/[^0-9.-]/g, "")) || Number(event.payload.amount) || 0), 0);
}

function buildVisualNode(event) {
  const node = document.createElement("div");
  const tone = event.payload.tone ?? event.type;
  node.className = `visual-event ${event.type} tone-${tone}`;
  const itemLine = event.payload.items?.length > 1 ? `<small>${event.payload.items.map((item) => item.payload?.detail || item.payload?.label).filter(Boolean).slice(0, 4).join(" · ")}</small>` : "";
  node.innerHTML = `
    ${effectImage(event)}
    <strong>${event.payload.label ?? eventLabel(event.type)}</strong>
    <span>${event.payload.detail ?? ""}</span>
    ${itemLine}
    ${event.type === "attack" ? `<i class="attack-streak"></i>` : ""}
  `;
  return node;
}

function effectImage(event) {
  const effectKey = {
    damage: "damage",
    heal: "heal",
    shield: "shieldBreak",
    shieldBreak: "shieldBreak",
    secretTrigger: "secret",
    evolution: "evolution",
    summon: "evolution",
    death: "damage",
    quest: "evolution",
    heroPower: "evolution",
    summary: "evolution",
    playCard: "evolution",
    attack: "damage",
  }[event.type] ?? "evolution";
  return `<img src="${ART_MANIFEST.effects[effectKey]}" alt="" />`;
}

function eventLabel(type) {
  const labels = {
    attack: "進攻",
    damage: "傷害",
    heal: "治療",
    heroPower: "召喚師技能",
    playCard: "出牌",
    secretTrigger: "秘儀觸發",
    shield: "護盾",
    shieldBreak: "護盾破裂",
    summon: "召喚",
    death: "死亡",
    quest: "任務推進",
    summary: "連鎖結算",
    evolution: "進化突破",
  };
  return labels[type] ?? "戰況";
}

function eventHint(event) {
  return event.payload.hint ?? event.payload.label ?? eventLabel(event.type);
}

function renderActionHint(text = null) {
  if (!els.actionHint) return;
  els.actionHint.textContent = text ?? currentActionHint();
}

function currentActionHint() {
  if (!state) return "準備遠征";
  if (state.waitingForEvolution) return "進化突破：選擇一張牌";
  if (state.pendingAction?.type === "attackTarget") return "選擇攻擊目標";
  if (state.pendingAction?.type === "heroPowerTarget") return "選擇召喚師技能目標";
  if (state.pendingAction?.type === "cardTarget") return "選擇卡牌目標";
  if (state.gameOver) return "對局結束";
  return state.active === 0 ? "你的回合：出牌、攻擊或結束回合" : "對手行動中";
}

function currentAnimationDuration() {
  return ANIMATION_SETTINGS.durations[animationSpeed] ?? ANIMATION_SETTINGS.durations.normal;
}

function loadAnimationSpeed() {
  if (!hasDom) return "normal";
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const stored = localStorage.getItem(ANIMATION_SETTINGS.speedStorageKey);
  if (["normal", "fast", "off"].includes(stored)) return stored;
  return reduced ? "fast" : "normal";
}

function setAnimationSpeed(value) {
  animationSpeed = ["normal", "fast", "off"].includes(value) ? value : "normal";
  if (hasDom) {
    localStorage.setItem(ANIMATION_SETTINGS.speedStorageKey, animationSpeed);
    document.documentElement.dataset.animationSpeed = animationSpeed;
    if (els.animationSpeed) els.animationSpeed.value = animationSpeed;
  }
}

function loadAnimationDetail() {
  if (!hasDom) return "standard";
  const stored = localStorage.getItem(ANIMATION_SETTINGS.detailStorageKey);
  return ["compact", "standard", "full"].includes(stored) ? stored : "standard";
}

function setAnimationDetail(value) {
  animationDetail = ["compact", "standard", "full"].includes(value) ? value : "standard";
  if (hasDom) {
    localStorage.setItem(ANIMATION_SETTINGS.detailStorageKey, animationDetail);
    document.documentElement.dataset.animationDetail = animationDetail;
    if (els.animationDetail) els.animationDetail.value = animationDetail;
  }
}

function runBalanceSimulation(gameCount = 50) {
  const summary = runHeadlessSimulation(gameCount, { seed: 101 });
  renderBalanceSummary(summary);
  render();
}

export function runHeadlessSimulation(gameCount = 50, options = {}) {
  const previousState = state;
  const previousRng = rng;
  const previousUid = uid;
  if (typeof options.seed === "number") setRandomSeed(options.seed);
  const results = [];
  for (let i = 0; i < gameCount; i++) {
    if (options.archetypes) {
      const firstRecipe = DECK_ARCHETYPES[i % DECK_ARCHETYPES.length];
      const secondRecipe = DECK_ARCHETYPES[(i + 3) % DECK_ARCHETYPES.length];
      results.push(simulateGame(firstRecipe.summonerId, secondRecipe.summonerId, { ...options, firstRecipe, secondRecipe }));
    } else {
      const pairIndex = i % SUMMONERS.length;
      const cycle = Math.floor(i / SUMMONERS.length);
      let first = SUMMONERS[pairIndex].id;
      let second = SUMMONERS[(pairIndex + 2) % SUMMONERS.length].id;
      if (cycle % 2 === 1) [first, second] = [second, first];
      results.push(simulateGame(first, second, options));
    }
  }
  state = previousState;
  rng = previousRng;
  uid = previousUid;
  return summarizeSimulationResults(results);
}

export function simulateGame(firstSummonerId, secondSummonerId, options = {}) {
  uid = 0;
  state = {
    players: [createPlayer("先手", firstSummonerId, options.firstRecipe), createPlayer("後手", secondSummonerId, options.secondRecipe)],
    active: 0,
    turn: 1,
    logs: [],
    gameOver: false,
    waitingForEvolution: false,
    pendingAction: null,
    visualQueue: [],
    transactions: [],
    phase: "main",
    simulating: true,
  };
  drawCards(0, 4);
  drawCards(1, 4);
  state.players[1].hp = 30;
  state.players[1].hand.push(cloneCard(COIN_CARD), cloneCard(SECOND_SUPPLY_CARD));
  startTurn(0);
  let safety = 0;
  const maxTurns = options.maxTurns ?? 30;
  const maxActions = options.maxActions ?? 120;
  let emptyHandTurns = 0;
  let peakBoardAttackGap = 0;
  while (!state.gameOver && state.turn <= maxTurns && safety < maxActions) {
    safety += 1;
    runAiActions(state.active);
    emptyHandTurns += state.players.filter((player) => player.hand.length === 0).length;
    peakBoardAttackGap = Math.max(peakBoardAttackGap, Math.abs(boardAttack(state.players[0]) - boardAttack(state.players[1])));
    if (state.gameOver) break;
    const next = state.active === 0 ? 1 : 0;
    cleanupTemporaryBuffs(state.active);
    if (next === 0) state.turn += 1;
    startTurn(next);
  }
  const winner = state.players[0].hp === state.players[1].hp ? -1 : state.players[0].hp > state.players[1].hp ? 0 : 1;
  return {
    winner,
    turns: state.turn,
    evolutions: state.players[0].evolutionCount + state.players[1].evolutionCount,
    handCards: state.players[0].hand.length + state.players[1].hand.length,
    emptyHandTurns,
    peakBoardAttackGap,
    quests: state.players.map((player) => ({ questId: player.questId, progress: player.questProgress, completed: player.questCompleted })),
    firstFaction: state.players[0].summoner.faction,
    secondFaction: state.players[1].summoner.faction,
    stalled: safety >= maxActions || state.turn > maxTurns,
    failureReason: safety >= maxActions ? "action-limit" : state.turn > maxTurns ? "turn-limit" : null,
  };
}

export function summarizeSimulationResults(results) {
  const total = results.length || 1;
  const firstWins = results.filter((item) => item.winner === 0).length;
  const secondWins = results.filter((item) => item.winner === 1).length;
  const stalled = results.filter((item) => item.stalled).length;
  return {
    total,
    firstWins,
    secondWins,
    stalled,
    avgTurns: average(results.map((item) => item.turns)),
    avgEvolutions: average(results.map((item) => item.evolutions)),
    avgHand: average(results.map((item) => item.handCards / 2)),
    emptyHandRate: average(results.map((item) => item.emptyHandTurns / Math.max(1, item.turns * 2))),
    avgPeakBoardAttackGap: average(results.map((item) => item.peakBoardAttackGap)),
    failures: results.filter((item) => item.failureReason),
    results,
  };
}

function renderBalanceSummary(summary) {
  const { total, firstWins, secondWins, stalled, avgTurns, avgEvolutions, avgHand, emptyHandRate, avgPeakBoardAttackGap } = Array.isArray(summary)
    ? summarizeSimulationResults(summary)
    : summary;
  els.balanceSummary.innerHTML = `
    <div><strong>${total}</strong><span>模擬場數</span></div>
    <div><strong>${avgTurns.toFixed(1)}</strong><span>平均回合</span></div>
    <div><strong>${avgEvolutions.toFixed(1)}</strong><span>平均總進化</span></div>
    <div><strong>${avgHand.toFixed(1)}</strong><span>平均手牌</span></div>
    <div><strong>${Math.round((firstWins / total) * 100)}%</strong><span>先手勝率</span></div>
    <div><strong>${Math.round((secondWins / total) * 100)}%</strong><span>後手勝率</span></div>
    <div><strong>${Math.round(emptyHandRate * 100)}%</strong><span>空手回合率</span></div>
    <div><strong>${avgPeakBoardAttackGap.toFixed(1)}</strong><span>場攻雪球</span></div>
    <div class="wide"><strong>${stalled}</strong><span>卡死或超時局</span></div>
  `;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

function render() {
  if (!state || state.simulating) return;
  const [player, opponent] = state.players;
  applyArenaTheme(player, opponent);
  els.matchTitle.textContent = `${FACTION_LABELS[player.summoner.faction]} 對 ${FACTION_LABELS[opponent.summoner.faction]}`;
  renderPlayerArea(els.playerArea, player);
  renderPlayerArea(els.opponentArea, opponent, true);
  renderBoard(els.playerBoard, player, 0);
  renderBoard(els.opponentBoard, opponent, 1);
  renderArtifacts(els.playerArtifacts, player);
  renderArtifacts(els.opponentArtifacts, opponent);
  renderHand();
  renderMetrics();
  renderActionHint();
  els.log.innerHTML = state.logs.map((item) => `<div>${item}</div>`).join("");
  els.endTurn.disabled = state.active !== 0 || state.waitingForEvolution || state.pendingAction || state.gameOver;
}

function renderPlayerArea(container, player, isOpponent = false) {
  const ownerIndex = isOpponent ? 1 : 0;
  const heroTargetClass = getHeroTargetClass(ownerIndex);
  const power = currentHeroPower(ownerIndex);
  const powerDisabled = ownerIndex !== 0 || !canUseHeroPower(ownerIndex);
  const quest = QUEST_LINES.find((item) => item.id === player.questId);
  const awakened = player.awakenedPowers.length ? `<div class="awakened">覺醒：${player.awakenedPowers.map((mode) => FACTION_LABELS[mode]).join("、")}</div>` : "";
  const theme = themeFor(player.summoner.faction);
  container.setAttribute("style", `--card-primary:${theme.primary};--card-accent:${theme.accent};--card-surface:${theme.surface};`);
  container.innerHTML = `
    <button class="hero-panel ${heroTargetClass}" type="button">
      <img class="hero-portrait" src="${theme.summonerPortrait}" alt="" />
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
    <div class="stat-panel quest-stat"><strong>${player.questCompleted ? "完成" : `${player.questProgress}/${quest?.threshold ?? 0}`}</strong><span>${quest?.name ?? "任務"}</span></div>
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
    node.setAttribute("style", cardVisualStyle(minion));
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
    node.setAttribute("style", cardVisualStyle(artifact));
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
    node.setAttribute("style", cardVisualStyle(handCard));
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
  const phaseText = PHASE_LABELS[state.phase] ?? PHASE_LABELS[state.players[state.active]?.phase] ?? "主要階段";
  const pendingText = state.pendingAction
    ? state.pendingAction.type === "attackTarget"
      ? "選擇攻擊目標"
      : "選擇卡牌目標"
    : state.active === 0
      ? `玩家回合 · ${phaseText}`
      : `對手回合 · ${phaseText}`;
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
  for (const status of minion.statuses ?? []) classes.push(`status-${status}`);
  return classes.join(" ");
}

function cardMarkup(item) {
  const stats = item.stats ? `<div class="stats"><span>攻 ${item.stats.attack}</span><span>速 ${item.stats.speed}</span><span>命 ${item.stats.health}</span></div>` : "";
  const keywords = keywordMarkup(item.tags);
  const typeIcon = ART_MANIFEST.icons.types[item.type];
  const rarityIcon = item.evolutionTier ? ART_MANIFEST.icons.rarities.evolution : ART_MANIFEST.icons.rarities[item.rarity] ?? ART_MANIFEST.icons.rarities.common;
  const art = resolveCardArt(item);
  const theme = themeFor(item.faction);
  return `
    <div class="card-art" style="background-image: linear-gradient(180deg, rgba(11, 16, 32, .04), rgba(11, 16, 32, .72)), url('${art.image}'); background-position: ${art.focus};">
      <img class="faction-emblem" src="${theme.emblem}" alt="" />
      <img class="rarity-mark" src="${rarityIcon}" alt="" />
    </div>
    <div class="cost">${item.cost}</div>
    <h4>${item.name}</h4>
    <div class="type"><img src="${typeIcon}" alt="" />${TYPE_LABELS[item.type]} · ${FACTION_LABELS[item.faction] ?? item.faction} · ${item.rarity}</div>
    ${keywords}
    <div class="text">${item.text}</div>
    ${stats}
  `;
}

function boardMarkup(item) {
  const theme = themeFor(item.faction);
  return `
    <img class="board-emblem" src="${theme.emblem}" alt="" />
    <h4>${item.name}</h4>
    ${keywordMarkup(keywordsOf(item), item.shield)}
    ${statusMarkup(item)}
    <div class="text">${item.text}</div>
    <div class="stats"><span>攻 ${item.currentAttack}</span><span>速 ${item.stats.speed}</span><span>命 ${item.currentHealth}</span></div>
  `;
}

function keywordMarkup(tags = [], shield = false) {
  const keywordTags = tags.filter((tag) => KEYWORD_LABELS[tag]);
  if (shield && !keywordTags.includes("ward")) keywordTags.push("ward");
  const keywords = keywordTags.map((tag) => ({ tag, label: KEYWORD_LABELS[tag] }));
  if (!keywords.length) return "";
  return `<div class="keywords">${keywords.map(({ tag, label }) => `<span title="${keywordHelp(label)}"><img src="${ART_MANIFEST.icons.keywords[tag]}" alt="" />${label}</span>`).join("")}</div>`;
}

function statusMarkup(item) {
  const statuses = (item.statuses ?? []).filter((status) => SUPPORTED_STATUSES.has(status));
  if (!statuses.length) return "";
  return `<div class="status-badges">${statuses.map((status) => `<span class="status-badge ${status}" title="${statusHelp(status)}">${statusLabel(status)}</span>`).join("")}</div>`;
}

function statusHelp(status) {
  return {
    silenced: "失去文字效果與關鍵字。",
    stunned: "本回合不能攻擊。",
    cannotAttack: "暫時不能攻擊。",
    deathrattleDisabled: "死亡時效果不會觸發。",
    temporaryBuff: "回合結束時移除的增益。",
  }[status] ?? status;
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

function themeFor(faction) {
  return FACTION_THEMES[faction] ?? FACTION_THEMES.neutral;
}

function resolveCardArt(item) {
  const fallback = item.art?.fallback ?? item.faction;
  return {
    image: item.art?.image ?? ART_MANIFEST.fallbackCards[fallback] ?? ART_MANIFEST.fallbackCards.neutral,
    focus: item.art?.focus ?? "center",
  };
}

function cardVisualStyle(item) {
  const theme = themeFor(item.faction);
  return `--card-primary:${theme.primary};--card-accent:${theme.accent};--card-surface:${theme.surface};`;
}

function applyArenaTheme(player, opponent) {
  const playerTheme = themeFor(player.summoner.faction);
  const opponentTheme = themeFor(opponent.summoner.faction);
  els.game.style.setProperty("--player-primary", playerTheme.primary);
  els.game.style.setProperty("--player-accent", playerTheme.accent);
  els.game.style.setProperty("--opponent-primary", opponentTheme.primary);
  els.game.style.setProperty("--arena-art", `url("${playerTheme.battlefieldArt}")`);
}

function evolutionClass(card) {
  if (card.rarity === "覺醒") return "evo-awaken";
  if (card.rarity === "發現") return "evo-discover";
  return "evo-upgrade";
}

function loadDecks() {
  if (!hasDom) return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(DECK_RULES.storageKey) || "[]");
    return Array.isArray(parsed) ? parsed.map(normalizeDeckRecipe) : [];
  } catch {
    return [];
  }
}

function saveDecks(decks) {
  if (!hasDom) return;
  localStorage.setItem(DECK_RULES.storageKey, JSON.stringify(decks.map(normalizeDeckRecipe)));
}

function openBuilder(summonerId, deckId = null) {
  builder.summonerId = summonerId;
  builder.savedDecks = loadDecks();
  builder.filters = { search: "", type: "all", cost: "all", tag: "all" };
  els.builderSearch.value = "";
  els.builderType.value = "all";
  els.builderCost.value = "all";
  els.builderTag.value = "all";
  const candidate = deckId ? findDeck(deckId) : defaultDeckRecipe(summonerId);
  loadBuilderRecipe(candidate?.summonerId === summonerId ? candidate : defaultDeckRecipe(summonerId));
  els.start.classList.add("hidden");
  els.game.classList.add("hidden");
  els.builderScreen.classList.remove("hidden");
  renderBuilder();
}

function findDeck(deckId) {
  if (!deckId) return null;
  if (deckId.startsWith("default-")) return Object.values(DEFAULT_DECK_RECIPES).find((recipe) => recipe.id === deckId) ?? null;
  return builder.savedDecks.find((deck) => deck.id === deckId) ?? null;
}

function loadBuilderRecipe(recipe) {
  builder.recipe = cloneRecipe(normalizeDeckRecipe(recipe));
  builder.activeDeckId = builder.recipe.id;
}

function saveCurrentDeck() {
  const name = els.deckNameInput.value.trim() || builder.recipe.name;
  const now = new Date().toISOString();
  const isDefault = builder.activeDeckId?.startsWith("default-");
  const saved = cloneRecipe(builder.recipe, {
    id: isDefault ? `deck-${Date.now()}` : builder.recipe.id,
    name,
    updatedAt: now,
  });
  const validation = validateDeckRecipe(saved);
  if (!validation.ok) {
    showDeckStatus(validation.errors, false);
    return;
  }
  builder.savedDecks = builder.savedDecks.filter((deck) => deck.id !== saved.id);
  builder.savedDecks.unshift(saved);
  saveDecks(builder.savedDecks);
  loadBuilderRecipe(saved);
  renderBuilder();
}

function copyCurrentDeck() {
  const copied = cloneRecipe(builder.recipe, {
    id: `deck-${Date.now()}`,
    name: `${builder.recipe.name} 複製`,
    updatedAt: new Date().toISOString(),
  });
  builder.savedDecks.unshift(copied);
  saveDecks(builder.savedDecks);
  loadBuilderRecipe(copied);
  renderBuilder();
}

function deleteCurrentDeck() {
  if (builder.activeDeckId?.startsWith("default-")) {
    showDeckStatus(["預設牌組不能刪除。"], false);
    return;
  }
  builder.savedDecks = builder.savedDecks.filter((deck) => deck.id !== builder.activeDeckId);
  saveDecks(builder.savedDecks);
  loadBuilderRecipe(defaultDeckRecipe(builder.summonerId));
  renderBuilder();
}

function resetCurrentDeck() {
  loadBuilderRecipe(defaultDeckRecipe(builder.summonerId));
  renderBuilder();
}

function updateDeckName() {
  builder.recipe.name = els.deckNameInput.value;
}

function updateQuestSelection() {
  builder.recipe.questId = els.questSelect.value;
  renderBuilder();
}

function loadArchetype(archetypeId) {
  const recipe = archetypeRecipe(archetypeId);
  if (!recipe) return;
  loadBuilderRecipe(recipe);
  renderBuilder();
}

function adjustCardCount(cardId, delta) {
  const ids = builder.recipe.cardIds;
  const counts = cardCounts(ids);
  const current = counts.get(cardId) ?? 0;
  if (delta > 0 && current >= DECK_RULES.maxCopies) return;
  if (delta > 0 && ids.length >= DECK_RULES.size) return;
  if (delta > 0) ids.push(cardId);
  if (delta < 0) {
    const index = ids.lastIndexOf(cardId);
    if (index >= 0) ids.splice(index, 1);
  }
  builder.recipe.updatedAt = new Date().toISOString();
  renderBuilder();
}

function startCustomMatch() {
  const recipe = cloneRecipe(builder.recipe, { name: els.deckNameInput.value.trim() || builder.recipe.name });
  const validation = validateDeckRecipe(recipe);
  if (!validation.ok) {
    showDeckStatus(validation.errors, false);
    return;
  }
  startMatch(builder.summonerId, recipe);
}

function renderBuilder() {
  if (!builder.recipe) return;
  const summoner = SUMMONERS.find((item) => item.id === builder.summonerId);
  const summary = summarizeDeck(builder.recipe);
  els.builderTitle.textContent = `${FACTION_LABELS[summoner.faction]} 構築`;
  els.deckNameInput.value = builder.recipe.name;
  renderQuestSelect();
  renderBuilderTags();
  renderArchetypes();
  renderDeckSelect();
  renderDeckSummary(summary);
  renderCardPool();
  renderDeckList();
  showDeckStatus(summary.errors, summary.ok);
  els.startCustomBtn.disabled = !summary.ok;
  els.deleteDeckBtn.disabled = builder.activeDeckId?.startsWith("default-");
}

function renderDeckSelect() {
  const decks = [defaultDeckRecipe(builder.summonerId), ...builder.savedDecks.filter((deck) => deck.summonerId === builder.summonerId)];
  els.deckSelect.innerHTML = decks
    .map((deck) => `<option value="${deck.id}" ${deck.id === builder.activeDeckId ? "selected" : ""}>${deck.name}</option>`)
    .join("");
}

function renderQuestSelect() {
  const quests = questsForSummoner(builder.summonerId);
  els.questSelect.innerHTML = quests
    .map((quest) => `<option value="${quest.id}" ${quest.id === builder.recipe.questId ? "selected" : ""}>${quest.name} · ${quest.conditionText}</option>`)
    .join("");
}

function renderBuilderTags() {
  const tags = [...new Set(questsForSummoner(builder.summonerId).flatMap((quest) => quest.tags))];
  els.builderTag.innerHTML = [`<option value="all">全部</option>`, ...tags.map((tag) => `<option value="${tag}" ${tag === builder.filters.tag ? "selected" : ""}>${tag}</option>`)].join("");
}

function renderArchetypes() {
  els.archetypeList.innerHTML = "";
  for (const archetype of archetypesForSummoner(builder.summonerId)) {
    const quest = QUEST_LINES.find((item) => item.id === archetype.questId);
    const button = document.createElement("button");
    button.className = "archetype-button";
    button.type = "button";
    button.innerHTML = `<strong>${archetype.name}</strong><span>${quest?.name ?? ""}</span><span>${archetype.description}</span>`;
    button.addEventListener("click", () => loadArchetype(archetype.id));
    els.archetypeList.append(button);
  }
}

function renderDeckSummary(summary) {
  const quest = QUEST_LINES.find((item) => item.id === summary.recipe.questId);
  const typeLine = Object.entries(summary.stats.types)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => `${TYPE_LABELS[type]} ${count}`)
    .join(" / ");
  const curveLine = Object.entries(summary.stats.curve)
    .filter(([, count]) => count > 0)
    .map(([cost, count]) => `${cost}:${count}`)
    .join(" ");
  els.deckSummary.innerHTML = `
    <div><strong>${summary.stats.total}/${DECK_RULES.size}</strong><span>牌數</span></div>
    <div><strong>${summary.ok ? "合法" : "需調整"}</strong><span>狀態</span></div>
    <div><strong>${quest?.name ?? "未選擇"}</strong><span>任務路線</span></div>
    <div><strong>${typeLine || "無"}</strong><span>類型分布</span></div>
    <div><strong>${curveLine || "無"}</strong><span>費用曲線</span></div>
  `;
}

function showDeckStatus(messages, ok) {
  if (!els.deckStatus) return;
  els.deckStatus.className = `deck-status ${ok ? "legal" : "illegal"}`;
  els.deckStatus.innerHTML = ok ? "牌組合法，可以開始對局。" : messages.map((message) => `<div>${message}</div>`).join("");
}

function renderCardPool() {
  const counts = cardCounts(builder.recipe.cardIds);
  const cards = legalCardsForSummoner(builder.summonerId).filter(matchesBuilderFilters);
  els.cardPool.innerHTML = "";
  for (const card of cards) {
    const count = counts.get(card.id) ?? 0;
    const node = document.createElement("article");
    node.className = "card builder-card";
    node.setAttribute("style", cardVisualStyle(card));
    node.innerHTML = `
      ${cardMarkup(card)}
      <div class="builder-card-actions">
        <button class="icon-button" type="button" title="移除一張" ${count <= 0 ? "disabled" : ""}>−</button>
        <div class="count">${count}/${DECK_RULES.maxCopies}</div>
        <button class="icon-button" type="button" title="加入一張" ${count >= DECK_RULES.maxCopies || builder.recipe.cardIds.length >= DECK_RULES.size ? "disabled" : ""}>＋</button>
      </div>
    `;
    const buttons = node.querySelectorAll("button");
    buttons[0].addEventListener("click", () => adjustCardCount(card.id, -1));
    buttons[1].addEventListener("click", () => adjustCardCount(card.id, 1));
    node.addEventListener("dblclick", () => adjustCardCount(card.id, 1));
    els.cardPool.append(node);
  }
}

function matchesBuilderFilters(card) {
  const search = builder.filters.search.trim().toLowerCase();
  const text = `${card.name} ${card.text} ${card.tags.join(" ")}`.toLowerCase();
  if (search && !text.includes(search)) return false;
  if (builder.filters.type !== "all" && card.type !== builder.filters.type) return false;
  if (builder.filters.cost === "0-1" && card.cost > 1) return false;
  if (builder.filters.cost === "5+" && card.cost < 5) return false;
  if (!["all", "0-1", "5+"].includes(builder.filters.cost) && card.cost !== Number(builder.filters.cost)) return false;
  if (builder.filters.tag !== "all" && !card.tags.includes(builder.filters.tag)) return false;
  return true;
}

function renderDeckList() {
  const counts = [...cardCounts(builder.recipe.cardIds).entries()]
    .map(([id, count]) => ({ card: BASE_CARDS.find((item) => item.id === id), count }))
    .filter((entry) => entry.card)
    .sort((a, b) => a.card.cost - b.card.cost || a.card.name.localeCompare(b.card.name, "zh-Hant"));
  els.deckList.innerHTML = "";
  for (const entry of counts) {
    const row = document.createElement("div");
    row.className = "deck-list-row";
    row.innerHTML = `
      <div>
        <strong>${entry.card.name}</strong>
        <div class="meta">${entry.card.cost} 費 · ${TYPE_LABELS[entry.card.type]} · ${FACTION_LABELS[entry.card.faction]}</div>
      </div>
      <strong>x${entry.count}</strong>
      <button class="icon-button" type="button" title="移除一張">−</button>
    `;
    row.querySelector("button").addEventListener("click", () => adjustCardCount(entry.card.id, -1));
    els.deckList.append(row);
  }
}

function renderSummoners() {
  els.summonerGrid.innerHTML = "";
  for (const summoner of SUMMONERS) {
    const archetypes = archetypesForSummoner(summoner.id);
    const theme = themeFor(summoner.faction);
    const node = document.createElement("article");
    node.className = "summoner-card";
    node.setAttribute("style", `--card-primary:${theme.primary};--card-accent:${theme.accent};--card-surface:${theme.surface};--summoner-art:url('${theme.summonerPortrait}');--summoner-bg:url('${theme.battlefieldArt}');`);
    node.innerHTML = `
      <div class="summoner-visual">
        <img src="${theme.summonerPortrait}" alt="" />
      </div>
      <div class="faction">${FACTION_LABELS[summoner.faction]}</div>
      <h2>${summoner.name}</h2>
      <p>${summoner.style}</p>
      <div class="summoner-tags">${archetypes.map((item) => `<span>${item.name.replace("模板", "")}</span>`).join("")}</div>
      <p><strong>召喚師能力</strong><br>${summoner.ability}</p>
      <div class="summoner-actions">
        <button class="button primary" type="button">快速開局</button>
        <button class="button secondary" type="button">構築牌組</button>
      </div>
    `;
    const [startButton, builderButton] = node.querySelectorAll("button");
    startButton.addEventListener("click", () => startMatch(summoner.id));
    builderButton.addEventListener("click", () => openBuilder(summoner.id));
    els.summonerGrid.append(node);
  }
}

function initBrowserGame() {
  setAnimationSpeed(loadAnimationSpeed());
  setAnimationDetail(loadAnimationDetail());
  els.animationSpeed.addEventListener("change", () => setAnimationSpeed(els.animationSpeed.value));
  els.animationDetail.addEventListener("change", () => setAnimationDetail(els.animationDetail.value));
  els.endTurn.addEventListener("click", endTurn);
  els.newGame.addEventListener("click", () => location.reload());
  els.simulate.addEventListener("click", () => runBalanceSimulation(50));
  els.resultNewGame.addEventListener("click", () => location.reload());
  els.deckSelect.addEventListener("change", () => {
    const selected = findDeck(els.deckSelect.value);
    if (selected) {
      loadBuilderRecipe(selected);
      renderBuilder();
    }
  });
  els.deckNameInput.addEventListener("input", updateDeckName);
  els.questSelect.addEventListener("change", updateQuestSelection);
  els.builderSearch.addEventListener("input", () => {
    builder.filters.search = els.builderSearch.value;
    renderCardPool();
  });
  els.builderType.addEventListener("change", () => {
    builder.filters.type = els.builderType.value;
    renderCardPool();
  });
  els.builderCost.addEventListener("change", () => {
    builder.filters.cost = els.builderCost.value;
    renderCardPool();
  });
  els.builderTag.addEventListener("change", () => {
    builder.filters.tag = els.builderTag.value;
    renderCardPool();
  });
  els.saveDeckBtn.addEventListener("click", saveCurrentDeck);
  els.copyDeckBtn.addEventListener("click", copyCurrentDeck);
  els.deleteDeckBtn.addEventListener("click", deleteCurrentDeck);
  els.resetDeckBtn.addEventListener("click", resetCurrentDeck);
  els.startCustomBtn.addEventListener("click", startCustomMatch);
  els.backToSummonersBtn.addEventListener("click", () => {
    els.builderScreen.classList.add("hidden");
    els.start.classList.remove("hidden");
  });
  renderSummoners();

  if (new URLSearchParams(location.search).has("simulate")) {
    runBalanceSimulation(50);
  }
}

if (hasDom) {
  initBrowserGame();
}
