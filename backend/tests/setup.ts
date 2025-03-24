import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, beforeAll, afterEach, jest } from '@jest/globals';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.OPENAI_API_KEY = 'test-key';

// Mock variables
let mongod: any;

// Mock mongoose connection methods (without direct assignment)
// @ts-ignore - We need to mock these for tests
mongoose.connection.db = {
  collections: () => Promise.resolve([])
};
// @ts-ignore
mongoose.connection.collections = {};
// @ts-ignore
mongoose.connection.close = () => Promise.resolve();
// @ts-ignore
mongoose.connection.dropDatabase = () => Promise.resolve();
// @ts-ignore
mongoose.disconnect = () => Promise.resolve();

// Mocked setup functions
beforeAll(async () => {
  console.log('Setting up mock database connection for tests');
  // No actual connection needed in mocked environment
});

afterAll(async () => {
  console.log('Cleaning up mock database connection');
  // No actual cleanup needed in mocked environment
});

afterEach(async () => {
  console.log('Clearing mock collections');
  // No need to delete from collections in mocked environment
}); 