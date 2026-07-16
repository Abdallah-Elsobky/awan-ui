export type ZoneId = 'study' | 'work' | 'play' | 'personal';

export type RiskLevel = 'green' | 'yellow' | 'red';

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'missed';

export type Priority = 'low' | 'medium' | 'high';

export interface Zone {
  id: ZoneId;
  name: string;
  color: string;
  capacity: number;
  requiredToday: boolean;
}

export interface Task {
  id: string;
  name: string;
  zone: ZoneId;
  duration: number; // minutes
  status: TaskStatus;
  dueDate?: string;
  startTime?: string;
  priority: Priority;
  notes?: string;
  goalId?: string;
  dependencies: string[];
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  createdAt: number;
  scheduledDate?: number;
  points: number; // AI-assigned, not user-editable
}

export interface Goal {
  id: string;
  name: string;
  zone: ZoneId;
  deadline: string;
  description: string;
  estimatedHours: number;
  taskIds: string[];
}

export interface UserPreferences {
  timezone: string;
  dailyStart: string;
  dailyEnd: string;
  preferredDuration: number;
  notifications: {
    taskReminders: boolean;
    missedTasks: boolean;
    burnoutAlerts: boolean;
    dailySummary: boolean;
    deadlineWarnings: boolean;
  };
  workLifeBalance: 'flexible' | 'balanced' | 'work-focused';
}

export interface UserProfile {
  name: string;
  email: string;
  totalPoints: number;
  spentPoints: number;
  currentStreak: number;
  longestStreak: number;
  equippedAvatar: string; // avatar id
  equippedBadge: string | null; // badge id or null
  unlockedAvatars: string[];
  unlockedBadges: string[];
  weeklyStreakDays: boolean[]; // 7 days, true = completed
  level: number;
  title: string;
}

export interface MarketplaceItem {
  id: string;
  type: 'avatar' | 'badge';
  name: string;
  description: string;
  price: number;
  emoji?: string;
  gradient?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface BurnoutMetrics {
  missedTasksPercent: number;
  utilizationPercent: number;
  restorativeTimePercent: number;
  consecutiveHighLoadDays: number;
}

export interface BurnoutResult {
  score: number;
  riskLevel: RiskLevel;
  metrics: BurnoutMetrics;
}

export interface RecoverySuggestion {
  id: string;
  title: string;
  description: string;
  color: 'rose' | 'teal' | 'purple';
  impact?: string;
  suggestedBlocks?: string[];
  details?: string;
  actions: string[];
}
