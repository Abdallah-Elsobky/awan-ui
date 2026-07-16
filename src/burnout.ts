import type { BurnoutResult, BurnoutMetrics, RecoverySuggestion, Task, Zone, RiskLevel } from './types';

export function calculateBurnoutScore(tasks: Task[], zones: Zone[]): BurnoutResult {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const tasksInWindow = tasks.filter((t) => t.createdAt >= sevenDaysAgo);
  const missedTasks = tasksInWindow.filter((t) => t.status === 'missed').length;
  const missedTasksPercent =
    tasksInWindow.length > 0 ? missedTasks / tasksInWindow.length : 0;

  const totalAvailableMinutes =
    zones.reduce((sum, z) => sum + z.capacity * 60, 0) * 7;
  const bookedMinutes = tasks
    .filter((t) => (t.scheduledDate ?? t.createdAt) >= sevenDaysAgo)
    .reduce((sum, t) => sum + t.duration, 0);
  const utilizationPercent =
    totalAvailableMinutes > 0 ? bookedMinutes / totalAvailableMinutes : 0;

  const recentTasks = tasks.filter(
    (t) => (t.scheduledDate ?? t.createdAt) >= sevenDaysAgo
  );
  const restorativeMinutes = recentTasks
    .filter((t) => t.zone === 'play' || t.zone === 'personal')
    .reduce((sum, t) => sum + t.duration, 0);
  const totalMinutes = recentTasks.reduce((sum, t) => sum + t.duration, 0);
  const zoneImbalance = totalMinutes > 0 ? 1 - restorativeMinutes / totalMinutes : 0;

  const dailyCapacity = zones.reduce((s, z) => s + z.capacity * 60, 0);
  const dailyUtilization: number[] = [];
  for (let i = 0; i < 7; i++) {
    const dayKey = new Date(sevenDaysAgo + i * 24 * 60 * 60 * 1000).toDateString();
    const dayMinutes = tasks
      .filter(
        (t) => new Date(t.scheduledDate ?? t.createdAt).toDateString() === dayKey
      )
      .reduce((sum, t) => sum + t.duration, 0);
    dailyUtilization.push(dailyCapacity > 0 ? dayMinutes / dailyCapacity : 0);
  }

  let maxConsecutiveHighLoad = 0;
  let currentStreak = 0;
  dailyUtilization.forEach((util) => {
    if (util > 0.8) {
      currentStreak++;
      maxConsecutiveHighLoad = Math.max(maxConsecutiveHighLoad, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  const consecutiveHighLoadScore = Math.min(maxConsecutiveHighLoad / 4, 1.0);

  const burnoutScore =
    (missedTasksPercent * 0.35 +
      utilizationPercent * 0.3 +
      zoneImbalance * 0.25 +
      consecutiveHighLoadScore * 0.1) *
    100;

  let riskLevel: RiskLevel = 'green';
  if (burnoutScore > 60) riskLevel = 'red';
  else if (burnoutScore > 30) riskLevel = 'yellow';

  const metrics: BurnoutMetrics = {
    missedTasksPercent: parseFloat((missedTasksPercent * 100).toFixed(1)),
    utilizationPercent: parseFloat((utilizationPercent * 100).toFixed(1)),
    restorativeTimePercent:
      totalMinutes > 0
        ? parseFloat(((restorativeMinutes / totalMinutes) * 100).toFixed(1))
        : 0,
    consecutiveHighLoadDays: maxConsecutiveHighLoad,
  };

  return {
    score: Math.round(burnoutScore),
    riskLevel,
    metrics,
  };
}

export function generateRecoverySuggestions(
  burnout: BurnoutResult
): RecoverySuggestion[] {
  const suggestions: RecoverySuggestion[] = [];

  if (burnout.riskLevel === 'green') return suggestions;

  if (burnout.metrics.utilizationPercent > 85 || burnout.riskLevel === 'yellow' || burnout.riskLevel === 'red') {
    suggestions.push({
      id: 'shift-recover',
      title: 'Shift & Recover',
      description:
        'Move 2 lower-priority tasks to later this week. Add 2 recovery blocks over the next 2 days.',
      color: 'rose',
      impact: "You'll recover 30% more energy this week",
      actions: ['Accept changes', 'Adjust', 'Dismiss'],
    });
  }

  if (
    parseFloat(String(burnout.metrics.restorativeTimePercent)) < 15 ||
    burnout.riskLevel === 'yellow' ||
    burnout.riskLevel === 'red'
  ) {
    suggestions.push({
      id: 'double-rest',
      title: 'Double Up on Rest',
      description:
        'Group personal time into 2-hour recovery blocks on the weekend.',
      color: 'teal',
      suggestedBlocks: [
        'Saturday 2-4 PM: Relaxation',
        'Sunday 10 AM-12 PM: Self-care',
      ],
      actions: ['Add blocks', 'Customize', 'Dismiss'],
    });
  }

  if (burnout.riskLevel === 'red') {
    suggestions.push({
      id: 'zone-override',
      title: 'Boost Personal Time',
      description:
        'Temporarily increase Play/Personal zone capacity by 30% for 48 hours.',
      color: 'purple',
      details: 'Remaining capacity before: 5 hours → After: 6.5 hours',
      actions: ['Enable 48 hours', 'Dismiss'],
    });
  }

  return suggestions.slice(0, 3);
}
