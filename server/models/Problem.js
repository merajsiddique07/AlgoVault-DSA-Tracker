const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem name is required'],
      trim: true,
    },
    problemUrl: {
      type: String,
      trim: true,
      default: '',
    },
    platform: {
      type: String,
      enum: ['LeetCode', 'Codeforces', 'GeeksforGeeks', 'HackerRank', 'CodeStudio', 'InterviewBit', 'Other'],
      default: 'LeetCode',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      default: 'Arrays',
    },
    tags: {
      type: [String],
      default: [],
    },
    approach: {
      type: String,
      required: [true, 'Approach used is required'],
      trim: true,
    },
    timeComplexity: {
      type: String,
      trim: true,
      default: 'O(N)',
    },
    spaceComplexity: {
      type: String,
      trim: true,
      default: 'O(1)',
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    codeLanguage: {
      type: String,
      enum: ['C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'C#', 'Rust', 'Other'],
      default: 'C++',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Need Revision', 'In Progress', 'Mastered'],
      default: 'In Progress',
    },
    revisionCount: {
      type: Number,
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // creates createdAt (when stored) & updatedAt
  }
);

// Indexes for fast searching and sorting
problemSchema.index({ title: 'text', approach: 'text', notes: 'text', topic: 'text' });
problemSchema.index({ lastAccessedAt: -1 });
problemSchema.index({ createdAt: -1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ topic: 1 });
problemSchema.index({ status: 1 });

module.exports = mongoose.model('Problem', problemSchema);
