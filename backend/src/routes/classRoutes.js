import express from 'express';
import {
  getMyClasses,
  createLiveClass,
  getClassroomAccess,
  updateClassStatus,
} from '../controllers/classController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMyClasses);
router.post('/', protect, authorize('instructor', 'admin'), createLiveClass);
router.get('/classroom/:batchId/access', protect, getClassroomAccess);
router.put('/:id/status', protect, authorize('instructor', 'admin'), updateClassStatus);

export default router;
