import { useState } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { Badge } from '../components/Badge';
import { Spinner } from '../components/Spinner';
import { zoneConfig, zoneOrder } from '../zoneConfig';
import type { Task, Goal, ZoneId } from '../types';
import {
  Plus,
  Sparkles,
  Target,
  RefreshCw,
  Check,
  X,
} from 'lucide-react';

interface GoalsScreenProps {
  goals: Goal[];
  tasks: Task[];
  onGoalClick: (g: Goal) => void;
}

const zoneColors: Record<string, string> = {
  study: '#8B5CF6',
  work: '#3B82F6',
  play: '#EC4899',
  personal: '#14B8A6',
};

export function GoalsScreen({ goals, tasks, onGoalClick }: GoalsScreenProps) {
  const [manualOpen, setManualOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Goals</h2>
          <p className="text-sm text-slate-500 mt-0.5">Set goals to break them down into tasks</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={() => setManualOpen(true)} size="md">
            <Plus size={16} /> Add Goal Manually
          </Button>
          <Button onClick={() => setAiOpen(true)} size="md" className="bg-study-600 hover:bg-study-700">
            <Sparkles size={16} /> AI Goal Generation
          </Button>
        </div>
      </div>

      {/* Goals list */}
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
            <Target size={36} className="text-brand-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No goals yet</h3>
          <p className="text-sm text-slate-500 mb-5">Create your first goal to get started</p>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Button onClick={() => setManualOpen(true)}>
              <Plus size={16} /> Add Goal Manually
            </Button>
            <Button variant="secondary" onClick={() => setAiOpen(true)}>
              <Sparkles size={16} /> Generate with AI
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const goalTasks = goal.taskIds
              .map((id) => tasks.find((t) => t.id === id))
              .filter(Boolean) as Task[];
            const done = goalTasks.filter((t) => t.status === 'completed').length;
            const total = goalTasks.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const days = Math.ceil(
              (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            const color = zoneColors[goal.zone] ?? '#6366F1';

            return (
              <div
                key={goal.id}
                onClick={() => onGoalClick(goal)}
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-card hover:shadow-card-hover hover:border-slate-300 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white"
                      style={{ backgroundColor: color }}
                    >
                      <Target size={14} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 truncate">{goal.name}</h3>
                  </div>
                  <span
                    className={`text-xs font-medium shrink-0 ${
                      days < 2 ? 'text-alert-600' : days < 7 ? 'text-warning-600' : 'text-slate-400'
                    }`}
                  >
                    {days <= 0 ? 'Overdue' : `${days}d left`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{goal.description}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-xs font-semibold" style={{ color }}>
                    {pct}%
                  </span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {done}/{total} tasks
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ManualGoalModal open={manualOpen} onClose={() => setManualOpen(false)} />
      <AIGoalModal open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

function ManualGoalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [zone, setZone] = useState<ZoneId>('study');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(20);
  const [aiBreakdown, setAiBreakdown] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTasks, setAiTasks] = useState<string[]>([]);

  const handleAiToggle = () => {
    if (!aiBreakdown) {
      setAiBreakdown(true);
      setAiLoading(true);
      setTimeout(() => {
        setAiLoading(false);
        setAiTasks([
          'Research and gather resources',
          'Create a study plan',
          'Complete first module',
          'Practice with exercises',
          'Review and assess progress',
        ]);
      }, 1500);
    } else {
      setAiBreakdown(false);
      setAiTasks([]);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Goal"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose} disabled={!name.trim() || !dueDate}>Create Goal</Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label="Goal name"
          placeholder="e.g., Learn React Fundamentals"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Zone</label>
          <div className="grid grid-cols-4 gap-2">
            {zoneOrder.map((z) => {
              const cfg = zoneConfig[z];
              return (
                <button
                  key={z}
                  onClick={() => setZone(z)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all ${
                    zone === z ? 'border-brand bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="text-[11px] font-medium text-slate-700">{cfg.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          label="Description (optional)"
          placeholder="Add more details about your goal..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div>
          <label className="text-sm font-medium text-slate-700 flex items-center justify-between mb-1">
            <span>Estimated hours</span>
            <span className="text-brand-600 font-semibold">{estimatedHours}h</span>
          </label>
          <input
            type="range"
            min={1}
            max={40}
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
            className="w-full accent-brand-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={aiBreakdown}
              onChange={handleAiToggle}
              className="accent-brand-500 w-4 h-4"
            />
            <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Sparkles size={15} className="text-brand-500" />
              Let AI break this into tasks
            </span>
          </label>

          {aiLoading && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-brand-50 rounded-lg">
              <Spinner size={18} className="text-brand-500" />
              <span className="text-sm text-brand-700">Generating tasks...</span>
            </div>
          )}

          {aiTasks.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {aiTasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Check size={16} className="text-success-500" />
                  <input
                    defaultValue={task}
                    className="flex-1 text-sm bg-transparent border-none focus:outline-none text-slate-700"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function AIGoalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [intent, setIntent] = useState('');
  const [timeframe, setTimeframe] = useState('1 month');
  const [zone, setZone] = useState<ZoneId>('study');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalHours, setGoalHours] = useState(20);
  const [aiTasks, setAiTasks] = useState<string[]>([]);

  const chips = ['Learn a skill', 'Complete a project', 'Build a habit', 'Prepare for exam'];

  const handleGenerate = () => {
    if (!intent.trim()) return;
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setGoalName('Master Data Science Fundamentals');
      setGoalDesc('Build a strong foundation in Python, statistics, and ML algorithms for a career switch.');
      setGoalHours(60);
      setAiTasks([
        'Python Basics & Data Structures',
        'Statistics Essentials',
        'Pandas & Data Manipulation',
        'ML Algorithms Overview',
        'Hands-on Project: Data Analysis',
      ]);
    }, 1800);
  };

  const handleRegenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setGoalName('Data Science Career Track');
      setGoalDesc('Comprehensive journey from Python to machine learning, focused on practical projects.');
      setGoalHours(80);
      setAiTasks([
        'Set up dev environment (Python, Jupyter)',
        'Complete Python for Data Science course',
        'Learn Descriptive & Inferential Statistics',
        'Master Scikit-learn & Model Evaluation',
        'Build portfolio project: End-to-end ML pipeline',
      ]);
    }, 1800);
  };

  const reset = () => {
    setIntent('');
    setGenerated(false);
    setGoalName('');
    setGoalDesc('');
    setAiTasks([]);
  };

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); reset(); }}
      title="Generate Goal with AI"
      size="md"
      footer={
        generated ? (
          <>
            <Button variant="secondary" onClick={handleRegenerate}>
              <RefreshCw size={14} /> Regenerate
            </Button>
            <Button onClick={() => { onClose(); reset(); }} className="bg-success-600 hover:bg-success-700">
              <Check size={14} /> Create Goal
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => { onClose(); reset(); }}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={!intent.trim() || generating}>
              {generating ? <Spinner size={16} /> : <Sparkles size={14} />}
              {generating ? 'Generating...' : 'Generate'}
            </Button>
          </>
        )
      }
    >
      {!generated && !generating && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              What do you want to achieve?
            </label>
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g., Master data science for career switch"
              className="w-full min-h-[80px] px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              autoFocus
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setIntent(chip)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">How much time do you have?</label>
            <div className="grid grid-cols-4 gap-2">
              {['1 week', '2 weeks', '1 month', '3+ months'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`py-2.5 rounded-lg text-xs font-medium transition-all ${
                    timeframe === t
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">What zone?</label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value as ZoneId)}
              className="w-full min-h-[44px] px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-brand"
            >
              {zoneOrder.map((z) => (
                <option key={z} value={z}>{zoneConfig[z].name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {generating && (
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner size={40} className="text-brand-500 mb-4" />
          <p className="text-sm text-slate-600 font-medium">Generating your goal breakdown...</p>
          <div className="flex gap-1.5 mt-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-soft"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {generated && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Badge color={zone as ZoneId}>{zoneConfig[zone].name}</Badge>
              <Badge color="brand">{goalHours}h estimated</Badge>
              <Badge color="slate">{timeframe}</Badge>
            </div>
            <input
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="text-lg font-bold text-slate-900 bg-transparent border-none focus:outline-none w-full mb-1"
            />
            <textarea
              value={goalDesc}
              onChange={(e) => setGoalDesc(e.target.value)}
              className="text-sm text-slate-600 bg-transparent border-none focus:outline-none w-full resize-none"
              rows={2}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles size={14} className="text-brand-500" />
              AI-suggested task breakdown
            </p>
            <div className="space-y-1.5">
              {aiTasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <input
                    defaultValue={task}
                    className="flex-1 text-sm bg-transparent border-none focus:outline-none text-slate-700"
                  />
                  <button className="text-slate-300 hover:text-alert-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
