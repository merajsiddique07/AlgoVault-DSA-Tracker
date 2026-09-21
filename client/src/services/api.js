import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const problemApi = {
  // Get all problems with filters
  getProblems: async (params = {}) => {
    const response = await api.get('/problems', { params });
    return response.data;
  },

  // Get problem by ID
  getProblemById: async (id, autoTouch = false) => {
    const response = await api.get(`/problems/${id}`, {
      params: { autoTouch },
    });
    return response.data;
  },

  // Create problem
  createProblem: async (data) => {
    const response = await api.post('/problems', data);
    return response.data;
  },

  // Update problem
  updateProblem: async (id, data) => {
    const response = await api.put(`/problems/${id}`, data);
    return response.data;
  },

  // Mark as accessed / reviewed
  markAsAccessed: async (id) => {
    const response = await api.patch(`/problems/${id}/access`);
    return response.data;
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    const response = await api.patch(`/problems/${id}/favorite`);
    return response.data;
  },

  // Delete problem
  deleteProblem: async (id) => {
    const response = await api.delete(`/problems/${id}`);
    return response.data;
  },

  // Get stats
  getStats: async () => {
    const response = await api.get('/problems/stats');
    return response.data;
  },

  // Seed sample data
  seedProblems: async (force = false) => {
    const response = await api.post(`/problems/seed?force=${force}`);
    return response.data;
  },
};

export default api;
