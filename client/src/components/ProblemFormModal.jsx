import React, { useState, useEffect } from 'react';
import { X, Code2, Cpu, Link as LinkIcon, Star, Check } from 'lucide-react';
import { COMMON_TOPICS, COMMON_PLATFORMS } from '../utils/formatters';

export default function ProblemFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    problemUrl: '',
    platform: 'LeetCode',
    difficulty: 'Medium',
    topic: 'Arrays & Hashing',
    customTopic: '',
    approach: '',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    codeLanguage: 'C++',
    codeSnippet: '',
    notes: '',
    status: 'In Progress',
    isFavorite: false,
  });

  const [activeTab, setActiveTab] = useState('approach'); // 'approach' | 'code' | 'notes'
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      const isCustomTopic = !COMMON_TOPICS.includes(initialData.topic);
      setFormData({
        title: initialData.title || '',
        problemUrl: initialData.problemUrl || '',
        platform: initialData.platform || 'LeetCode',
        difficulty: initialData.difficulty || 'Medium',
        topic: isCustomTopic ? 'Custom' : initialData.topic || 'Arrays & Hashing',
        customTopic: isCustomTopic ? initialData.topic : '',
        approach: initialData.approach || '',
        timeComplexity: initialData.timeComplexity || 'O(N)',
        spaceComplexity: initialData.spaceComplexity || 'O(1)',
        codeLanguage: initialData.codeLanguage || 'C++',
        codeSnippet: initialData.codeSnippet || '',
        notes: initialData.notes || '',
        status: initialData.status || 'In Progress',
        isFavorite: Boolean(initialData.isFavorite),
      });
    } else {
      setFormData({
        title: '',
        problemUrl: '',
        platform: 'LeetCode',
        difficulty: 'Medium',
        topic: 'Arrays & Hashing',
        customTopic: '',
        approach: '',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        codeLanguage: 'C++',
        codeSnippet: '',
        notes: '',
        status: 'In Progress',
        isFavorite: false,
      });
    }
    setErrors({});
    setActiveTab('approach');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Problem name is required';
    }
    if (!formData.approach.trim()) {
      newErrors.approach = 'Approach explanation is required';
      setActiveTab('approach');
    }

    const finalTopic = formData.topic === 'Custom' ? formData.customTopic.trim() : formData.topic;
    if (!finalTopic) {
      newErrors.topic = 'Please specify a topic';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        topic: finalTopic,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Update Problem' : 'Store New DSA Problem'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Record the problem, approach intuition, complexities and solution code
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* Title & Star */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Problem Name <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, isFavorite: !p.isFavorite }))}
                  className={`flex items-center gap-1 text-xs font-medium ${
                    formData.isFavorite ? 'text-amber-500' : 'text-slate-400'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${formData.isFavorite ? 'fill-amber-400' : ''}`} />
                  <span>{formData.isFavorite ? 'Starred' : 'Add to Starred'}</span>
                </button>
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Trapping Rain Water, Course Schedule..."
                className={`w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                  errors.title
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:border-brand-500'
                } text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20`}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
            </div>

            {/* Platform & Problem URL */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {COMMON_PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Problem URL (Optional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="problemUrl"
                    value={formData.problemUrl}
                    onChange={handleChange}
                    placeholder="https://leetcode.com/problems/..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Topic & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Topic <span className="text-rose-500">*</span>
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {COMMON_TOPICS.filter((t) => t !== 'All').map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                  <option value="Custom">+ Custom Topic</option>
                </select>
                {formData.topic === 'Custom' && (
                  <input
                    type="text"
                    name="customTopic"
                    value={formData.customTopic}
                    onChange={handleChange}
                    placeholder="Enter custom topic..."
                    className="w-full mt-2 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                )}
                {errors.topic && <p className="text-xs text-rose-500 mt-1">{errors.topic}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, difficulty: diff }))}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        formData.difficulty === diff
                          ? diff === 'Easy'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : diff === 'Medium'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-rose-500 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time & Space Complexity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Time Complexity
                </label>
                <input
                  type="text"
                  name="timeComplexity"
                  value={formData.timeComplexity}
                  onChange={handleChange}
                  placeholder="e.g. O(N), O(N log N)"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Space Complexity
                </label>
                <input
                  type="text"
                  name="spaceComplexity"
                  value={formData.spaceComplexity}
                  onChange={handleChange}
                  placeholder="e.g. O(1), O(N)"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {/* Tab navigation: Approach / Code Snippet / Notes */}
            <div className="pt-2">
              <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('approach')}
                  className={`px-4 py-2 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === 'approach'
                      ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Approach Used <span className="text-rose-500">*</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`px-4 py-2 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === 'code'
                      ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Code Solution
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === 'notes'
                      ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  Notes & Gotchas
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-3">
                {activeTab === 'approach' && (
                  <div>
                    <textarea
                      name="approach"
                      value={formData.approach}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Explain your approach clearly:
1. Core intuition (Why this data structure/algorithm?)
2. Step-by-step logic
3. Edge cases and constraints handled..."
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border ${
                        errors.approach
                          ? 'border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-200 dark:border-slate-800 focus:border-brand-500'
                      } text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 leading-relaxed font-sans`}
                    />
                    {errors.approach && (
                      <p className="text-xs text-rose-500 mt-1">{errors.approach}</p>
                    )}
                  </div>
                )}

                {activeTab === 'code' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-500 dark:text-slate-400">
                        Language
                      </label>
                      <select
                        name="codeLanguage"
                        value={formData.codeLanguage}
                        onChange={handleChange}
                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        {['C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'C#', 'Other'].map(
                          (lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                          )
                        )}
                      </select>
                    </div>
                    <textarea
                      name="codeSnippet"
                      value={formData.codeSnippet}
                      onChange={handleChange}
                      rows={7}
                      placeholder="// Paste your clean solution code here..."
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 leading-relaxed"
                    />
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Notes for future revisions (e.g., watch out for integer overflow, 1-based indexing, dummy node trick)..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 leading-relaxed"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                Current Learning Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Need Revision', label: 'Need Revision', color: 'border-rose-500 text-rose-600 dark:text-rose-400' },
                  { id: 'In Progress', label: 'In Progress', color: 'border-blue-500 text-blue-600 dark:text-blue-400' },
                  { id: 'Mastered', label: 'Mastered', color: 'border-emerald-500 text-emerald-600 dark:text-emerald-400' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, status: s.id }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      formData.status === s.id
                        ? `${s.color} bg-slate-100 dark:bg-slate-800 font-semibold ring-1 ring-brand-500/30`
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 active:scale-[0.98] transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : isEditing ? 'Update Problem' : 'Store Problem'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
