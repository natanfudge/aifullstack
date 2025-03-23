import { Request, Response, NextFunction } from 'express';
import { generateBlogPost } from '../utils/openai';
import { AppError } from '../utils/AppError';
import { validateGenerateRequest } from '../utils/validation';

export const generatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate input
    if (!validateGenerateRequest(req.body)) {
      throw new AppError('Invalid generate request', 400);
    }

    const { topic, style } = req.body;
    const result = await generateBlogPost(topic, style);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}; 