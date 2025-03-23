import { AppError } from '../../src/utils/AppError';

describe('AppError', () => {
  it('should create an error with default status code', () => {
    const error = new AppError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
  });

  it('should create an error with custom status code', () => {
    const error = new AppError('Test error', 400);
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('error');
  });

  it('should create an error with custom status', () => {
    const error = new AppError('Test error', 400, 'fail');
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe('fail');
  });

  it('should capture stack trace', () => {
    const error = new AppError('Test error');
    expect(error.stack).toBeDefined();
  });

  it('should be instance of Error', () => {
    const error = new AppError('Test error');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should handle different status codes', () => {
    const statusCodes = [200, 201, 400, 401, 403, 404, 500];
    statusCodes.forEach(code => {
      const error = new AppError('Test error', code);
      expect(error.statusCode).toBe(code);
    });
  });

  it('should handle empty message', () => {
    const error = new AppError('');
    expect(error.message).toBe('');
  });

  it('should handle long message', () => {
    const longMessage = 'a'.repeat(1000);
    const error = new AppError(longMessage);
    expect(error.message).toBe(longMessage);
  });

  it('should handle special characters in message', () => {
    const message = 'Test error!@#$%^&*()';
    const error = new AppError(message);
    expect(error.message).toBe(message);
  });
}); 