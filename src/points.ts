import type { Task, Priority } from './types';

// AI-assigned points based on task attributes — user cannot set these
const BASE_POINTS: Record<Priority, number> = {
  low: 10,
  medium: 20,
  high: 35,
};

const DURATION_BONUS: { min: number; bonus: number }[] = [
  { min: 60, bonus: 15 },
  { min: 45, bonus: 10 },
  { min: 30, bonus: 5 },
  { min: 0, bonus: 0 },
];

// Deterministically assign points when a task is created — cannot be gamed
export function assignTaskPoints(task: Omit<Task, 'points'>): number {
  const base = BASE_POINTS[task.priority];
  const durationBonus = DURATION_BONUS.find((d) => task.duration >= d.min)?.bonus ?? 0;
  const dependencyBonus = task.dependencies.length * 5;
  const recurringBonus = task.recurring && task.recurring !== 'none' ? 5 : 0;
  return base + durationBonus + dependencyBonus + recurringBonus;
}

export function getPointsForCompletion(task: Task): number {
  return task.points;
}

export function calculateLevel(totalPoints: number): { level: number; title: string; nextLevelAt: number } {
  const thresholds = [
    { level: 1, points: 0, title: 'Starter' },
    { level: 2, points: 100, title: 'Hustler' },
    { level: 3, points: 300, title: 'Achiever' },
    { level: 4, points: 600, title: 'Dynamo' },
    { level: 5, points: 1000, title: 'Warrior' },
    { level: 6, points: 1500, title: 'Champion' },
    { level: 7, points: 2500, title: 'Legend' },
    { level: 8, points: 4000, title: 'Master' },
  ];

  let current = thresholds[0];
  for (const t of thresholds) {
    if (totalPoints >= t.points) current = t;
    else break;
  }

  const nextIdx = thresholds.indexOf(current) + 1;
  const nextLevelAt = nextIdx < thresholds.length ? thresholds[nextIdx].points : current.points * 2;

  return { level: current.level, title: current.title, nextLevelAt };
}
