import { useState } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { zoneConfig } from '../zoneConfig';
import type { Task } from '../types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

type ViewMode = 'timeline' | 'week' | 'month';

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getWeekStart(offset: number): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatHour(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}${period}`;
}

export function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [mode, setMode] = useState<ViewMode>('timeline');
  const [dayOffset, setDayOffset] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const tasksForDate = (date: Date) =>
    tasks.filter((t) => {
      if (!t.scheduledDate) return false;
      return new Date(t.scheduledDate).toDateString() === date.toDateString();
    });

  // === Timeline View ===
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + dayOffset);
  const dayTasks = tasksForDate(currentDate);

  // === Week View ===
  const weekStart = getWeekStart(weekOffset);
  const weekDays = dayNames.map((day, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return { day, date };
  });
  const weekTasks = weekDays.flatMap((d) => tasksForDate(d.date));
  const weekCompleted = weekTasks.filter((t) => t.status === 'completed').length;
  const weekTotal = weekTasks.length;
  const weekPct = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

  const zoneMinutes: Record<string, number> = {};
  weekTasks.forEach((t) => {
    zoneMinutes[t.zone] = (zoneMinutes[t.zone] ?? 0) + t.duration;
  });
  const totalMinutes = Object.values(zoneMinutes).reduce((a, b) => a + b, 0);

  // === Month View ===
  const monthDate = new Date();
  monthDate.setMonth(monthDate.getMonth() + monthOffset);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthCells: (Date | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) monthCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) monthCells.push(new Date(year, month, d));
  while (monthCells.length < 42) monthCells.push(null);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {(['timeline', 'week', 'month'] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                mode === m
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* === Timeline View === */}
      {mode === 'timeline' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {fullDayNames[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setDayOffset(dayOffset - 1)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setDayOffset(0)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                Today
              </button>
              <button
                onClick={() => setDayOffset(dayOffset + 1)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <Card padding="sm">
            <div
              className="overflow-y-auto"
              style={{ maxHeight: 'min(500px, 70vh)', WebkitOverflowScrolling: 'touch' }}
            >
              {hours.map((hour, i) => {
                const hourTasks = dayTasks.filter((t) => {
                  if (!t.startTime) return false;
                  return parseInt(t.startTime.split(':')[0]) === hour;
                });
                const isLast = i === hours.length - 1;
                return (
                  <div key={hour} className={`flex ${isLast ? '' : 'border-b border-slate-100'}`}>
                    <div className="w-16 shrink-0 text-right pr-3 pt-2">
                      <span className="text-[11px] text-slate-400 font-mono">{formatHour(hour)}</span>
                    </div>
                    <div className="flex-1 min-h-[56px] py-1.5 pr-2 relative">
                      {hourTasks.map((task) => {
                        const cfg = zoneConfig[task.zone];
                        return (
                          <button
                            key={task.id}
                            onClick={() => onTaskClick(task)}
                            className="w-full text-left rounded-lg px-3 py-2 mb-1 transition-all hover:scale-[1.01] hover:shadow-md"
                            style={{
                              backgroundColor: cfg.color,
                              minHeight: '48px',
                            }}
                          >
                            <p className="text-sm font-medium text-white truncate">{task.name}</p>
                            <p className="text-[11px] text-white/80 font-mono mt-0.5">
                              {task.startTime} · {task.duration}min
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {dayTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar size={32} className="text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400">No tasks scheduled for this day</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* === Week View === */}
      {mode === 'week' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">This Week</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —{' '}
                {new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setWeekOffset(weekOffset - 1)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setWeekOffset(0)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                Today
              </button>
              <button
                onClick={() => setWeekOffset(weekOffset + 1)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <Card padding="sm" className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Day headers */}
              <div className="flex border-b border-slate-200">
                <div className="w-14 shrink-0" />
                {weekDays.map(({ day, date }) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div key={day} className="flex-1 text-center py-2">
                      <p className="text-xs font-medium text-slate-400 uppercase">{day}</p>
                      <p
                        className={`text-lg font-bold mt-0.5 ${
                          isToday ? 'text-brand-600' : 'text-slate-700'
                        }`}
                      >
                        {date.getDate()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Time grid */}
              <div
                className="overflow-y-auto"
                style={{ maxHeight: 'min(500px, 60vh)', WebkitOverflowScrolling: 'touch' }}
              >
                {hours.filter((_, i) => i % 2 === 0).map((hour) => (
                  <div key={hour} className="flex border-b border-slate-100 h-16">
                    <div className="w-14 shrink-0 text-right pr-2 pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatHour(hour)}
                      </span>
                    </div>
                    {weekDays.map(({ date }) => {
                      const dayTasks = tasksForDate(date);
                      const hourTasks = dayTasks.filter((t) => {
                        if (!t.startTime) return false;
                        const h = parseInt(t.startTime.split(':')[0]);
                        return h === hour || h === hour + 1;
                      });
                      return (
                        <div
                          key={date.toISOString() + hour}
                          className="flex-1 border-l border-slate-100 relative"
                        >
                          {hourTasks.map((task) => {
                            const cfg = zoneConfig[task.zone];
                            return (
                              <button
                                key={task.id}
                                onClick={() => onTaskClick(task)}
                                className="absolute inset-0.5 rounded-md px-1.5 py-1 text-left text-white text-[10px] font-medium overflow-hidden transition-all hover:scale-[1.02] hover:z-10 hover:shadow-md"
                                style={{ backgroundColor: cfg.color }}
                              >
                                <p className="truncate">{task.name}</p>
                                <p className="opacity-80 font-mono mt-0.5">{task.startTime}</p>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Week Stats */}
          <Card padding="md">
            <h3 className="text-base font-bold text-slate-900 mb-3">Week Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Tasks completed</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {weekCompleted} of {weekTotal} ({weekPct}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success-500 rounded-full transition-all duration-500"
                    style={{ width: `${weekPct}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm text-slate-600">Burnout trend:</span>
                  <Badge color="warning">Rising</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Hours per zone</p>
                <div className="space-y-1.5">
                  {Object.entries(zoneConfig).map(([id, cfg]) => {
                    const mins = zoneMinutes[id] ?? 0;
                    const pct = totalMinutes > 0 ? (mins / totalMinutes) * 100 : 0;
                    return (
                      <div key={id} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                        <span className="text-xs text-slate-600 w-16">{cfg.name}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-10 text-right">
                          {(mins / 60).toFixed(1)}h
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* === Month View === */}
      {mode === 'month' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMonthOffset(monthOffset - 1)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setMonthOffset(0)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                Today
              </button>
              <button
                onClick={() => setMonthOffset(monthOffset + 1)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <Card padding="sm">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {dayNames.map((day) => (
                <div key={day} className="text-center py-2">
                  <span className="text-xs font-medium text-slate-400 uppercase">{day.slice(0, 3)}</span>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {monthCells.map((date, i) => {
                if (!date) {
                  return <div key={i} className="h-24 bg-slate-50 rounded-lg" />;
                }
                const isToday = date.toDateString() === new Date().toDateString();
                const dayTasks = tasksForDate(date);
                const hasTasks = dayTasks.length > 0;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (dayTasks.length > 0) {
                        onTaskClick(dayTasks[0]);
                      }
                    }}
                    className={`h-24 rounded-lg border p-1.5 text-left transition-all hover:shadow-sm ${
                      hasTasks ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-bold ${
                          isToday
                            ? 'w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center'
                            : 'text-slate-700'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-[10px] text-slate-400">{dayTasks.length}</span>
                      )}
                    </div>
                    {dayTasks.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: zoneConfig[task.zone].color }}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <span className="text-[9px] text-slate-400">+{dayTasks.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
