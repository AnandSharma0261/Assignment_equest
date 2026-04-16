import { Router } from 'express';
import {
  applyToJob,
  myApplications,
  applicationsForJob,
  updateStatus,
} from '../controllers/application.controller.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, requireRole('seeker'), applyToJob);
router.get('/mine', protect, requireRole('seeker'), myApplications);
router.get('/job/:jobId', protect, requireRole('employer'), applicationsForJob);
router.patch('/:id/status', protect, requireRole('employer'), updateStatus);

export default router;
