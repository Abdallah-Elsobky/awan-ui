import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Textarea } from '../components/Input';
import { zoneConfig } from '../zoneConfig';
import type { Task, TaskStatus, ZoneId } from '../types';
import {
  Pencil,
  SkipForward,
  CheckCircle2,
  Trash2,
  Clock,
  Calendar,
  Link2,
  Activity,
} from 'lucide-react';

interface TaskDetailProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

const statusOptions: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
];

export function TaskDetail({ task, open, onClose, onEdit, onStatusChange, onDelete }: TaskDetailProps) {
  if (!task) return null;

  const cfg = zoneConfig[task.zone];
  const daysLeft = task.dueDate
    ? Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Badge color={task.zone as ZoneId} className="mb-2">{cfg.name}</Badge>
            <h2 className="text-xl font-bold text-slate-900">{task.name}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <div className="flex gap-2">
            {statusOptions.map((s) => (
              <button
                key={s.id}
                onClick={() => onStatusChange(task.id, s.id)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  task.status === s.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-slate-500 mb-1">
              <Clock size={12} /> Duration
            </label>
            <p className="text-sm text-slate-900">{task.duration} min</p>
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-slate-500 mb-1">
              <Clock size={12} /> Start time
            </label>
            <p className="text-sm text-slate-900 font-mono">{task.startTime ?? '—'}</p>
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-slate-500 mb-1">
              <Calendar size={12} /> Deadline
            </label>
            <p className="text-sm text-slate-900">
              {task.dueDate ?? '—'}
              {daysLeft !== null && (
                <span className={`ml-1 text-xs ${daysLeft < 2 ? 'text-alert-600' : 'text-slate-400'}`}>
                  ({daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`})
                </span>
              )}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Priority</label>
            <Badge color={task.priority === 'high' ? 'alert' : task.priority === 'medium' ? 'warning' : 'slate'}>
              {task.priority}
            </Badge>
          </div>
        </div>

        {/* Dependencies */}
        {task.dependencies.length > 0 && (
          <div className="pt-3 border-t border-slate-200">
            <label className="flex items-center gap-1 text-sm font-medium text-slate-700 mb-2">
              <Link2 size={14} /> Dependencies
            </label>
            <div className="flex flex-wrap gap-1.5">
              {task.dependencies.map((dep) => (
                <Badge key={dep} color="slate">{dep}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="pt-3 border-t border-slate-200">
          <Textarea
            label="Notes"
            defaultValue={task.notes ?? ''}
            placeholder="Add sub-steps, context, or details..."
          />
        </div>

        {/* Activity Log */}
        <div className="pt-3 border-t border-slate-200">
          <label className="flex items-center gap-1 text-sm font-medium text-slate-700 mb-2">
            <Activity size={14} /> Activity
          </label>
          <div className="space-y-1 text-xs text-slate-500">
            <p>Created {new Date(task.createdAt).toLocaleDateString()}</p>
            {task.status === 'in-progress' && (
              <p>Marked as In Progress at 2:15 PM</p>
            )}
            {task.status === 'completed' && (
              <p>Completed at 4:30 PM</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200">
          <Button variant="secondary" size="sm" onClick={() => onEdit(task)}>
            <Pencil size={14} /> Edit
          </Button>
          <Button
            size="sm"
            className="bg-warning-500 hover:bg-warning-600"
            onClick={() => onStatusChange(task.id, 'todo')}
          >
            <SkipForward size={14} /> Skip
          </Button>
          <Button
            size="sm"
            className="bg-success-500 hover:bg-success-600"
            onClick={() => onStatusChange(task.id, 'completed')}
          >
            <CheckCircle2 size={14} /> Complete
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
