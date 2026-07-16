import { useState } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ProgressRing } from '../components/ProgressRing';
import { zoneConfig } from '../zoneConfig';
import { weeklyHeatmapData } from '../mockData';
import type { Task, Goal, BurnoutResult, RecoverySuggestion, ZoneId, UserProfile } from '../types';
import {
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Zap,
  MoreVertical,
  ArrowRight,
  Sparkles,
  Flame,
  Bell,
  ChevronRight,
  CalendarDays,
  Target,
} from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  goals: Goal[];
  burnout: BurnoutResult;
  suggestions: RecoverySuggestion[];
  profile: UserProfile;
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  onGoalClick: (goal: Goal) => void;
  onOpenRecovery: () => void;
  onToggleTask: (taskId: string) => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

function energyColor(value: number): string {
  if (value >= 70) return '#10B981';
  if (value >= 40) return '#F59E0B';
  return '#EF4444';
}

export function Dashboard({
  tasks,
  goals,
  burnout,
  suggestions,
  profile,
  onAddTask,
  onTaskClick,
  onGoalClick,
  onOpenRecovery,
  onToggleTask,
  onOpenProfile,
  onOpenNotifications,
}: DashboardProps) {
  const [zoneFilter, setZoneFilter] = useState<ZoneId | 'all'>('all');
  const [heatmapExpanded, setHeatmapExpanded] = useState(false);

  const todayTasks = tasks.filter((t) => {
    if (!t.scheduledDate) return false;
    return new Date(t.scheduledDate).toDateString() === new Date().toDateString();
  });
  const filteredTasks =
    zoneFilter === 'all' ? todayTasks : todayTasks.filter((t) => t.zone === zoneFilter);

  const upcomingGoals = goals
    .filter((g) => {
      const days = Math.ceil(
        (new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return days >= 0 && days <= 7;
    })
    .slice(0, 4);

  const accentColor =
    burnout.riskLevel === 'green'
      ? '#10B981'
      : burnout.riskLevel === 'yellow'
        ? '#F59E0B'
        : '#EF4444';

  const statusLabel =
    burnout.riskLevel === 'green' ? 'Healthy' : burnout.riskLevel === 'yellow' ? 'Caution' : 'Alert';

  const statusText =
    burnout.riskLevel === 'green'
      ? "You're on track. Keep up the great work!"
      : burnout.riskLevel === 'yellow'
        ? "You're running low on energy. Consider a 48-hour reset."
        : 'Alert: Burnout risk detected. Recovery mode recommended.';

  const completedCount = todayTasks.filter((t) => t.status === 'completed').length;
  const totalCount = todayTasks.length;
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const availablePoints = profile.totalPoints - profile.spentPoints;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* === Home Header (like reference image) === */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onOpenProfile} className="relative shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xl shadow-sm">
              {profile.equippedAvatar === 'default' ? '👤' : '🥷'}
            </div>
            {profile.equippedBadge && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] shadow-sm border border-slate-100">
                🔥
              </div>
            )}
          </button>
          <div>
            <p className="text-xs text-slate-400">{todayDate}</p>
            <h1 className="text-xl font-bold text-slate-900">Today</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Points pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition-all"
          >
            <Zap size={14} className="text-brand-600" />
            <span className="text-sm font-bold">{availablePoints}</span>
          </button>
          {/* Streak pill */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-warning-50 text-warning-700">
            <Flame size={14} className="text-warning-500" />
            <span className="text-sm font-bold">{profile.currentStreak}</span>
          </div>
          {/* Notification bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <Bell size={18} className="text-slate-600" />
            {suggestions.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-alert-500" />
            )}
          </button>
        </div>
      </div>

      {/* === Streak row (7-day visual) === */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-warning-500" />
            <h3 className="text-sm font-bold text-slate-900">Daily Streak</h3>
          </div>
          <span className="text-xs text-slate-400">
            {profile.currentStreak} days · Best: {profile.longestStreak}
          </span>
        </div>
        <div className="flex gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  profile.weeklyStreakDays[i]
                    ? 'bg-brand-500 text-white shadow-sm'
                    : i < profile.weeklyStreakDays.filter(Boolean).length
                      ? 'bg-slate-100 text-slate-300'
                      : 'bg-slate-50 text-slate-300 border border-slate-100'
                }`}
              >
                {profile.weeklyStreakDays[i] ? <CheckCircle2 size={18} /> : d}
              </div>
              <span className="text-[10px] text-slate-400">{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* === Energy Status Card === */}
      <div
        onClick={onOpenRecovery}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-card hover:shadow-card-hover transition-all cursor-pointer animate-fade-in"
        style={{ borderTop: `3px solid ${accentColor}` }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Your Energy Status</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">7-day trend</span>
              {burnout.score > 50 ? (
                <TrendingUp size={16} className="text-warning-500" />
              ) : (
                <TrendingDown size={16} className="text-success-500" />
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <ProgressRing
              score={burnout.score}
              riskLevel={burnout.riskLevel}
              size={140}
              strokeWidth={6}
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <span className="text-xl font-bold" style={{ color: accentColor }}>
                  {statusLabel}
                </span>
                <Sparkles size={14} style={{ color: accentColor }} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{statusText}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <Badge color="slate">
                  {completedCount}/{totalCount} tasks done
                </Badge>
                <Badge color={burnout.riskLevel === 'green' ? 'success' : 'warning'}>
                  {burnout.metrics.utilizationPercent}% utilization
                </Badge>
                <Badge color="brand">
                  {burnout.metrics.consecutiveHighLoadDays} high-load days
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Score: {burnout.score}/100 · Rest time: {burnout.metrics.restorativeTimePercent}%
            </p>
            <button className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">
              View recovery options <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Weekly Heatmap */}
          <Card padding="md">
            <button
              onClick={() => setHeatmapExpanded(!heatmapExpanded)}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="text-lg font-bold text-slate-900">Weekly Energy Breakdown</h3>
              {heatmapExpanded ? (
                <ChevronUp size={18} className="text-slate-400" />
              ) : (
                <ChevronDown size={18} className="text-slate-400" />
              )}
            </button>

            <div className={`${heatmapExpanded ? 'block' : 'hidden lg:block'}`}>
              <div className="space-y-2">
                {['Cognitive', 'Physical', 'Emotional'].map((energyType) => (
                  <div key={energyType} className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-500 w-16 shrink-0">
                      {energyType}
                    </span>
                    <div className="flex gap-1 flex-1">
                      {weeklyHeatmapData.map((d) => {
                        const val =
                          energyType === 'Cognitive'
                            ? d.cognitive
                            : energyType === 'Physical'
                              ? d.physical
                              : d.emotional;
                        return (
                          <div key={d.day} className="flex-1 group relative" title={`${d.day}: ${energyType} ${val}%`}>
                            <div
                              className="h-7 rounded-md transition-all hover:scale-105 cursor-default"
                              style={{ backgroundColor: energyColor(val), opacity: 0.15 + (val / 100) * 0.85 }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-medium text-slate-500 w-16 shrink-0" />
                  <div className="flex gap-1 flex-1">
                    {weeklyHeatmapData.map((d) => (
                      <span key={d.day} className="flex-1 text-center text-[10px] text-slate-400">
                        {d.day.charAt(0)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 justify-center">
                <span className="text-[10px] text-slate-400">High</span>
                <div className="flex gap-0.5">
                  {[0.2, 0.4, 0.6, 0.8, 1].map((o) => (
                    <div key={o} className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#10B981', opacity: o }} />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400">Depleted</span>
                <div className="flex gap-0.5">
                  {[1, 0.8, 0.6, 0.4, 0.2].map((o) => (
                    <div key={o} className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#EF4444', opacity: o }} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Middle column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Today's Tasks */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-900">Today's Tasks</h3>
              <Button size="sm" variant="secondary" onClick={onAddTask}>
                <Plus size={16} /> Add
              </Button>
            </div>

            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
              {(['all', ...Object.keys(zoneConfig)] as (ZoneId | 'all')[]).map((z) => (
                <button
                  key={z}
                  onClick={() => setZoneFilter(z)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    zoneFilter === z ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {z === 'all' ? 'All' : zoneConfig[z as ZoneId].name}
                </button>
              ))}
            </div>

            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-3">
                  <CheckCircle2 size={24} className="text-brand-400" />
                </div>
                <p className="text-sm font-medium text-slate-900">You're all caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No tasks today. Enjoy your free time!</p>
              </div>
            ) : (
              <div
                className="space-y-2 overflow-y-auto"
                style={{ maxHeight: 'min(400px, 60vh)', WebkitOverflowScrolling: 'touch' }}
              >
                {filteredTasks.map((task) => {
                  const cfg = zoneConfig[task.zone];
                  const isOverdue = task.status === 'missed';
                  const isCompleted = task.status === 'completed';
                  const isInProgress = task.status === 'in-progress';

                  return (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className={`flex items-center gap-3 px-4 rounded-xl border transition-all hover:shadow-card-hover cursor-pointer group ${
                        isOverdue
                          ? 'bg-alert-50 border-alert-200'
                          : isCompleted
                            ? 'bg-slate-50 border-slate-200'
                            : isInProgress
                              ? 'bg-white border-brand-200'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                      style={{ height: '64px' }}
                    >
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: isOverdue ? '#EF4444' : cfg.color, opacity: isCompleted ? 0.5 : 1 }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isCompleted
                              ? 'text-slate-400 line-through'
                              : isOverdue
                                ? 'text-alert-600'
                                : isInProgress
                                  ? 'text-brand-700'
                                  : 'text-slate-900'
                          }`}
                        >
                          {task.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[11px] ${cfg.text}`}>{cfg.name}</span>
                          {task.startTime && (
                            <span className="text-[11px] text-slate-400 font-mono">{task.startTime}</span>
                          )}
                          <span className="text-[11px] text-brand-500 font-medium flex items-center gap-0.5">
                            <Zap size={9} /> {task.points}
                          </span>
                        </div>
                      </div>
                      <Badge
                        color={task.priority === 'high' ? 'alert' : task.priority === 'medium' ? 'warning' : 'slate'}
                        className="hidden sm:inline-flex"
                      >
                        {task.priority}
                      </Badge>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                        className="shrink-0 p-1"
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={22} className="text-success-500" />
                        ) : isOverdue ? (
                          <AlertCircle size={22} className="text-alert-500" />
                        ) : isInProgress ? (
                          <Clock size={22} className="text-brand-500" />
                        ) : (
                          <Circle size={22} className="text-slate-300 hover:text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onTaskClick(task); }}
                        className="shrink-0 p-1 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* === Deadlines Ahead — Modern distinct design === */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <CalendarDays size={18} className="text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900">Deadlines Ahead</h3>
            </div>
            {upcomingGoals.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                <Target size={28} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No deadlines in the next 7 days.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingGoals.map((goal) => {
                  const cfg = zoneConfig[goal.zone];
                  const days = Math.ceil(
                    (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  const goalTasks = goal.taskIds
                    .map((id) => tasks.find((t) => t.id === id))
                    .filter(Boolean) as Task[];
                  const done = goalTasks.filter((t) => t.status === 'completed').length;
                  const total = goalTasks.length;
                  const pct = total > 0 ? (done / total) * 100 : 0;
                  const isUrgent = days < 2;
                  const isWarning = days >= 2 && days < 5;

                  return (
                    <div
                      key={goal.id}
                      onClick={() => onGoalClick(goal)}
                      className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:shadow-card-hover hover:border-slate-300 cursor-pointer transition-all"
                    >
                      {/* Left color bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: cfg.color }} />

                      <div className="p-4 pl-5">
                        {/* Top row: zone + days left */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: cfg.color + '20' }}
                            >
                              <Target size={13} style={{ color: cfg.color }} />
                            </div>
                            <span className="text-xs font-medium" style={{ color: cfg.color }}>
                              {cfg.name}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                              isUrgent
                                ? 'bg-alert-50 text-alert-600'
                                : isWarning
                                  ? 'bg-warning-50 text-warning-600'
                                  : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Clock size={11} />
                            {days === 0 ? 'Today' : days === 1 ? '1 day' : `${days} days`}
                          </div>
                        </div>

                        {/* Goal name */}
                        <p className="text-sm font-bold text-slate-900 mb-3 group-hover:text-brand-700 transition-colors">
                          {goal.name}
                        </p>

                        {/* Progress section */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[11px] text-slate-400">
                                {done} of {total} tasks
                              </span>
                              <span className="text-[11px] font-semibold" style={{ color: cfg.color }}>
                                {Math.round(pct)}%
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Recovery Suggestions */}
        <div className="lg:col-span-1">
          {suggestions.length > 0 && (
            <Card padding="md" className="lg:sticky lg:top-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={18} className="text-warning-500" />
                <h3 className="text-base font-bold text-slate-900">Recovery Suggestions</h3>
              </div>
              <div className="space-y-3">
                {suggestions.map((s) => {
                  const colorMap: Record<string, { bg: string; text: string; btn: string }> = {
                    rose: { bg: 'bg-play-50', text: 'text-play-600', btn: 'bg-play-500' },
                    teal: { bg: 'bg-personal-50', text: 'text-personal-600', btn: 'bg-personal-500' },
                    purple: { bg: 'bg-study-50', text: 'text-study-600', btn: 'bg-study-500' },
                  };
                  const c = colorMap[s.color];
                  return (
                    <div key={s.id} className={`p-3 rounded-xl ${c.bg}`}>
                      <p className={`text-sm font-bold ${c.text}`}>{s.title}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.description}</p>
                      {s.impact && (
                        <p className="text-xs text-success-600 font-medium mt-1.5">{s.impact}</p>
                      )}
                      <div className="flex gap-1.5 mt-2.5">
                        <button className={`flex-1 h-8 rounded-lg text-[11px] font-medium text-white ${c.btn}`}>
                          {s.actions[0]}
                        </button>
                        {s.actions[1] && (
                          <button className="flex-1 h-8 rounded-lg text-[11px] font-medium bg-white text-slate-600 border border-slate-200">
                            {s.actions[1]}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="w-full text-xs text-slate-400 hover:text-slate-600 mt-3 font-medium">
                Dismiss all
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
