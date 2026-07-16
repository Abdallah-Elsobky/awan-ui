import { useState } from 'react';
import { Toggle } from '../components/Toggle';
import type { UserPreferences, Zone } from '../types';
import {
  Plus,
  LogOut,
  Trash2,
  ChevronRight,
  ChevronDown,
  Moon,
  Sun,
  Monitor,
  Sparkles,
} from 'lucide-react';

interface SettingsScreenProps {
  preferences: UserPreferences;
  zones: Zone[];
  onUpdatePrefs: (prefs: UserPreferences) => void;
  onUpdateZones: (zones: Zone[]) => void;
}

type Theme = 'light' | 'dark' | 'auto';
type TextSize = 'smaller' | 'default' | 'larger';

function SectionHeader({ children }: { children: string }) {
  return (
    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
      {children}
    </h2>
  );
}

function SettingsRow({
  label,
  description,
  children,
  onClick,
  showArrow,
}: {
  label: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  showArrow?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between gap-3 py-3 px-1 ${onClick ? 'cursor-pointer hover:bg-slate-50 rounded-lg -mx-1 px-1' : ''}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      {children}
      {showArrow && <ChevronRight size={18} className="text-slate-300 shrink-0" />}
    </div>
  );
}

export function SettingsScreen({ preferences, zones, onUpdatePrefs, onUpdateZones }: SettingsScreenProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [textSize, setTextSize] = useState<TextSize>('default');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [burnoutTracking, setBurnoutTracking] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);

  const updateZone = (id: string, updates: Partial<Zone>) => {
    const updatedZones = zones.map((z) => (z.id === id ? { ...z, ...updates } as Zone : z));
    onUpdateZones(updatedZones);
  };

  const updateNotif = (key: keyof UserPreferences['notifications'], value: boolean) => {
    onUpdatePrefs({
      ...preferences,
      notifications: { ...preferences.notifications, [key]: value },
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Settings</h1>

      {/* ACCOUNT */}
      <section className="mb-8">
        <SectionHeader>Account</SectionHeader>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-study-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <input
                defaultValue="Jane Doe"
                className="text-base font-semibold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 w-full"
              />
              <p className="text-xs text-slate-400 mt-0.5">jane@example.com</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-alert-500 text-white text-sm font-bold hover:opacity-90 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </section>

      {/* ZONES */}
      <section className="mb-8">
        <SectionHeader>Zones</SectionHeader>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="space-y-2">
            {zones.map((zone) => {
              const isActive = activeZoneId === zone.id;
              return (
                <div
                  key={zone.id}
                  className="border border-slate-150 rounded-xl overflow-hidden transition-all bg-slate-55/30"
                >
                  <div
                    onClick={() => setActiveZoneId(isActive ? null : zone.id)}
                    className="flex items-center gap-3 py-3 px-3 hover:bg-slate-50 transition-all cursor-pointer select-none"
                  >
                    <div
                      className="w-7 h-7 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: zone.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{zone.name}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {zone.capacity}h/day
                    </span>
                    {isActive ? (
                      <ChevronDown size={18} className="text-slate-500 shrink-0" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-300 shrink-0" />
                    )}
                  </div>

                  {isActive && (
                    <div className="px-4 pb-4 pt-2 bg-white border-t border-slate-100 space-y-4 animate-slide-down">
                      {/* Name Edit */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Zone Name
                        </label>
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                          className="w-full min-h-[40px] px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                      </div>

                      {/* Capacity Slider */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Daily capacity
                          </label>
                          <span className="text-sm font-bold text-brand-600">{zone.capacity} hours</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={12}
                          value={zone.capacity}
                          onChange={(e) =>
                            updateZone(zone.id, { capacity: parseInt(e.target.value) })
                          }
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        />
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {zone.id === 'work' && "💡 Work capacity directly affects your burnout prediction. Higher scheduled work hours will increase your load profile."}
                          {zone.id === 'study' && "💡 Study capacity tracks your learning load. Keeping it to 2-4 hours is optimal for intense focus."}
                          {zone.id === 'play' && "💡 Play provides essential restorative energy. Setting it to 1-3 hours balances weekly stress metrics."}
                          {zone.id === 'personal' && "💡 Personal capacity includes life admin and wellness, restoring daily productivity bandwidth."}
                        </p>
                      </div>

                      {/* Color Picker */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Theme Color
                        </label>
                        <div className="flex gap-2.5 pt-1">
                          {['#8B5CF6', '#3B82F6', '#EC4899', '#14B8A6', '#F59E0B', '#EF4444'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => updateZone(zone.id, { color: c })}
                              className={`w-7 h-7 rounded-full transition-all relative border border-slate-200 flex items-center justify-center ${
                                zone.color === c ? 'scale-110 ring-2 ring-brand-500 ring-offset-2' : 'hover:scale-105'
                              }`}
                              style={{ backgroundColor: c }}
                            >
                              {zone.color === c && (
                                <span className="text-white text-[10px] font-bold">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Required Today Toggle */}
                      <div className="pt-3 border-t border-slate-100">
                        <Toggle
                          checked={zone.requiredToday}
                          onChange={(v) => updateZone(zone.id, { requiredToday: v })}
                          label="Required today?"
                          description="Determine if this zone's tasks are mandatory for today's schedule."
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button className="w-full h-12 mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-600 hover:border-brand hover:text-brand transition-all">
            <Plus size={16} /> Add Custom Zone
          </button>
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="mb-8">
        <SectionHeader>Notifications</SectionHeader>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="space-y-1">
            <Toggle
              checked={preferences.notifications.taskReminders}
              onChange={(v) => updateNotif('taskReminders', v)}
              label="Task Reminders"
              description="Get reminded 15 minutes before tasks"
            />
            <div className="border-t border-slate-100" />
            <Toggle
              checked={preferences.notifications.missedTasks}
              onChange={(v) => updateNotif('missedTasks', v)}
              label="Missed Task Alerts"
              description="Notify when you skip a scheduled task"
            />
            <div className="border-t border-slate-100" />
            <Toggle
              checked={preferences.notifications.burnoutAlerts}
              onChange={(v) => updateNotif('burnoutAlerts', v)}
              label="Burnout Predictions"
              description="Receive alerts when burnout risk is detected"
            />
            <div className="border-t border-slate-100" />
            <Toggle
              checked={preferences.notifications.dailySummary}
              onChange={(v) => updateNotif('dailySummary', v)}
              label="Daily Summary Email"
              description="Get a weekly email recap of your progress"
            />
            <div className="border-t border-slate-100" />
            <Toggle
              checked={preferences.notifications.deadlineWarnings}
              onChange={(v) => updateNotif('deadlineWarnings', v)}
              label="Deadline Warnings"
              description="Alert if deadline is less than 2 days away"
            />
          </div>

          {/* Quiet hours */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-900 mb-1">Quiet hours</p>
            <p className="text-xs text-slate-500 mb-2">Won't receive notifications during quiet hours</p>
            <div className="flex items-center gap-2">
              <input
                type="time"
                defaultValue="22:00"
                className="min-h-[40px] px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-brand"
              />
              <span className="text-sm text-slate-400">to</span>
              <input
                type="time"
                defaultValue="08:00"
                className="min-h-[40px] px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DISPLAY & ACCESSIBILITY */}
      <section className="mb-8">
        <SectionHeader>Display & Accessibility</SectionHeader>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="space-y-4">
            {/* Language */}
            <SettingsRow label="Language">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="min-h-[40px] px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-brand"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Japanese</option>
              </select>
            </SettingsRow>

            <div className="border-t border-slate-100" />

            {/* Theme */}
            <div>
              <SettingsRow label="Theme" />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {([
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'auto', label: 'Auto', icon: Monitor },
                ] as { id: Theme; label: string; icon: typeof Sun }[]).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                      theme === t.id
                        ? 'border-brand bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <t.icon size={18} />
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Text Size */}
            <div>
              <SettingsRow label="Text Size" />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(['smaller', 'default', 'larger'] as TextSize[]).map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setTextSize(s)}
                    className={`py-2.5 rounded-xl border-2 font-medium capitalize transition-all ${
                      textSize === s
                        ? 'border-brand bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                    style={{ fontSize: i === 0 ? '11px' : i === 1 ? '13px' : '15px' }}
                  >
                    A
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100" />

            <Toggle
              checked={reducedMotion}
              onChange={setReducedMotion}
              label="Reduce motion"
              description="Disable animations for a simpler experience"
            />
          </div>
        </div>
      </section>

      {/* PRIVACY & DATA */}
      <section className="mb-8">
        <SectionHeader>Privacy & Data</SectionHeader>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="space-y-1">
            <SettingsRow
              label="Export my data"
              description="Download all your data as JSON"
              showArrow
              onClick={() => {}}
            />
            <div className="border-t border-slate-100" />
            <Toggle
              checked={burnoutTracking}
              onChange={setBurnoutTracking}
              label="Burnout tracking"
              description="Allow burnout analysis and recovery suggestions"
            />
            <div className="border-t border-slate-100" />
            <Toggle
              checked={analytics}
              onChange={setAnalytics}
              label="Share analytics"
              description="Help improve AWAN with anonymous usage data"
            />
          </div>
          <button className="w-full h-12 mt-4 flex items-center justify-center gap-2 rounded-xl bg-alert-50 text-alert-600 text-sm font-bold hover:bg-alert-100 transition-all">
            <Trash2 size={16} /> Delete account permanently
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mb-8">
        <SectionHeader>About</SectionHeader>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="space-y-1">
            <SettingsRow label="Version">
              <span className="text-xs text-slate-400 font-mono">v1.2.0</span>
            </SettingsRow>
            <div className="border-t border-slate-100" />
            <SettingsRow label="What's new" showArrow onClick={() => {}} />
            <div className="border-t border-slate-100" />
            <SettingsRow label="Help & support" showArrow onClick={() => {}} />
            <div className="border-t border-slate-100" />
            <SettingsRow label="Send feedback" showArrow onClick={() => {}} />
          </div>
        </div>
      </section>

      <div className="text-center pb-4">
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
          <Sparkles size={12} /> AWAN — Your guilt-free productivity companion
        </p>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-scale-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-alert-50 flex items-center justify-center mb-3">
                <LogOut size={24} className="text-alert-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Are you sure?</h3>
              <p className="text-sm text-slate-500 mb-5">You'll be logged out of your account.</p>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 h-12 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 h-12 rounded-xl bg-alert-500 text-white text-sm font-bold hover:opacity-90 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
