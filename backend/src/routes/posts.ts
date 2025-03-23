import express from 'express';
import { protect } from '../middleware/auth';
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
  .route('/')
  .get(getAllPosts)
  .post(createPost);

router
  .route('/:id')
  .get(getPost)
  .patch(updatePost)
  .delete(deletePost);

export default router; 