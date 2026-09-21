import React, { useState } from 'react';
import {
  ExternalLink,
  Clock,
  Calendar,
  Star,
  Edit2,
  Trash2,
  Check,
  Code2,
  Cpu,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from 'lucide-react';
import {
  formatRelativeTime,
  formatFullDateTime,
  getDifficultyBadge,
  getStatusBadge,
} from '../utils/formatters';

export default function ProblemCard({
  problem,
  onViewDetails,
  onEdit,
  onDelete,
  onMarkAccessed,
  onToggleFavorite,
  onStatusChange,
}) {
  const [isApproachExpanded, setIsApproachExpanded] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);

  const diffBadge = getDifficultyBadge(problem.difficulty);
  const statusBadge = getStatusBadge(problem.status);

  const handleMarkAccessed = async (e) => {
    e.stopPropagation();
    setIsAccessing(true);
    await onMarkAccessed(problem._id);
    setTimeout(() => setIsAccessing(false), 600);
  };

  return (
    <div
      onClick={() => onViewDetails(problem)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Top bar: Platform, Topic, Star & External Link */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Difficulty Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${diffBadge.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${diffBadge.dot}`}></span>
              {problem.difficulty}
            </span>

            {/* Topic Badge */}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
              {problem.topic}
            </span>

            {/* Platform Badge */}
            {problem.platform && (
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {problem.platform}
              </span>
            )}
          </div>

          {/* Star Bookmark */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(problem._id);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                problem.isFavorite
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
              }`}
              title={problem.isFavorite ? 'Remove from favorites' : 'Mark favorite'}
            >
              <Star className={`w-4 h-4 ${problem.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {problem.title}
          </h3>
          {problem.problemUrl && (
            <a
              href={problem.problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-slate-400 hover:text-brand-500 transition-colors p-0.5"
              title="Open problem link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Approach Used Preview */}
        <div className="mb-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 p-3 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-brand-500" />
              Approach Used
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsApproachExpanded(!isApproachExpanded);
              }}
              className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5"
            >
              {isApproachExpanded ? (
                <>Less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>More <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
          <p
            className={`text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans ${
              isApproachExpanded ? 'whitespace-pre-line' : 'line-clamp-2'
            }`}
          >
            {problem.approach}
          </p>
        </div>

        {/* Complexities */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
            Time: <span className="font-semibold text-brand-600 dark:text-brand-400">{problem.timeComplexity || 'O(N)'}</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
            Space: <span className="font-semibold text-brand-600 dark:text-brand-400">{problem.spaceComplexity || 'O(1)'}</span>
          </span>
        </div>
      </div>

      <div>
        {/* Timing Information: Last Accessed & When Stored */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Last Accessed:</span>
            </span>
            <span
              className="font-medium text-slate-700 dark:text-slate-300"
              title={formatFullDateTime(problem.lastAccessedAt)}
            >
              {formatRelativeTime(problem.lastAccessedAt)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>When Stored:</span>
            </span>
            <span
              className="font-medium text-slate-700 dark:text-slate-300"
              title={formatFullDateTime(problem.createdAt)}
            >
              {formatFullDateTime(problem.createdAt).split(',')[0]}
            </span>
          </div>
        </div>

        {/* Card Action Toolbar */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {/* Quick Mark Reviewed Button */}
          <button
            onClick={handleMarkAccessed}
            disabled={isAccessing}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-brand-200 dark:border-brand-900 bg-brand-50/70 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 transition-all active:scale-[0.98]"
            title="Update last accessed time to now"
          >
            <Check className={`w-3.5 h-3.5 ${isAccessing ? 'animate-bounce text-emerald-500' : ''}`} />
            <span>{isAccessing ? 'Reviewed!' : 'Mark Reviewed'}</span>
          </button>

          {/* Status Dropdown */}
          <select
            value={problem.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatusChange(problem._id, e.target.value)}
            className={`text-xs px-2 py-1.5 rounded-xl border font-medium focus:outline-none cursor-pointer ${statusBadge.bg}`}
          >
            <option value="Need Revision">Need Revision</option>
            <option value="In Progress">In Progress</option>
            <option value="Mastered">Mastered</option>
          </select>

          {/* Edit & Delete */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(problem);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit problem"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(problem);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Delete problem"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
