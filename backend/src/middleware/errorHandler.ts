import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error({
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      statusCode: err.statusCode,
    });

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    logger.error({
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      statusCode: 400,
    });

    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Handle mongoose duplicate key errors
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    logger.error({
      message: 'Duplicate field value entered',
      stack: err.stack,
      path: req.path,
      method: req.method,
      statusCode: 400,
    });

    return res.status(400).json({
      status: 'fail',
      message: 'Duplicate field value entered',
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    logger.error({
      message: 'Invalid token',
      stack: err.stack,
      path: req.path,
      method: req.method,
      statusCode: 401,
    });

    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token',
    });
  }

  // Handle unknown errors
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: 500,
  });

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
}; 