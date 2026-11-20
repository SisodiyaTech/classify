import api from './api';

export const authService = {
  login: async (credentials) => {
    // Simulated endpoint call: replace with api.post('/auth/login', credentials)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, token: 'mock-jwt-token-xyz' });
      }, 300);
    });
  },

  register: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, token: 'mock-jwt-token-new' });
      }, 300);
    });
  },

  logout: async () => {
    return Promise.resolve({ success: true });
  },

  getCurrentUser: async () => {
    return api.get('/auth/me').catch(() => null);
  }
};
