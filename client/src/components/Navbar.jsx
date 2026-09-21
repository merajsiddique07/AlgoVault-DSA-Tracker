import React from 'react';
import { Sparkles, Sun, Moon, Plus, Search, Code2, Database } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onAddClick,
  onSeedClick,
  totalCount = 0,
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 dark:bg-[#0B0F17]/80 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md shadow-brand-500/20 text-white">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  AlgoVault
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                    By Meraj
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Store approaches, track revisions & master DSA
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search problem, approach, topic, or complexity..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Quick Seed Button if empty */}
            {totalCount === 0 && (
              <button
                onClick={onSeedClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
                title="Load sample DSA problems"
              >
                <Database className="w-3.5 h-3.5 text-brand-500" />
                <span>Load Samples</span>
              </button>
            )}

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Add Problem Button */}
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Problem</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search problems, approaches, notes..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
