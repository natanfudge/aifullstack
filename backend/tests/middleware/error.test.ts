import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../src/middleware/error';
import { AppError } from '../../src/utils/AppError';

describe('Error Handler Middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn() as NextFunction;
  });

  it('should handle AppError with custom status code', async () => {
    const error = new AppError('Custom error message', 400);

    await errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Custom error message',
    });
  });

  it('should handle AppError with default status code', async () => {
    const error = new AppError('Custom error message');

    await errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Custom error message',
    });
  });

  it('should handle regular Error', async () => {
    const error = new Error('Regular error message');

    await errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Something went wrong',
    });
  });

  it('should handle unknown error type', async () => {
    const error = 'String error';

    await errorHandler(error as any, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Something went wrong',
    });
  });

  it('should handle Mongoose validation error', async () => {
    const error = {
      name: 'ValidationError',
      errors: {
        email: {
          message: 'Email is required',
        },
      },
    };

    await errorHandler(error as any, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Email is required',
    });
  });

  it('should handle Mongoose duplicate key error', async () => {
    const error = {
      name: 'MongoError',
      code: 11000,
      keyValue: {
        email: 'test@example.com',
      },
    };

    await errorHandler(error as any, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Email already exists',
    });
  });

  it('should handle JWT error', async () => {
    const error = {
      name: 'JsonWebTokenError',
      message: 'Invalid token',
    };

    await errorHandler(error as any, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Not logged in',
    });
  });

  it('should handle JWT expired error', async () => {
    const error = {
      name: 'TokenExpiredError',
      message: 'Token expired',
    };

    await errorHandler(error as any, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Not logged in',
    });
  });
}); 