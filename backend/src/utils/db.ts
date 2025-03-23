import mongoose from 'mongoose';
import { config } from './config';
import { logger } from './logger';

let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(config.mongoUri);
    isConnected = true;
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    if (config.nodeEnv !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

export const closeDB = async (): Promise<void> => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  logger.info('MongoDB reconnected');
}); 