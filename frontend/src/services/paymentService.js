import api from './api';

export const paymentService = {
  enrollBatch: async (batchId, paymentMethod = 'UPI / Card') => {
    return await api.post('/enrollments/checkout', { batchId, paymentMethod });
  },

  getMyEnrollments: async () => {
    return await api.get('/enrollments/my');
  },

  getMyPayments: async () => {
    return await api.get('/enrollments/payments/my');
  },
};

export default paymentService;
