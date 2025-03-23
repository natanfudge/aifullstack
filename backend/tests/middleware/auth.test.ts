import { Request, Response, NextFunction } from 'express';
import { protect } from '../../src/middleware/auth';
import { User } from '../../src/models/User';
import { connectDB, closeDB, clearDB, createTestUser, generateTestToken } from '../helpers';

describe('Auth Middleware', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it('should pass with valid token', async () => {
    const user = await createTestUser();
    const token = generateTestToken(user._id);

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user._id.toString()).toBe(user._id.toString());
  });

  it('should fail without token', async () => {
    const req = {
      headers: {},
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Not logged in',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail with invalid token', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Not logged in',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail with non-existent user', async () => {
    const token = generateTestToken('507f1f77bcf86cd799439011');

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'User no longer exists',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail with malformed token', async () => {
    const req = {
      headers: {
        authorization: 'Bearer not-a-jwt-token',
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Not logged in',
    });
    expect(next).not.toHaveBeenCalled();
  });
}); 