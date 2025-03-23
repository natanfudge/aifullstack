import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { errorResponse } from '../utils/response';

export const errorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error);

  if (error instanceof AppError) {
    return errorResponse(res, error.message, error.statusCode);
  }

  if (error.name === 'ValidationError') {
    return errorResponse(res, error.message, 400);
  }

  if (error.code === 11000) {
    return errorResponse(res, 'Email already exists', 400);
  }

  if (error.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Not logged in', 401);
  }

  if (error.name === 'TokenExpiredError') {
    return errorResponse(res, 'Not logged in', 401);
  }

  return errorResponse(res, error.message || 'Internal server error', 500);
}; 