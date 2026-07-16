import { useState, useMemo } from 'react';
import { Sparkles, Home, Plus, Zap, Target, User, Calendar } from 'lucide-react';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { Dashboard } from './screens/Dashboard';
import { TaskModal } from './screens/TaskModal';
import { GoalDetail } from './screens/GoalDetail';
import { RecoveryModal } from './screens/RecoveryModal';
import { SettingsScreen } from './screens/SettingsScreen';
import { CalendarView } from './screens/CalendarView';
import { TaskDetail } from './screens/TaskDetail';
import { GoalsScreen } from './screens/GoalsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { calculateBurnoutScore, generateRecoverySuggestions } from './burnout';
import { assignTaskPoints } from './points';
import { mockTasks, mockGoals, defaultZones, defaultPreferences, defaultProfile } from './mockData';
import type { Task, Goal, Zone, UserPreferences, TaskStatus, UserProfile, MarketplaceItem } from './types';

type AppState = 'auth' | 'onboarding' | 'app';
type AppView = 'dashboard' | 'calendar' | 'goals' | 'profile' | 'settings';

export default function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [view, setView] = useState<AppView>('dashboard');
  const [zones, setZones] = useState<Zone[]>(defaultZones);
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [goals] = useState<Goal[]>(mockGoals);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const burnout = useMemo(() => calculateBurnoutScore(tasks, zones), [tasks, zones]);
  const suggestions = useMemo(() => generateRecoverySuggestions(burnout), [burnout]);

  const handleAuthComplete = () => setAppState('onboarding');
  const handleOnboardingComplete = (z: Zone[], p: UserPreferences) => {
    setZones(z);
    setPrefs(p);
    setAppState('app');
  };

  const handleAddTask = () => {
    setEditTask(null);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (task: Partial<Task>) => {
    if (task.id) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...task } as Task : t)));
    } else {
      const baseTask: Omit<Task, 'points'> = {
        id: `t${Date.now()}`,
        name: task.name ?? 'Untitled task',
        zone: task.zone ?? 'study',
        duration: task.duration ?? 30,
        status: task.status ?? 'todo',
        dueDate: task.dueDate,
        startTime: task.startTime,
        priority: task.priority ?? 'medium',
        notes: task.notes,
        goalId: task.goalId,
        dependencies: task.dependencies ?? [],
        recurring: task.recurring ?? 'none',
        createdAt: Date.now(),
        scheduledDate: Date.now(),
      };
      const points = assignTaskPoints(baseTask);
      setTasks((prev) => [...prev, { ...baseTask, points }]);
    }
    setTaskModalOpen(false);
  };

  const handleTaskClick = (task: Task) => {
    setDetailTask(task);
    setTaskDetailOpen(true);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const wasCompleted = t.status === 'completed';
        const newStatus = wasCompleted ? 'todo' : ('completed' as TaskStatus);
        if (!wasCompleted) {
          setProfile((p) => ({ ...p, totalPoints: p.totalPoints + t.points }));
        } else {
          setProfile((p) => ({ ...p, totalPoints: Math.max(0, p.totalPoints - t.points) }));
        }
        return { ...t, status: newStatus };
      })
    );
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        if (status === 'completed' && t.status !== 'completed') {
          setProfile((p) => ({ ...p, totalPoints: p.totalPoints + t.points }));
        } else if (t.status === 'completed' && status !== 'completed') {
          setProfile((p) => ({ ...p, totalPoints: Math.max(0, p.totalPoints - t.points) }));
        }
        return { ...t, status };
      })
    );
    setDetailTask((prev) => (prev?.id === taskId ? { ...prev, status } : prev));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setTaskDetailOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setTaskDetailOpen(false);
    setTaskModalOpen(true);
  };

  const handleGoalClick = (goal: Goal) => setSelectedGoal(goal);

  const handleBuyItem = (item: MarketplaceItem) => {
    const available = profile.totalPoints - profile.spentPoints;
    if (available < item.price) return;
    setProfile((p) => ({
      ...p,
      spentPoints: p.spentPoints + item.price,
      unlockedAvatars: item.type === 'avatar' ? [...p.unlockedAvatars, item.id] : p.unlockedAvatars,
      unlockedBadges: item.type === 'badge' ? [...p.unlockedBadges, item.id] : p.unlockedBadges,
    }));
  };

  const handleEquipAvatar = (id: string) => {
    setProfile((p) => ({ ...p, equippedAvatar: id }));
  };

  const handleEquipBadge = (id: string) => {
    setProfile((p) => ({ ...p, equippedBadge: id }));
  };

  const handleNavClick = (id: AppView) => {
    setView(id);
    setSelectedGoal(null);
  };

  if (appState === 'auth') {
    return <AuthScreen onComplete={handleAuthComplete} />;
  }

  if (appState === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  const showRecoveryBadge = suggestions.length > 0;
  const navItems: { id: AppView; label: string; icon: typeof Home }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Week', icon: Calendar },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-slate-200 flex-col z-30">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">AWAN</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {item.id === 'dashboard' && showRecoveryBadge && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-warning-500" />
                )}
              </button>
            );
          })}
          <button
            onClick={handleAddTask}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 mt-4 rounded-xl bg-brand-600 text-white text-sm font-medium hover:opacity-90 transition-all"
          >
            <Plus size={18} /> Add Task
          </button>
        </nav>
        <div className="px-3 py-4 border-t border-slate-200">
          <button
            onClick={() => handleNavClick('profile')}
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-base">
              {profile.equippedAvatar === 'default' ? '👤' : '🥷'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-slate-900 truncate">{profile.name}</p>
              <p className="text-xs text-brand-600 font-semibold">{profile.totalPoints - profile.spentPoints} pts</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 glass border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">AWAN</span>
        </div>
        {showRecoveryBadge && (
          <button
            onClick={() => setRecoveryOpen(true)}
            className="relative p-2 rounded-lg hover:bg-slate-100"
          >
            <Zap size={20} className="text-warning-500" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-alert-500" />
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="lg:ml-60 pb-28 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {selectedGoal ? (
            <GoalDetail
              goal={selectedGoal}
              tasks={tasks}
              onBack={() => setSelectedGoal(null)}
              onTaskClick={handleTaskClick}
              onToggleTask={handleToggleTask}
            />
          ) : view === 'dashboard' ? (
            <Dashboard
              tasks={tasks}
              goals={goals}
              burnout={burnout}
              suggestions={suggestions}
              profile={profile}
              onAddTask={handleAddTask}
              onTaskClick={handleTaskClick}
              onGoalClick={handleGoalClick}
              onOpenRecovery={() => setRecoveryOpen(true)}
              onToggleTask={handleToggleTask}
              onOpenProfile={() => handleNavClick('profile')}
              onOpenNotifications={() => setRecoveryOpen(true)}
            />
          ) : view === 'calendar' ? (
            <CalendarView tasks={tasks} onTaskClick={handleTaskClick} />
          ) : view === 'goals' ? (
            <GoalsScreen goals={goals} tasks={tasks} onGoalClick={handleGoalClick} />
          ) : view === 'profile' ? (
            <ProfileScreen
              profile={profile}
              onBuyItem={handleBuyItem}
              onEquipAvatar={handleEquipAvatar}
              onEquipBadge={handleEquipBadge}
              onNavigateSettings={() => handleNavClick('settings')}
            />
          ) : view === 'settings' ? (
            <SettingsScreen
              preferences={prefs}
              zones={zones}
              onUpdatePrefs={setPrefs}
              onUpdateZones={setZones}
            />
          ) : null}
        </div>
      </main>

      {/* Floating bottom nav (mobile + tablet) */}
      <nav className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center justify-center gap-1 px-2 h-16 bg-white rounded-[24px] border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          {navItems.slice(0, 2).map((item) => (
            <NavButton key={item.id} item={item} active={view === item.id} onClick={() => handleNavClick(item.id)} />
          ))}
          <div className="w-16 shrink-0" />
          {navItems.slice(2).map((item) => (
            <NavButton key={item.id} item={item} active={view === item.id} onClick={() => handleNavClick(item.id)} />
          ))}
        </div>

        <button
          onClick={handleAddTask}
          className="absolute left-1/2 -translate-x-1/2 -top-7 w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(34,197,94,0.4)] active:scale-92 transition-transform"
          aria-label="Add task"
        >
          <Plus size={26} />
        </button>
      </nav>

      {/* Modals */}
      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        existingTasks={tasks}
        editTask={editTask}
      />
      <TaskDetail
        task={detailTask}
        open={taskDetailOpen}
        onClose={() => setTaskDetailOpen(false)}
        onEdit={handleEditTask}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
      />
      <RecoveryModal
        open={recoveryOpen}
        onClose={() => setRecoveryOpen(false)}
        burnout={burnout}
        suggestions={suggestions}
      />
    </div>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: { id: AppView; label: string; icon: typeof Home };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all min-w-[48px] min-h-[48px] justify-center active:scale-95 ${
        active ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:bg-slate-100'
      }`}
    >
      <item.icon size={22} />
      <span className="text-[10px] font-medium">{item.label}</span>
    </button>
  );
}
