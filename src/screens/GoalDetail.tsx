import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ProgressRing } from '../components/ProgressRing';
import { zoneConfig } from '../zoneConfig';
import type { Task, Goal, TaskStatus } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  MoreVertical,
  Pencil,
  Trash2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface GoalDetailProps {
  goal: Goal;
  tasks: Task[];
  onBack: () => void;
  onTaskClick: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
}

const statusIcons: Record<TaskStatus, typeof CheckCircle2> = {
  completed: CheckCircle2,
  'in-progress': Clock,
  todo: Circle,
  missed: AlertCircle,
};

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Completed',
  missed: 'Missed',
};

export function GoalDetail({ goal, tasks, onBack, onTaskClick, onToggleTask }: GoalDetailProps) {
  const cfg = zoneConfig[goal.zone];
  const goalTasks = goal.taskIds
    .map((id) => tasks.find((t) => t.id === id))
    .filter(Boolean) as Task[];

  const done = goalTasks.filter((t) => t.status === 'completed').length;
  const total = goalTasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const daysLeft = Math.ceil(
    (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isBehind = pct < 50 && daysLeft < 5;

  const grouped: Record<TaskStatus, Task[]> = {
    'todo': [],
    'in-progress': [],
    'completed': [],
    'missed': [],
  };
  goalTasks.forEach((t) => grouped[t.status].push(t));

  // Dependency graph: simple linear flow
  const depTasks = goalTasks.filter((t) => t.dependencies.length > 0 || goalTasks.some((g) => g.dependencies.includes(t.id)));

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge color={goal.zone as 'study' | 'work' | 'play' | 'personal'}>{cfg.name}</Badge>
              <span
                className={`text-xs font-medium ${
                  daysLeft < 2 ? 'text-alert-600' : daysLeft < 7 ? 'text-warning-600' : 'text-slate-400'
                }`}
              >
                {daysLeft <= 0 ? 'Overdue' : `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{goal.name}</h1>
            <p className="text-sm text-slate-500 mt-1">{goal.description}</p>
          </div>
          <ProgressRing score={pct} riskLevel="green" size={100} strokeWidth={7} label="done" />
        </div>
      </div>

      {/* Section A: Progress Overview */}
      <Card padding="md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">Progress</p>
            <p className="text-sm font-semibold text-slate-900">
              {done} of {total} tasks
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Burnout risk</p>
            <Badge color={isBehind ? 'warning' : 'success'}>
              {isBehind ? 'Caution' : 'On track'}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Time spent</p>
            <p className="text-sm font-semibold text-slate-900">
              {((done / Math.max(total, 1)) * goal.estimatedHours).toFixed(1)}h / {goal.estimatedHours}h
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Pace</p>
            {isBehind ? (
              <span className="text-sm font-semibold text-warning-600">Behind schedule</span>
            ) : (
              <span className="text-sm font-semibold text-success-600">On pace ✓</span>
            )}
          </div>
        </div>
      </Card>

      {/* Section B: Task Breakdown */}
      <Card padding="md">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Task Breakdown</h3>
        <div className="space-y-4">
          {(['todo', 'in-progress', 'completed'] as TaskStatus[]).map((status) => {
            const items = grouped[status];
            if (items.length === 0) return null;
            return (
              <div key={status}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  {statusLabels[status]} ({items.length})
                </p>
                <div className="space-y-1.5">
                  {items.map((task) => {
                    const StatusIcon = statusIcons[task.status];
                    const taskCfg = zoneConfig[task.zone];
                    return (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-all border-l-4"
                        style={{ borderColor: taskCfg.color }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTask(task.id);
                          }}
                        >
                          <StatusIcon
                            size={18}
                            className={
                              task.status === 'completed'
                                ? 'text-success-500'
                                : 'text-slate-300'
                            }
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'
                            }`}
                          >
                            {task.name}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            {task.duration} min · {taskCfg.name}
                          </span>
                        </div>
                        <MoreVertical size={16} className="text-slate-300" />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Section C: Dependency Graph */}
      {depTasks.length > 0 && (
        <Card padding="md">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Dependency Graph</h3>
          <p className="text-xs text-slate-500 mb-4">
            Visual flow of task dependencies. Red indicates the critical path.
          </p>
          <div className="overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max pb-2">
              {goalTasks.map((task, i) => {
                const hasDep = task.dependencies.length > 0;
                const isCritical = task.priority === 'high' && (hasDep || goalTasks.some((g) => g.dependencies.includes(task.id)));
                return (
                  <div key={task.id} className="flex items-center gap-2">
                    {i > 0 && (
                      <div className="flex items-center">
                        <div
                          className={`h-0.5 w-6 ${isCritical ? 'bg-alert-400' : 'bg-slate-300'}`}
                        />
                        <ArrowRight size={14} className={isCritical ? 'text-alert-400' : 'text-slate-300'} />
                      </div>
                    )}
                    <div
                      className={`px-3 py-2.5 rounded-lg border-2 min-w-[120px] max-w-[160px] ${
                        isCritical
                          ? 'border-alert-400 bg-alert-50'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: zoneConfig[task.zone].color }}
                        />
                        <span className="text-[10px] text-slate-400 uppercase">
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 truncate">{task.name}</p>
                      {isCritical && (
                        <p className="text-[10px] text-alert-600 font-medium mt-0.5 flex items-center gap-0.5">
                          <AlertTriangle size={9} /> Critical
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Section D: Reschedule (conditional) */}
      {isBehind && (
        <Card padding="md" accent="amber">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle size={18} className="text-warning-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-slate-900">You're behind schedule</h3>
              <p className="text-sm text-slate-500">Here are some options to get back on track:</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">
              Extend deadline by 3 days
            </Button>
            <Button variant="secondary" size="sm">
              Add 2 more hours/week
            </Button>
            <Button variant="secondary" size="sm">
              Reduce scope
            </Button>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm">
          <Pencil size={14} /> Edit goal
        </Button>
        <Button size="sm">
          <CheckCircle2 size={14} /> Complete goal
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 size={14} /> Delete
        </Button>
      </div>
    </div>
  );
}
