import { useState } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { Badge } from '../components/Badge';
import { Spinner } from '../components/Spinner';
import { zoneConfig, zoneOrder } from '../zoneConfig';
import type { Task, ZoneId, Priority, TaskStatus } from '../types';
import { Sparkles, Check, X } from 'lucide-react';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  existingTasks: Task[];
  editTask?: Task | null;
}

const durations = [15, 30, 45, 60];

export function TaskModal({ open, onClose, onSave, existingTasks, editTask }: TaskModalProps) {
  const [name, setName] = useState(editTask?.name ?? '');
  const [zone, setZone] = useState<ZoneId>(editTask?.zone ?? 'study');
  const [duration, setDuration] = useState(editTask?.duration ?? 30);
  const [customDuration, setCustomDuration] = useState(false);
  const [dueDate, setDueDate] = useState(editTask?.dueDate ?? '');
  const [startTime, setStartTime] = useState(editTask?.startTime ?? '');
  const [recurring, setRecurring] = useState(editTask?.recurring ?? 'none');
  const [priority, setPriority] = useState<Priority>(editTask?.priority ?? 'medium');
  const [notes, setNotes] = useState(editTask?.notes ?? '');
  const [dependencies, setDependencies] = useState<string[]>(editTask?.dependencies ?? []);
  const [goalId, setGoalId] = useState(editTask?.goalId ?? '');
  const [aiBreakdown, setAiBreakdown] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSubtasks, setAiSubtasks] = useState<string[]>([]);

  const handleSave = () => {
    onSave({
      id: editTask?.id,
      name,
      zone,
      duration,
      dueDate: dueDate || undefined,
      startTime: startTime || undefined,
      recurring,
      priority,
      notes: notes || undefined,
      dependencies,
      goalId: goalId || undefined,
      status: editTask?.status ?? ('todo' as TaskStatus),
    });
    handleReset();
  };

  const handleReset = () => {
    setName('');
    setZone('study');
    setDuration(30);
    setCustomDuration(false);
    setDueDate('');
    setStartTime('');
    setRecurring('none');
    setPriority('medium');
    setNotes('');
    setDependencies([]);
    setGoalId('');
    setAiBreakdown(false);
    setAiSubtasks([]);
  };

  const handleAiBreakdown = () => {
    if (!aiBreakdown) {
      setAiBreakdown(true);
      setAiLoading(true);
      setTimeout(() => {
        setAiLoading(false);
        setAiSubtasks([
          'Research and gather materials',
          'Create outline / structure',
          'Draft first version',
          'Review and refine',
        ]);
      }, 1500);
    } else {
      setAiBreakdown(false);
      setAiSubtasks([]);
    }
  };

  const toggleDependency = (taskId: string) => {
    setDependencies((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editTask ? 'Edit task' : 'Create a task'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {editTask ? 'Save changes' : 'Save task'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* A. Task Basics */}
        <div>
          <Input
            label="Task name"
            placeholder="e.g., Read Chapter 5 of React docs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Zone</label>
            <div className="grid grid-cols-4 gap-2">
              {zoneOrder.map((z) => {
                const cfg = zoneConfig[z];
                return (
                  <button
                    key={z}
                    onClick={() => setZone(z)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all ${
                      zone === z
                        ? 'border-brand bg-brand-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: cfg.color }}
                    />
                    <span className="text-[11px] font-medium text-slate-700">{cfg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
            <div className="flex gap-2 flex-wrap">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDuration(d);
                    setCustomDuration(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    !customDuration && duration === d
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d < 60 ? `${d} min` : '1 hr'}
                </button>
              ))}
              <button
                onClick={() => setCustomDuration(true)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  customDuration ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Custom
              </button>
            </div>
            {customDuration && (
              <input
                type="number"
                min={5}
                max={480}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                className="mt-2 w-24 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-brand"
              />
            )}
          </div>
        </div>

        {/* B. Schedule */}
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Schedule</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Due date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Input
              label="Start time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Recurring</label>
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value as Task['recurring'] ?? 'none')}
              className="w-full min-h-[44px] px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* C. Advanced */}
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Advanced</h4>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    priority === p
                      ? p === 'high'
                        ? 'bg-alert-500 text-white'
                        : p === 'medium'
                          ? 'bg-warning-500 text-white'
                          : 'bg-slate-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Dependencies
            </label>
            <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-200 rounded-lg p-2">
              {existingTasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">No other tasks available</p>
              ) : (
                existingTasks
                  .filter((t) => t.id !== editTask?.id)
                  .map((t) => (
                    <label
                      key={t.id}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={dependencies.includes(t.id)}
                        onChange={() => toggleDependency(t.id)}
                        className="accent-brand-500"
                      />
                      <span className="text-xs text-slate-700 truncate">{t.name}</span>
                    </label>
                  ))
              )}
            </div>
          </div>

          <div className="mt-3">
            <Textarea
              label="Notes"
              placeholder="Sub-steps, context, or details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* D. AI Assistant */}
        <div className="pt-4 border-t border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={aiBreakdown}
              onChange={handleAiBreakdown}
              className="accent-brand-500 w-4 h-4"
            />
            <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Sparkles size={15} className="text-brand-500" />
              Let AI break this down into smaller tasks
            </span>
          </label>

          {aiLoading && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-brand-50 rounded-lg">
              <Spinner size={18} className="text-brand-500" />
              <span className="text-sm text-brand-700">
                I'll create 3-4 smaller tasks based on your task...
              </span>
            </div>
          )}

          {aiSubtasks.length > 0 && (
            <div className="mt-3 space-y-2">
              {aiSubtasks.map((subtask, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Check size={16} className="text-success-500" />
                  <input
                    defaultValue={subtask}
                    className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-slate-700"
                  />
                  <button className="text-slate-300 hover:text-alert-500">
                    <X size={16} />
                  </button>
                </div>
              ))}
              <Badge color="brand">AI suggested — editable</Badge>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
