import mongoose from 'mongoose';
import { connectToDatabase, closeDB } from '../../src/utils/db';
import { config } from '../../src/utils/config';
import { logger } from '../../src/utils/logger';

jest.mock('../../src/utils/logger');

describe('Database Connection', () => {
  beforeAll(async () => {
    // Ensure we're disconnected before starting tests
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }, 10000);

  afterAll(async () => {
    await closeDB();
  }, 10000);

  it('should connect to database successfully', async () => {
    await connectToDatabase();
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  }, 10000);

  it('should handle connection error', async () => {
    // Temporarily modify the MongoDB URI to cause a connection error
    const originalUri = config.mongoUri;
    config.mongoUri = 'mongodb://invalid-host:27017/test';

    await expect(connectToDatabase()).rejects.toThrow();
    expect(logger.error).toHaveBeenCalled();

    // Restore original URI
    config.mongoUri = originalUri;
  }, 10000);

  it('should handle disconnection', async () => {
    await connectToDatabase();
    await mongoose.connection.close();
    expect(mongoose.connection.readyState).toBe(0); // 0 = disconnected
  }, 10000);

  it('should handle reconnection', async () => {
    await connectToDatabase();
    await mongoose.connection.close();
    await connectToDatabase();
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  }, 10000);

  it('should handle connection events', async () => {
    await connectToDatabase();
    expect(logger.info).toHaveBeenCalledWith('MongoDB connected');
  }, 10000);

  it('should handle disconnection events', async () => {
    await connectToDatabase();
    await mongoose.connection.close();
    expect(logger.warn).toHaveBeenCalledWith('MongoDB disconnected');
  }, 10000);

  it('should handle reconnection events', async () => {
    await connectToDatabase();
    await mongoose.connection.close();
    await connectToDatabase();
    expect(logger.info).toHaveBeenCalledWith('MongoDB reconnected');
  }, 10000);

  it('should handle multiple connection attempts', async () => {
    await connectToDatabase();
    await connectToDatabase(); // Second attempt should be ignored
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  }, 10000);
}); 