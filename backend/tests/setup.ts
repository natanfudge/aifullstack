import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/blog-post-generator-test';
process.env.JWT_SECRET = 'test-secret';
process.env.OPENAI_API_KEY = 'test-key';

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
}); 