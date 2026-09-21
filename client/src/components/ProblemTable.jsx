import React from 'react';
import {
  ExternalLink,
  Clock,
  Calendar,
  Star,
  Edit2,
  Trash2,
  Check,
  Eye,
} from 'lucide-react';
import {
  formatRelativeTime,
  formatFullDateTime,
  getDifficultyBadge,
  getStatusBadge,
} from '../utils/formatters';

export default function ProblemTable({
  problems,
  onViewDetails,
  onEdit,
  onDelete,
  onMarkAccessed,
  onToggleFavorite,
  onStatusChange,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 pl-4 pr-2 w-10 text-center">★</th>
            <th className="py-3.5 px-3 min-w-[200px]">Problem Name</th>
            <th className="py-3.5 px-3 min-w-[130px]">Topic</th>
            <th className="py-3.5 px-3 min-w-[90px]">Difficulty</th>
            <th className="py-3.5 px-3 min-w-[180px]">Approach Used</th>
            <th className="py-3.5 px-3 min-w-[110px]">Complexity</th>
            <th className="py-3.5 px-3 min-w-[120px]">Status</th>
            <th className="py-3.5 px-3 min-w-[120px]">Last Accessed</th>
            <th className="py-3.5 px-3 min-w-[110px]">When Stored</th>
            <th className="py-3.5 pr-4 pl-2 text-right min-w-[120px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {problems.map((problem) => {
            const diffBadge = getDifficultyBadge(problem.difficulty);
            const statusBadge = getStatusBadge(problem.status);

            return (
              <tr
                key={problem._id}
                onClick={() => onViewDetails(problem)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                {/* Favorite Star */}
                <td className="py-3 pl-4 pr-2 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleFavorite(problem._id)}
                    className="text-slate-300 dark:text-slate-600 hover:text-amber-500 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        problem.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                      }`}
                    />
                  </button>
                </td>

                {/* Title & Platform */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {problem.title}
                    </span>
                    {problem.problemUrl && (
                      <a
                        href={problem.problemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-brand-500 inline-flex p-0.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  {problem.platform && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {problem.platform}
                    </span>
                  )}
                </td>

                {/* Topic */}
                <td className="py-3 px-3">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700/60">
                    {problem.topic}
                  </span>
                </td>

                {/* Difficulty */}
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${diffBadge.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${diffBadge.dot}`}></span>
                    {problem.difficulty}
                  </span>
                </td>

                {/* Approach */}
                <td className="py-3 px-3">
                  <p className="line-clamp-2 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed max-w-xs">
                    {problem.approach}
                  </p>
                </td>

                {/* Complexity */}
                <td className="py-3 px-3 font-mono text-[11px]">
                  <div className="text-slate-700 dark:text-slate-300">T: {problem.timeComplexity || 'O(N)'}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px]">S: {problem.spaceComplexity || 'O(1)'}</div>
                </td>

                {/* Status */}
                <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={problem.status}
                    onChange={(e) => onStatusChange(problem._id, e.target.value)}
                    className={`text-[11px] px-2 py-1 rounded-lg border font-medium focus:outline-none cursor-pointer ${statusBadge.bg}`}
                  >
                    <option value="Need Revision">Need Revision</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Mastered">Mastered</option>
                  </select>
                </td>

                {/* Last Accessed */}
                <td
                  className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap"
                  title={formatFullDateTime(problem.lastAccessedAt)}
                >
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{formatRelativeTime(problem.lastAccessedAt)}</span>
                  </div>
                </td>

                {/* When Stored */}
                <td
                  className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]"
                  title={formatFullDateTime(problem.createdAt)}
                >
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{formatFullDateTime(problem.createdAt).split(',')[0]}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3 pr-4 pl-2 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onMarkAccessed(problem._id)}
                      className="p-1 rounded-md text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50"
                      title="Mark Reviewed Today"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEdit(problem)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(problem)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
