import React from 'react';
import { LayoutGrid, Table, ArrowUpDown, Star, Filter, RotateCcw } from 'lucide-react';
import { COMMON_TOPICS } from '../utils/formatters';

export default function FilterBar({
  selectedTopic,
  setSelectedTopic,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedStatus,
  setSelectedStatus,
  isFavoriteOnly,
  setIsFavoriteOnly,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  onResetFilters,
  hasActiveFilters,
}) {
  return (
    <div className="space-y-4 mb-6">
      {/* Topics Scrollable Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin no-scrollbar">
        {COMMON_TOPICS.map((topic) => {
          const isSelected = selectedTopic === topic;
          return (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`shrink-0 px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                  : 'bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>

      {/* Main Filter & Sort Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Left: Difficulty & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Group */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700/60 text-xs">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Status Group */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700/60 text-xs">
            {['All', 'Need Revision', 'In Progress', 'Mastered'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Starred Only Toggle */}
          <button
            onClick={() => setIsFavoriteOnly(!isFavoriteOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isFavoriteOnly
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:text-amber-500'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFavoriteOnly ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>Starred</span>
          </button>

          {/* Clear Filters Button if any are active */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Sort & View Modes */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('_');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="lastAccessedAt_desc">Last Accessed (Recent)</option>
              <option value="lastAccessedAt_asc">Last Accessed (Oldest)</option>
              <option value="createdAt_desc">When Stored (Newest)</option>
              <option value="createdAt_asc">When Stored (Oldest)</option>
              <option value="title_asc">Problem Name (A-Z)</option>
              <option value="difficulty_asc">Difficulty</option>
            </select>
          </div>

          {/* View Toggle (Grid / Table) */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table List View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
