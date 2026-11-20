import api from './api';

export const courseService = {
  getAllCourses: async (params = {}) => {
    return await api.get('/courses', { params });
  },

  getCourseById: async (id) => {
    return await api.get(`/courses/${id}`);
  },

  createCourse: async (data) => {
    return await api.post('/courses', data);
  },

  updateCourse: async (id, data) => {
    return await api.put(`/courses/${id}`, data);
  },

  deleteCourse: async (id) => {
    return await api.delete(`/courses/${id}`);
  },
};

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

export default {
  courseService,
  batchService,
  paymentService,
  classService,
  adminService,
};
