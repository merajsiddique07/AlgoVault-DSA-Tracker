export const COMMON_TOPICS = [
  'All',
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack & Queue',
  'Binary Search',
  'Linked List',
  'Trees & BST',
  'Tries',
  'Heap & Priority Queue',
  'Backtracking',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Bit Manipulation',
  'Math & Geometry',
  'Design',
];

export const COMMON_PLATFORMS = [
  'LeetCode',
  'GeeksforGeeks',
  'Codeforces',
  'HackerRank',
  'CodeStudio',
  'InterviewBit',
  'Other',
];

export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return 'Never';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid date';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 30) return `${diffInDays}d ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;

  return `${Math.floor(diffInMonths / 12)}y ago`;
};

export const formatFullDateTime = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case 'Easy':
      return {
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-500',
      };
    case 'Medium':
      return {
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        dot: 'bg-amber-500',
      };
    case 'Hard':
      return {
        bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        dot: 'bg-rose-500',
      };
    default:
      return {
        bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
        dot: 'bg-slate-500',
      };
  }
};

export const getStatusBadge = (status) => {
  switch (status) {
    case 'Mastered':
      return {
        bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        label: 'Mastered',
      };
    case 'Need Revision':
      return {
        bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        label: 'Need Revision',
      };
    case 'In Progress':
    default:
      return {
        bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        label: 'In Progress',
      };
  }
};
