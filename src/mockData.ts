import type { Zone, Task, Goal, UserPreferences, UserProfile } from './types';
import { assignTaskPoints } from './points';

export const defaultZones: Zone[] = [
  { id: 'study', name: 'Study', color: '#8B5CF6', capacity: 4, requiredToday: true },
  { id: 'work', name: 'Work', color: '#3B82F6', capacity: 6, requiredToday: true },
  { id: 'play', name: 'Play', color: '#EC4899', capacity: 2, requiredToday: false },
  { id: 'personal', name: 'Personal', color: '#14B8A6', capacity: 3, requiredToday: false },
];

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

function withPoints(task: Omit<Task, 'points'>): Task {
  return { ...task, points: assignTaskPoints(task) };
}

export const mockTasks: Task[] = [
  withPoints({
    id: 't1', name: 'Read Chapter 5 of React docs', zone: 'study', duration: 45, status: 'completed',
    startTime: '09:00', priority: 'medium', dependencies: [], recurring: 'none', createdAt: now - day * 2, scheduledDate: now,
  }),
  withPoints({
    id: 't2', name: 'Review pull request #142', zone: 'work', duration: 30, status: 'in-progress',
    startTime: '10:30', priority: 'high', dependencies: [], recurring: 'none', createdAt: now - day, scheduledDate: now,
  }),
  withPoints({
    id: 't3', name: 'Team standup meeting', zone: 'work', duration: 30, status: 'todo',
    startTime: '11:00', priority: 'high', dependencies: [], recurring: 'daily', createdAt: now - day, scheduledDate: now,
  }),
  withPoints({
    id: 't4', name: 'Practice piano for 30 minutes', zone: 'play', duration: 30, status: 'todo',
    startTime: '18:00', priority: 'low', dependencies: [], recurring: 'none', createdAt: now - day, scheduledDate: now,
  }),
  withPoints({
    id: 't5', name: 'Meal prep for the week', zone: 'personal', duration: 60, status: 'todo',
    startTime: '19:00', priority: 'medium', dependencies: [], recurring: 'weekly', createdAt: now - day, scheduledDate: now,
  }),
  withPoints({
    id: 't6', name: 'Submit project proposal', zone: 'work', duration: 90, status: 'missed',
    dueDate: new Date(now - day).toISOString().split('T')[0], priority: 'high', dependencies: ['t2'],
    recurring: 'none', createdAt: now - day * 3, scheduledDate: now - day,
  }),
  withPoints({
    id: 't7', name: 'Write essay outline', zone: 'study', duration: 60, status: 'missed',
    priority: 'medium', dependencies: ['t1'], recurring: 'none', createdAt: now - day * 4, scheduledDate: now - day * 2,
  }),
  withPoints({
    id: 't8', name: 'Fix authentication bug', zone: 'work', duration: 120, status: 'completed',
    priority: 'high', dependencies: [], recurring: 'none', createdAt: now - day * 5, scheduledDate: now - day * 3,
  }),
  withPoints({
    id: 't9', name: 'Gym session — cardio', zone: 'personal', duration: 45, status: 'completed',
    priority: 'low', dependencies: [], recurring: 'daily', createdAt: now - day * 5, scheduledDate: now - day * 3,
  }),
  withPoints({
    id: 't10', name: 'Watch a documentary', zone: 'play', duration: 60, status: 'completed',
    priority: 'low', dependencies: [], recurring: 'none', createdAt: now - day * 6, scheduledDate: now - day * 4,
  }),
  withPoints({
    id: 't11', name: 'Deploy staging environment', zone: 'work', duration: 45, status: 'todo',
    dueDate: new Date(now + day * 2).toISOString().split('T')[0], priority: 'high', dependencies: ['t8'],
    recurring: 'none', createdAt: now - day * 2, scheduledDate: now + day,
  }),
  withPoints({
    id: 't12', name: 'Research paper: AI in education', zone: 'study', duration: 90, status: 'todo',
    dueDate: new Date(now + day * 4).toISOString().split('T')[0], priority: 'medium', dependencies: ['t1'],
    recurring: 'none', createdAt: now - day * 2, scheduledDate: now + day * 2,
  }),
];

export const mockGoals: Goal[] = [
  {
    id: 'g1', name: 'Master React 18 patterns', zone: 'study',
    deadline: new Date(now + day * 5).toISOString().split('T')[0],
    description: 'Complete the advanced React course and build a portfolio project.',
    estimatedHours: 20, taskIds: ['t1', 't7', 't12'],
  },
  {
    id: 'g2', name: 'Ship Q3 product launch', zone: 'work',
    deadline: new Date(now + day * 3).toISOString().split('T')[0],
    description: 'Finalize features, fix critical bugs, and deploy to production.',
    estimatedHours: 35, taskIds: ['t2', 't3', 't6', 't8', 't11'],
  },
  {
    id: 'g3', name: 'Build a consistent wellness routine', zone: 'personal',
    deadline: new Date(now + day * 14).toISOString().split('T')[0],
    description: 'Establish daily exercise, meal prep, and mindfulness habits.',
    estimatedHours: 15, taskIds: ['t5', 't9'],
  },
];

export const defaultPreferences: UserPreferences = {
  timezone: 'UTC-08:00 (Pacific)',
  dailyStart: '06:00',
  dailyEnd: '23:00',
  preferredDuration: 30,
  notifications: {
    taskReminders: true,
    missedTasks: true,
    burnoutAlerts: true,
    dailySummary: false,
    deadlineWarnings: true,
  },
  workLifeBalance: 'balanced',
};

export const defaultProfile: UserProfile = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  totalPoints: 285,
  spentPoints: 50,
  currentStreak: 5,
  longestStreak: 12,
  equippedAvatar: 'ninja',
  equippedBadge: 'streak7',
  unlockedAvatars: ['default', 'ninja'],
  unlockedBadges: ['streak7', 'centurion'],
  weeklyStreakDays: [true, true, true, true, true, false, false],
  level: 2,
  title: 'Hustler',
};

export const weeklyHeatmapData = [
  { day: 'Mon', cognitive: 45, physical: 70, emotional: 55 },
  { day: 'Tue', cognitive: 80, physical: 30, emotional: 65 },
  { day: 'Wed', cognitive: 90, physical: 25, emotional: 40 },
  { day: 'Thu', cognitive: 70, physical: 50, emotional: 35 },
  { day: 'Fri', cognitive: 55, physical: 60, emotional: 50 },
  { day: 'Sat', cognitive: 20, physical: 85, emotional: 80 },
  { day: 'Sun', cognitive: 15, physical: 90, emotional: 85 },
];
