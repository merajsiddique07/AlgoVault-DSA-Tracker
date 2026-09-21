import React from 'react';
import { Layers, AlertCircle, CheckCircle2, Flame, Award, Clock } from 'lucide-react';

export default function StatsHeader({ stats, activeStatusFilter, onStatusFilterClick }) {
  if (!stats) return null;

  const { total = 0, difficulty = {}, status = {}, staleProblemsCount = 0 } = stats;
  const easy = difficulty.easy || 0;
  const medium = difficulty.medium || 0;
  const hard = difficulty.hard || 0;
  const mastered = status.mastered || 0;
  const inProgress = status.inProgress || 0;
  const needRevision = status.needRevision || 0;

  const masteredRate = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Problems */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Problems
          </span>
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {total}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            tracked in vault
          </span>
        </div>
        {/* Visual difficulty bar */}
        <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            style={{ width: `${total ? (easy / total) * 100 : 0}%` }}
            className="bg-emerald-500 transition-all"
            title={`Easy: ${easy}`}
          />
          <div
            style={{ width: `${total ? (medium / total) * 100 : 0}%` }}
            className="bg-amber-500 transition-all"
            title={`Medium: ${medium}`}
          />
          <div
            style={{ width: `${total ? (hard / total) * 100 : 0}%` }}
            className="bg-rose-500 transition-all"
            title={`Hard: ${hard}`}
          />
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Difficulty Ratio
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Easy:</span>
            <span className="font-bold text-slate-900 dark:text-white">{easy}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Med:</span>
            <span className="font-bold text-slate-900 dark:text-white">{medium}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Hard:</span>
            <span className="font-bold text-slate-900 dark:text-white">{hard}</span>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 truncate">
          Target standard: ~50% Med / 30% Easy / 20% Hard
        </div>
      </div>

      {/* Needs Revision Card */}
      <div
        onClick={() => onStatusFilterClick('Need Revision')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
          activeStatusFilter === 'Need Revision'
            ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/20'
            : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Needs Revision
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {needRevision}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            problems flagged
          </span>
        </div>
        <div className="mt-3 text-[11px] font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
          {staleProblemsCount > 0 ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{staleProblemsCount} unreviewed &gt; 7 days</span>
            </>
          ) : (
            <span>All problems actively reviewed!</span>
          )}
        </div>
      </div>

      {/* Mastered Rate */}
      <div
        onClick={() => onStatusFilterClick('Mastered')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
          activeStatusFilter === 'Mastered'
            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-500/20'
            : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Mastered
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {mastered}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({masteredRate}% total)
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{inProgress} in progress</span>
        </div>
      </div>
    </div>
  );
}
