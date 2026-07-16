import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Toggle } from '../components/Toggle';
import { Input } from '../components/Input';
import { zoneConfig, zoneOrder } from '../zoneConfig';
import type { Zone, UserPreferences, ZoneId } from '../types';
import { ChevronRight, Check, Clock, Bell, Heart } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (zones: Zone[], prefs: UserPreferences) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<'zones' | 'preferences'>('zones');
  const [zones, setZones] = useState<Zone[]>([
    { id: 'study', name: 'Study', color: '#8B5CF6', capacity: 4, requiredToday: true },
    { id: 'work', name: 'Work', color: '#3B82F6', capacity: 6, requiredToday: true },
    { id: 'play', name: 'Play', color: '#EC4899', capacity: 2, requiredToday: false },
    { id: 'personal', name: 'Personal', color: '#14B8A6', capacity: 3, requiredToday: false },
  ]);

  const [prefs, setPrefs] = useState<UserPreferences>({
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
  });

  const updateZone = (id: ZoneId, updates: Partial<Zone>) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...updates } : z)));
  };

  const updateNotif = (key: keyof UserPreferences['notifications'], value: boolean) => {
    setPrefs((prev) => ({ ...prev, notifications: { ...prev.notifications, [key]: value } }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-slate-200">
        <div
          className="h-full bg-brand-600 transition-all duration-500"
          style={{ width: step === 'zones' ? '50%' : '100%' }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl">
          {step === 'zones' ? (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 mb-3">
                  <Heart size={24} className="text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Let's set up your zones</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Zones help categorize your tasks and track energy across life areas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {zoneOrder.map((zoneId) => {
                  const zone = zones.find((z) => z.id === zoneId)!;
                  const cfg = zoneConfig[zoneId];
                  void cfg;
                  return (
                    <Card key={zoneId} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full shrink-0"
                          style={{ backgroundColor: zone.color }}
                        />
                        <input
                          value={zone.name}
                          onChange={(e) => updateZone(zoneId, { name: e.target.value })}
                          className="text-base font-bold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        {zoneId === 'study' && 'Learning, reading, and skill-building tasks.'}
                        {zoneId === 'work' && 'Professional tasks and deadlines.'}
                        {zoneId === 'play' && 'Hobbies, entertainment, and fun.'}
                        {zoneId === 'personal' && 'Health, wellness, and life admin.'}
                      </p>
                      <div>
                        <label className="text-xs font-medium text-slate-600 flex items-center justify-between mb-1">
                          <span>Daily capacity</span>
                          <span className="text-brand-600 font-semibold">{zone.capacity}h</span>
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={12}
                          value={zone.capacity}
                          onChange={(e) =>
                            updateZone(zoneId, { capacity: parseInt(e.target.value) })
                          }
                          className="w-full accent-brand-500"
                        />
                      </div>
                      <Toggle
                        checked={zone.requiredToday}
                        onChange={(v) => updateZone(zoneId, { requiredToday: v })}
                        label="Required today?"
                      />
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={() => setStep('preferences')} size="lg">
                  Continue <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 mb-3">
                  <Clock size={24} className="text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Your preferences</h2>
                <p className="text-sm text-slate-500 mt-1">
                  We'll use these to tailor your schedule and notifications.
                </p>
              </div>

              <Card className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Timezone
                    </label>
                    <select
                      value={prefs.timezone}
                      onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      <option>UTC-08:00 (Pacific)</option>
                      <option>UTC-05:00 (Eastern)</option>
                      <option>UTC+00:00 (GMT)</option>
                      <option>UTC+01:00 (Central European)</option>
                      <option>UTC+05:30 (India)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Work-life balance
                    </label>
                    <select
                      value={prefs.workLifeBalance}
                      onChange={(e) =>
                        setPrefs({
                          ...prefs,
                          workLifeBalance: e.target.value as UserPreferences['workLifeBalance'],
                        })
                      }
                      className="w-full min-h-[44px] px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="flexible">Flexible</option>
                      <option value="balanced">Balanced</option>
                      <option value="work-focused">Work-focused</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Daily start time"
                    type="time"
                    value={prefs.dailyStart}
                    onChange={(e) => setPrefs({ ...prefs, dailyStart: e.target.value })}
                  />
                  <Input
                    label="Daily end time"
                    type="time"
                    value={prefs.dailyEnd}
                    onChange={(e) => setPrefs({ ...prefs, dailyEnd: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred task duration
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[15, 25, 30, 45, 60].map((d) => (
                      <button
                        key={d}
                        onClick={() => setPrefs({ ...prefs, preferredDuration: d })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          prefs.preferredDuration === d
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {d} min
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell size={16} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Notifications</span>
                  </div>
                  <div className="space-y-3">
                    <Toggle
                      checked={prefs.notifications.taskReminders}
                      onChange={(v) => updateNotif('taskReminders', v)}
                      label="Task reminders"
                      description="Get notified 15-30 min before tasks"
                    />
                    <Toggle
                      checked={prefs.notifications.missedTasks}
                      onChange={(v) => updateNotif('missedTasks', v)}
                      label="Missed task alerts"
                      description="Alerts when tasks are missed"
                    />
                    <Toggle
                      checked={prefs.notifications.burnoutAlerts}
                      onChange={(v) => updateNotif('burnoutAlerts', v)}
                      label="Burnout predictions"
                      description="AI-powered burnout risk alerts"
                    />
                    <Toggle
                      checked={prefs.notifications.dailySummary}
                      onChange={(v) => updateNotif('dailySummary', v)}
                      label="Daily summary email"
                      description="End-of-day recap of your progress"
                    />
                    <Toggle
                      checked={prefs.notifications.deadlineWarnings}
                      onChange={(v) => updateNotif('deadlineWarnings', v)}
                      label="Deadline warnings"
                      description="Heads up before upcoming deadlines"
                    />
                  </div>
                </div>
              </Card>

              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={() => setStep('zones')}>
                  Back
                </Button>
                <Button onClick={() => onComplete(zones, prefs)} size="lg">
                  <Check size={18} /> Complete Setup
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
