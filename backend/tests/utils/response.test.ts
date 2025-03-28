import { Response } from 'express';
import { successResponse, errorResponse } from '../../src/utils/response';

describe('Response Utils', () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('successResponse', () => {
    it('should send success response with data', () => {
      const data = { id: 1, name: 'Test' };
      successResponse(mockRes as Response, data);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it('should send success response with custom status code', () => {
      const data = { message: 'Created' };
      successResponse(mockRes as Response, data, 201);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });

    it('should handle null data', () => {
      successResponse(mockRes as Response, null);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: null,
      });
    });

    it('should handle undefined data', () => {
      successResponse(mockRes as Response, undefined);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: null,
      });
    });

    it('should handle empty object data', () => {
      successResponse(mockRes as Response, {});

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {},
      });
    });

    it('should handle array data', () => {
      const data = [1, 2, 3];
      successResponse(mockRes as Response, data);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data,
      });
    });
  });

  describe('errorResponse', () => {
    it('should send error response with string message', () => {
      const error = 'Test error';
      errorResponse(mockRes as Response, error);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error,
      });
    });

    it('should send error response with custom status code', () => {
      const error = 'Not found';
      errorResponse(mockRes as Response, error, 404);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error,
      });
    });

    it('should handle Error object', () => {
      const error = new Error('Test error');
      errorResponse(mockRes as Response, error);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: error.message,
      });
    });

    it('should handle array of errors', () => {
      const errors = ['Error 1', 'Error 2'];
      errorResponse(mockRes as Response, errors);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error 1, Error 2',
      });
    });

    it('should handle null error', () => {
      errorResponse(mockRes as Response, null);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Something went wrong',
      });
    });

    it('should handle undefined error', () => {
      errorResponse(mockRes as Response, undefined);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Something went wrong',
      });
    });

    it('should handle object error', () => {
      const error = { code: 404, message: 'Not found' };
      errorResponse(mockRes as Response, error);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: JSON.stringify(error),
      });
    });
  });
}); 