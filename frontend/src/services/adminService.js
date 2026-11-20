import api from './api';

export const adminService = {
  getAdminStats: async () => {
    return await api.get('/admin/stats');
  },

  getInstructors: async (status) => {
    return await api.get('/admin/instructors', { params: { status } });
  },

  updateInstructorStatus: async (id, status) => {
    return await api.put(`/admin/instructors/${id}/status`, { status });
  },

  updateCourseStatus: async (id, status) => {
    return await api.put(`/admin/courses/${id}/status`, { status });
  },

  getAllPayments: async () => {
    return await api.get('/admin/payments');
  },

  getAllUsers: async (role) => {
    return await api.get('/admin/users', { params: { role } });
  },
};

export default adminService;
