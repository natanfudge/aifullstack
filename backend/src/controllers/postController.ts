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
    const posts = await Post.find({ author: req.user._id }).sort('-createdAt');
    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate input
    if (!validatePost(req.body)) {
      throw new AppError('Invalid post data', 400);
    }

    const post = await Post.create({
      ...req.body,
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate input
    if (!validatePost(req.body)) {
      throw new AppError('Invalid post data', 400);
    }

    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
        author: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    res.status(204).json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
}; 