import mongoose from 'mongoose';
import { connectDB, closeDB, clearDB } from '../helpers';
import { User } from '../../src/models/User';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);

    expect(user._id).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Password should be hashed
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  it('should hash password before saving', async () => {
    const password = 'password123';
    const user = await User.create({
      email: 'test@example.com',
      password,
    });

    const isMatch = await bcrypt.compare(password, user.password);
    expect(isMatch).toBe(true);
  });

  it('should require email and password', async () => {
    const userData = {
      email: 'test@example.com',
    };

    try {
      await User.create(userData);
      fail('Should have thrown validation error');
    } catch (error: any) {
      expect(error.errors.password).toBeDefined();
    }
  });

  it('should validate email format', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'password123',
    };

    try {
      await User.create(userData);
      fail('Should have thrown validation error');
    } catch (error: any) {
      expect(error.errors.email).toBeDefined();
    }
  });

  it('should not allow duplicate emails', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    };

    await User.create(userData);

    try {
      await User.create(userData);
      fail('Should have thrown duplicate key error');
    } catch (error: any) {
      expect(error.code).toBe(11000);
    }
  });

  it('should compare password correctly', async () => {
    const password = 'password123';
    const user = await User.create({
      email: 'test@example.com',
      password,
    });

    const isMatch = await user.comparePassword(password);
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should update timestamps on save', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
    });

    const createdAt = user.createdAt;
    const updatedAt = user.updatedAt;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 1000));

    user.email = 'updated@example.com';
    await user.save();

    expect(user.createdAt).toEqual(createdAt);
    expect(user.updatedAt.getTime()).toBeGreaterThan(updatedAt.getTime());
  });

  it('should not include password in toJSON', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
    });

    const userJson = user.toJSON();
    expect(userJson.password).toBeUndefined();
  });
}); 