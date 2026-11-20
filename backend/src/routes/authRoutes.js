import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  submitInstructorVerification,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post(
  '/instructor-verification',
  protect,
  authorize('instructor'),
  submitInstructorVerification
);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
