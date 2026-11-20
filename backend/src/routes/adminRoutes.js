import express from 'express';
import {
  getAdminStats,
  getAdminInstructors,
  updateInstructorStatus,
  updateCourseModerationStatus,
  getAllPayments,
  getAllUsers,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes here require Admin role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/instructors', getAdminInstructors);
router.put('/instructors/:id/status', updateInstructorStatus);
router.put('/courses/:id/status', updateCourseModerationStatus);
router.get('/payments', getAllPayments);
router.get('/users', getAllUsers);

export default router;
