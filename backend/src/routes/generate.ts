import express from 'express';
import { protect } from '../middleware/auth';
import { generatePost } from '../controllers/generateController';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.post('/', generatePost);

export default router; 