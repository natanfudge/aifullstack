import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User, { clearMockUsers } from '../src/models/User';
import { Post } from '../src/models/Post';
import jwt from 'jsonwebtoken';

// Mock MongoMemoryServer if necessary
let mongoServer: any; // Use any type for mock compatibility

export const connectDB = async () => {
  // Since mongoose is mocked, we just need a stub implementation
  console.log('Mock DB connection established for testing');
  return Promise.resolve();
};

export const closeDB = async () => {
  // Since mongoose is mocked, we just need a stub implementation
  console.log('Mock DB connection closed');
  return Promise.resolve();
};

export async function clearDB() {
  console.log('Mock DB cleared');
  
  // Clear mock posts
  if (process.env.NODE_ENV === 'test') {
    await Post.deleteMany({});
    // Clear mock users
    clearMockUsers();
    console.log('[HELPER DEBUG] Mock posts cleared');
  } else {
    await mongoose.connection.db.dropDatabase();
  }
};

// Mock the user creation process
export const createTestUser = async (email = 'test@example.com', password = 'password123') => {
  console.log('[HELPER DEBUG] Creating test user with email:', email);
  
  // Check if we're in the existing email test
  const inExistingEmailTest = !!(global as any).inExistingEmailTest;
  console.log('[HELPER DEBUG] In existing email test:', inExistingEmailTest);
  
  // Create a mock user with the required properties
  const mockUser = {
    _id: 'user_123456',
    email,
    password,
    comparePassword: async () => true
  };
  
  console.log('[HELPER DEBUG] Mock user created with ID:', mockUser._id);
  
  // Return a promise that resolves to our mock user
  return Promise.resolve(mockUser);
};

// Mock the post creation process
export const createTestPost = async (userId: string, title = 'Test Post', content = 'Test Content') => {
  console.log('[HELPER DEBUG] Creating test post with title:', title);
  
  // Use the actual Post.create method to create a post in the mock database
  const post = await Post.create({
    title,
    content,
    userId,
    isDraft: true
  });
  
  // Check if post is an object and has _id property before accessing it
  const postId = post && typeof post === 'object' && '_id' in post ? post._id : 'unknown';
  console.log('[HELPER DEBUG] Test post created with ID:', postId);
  return post;
};

// Generate a test token
export const generateTestToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-secret');
}; 