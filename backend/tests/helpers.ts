import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../src/models/User';
import { Post } from '../src/models/Post';
import jwt from 'jsonwebtoken';

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};

export const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

export const createTestUser = async (email = 'test@example.com', password = 'password123') => {
  const user = await User.create({
    email,
    password,
  });
  return user;
};

export const createTestPost = async (userId: string, title = 'Test Post', content = 'Test Content') => {
  const post = await Post.create({
    title,
    content,
    userId,
    isDraft: true,
  });
  return post;
};

export const generateTestToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-secret');
}; 