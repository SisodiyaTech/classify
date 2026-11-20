import api from './api';

export const courseService = {
  getAllCourses: async (params) => {
    // Simulated or fallback to api.get('/courses', { params })
    return Promise.resolve([]);
  },
  getCourseById: async (id) => {
    return Promise.resolve(null);
  },
  createCourse: async (data) => {
    return Promise.resolve({ success: true, data });
  },
  updateCourse: async (id, data) => {
    return Promise.resolve({ success: true, data });
  }
};

export const batchService = {
  getBatchesByCourse: async (courseId) => {
    return Promise.resolve([]);
  },
  createBatch: async (data) => {
    return Promise.resolve({ success: true, data });
  }
};

export const paymentService = {
  processPayment: async (paymentPayload) => {
    // Simulated Razorpay / Stripe gateway trigger
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
          status: 'Completed'
        });
      }, 500);
    });
  }
};
