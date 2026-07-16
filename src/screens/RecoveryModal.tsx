import { useState } from 'react';
import { Modal } from '../components/Modal';

import { Badge } from '../components/Badge';
import { ProgressRing } from '../components/ProgressRing';
import type { BurnoutResult, RecoverySuggestion } from '../types';
import {
  RefreshCw,
  Moon,
  Zap,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface RecoveryModalProps {
  open: boolean;
  onClose: () => void;
  burnout: BurnoutResult;
  suggestions: RecoverySuggestion[];
}

const suggestionIcons: Record<string, typeof RefreshCw> = {
  'shift-recover': RefreshCw,
  'double-rest': Moon,
  'zone-override': Zap,
};

const colorClasses: Record<string, { bg: string; text: string; btn: string; border: string }> = {
  rose: { bg: 'bg-play-50', text: 'text-play-600', btn: 'bg-play-500 hover:bg-play-600', border: 'border-play-200' },
  teal: { bg: 'bg-personal-50', text: 'text-personal-600', btn: 'bg-personal-500 hover:bg-personal-600', border: 'border-personal-200' },
  purple: { bg: 'bg-study-50', text: 'text-study-600', btn: 'bg-study-500 hover:bg-study-600', border: 'border-study-200' },
};

export function RecoveryModal({ open, onClose, burnout, suggestions }: RecoveryModalProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [dontShow, setDontShow] = useState(false);

  const handleAccept = (id: string) => {
    setAccepted((prev) => new Set(prev).add(id));
  };

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const visibleSuggestions = suggestions.filter((s) => !dismissed.has(s.id));

  return (
    <Modal open={open} onClose={onClose} size="lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              burnout.riskLevel === 'red'
                ? 'bg-alert-100'
                : 'bg-warning-100'
            }`}
          >
            <Zap
              size={20}
              className={burnout.riskLevel === 'red' ? 'text-alert-600' : 'text-warning-600'}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Energy Recovery Mode</h2>
            <p className="text-sm text-slate-500">Your energy is low. Here's how to recover.</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Current risk display */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 mb-4">
        <ProgressRing
          score={burnout.score}
          riskLevel={burnout.riskLevel}
          size={80}
          strokeWidth={6}
          animate={false}
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">
            {burnout.score}/100 ({burnout.riskLevel === 'red' ? 'High' : 'Moderate'})
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={12} className={burnout.metrics.missedTasksPercent > 30 ? 'text-alert-500' : 'text-slate-300'} />
              <span className="text-xs text-slate-600">
                Missed tasks: {burnout.metrics.missedTasksPercent}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={12} className={burnout.metrics.utilizationPercent > 85 ? 'text-alert-500' : 'text-slate-300'} />
              <span className="text-xs text-slate-600">
                Utilization: {burnout.metrics.utilizationPercent}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={12} className={burnout.metrics.restorativeTimePercent < 15 ? 'text-alert-500' : 'text-slate-300'} />
              <span className="text-xs text-slate-600">
                Rest time: {burnout.metrics.restorativeTimePercent}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={12} className={burnout.metrics.consecutiveHighLoadDays > 3 ? 'text-alert-500' : 'text-slate-300'} />
              <span className="text-xs text-slate-600">
                High-load days: {burnout.metrics.consecutiveHighLoadDays}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestion cards */}
      {visibleSuggestions.length === 0 ? (
        <div className="text-center py-8">
          <Check size={32} className="text-success-500 mx-auto mb-2" />
          <p className="text-sm text-slate-600">All suggestions have been addressed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleSuggestions.map((s) => {
            const Icon = suggestionIcons[s.id] ?? Zap;
            const c = colorClasses[s.color];
            const isAccepted = accepted.has(s.id);

            return (
              <div
                key={s.id}
                className={`p-4 rounded-xl border ${c.bg} ${c.border} animate-slide-up`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={c.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-bold ${c.text}`}>{s.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{s.description}</p>

                    {s.impact && (
                      <p className="text-xs text-success-600 font-medium mt-2 flex items-center gap-1">
                        <Check size={12} /> {s.impact}
                      </p>
                    )}

                    {s.suggestedBlocks && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {s.suggestedBlocks.map((block) => (
                          <Badge key={block} color="personal">
                            {block}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {s.details && (
                      <p className="text-xs text-slate-500 mt-2 font-mono">{s.details}</p>
                    )}

                    {isAccepted ? (
                      <div className="flex items-center gap-1.5 mt-3 text-success-600">
                        <Check size={16} />
                        <span className="text-sm font-medium">Accepted — changes applied</span>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAccept(s.id)}
                          className={`px-4 h-9 rounded-lg text-xs font-medium text-white transition-all ${c.btn}`}
                        >
                          {s.actions[0]}
                        </button>
                        {s.actions[1] && (
                          <button className="px-4 h-9 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50">
                            {s.actions[1]}
                          </button>
                        )}
                        {s.actions[2] && (
                          <button
                            onClick={() => handleDismiss(s.id)}
                            className="px-4 h-9 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-600"
                          >
                            {s.actions[2]}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={dontShow}
            onChange={(e) => setDontShow(e.target.checked)}
            className="accent-brand-500 w-4 h-4"
          />
          <span className="text-xs text-slate-500">Don't show for 1 week</span>
        </label>
        <button
          onClick={onClose}
          className="text-sm text-slate-400 hover:text-slate-600 font-medium"
        >
          Dismiss all
        </button>
      </div>
    </Modal>
  );
}
