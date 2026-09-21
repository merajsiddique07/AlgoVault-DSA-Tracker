import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Clock,
  Calendar,
  Copy,
  Check,
  Edit2,
  Trash2,
  Cpu,
  Code2,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  formatRelativeTime,
  formatFullDateTime,
  getDifficultyBadge,
  getStatusBadge,
} from '../utils/formatters';

export default function ProblemDetailModal({
  problem,
  onClose,
  onEdit,
  onDelete,
  onMarkAccessed,
  onStatusChange,
}) {
  const [copied, setCopied] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);

  if (!problem) return null;

  const diffBadge = getDifficultyBadge(problem.difficulty);
  const statusBadge = getStatusBadge(problem.status);

  const handleCopyCode = () => {
    if (!problem.codeSnippet) return;
    navigator.clipboard.writeText(problem.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkReviewed = async () => {
    setIsAccessing(true);
    await onMarkAccessed(problem._id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setIsAccessing(false), 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${diffBadge.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${diffBadge.dot}`}></span>
                {problem.difficulty}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                {problem.topic}
              </span>

              {problem.platform && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                  {problem.platform}
                </span>
              )}

              <select
                value={problem.status}
                onChange={(e) => onStatusChange(problem._id, e.target.value)}
                className={`text-xs px-3 py-1 rounded-full border font-medium focus:outline-none cursor-pointer ${statusBadge.bg}`}
              >
                <option value="Need Revision">Need Revision</option>
                <option value="In Progress">In Progress</option>
                <option value="Mastered">Mastered</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {problem.title}
              </h2>
              {problem.problemUrl && (
                <a
                  href={problem.problemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Open problem link in new tab"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          
          {/* Approach Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-brand-500" />
              Approach Used & Intuition
            </h3>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
              {problem.approach}
            </div>
          </div>

          {/* Complexity Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs uppercase font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Time Complexity
              </span>
              <span className="font-mono font-semibold text-base text-brand-600 dark:text-brand-400">
                {problem.timeComplexity || 'O(N)'}
              </span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs uppercase font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Space Complexity
              </span>
              <span className="font-mono font-semibold text-base text-brand-600 dark:text-brand-400">
                {problem.spaceComplexity || 'O(1)'}
              </span>
            </div>
          </div>

          {/* Solution Code */}
          {problem.codeSnippet && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-brand-400" />
                  {problem.codeLanguage || 'Solution Code'}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-72">
                <code>{problem.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Notes & Edge Cases */}
          {problem.notes && (
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5" />
                Notes, Edge Cases & Gotchas
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {problem.notes}
              </p>
            </div>
          )}

          {/* Meta & Timings Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Last Accessed:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                {formatRelativeTime(problem.lastAccessedAt)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {formatFullDateTime(problem.lastAccessedAt)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 block mb-0.5">When Stored:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {formatFullDateTime(problem.createdAt).split(',')[0]}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {formatFullDateTime(problem.createdAt)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Revisions:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
                {problem.revisionCount || 0} times reviewed
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(problem);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Problem</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onDelete(problem);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Mark Reviewed CTA */}
            <button
              onClick={handleMarkReviewed}
              disabled={isAccessing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAccessing ? 'Updating...' : 'Mark Reviewed Today'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
