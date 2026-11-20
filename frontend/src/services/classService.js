import api from './api';

export const classService = {
  getMyClasses: async () => {
    return await api.get('/classes/my');
  },

  createLiveClass: async (data) => {
    return await api.post('/classes', data);
  },

  getClassroomAccess: async (batchId) => {
    return await api.get(`/classes/classroom/${batchId}/access`);
  },

  updateClassStatus: async (id, status) => {
    return await api.put(`/classes/${id}/status`, { status });
  },
};

export default classService;
