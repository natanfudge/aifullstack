import { Request, Response, NextFunction } from 'express';
import { Post } from '../models/Post';
import { AppError } from '../utils/AppError';
import { validatePost } from '../utils/validation';

interface AuthRequest extends Request {
  user?: any;
}

export const getAllPosts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[POST CONTROLLER DEBUG] Getting all posts for user:', req.user._id);
    let posts = [];
    const postsQuery = await Post.find({ userId: req.user._id });
    
    if (Array.isArray(postsQuery)) {
      posts = postsQuery;
    } else if (postsQuery && typeof (postsQuery as any).sort === 'function') {
      // Handle mongoose Query object
      posts = await (postsQuery as any).sort('-createdAt');
    } else {
      // Handle any other return type
      console.log('[POST CONTROLLER DEBUG] Unexpected return type from Post.find():', typeof postsQuery);
      posts = [];
    }
    
    console.log('[POST CONTROLLER DEBUG] Found posts:', Array.isArray(posts) ? posts.length : 0);
    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.log('[POST CONTROLLER DEBUG] Error getting posts:', error);
    next(error);
  }
};

export const getPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[POST CONTROLLER DEBUG] Getting post by ID:', req.params.id);
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!post) {
      console.log('[POST CONTROLLER DEBUG] Post not found');
      throw new AppError('Post not found', 404);
    }

    console.log('[POST CONTROLLER DEBUG] Post found');
    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.log('[POST CONTROLLER DEBUG] Error getting post:', error);
    next(error);
  }
};

export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[POST CONTROLLER DEBUG] Creating post with data:', JSON.stringify(req.body));
    // Validate input
    if (!validatePost(req.body)) {
      console.log('[POST CONTROLLER DEBUG] Invalid post data');
      throw new AppError('Please provide title and content', 400);
    }

    const post = await Post.create({
      ...req.body,
      userId: req.user._id,
    });

    console.log('[POST CONTROLLER DEBUG] Post created with ID:', post && typeof post === 'object' ? post._id : 'unknown');
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.log('[POST CONTROLLER DEBUG] Error creating post:', error);
    next(error);
  }
};

export const updatePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[POST CONTROLLER DEBUG] Updating post ID:', req.params.id);
    // Validate input
    if (!validatePost(req.body)) {
      console.log('[POST CONTROLLER DEBUG] Invalid post data for update');
      throw new AppError('Please provide title and content', 400);
    }

    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      console.log('[POST CONTROLLER DEBUG] Post not found for update');
      throw new AppError('Post not found', 404);
    }

    console.log('[POST CONTROLLER DEBUG] Post updated successfully');
    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.log('[POST CONTROLLER DEBUG] Error updating post:', error);
    next(error);
  }
};

export const deletePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[POST CONTROLLER DEBUG] Deleting post ID:', req.params.id);
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!post) {
      console.log('[POST CONTROLLER DEBUG] Post not found for deletion');
      throw new AppError('Post not found', 404);
    }

    console.log('[POST CONTROLLER DEBUG] Post deleted successfully');
    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    console.log('[POST CONTROLLER DEBUG] Error deleting post:', error);
    next(error);
  }
};