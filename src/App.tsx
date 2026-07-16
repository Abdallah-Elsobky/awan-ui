import { useState, useMemo } from 'react';
import { Sparkles, Home, Plus, Zap, Target, User, Calendar, Sun, Moon, Eye } from 'lucide-react';
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
  const [mockupSize, setMockupSize] = useState<'S' | 'M' | 'L'>('L');
  const [mockupTheme, setMockupTheme] = useState<'light' | 'dark' | 'eyeMode'>('dark');
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

  const showRecoveryBadge = suggestions.length > 0;
  const navItems: { id: AppView; label: string; icon: typeof Home }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Week', icon: Calendar },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <MobileMockup
      theme={mockupTheme}
      size={mockupSize}
      onThemeChange={setMockupTheme}
      onSizeChange={setMockupSize}
    >
      {appState === 'auth' ? (
        <AuthScreen onComplete={handleAuthComplete} />
      ) : appState === 'onboarding' ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-30 glass border-b border-slate-200 px-4 py-3 flex items-center justify-between">
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
          <main className="flex-1 pb-28 pt-2 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 py-4">
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

          {/* Floating bottom nav */}
          <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
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
      )}
    </MobileMockup>
  );
}

interface MobileMockupProps {
  children: React.ReactNode;
  theme: 'light' | 'dark' | 'eyeMode';
  size: 'S' | 'M' | 'L';
  onThemeChange: (theme: 'light' | 'dark' | 'eyeMode') => void;
  onSizeChange: (size: 'S' | 'M' | 'L') => void;
}

function MobileMockup({
  children,
  theme,
  size,
  onThemeChange,
  onSizeChange,
}: MobileMockupProps) {
  return (
    <div className={`mockup-page-wrapper theme-${theme}`}>
      {/* Drifting background clouds */}
      <div className="ambient-cloud cloud-1" />
      <div className="ambient-cloud cloud-2" />
      <div className="ambient-cloud cloud-3" />

      {/* Settings control panel */}
      <div className="control-panel-card">
        <h3 className="text-xs font-bold tracking-wider uppercase opacity-80 mb-3.5">Environment</h3>

        {/* Mockup size selection */}
        <div className="mb-4">
          <label className="text-[10px] font-bold opacity-60 block mb-1.5 uppercase tracking-wide">Mockup Size</label>
          <div className="flex gap-1.5">
            {(['S', 'M', 'L'] as const).map((s) => (
              <button
                key={s}
                onClick={() => onSizeChange(s)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all border ${
                  size === s
                    ? 'bg-brand text-white border-brand shadow-sm'
                    : 'bg-slate-500/5 hover:bg-slate-500/10 border-transparent'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Mockup background theme selection */}
        <div>
          <label className="text-[10px] font-bold opacity-60 block mb-1.5 uppercase tracking-wide">Backdrop Theme</label>
          <div className="flex gap-1.5">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'eyeMode', label: 'Eye Care', icon: Eye },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onThemeChange(t.id as any)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all border ${
                    isActive
                      ? 'bg-brand text-white border-brand shadow-sm'
                      : 'bg-slate-500/5 hover:bg-slate-500/10 border-transparent'
                  }`}
                  title={`${t.label} Theme`}
                >
                  <Icon size={13} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Phone container */}
      <div className={`phone-container phone-size-${size.toLowerCase()}`}>
        {/* Physical buttons */}
        <div className="phone-button silent-switch" />
        <div className="phone-button volume-up" />
        <div className="phone-button volume-down" />
        <div className="phone-button power" />

        {/* Frame */}
        <div className="phone-frame">
          <div className="phone-screen">
            {/* Status bar */}
            <div className="phone-status-bar">
              <span className="text-xs font-semibold select-none text-slate-800">9:41</span>
              <div className="dynamic-island">
                <div className="island-lens" />
              </div>
              <div className="flex items-center gap-1.5 text-slate-800 select-none">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c3.9 3.89 10.21 3.89 14.1 0l1.38-1.79C21.06 16.07 21.8 14.12 21.8 12c0-4.97-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 3.3-6 6z" />
                </svg>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L12 15v5.93zm5.07-2.66c-.3-.8-.86-1.5-1.57-2L15 13v-2h-2V9H9V7h4v2h2v4l3.5 2.1c.42-.92.68-1.93.68-3.1 0-3.31-2.69-6-6-6-1.39 0-2.67.48-3.69 1.28L8 4.31C9.17 3.51 10.53 3 12 3c4.97 0 9 4.03 9 9 0 2.21-.8 4.22-2.12 5.77z" />
                </svg>
                <div className="w-5.5 h-3 border border-slate-800 rounded-[4px] p-[1.5px] flex items-center">
                  <div className="h-full w-3 bg-slate-800 rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Screen Content */}
            <div className="phone-content overflow-y-auto overflow-x-hidden">
              {children}
            </div>

            {/* Home indicator */}
            <div className="home-indicator" />
          </div>
        </div>
      </div>
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
