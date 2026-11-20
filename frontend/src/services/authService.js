import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res?.token) {
      localStorage.setItem('classify_token', res.token);
    }
    return res;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res?.token) {
      localStorage.setItem('classify_token', res.token);
    }
    return res;
  },

  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  updateProfile: async (data) => {
    return await api.put('/auth/profile', data);
  },

  submitInstructorVerification: async (data) => {
    return await api.post('/auth/instructor-verification', data);
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, password) => {
    return await api.post('/auth/reset-password', { token, password });
  },

  logout: async () => {
    localStorage.removeItem('classify_token');
    return Promise.resolve({ success: true });
  },
};

export default authService;
