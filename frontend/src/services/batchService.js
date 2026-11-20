import api from './api';

export const batchService = {
  getBatches: async (params = {}) => {
    return await api.get('/batches', { params });
  },

  getBatchById: async (id) => {
    return await api.get(`/batches/${id}`);
  },

  createBatch: async (data) => {
    return await api.post('/batches', data);
  },

  updateBatch: async (id, data) => {
    return await api.put(`/batches/${id}`, data);
  },
};

export default batchService;
