import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsHeader from './components/StatsHeader';
import FilterBar from './components/FilterBar';
import ProblemCard from './components/ProblemCard';
import ProblemTable from './components/ProblemTable';
import ProblemDetailModal from './components/ProblemDetailModal';
import ProblemFormModal from './components/ProblemFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { problemApi } from './services/api';
import { Sparkles, Plus, Code2, Download, Upload, Loader2, Database } from 'lucide-react';

export default function App() {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isFavoriteOnly, setIsFavoriteOnly] = useState(false);
  const [sortBy, setSortBy] = useState('lastAccessedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals & Popups
  const [detailModalProblem, setDetailModalProblem] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [deletingProblem, setDeletingProblem] = useState(null);
  const [toast, setToast] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch problems with active filters
  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await problemApi.getProblems({
        search: debouncedSearch,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        status: selectedStatus,
        isFavorite: isFavoriteOnly ? 'true' : undefined,
        sortBy,
        order: sortOrder,
      });
      if (res.success) {
        setProblems(res.data);
      }
    } catch (err) {
      console.error('Fetch problems error:', err);
      showToast('Could not load problems. Check backend connection.', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedTopic, selectedDifficulty, selectedStatus, isFavoriteOnly, sortBy, sortOrder]);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await problemApi.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
    fetchStats();
  }, [fetchProblems, fetchStats]);

  // Create problem
  const handleCreateProblem = async (formData) => {
    try {
      const res = await problemApi.createProblem(formData);
      if (res.success) {
        showToast(`Stored "${res.data.title}" successfully!`);
        fetchProblems();
        fetchStats();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create problem', 'error');
      throw err;
    }
  };

  // Update problem
  const handleUpdateProblem = async (formData) => {
    try {
      const res = await problemApi.updateProblem(editingProblem._id, formData);
      if (res.success) {
        showToast(`Updated "${res.data.title}"!`);
        fetchProblems();
        fetchStats();
        if (detailModalProblem && detailModalProblem._id === editingProblem._id) {
          setDetailModalProblem(res.data);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update problem', 'error');
      throw err;
    }
  };

  // Delete problem
  const handleDeleteConfirm = async () => {
    if (!deletingProblem) return;
    try {
      const res = await problemApi.deleteProblem(deletingProblem._id);
      if (res.success) {
        showToast(`Deleted "${deletingProblem.title}"`);
        if (detailModalProblem && detailModalProblem._id === deletingProblem._id) {
          setDetailModalProblem(null);
        }
        setDeletingProblem(null);
        fetchProblems();
        fetchStats();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete problem', 'error');
    }
  };

  // Quick mark reviewed today
  const handleMarkAccessed = async (id) => {
    try {
      const res = await problemApi.markAsAccessed(id);
      if (res.success) {
        showToast(`Marked as reviewed! Revision #${res.data.revisionCount}`);
        // Update local state without full reload
        setProblems((prev) =>
          prev.map((p) => (p._id === id ? { ...p, lastAccessedAt: res.data.lastAccessedAt, revisionCount: res.data.revisionCount } : p))
        );
        if (detailModalProblem && detailModalProblem._id === id) {
          setDetailModalProblem((prev) => ({
            ...prev,
            lastAccessedAt: res.data.lastAccessedAt,
            revisionCount: res.data.revisionCount,
          }));
        }
        fetchStats();
      }
    } catch (err) {
      showToast('Could not mark as reviewed', 'error');
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (id) => {
    try {
      const res = await problemApi.toggleFavorite(id);
      if (res.success) {
        setProblems((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isFavorite: res.data.isFavorite } : p))
        );
        if (detailModalProblem && detailModalProblem._id === id) {
          setDetailModalProblem((prev) => ({ ...prev, isFavorite: res.data.isFavorite }));
        }
      }
    } catch (err) {
      showToast('Could not update favorite', 'error');
    }
  };

  // Status dropdown change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await problemApi.updateProblem(id, { status: newStatus });
      if (res.success) {
        showToast(`Status updated to "${newStatus}"`);
        setProblems((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
        if (detailModalProblem && detailModalProblem._id === id) {
          setDetailModalProblem((prev) => ({ ...prev, status: newStatus }));
        }
        fetchStats();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Seed sample data
  const handleSeed = async (force = false) => {
    try {
      const res = await problemApi.seedProblems(force);
      showToast(res.message || 'Sample problems loaded!');
      fetchProblems();
      fetchStats();
    } catch (err) {
      showToast('Could not seed data', 'error');
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setIsFavoriteOnly(false);
    setSearchTerm('');
    setSortBy('lastAccessedAt');
    setSortOrder('desc');
  };

  const hasActiveFilters =
    selectedTopic !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedStatus !== 'All' ||
    isFavoriteOnly ||
    searchTerm !== '';

  // Export Sheet to JSON
  const handleExportJSON = () => {
    if (problems.length === 0) {
      showToast('No problems to export', 'info');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(problems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dsa_sheet_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported DSA sheet to JSON!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => {
          setEditingProblem(null);
          setFormModalOpen(true);
        }}
        onSeedClick={() => handleSeed(false)}
        totalCount={problems.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Statistics Dashboard Banner */}
        <StatsHeader
          stats={stats}
          activeStatusFilter={selectedStatus}
          onStatusFilterClick={(status) => {
            setSelectedStatus((prev) => (prev === status ? 'All' : status));
          }}
        />

        {/* Filter and Control Bar */}
        <FilterBar
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          isFavoriteOnly={isFavoriteOnly}
          setIsFavoriteOnly={setIsFavoriteOnly}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Action Header Banner (Results count + Export/Import tools) */}
        <div className="flex items-center justify-between gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{problems.length}</span> problem{problems.length === 1 ? '' : 's'}</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 font-medium">
                Filtered
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Export JSON backup */}
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
              title="Export problems as JSON backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Sheet</span>
            </button>
          </div>
        </div>

        {/* Problems Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-3" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading problems...</p>
          </div>
        ) : problems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {hasActiveFilters ? 'No problems match your filters' : 'Your DSA Vault is empty'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {hasActiveFilters
                ? 'Try adjusting your search keywords, difficulty, or topic filters.'
                : 'Start tracking problems, approaches, and revisions, or load sample problems.'}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {hasActiveFilters ? (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingProblem(null);
                      setFormModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Problem</span>
                  </button>
                  <button
                    onClick={() => handleSeed(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
                  >
                    <Database className="w-3.5 h-3.5 text-brand-500" />
                    <span>Load 5 Popular Problems</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((problem) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                onViewDetails={(p) => setDetailModalProblem(p)}
                onEdit={(p) => {
                  setEditingProblem(p);
                  setFormModalOpen(true);
                }}
                onDelete={(p) => setDeletingProblem(p)}
                onMarkAccessed={handleMarkAccessed}
                onToggleFavorite={handleToggleFavorite}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <ProblemTable
            problems={problems}
            onViewDetails={(p) => setDetailModalProblem(p)}
            onEdit={(p) => {
              setEditingProblem(p);
              setFormModalOpen(true);
            }}
            onDelete={(p) => setDeletingProblem(p)}
            onMarkAccessed={handleMarkAccessed}
            onToggleFavorite={handleToggleFavorite}
            onStatusChange={handleStatusChange}
          />
        )}

      </main>

      {/* Detail Modal */}
      <ProblemDetailModal
        problem={detailModalProblem}
        onClose={() => setDetailModalProblem(null)}
        onEdit={(p) => {
          setEditingProblem(p);
          setFormModalOpen(true);
        }}
        onDelete={(p) => setDeletingProblem(p)}
        onMarkAccessed={handleMarkAccessed}
        onStatusChange={handleStatusChange}
      />

      {/* Add / Edit Form Modal */}
      <ProblemFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingProblem(null);
        }}
        onSubmit={editingProblem ? handleUpdateProblem : handleCreateProblem}
        initialData={editingProblem}
        isEditing={Boolean(editingProblem)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProblem)}
        onClose={() => setDeletingProblem(null)}
        onConfirm={handleDeleteConfirm}
        problemTitle={deletingProblem?.title}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
