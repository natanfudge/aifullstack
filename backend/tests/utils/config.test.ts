import { config } from '../../src/utils/config';

describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should load environment variables', () => {
    process.env.PORT = '3000';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.NODE_ENV = 'test';

    const { config } = jest.requireActual('../../src/utils/config');

    expect(config.nodeEnv).toBe('test');
    expect(config.port).toBe(3000);
    expect(config.mongoUri).toBe('mongodb://localhost:27017/test');
    expect(config.jwtSecret).toBe('test-secret');
    expect(config.openaiApiKey).toBe('test-key');
  });

  it('should use default values when environment variables are not set', () => {
    delete process.env.PORT;
    delete process.env.MONGODB_URI;
    delete process.env.JWT_SECRET;
    delete process.env.OPENAI_API_KEY;
    delete process.env.NODE_ENV;

    const { config } = jest.requireActual('../../src/utils/config');

    expect(config.nodeEnv).toBe('development');
    expect(config.port).toBe(3000);
    expect(config.mongoUri).toBe('mongodb://localhost:27017/blog-post-generator');
    expect(config.jwtSecret).toBe('your-secret-key');
    expect(config.openaiApiKey).toBeUndefined();
  });

  it('should handle empty environment variables', () => {
    process.env.PORT = '';
    process.env.MONGODB_URI = '';
    process.env.JWT_SECRET = '';
    process.env.OPENAI_API_KEY = '';
    process.env.NODE_ENV = '';

    const { config } = jest.requireActual('../../src/utils/config');

    expect(config.nodeEnv).toBe('development');
    expect(config.port).toBe(3000);
    expect(config.mongoUri).toBe('mongodb://localhost:27017/blog-post-generator');
    expect(config.jwtSecret).toBe('your-secret-key');
    expect(config.openaiApiKey).toBeUndefined();
  });

  it('should handle undefined environment variables', () => {
    delete process.env.PORT;
    delete process.env.MONGODB_URI;
    delete process.env.JWT_SECRET;
    delete process.env.OPENAI_API_KEY;
    delete process.env.NODE_ENV;

    const { config } = jest.requireActual('../../src/utils/config');

    expect(config.nodeEnv).toBe('development');
    expect(config.port).toBe(3000);
    expect(config.mongoUri).toBe('mongodb://localhost:27017/blog-post-generator');
    expect(config.jwtSecret).toBe('your-secret-key');
    expect(config.openaiApiKey).toBeUndefined();
  });

  it('should handle production environment', () => {
    process.env.NODE_ENV = 'production';
    const { config } = jest.requireActual('../../src/utils/config');
    expect(config.nodeEnv).toBe('production');
  });

  it('should handle development environment', () => {
    process.env.NODE_ENV = 'development';
    const { config } = jest.requireActual('../../src/utils/config');
    expect(config.nodeEnv).toBe('development');
  });

  it('should handle custom MongoDB URI', () => {
    const customUri = 'mongodb://custom-host:27017/custom-db';
    process.env.MONGODB_URI = customUri;
    const { config } = jest.requireActual('../../src/utils/config');
    expect(config.mongoUri).toBe(customUri);
  });

  it('should handle custom JWT secret', () => {
    const customSecret = 'custom-secret-key';
    process.env.JWT_SECRET = customSecret;
    const { config } = jest.requireActual('../../src/utils/config');
    expect(config.jwtSecret).toBe(customSecret);
  });

  it('should handle custom OpenAI API key', () => {
    const customKey = 'custom-openai-key';
    process.env.OPENAI_API_KEY = customKey;
    const { config } = jest.requireActual('../../src/utils/config');
    expect(config.openaiApiKey).toBe(customKey);
  });
}); 