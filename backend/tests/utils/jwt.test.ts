import { generateToken, verifyToken } from '../../src/utils/jwt';
import { config } from '../../src/utils/config';
import jwt from 'jsonwebtoken';
import { AppError } from '../../src/utils/AppError';

jest.mock('jsonwebtoken');

describe('JWT Utils', () => {
  const testUserId = '507f1f77bcf86cd799439011';
  const mockToken = 'mock.jwt.token';

  beforeEach(() => {
    jest.clearAllMocks();
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);
  });

  describe('generateToken', () => {
    it('should generate a valid token', () => {
      const token = generateToken(testUserId);
      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: testUserId },
        config.jwtSecret,
        { expiresIn: '1d' }
      );
    });

    it('should accept custom expiration', () => {
      const token = generateToken(testUserId, '1h');
      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: testUserId },
        config.jwtSecret,
        { expiresIn: '1h' }
      );
    });
  });

  describe('verifyToken', () => {
    beforeEach(() => {
      (jwt.verify as jest.Mock).mockReturnValue({ id: testUserId });
    });

    it('should verify a valid token', () => {
      const decoded = verifyToken(mockToken);
      expect(decoded).toEqual({ id: testUserId });
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, config.jwtSecret);
    });

    it('should throw AppError when token is missing', () => {
      expect(() => verifyToken('')).toThrow(AppError);
      expect(() => verifyToken('')).toThrow('No token provided');
    });

    it('should throw AppError when token is expired', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });
      expect(() => verifyToken(mockToken)).toThrow('Token expired');
    });

    it('should throw AppError when token is invalid', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });
      expect(() => verifyToken(mockToken)).toThrow('Invalid token');
    });

    it('should throw AppError when token verification fails', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Verification failed');
      });
      expect(() => verifyToken(mockToken)).toThrow('Token verification failed');
    });

    it('should throw AppError when token payload is invalid', () => {
      (jwt.verify as jest.Mock).mockReturnValue('invalid-payload');
      expect(() => verifyToken(mockToken)).toThrow('Invalid token payload');
    });

    it('should throw AppError when token payload is missing id', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ foo: 'bar' });
      expect(() => verifyToken(mockToken)).toThrow('Invalid token payload');
    });
  });
}); 