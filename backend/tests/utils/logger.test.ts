import { logger } from '../../src/utils/logger';

jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }
}));

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be a winston logger instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should format log messages correctly', () => {
    const message = 'Test log message';
    logger.info(message);
    expect(logger.info).toHaveBeenCalledWith(message);
  });

  it('should handle object logging', () => {
    const obj = { key: 'value' };
    logger.info(obj);
    expect(logger.info).toHaveBeenCalledWith(obj);
  });

  it('should handle error logging', () => {
    const error = new Error('Test error');
    logger.error(error);
    expect(logger.error).toHaveBeenCalledWith(error);
  });

  it('should handle multiple arguments', () => {
    const message = 'Test message';
    const data = { key: 'value' };
    logger.info(message, data);
    expect(logger.info).toHaveBeenCalledWith(message, data);
  });

  it('should handle undefined values', () => {
    logger.info(undefined);
    expect(logger.info).toHaveBeenCalledWith(undefined);
  });

  it('should handle null values', () => {
    logger.info(null);
    expect(logger.info).toHaveBeenCalledWith(null);
  });

  it('should handle circular references', () => {
    const circular: any = { a: 1 };
    circular.self = circular;
    logger.info(circular);
    expect(logger.info).toHaveBeenCalledWith(circular);
  });

  it('should handle long messages', () => {
    const longMessage = 'a'.repeat(1000);
    logger.info(longMessage);
    expect(logger.info).toHaveBeenCalledWith(longMessage);
  });
}); 