import { runHeadlessSimulation } from "../outputs/app.js";

const gameCount = Number.parseInt(process.argv[2] ?? "50", 10);
const seed = Number.parseInt(process.argv[3] ?? "405", 10);
const summary = runHeadlessSimulation(gameCount, { seed });
const archetypeSummary = runHeadlessSimulation(gameCount, { seed: seed + 700, archetypes: true });

console.log(JSON.stringify(
  {
    games: summary.total,
    seed,
    avgTurns: Number(summary.avgTurns.toFixed(2)),
    avgEvolutions: Number(summary.avgEvolutions.toFixed(2)),
    firstWinRate: Number((summary.firstWins / summary.total).toFixed(3)),
    secondWinRate: Number((summary.secondWins / summary.total).toFixed(3)),
    avgHand: Number(summary.avgHand.toFixed(2)),
    emptyHandRate: Number(summary.emptyHandRate.toFixed(3)),
    avgPeakBoardAttackGap: Number(summary.avgPeakBoardAttackGap.toFixed(2)),
    stalled: summary.stalled,
    failures: summary.failures.map((item) => item.failureReason),
    archetypeTemplates: {
      avgTurns: Number(archetypeSummary.avgTurns.toFixed(2)),
      avgEvolutions: Number(archetypeSummary.avgEvolutions.toFixed(2)),
      firstWinRate: Number((archetypeSummary.firstWins / archetypeSummary.total).toFixed(3)),
      secondWinRate: Number((archetypeSummary.secondWins / archetypeSummary.total).toFixed(3)),
      stalled: archetypeSummary.stalled,
    },
  },
  null,
  2,
));

const firstRate = summary.firstWins / summary.total;
const secondRate = summary.secondWins / summary.total;
const inTargetPace = summary.avgTurns >= 8 && summary.avgTurns <= 12 && summary.avgEvolutions >= 3 && summary.avgEvolutions <= 5;
const inTargetWinRate = firstRate >= 0.45 && firstRate <= 0.55 && secondRate >= 0.45 && secondRate <= 0.55;

if (summary.stalled > 0 || archetypeSummary.stalled > 0 || !inTargetPace || !inTargetWinRate) {
  process.exitCode = 1;
}
