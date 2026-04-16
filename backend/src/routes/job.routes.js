import { Router } from 'express';
import {
  listJobs,
  getJob,
  createJob,
  closeJob,
  listEmployerJobs,
} from '../controllers/job.controller.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', listJobs);
router.get('/mine/posted', protect, requireRole('employer'), listEmployerJobs);
router.get('/:id', getJob);
router.post('/', protect, requireRole('employer'), createJob);
router.patch('/:id/close', protect, requireRole('employer'), closeJob);

export default router;
