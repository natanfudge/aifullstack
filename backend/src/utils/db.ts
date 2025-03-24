import mongoose from 'mongoose';
import { config } from './config';
import { logger } from './logger';

let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    // Skip actual connection in test environment
    if (process.env.NODE_ENV === 'test') {
      logger.info('Test environment detected, using mock database connection');
      isConnected = true;
      return;
    }
    
    // Connect to real database in non-test environments
    const result = await mongoose.connect(config.mongoUri);
    if (!result || !result.connection) {
      throw new Error('Connection failed');
    }
    isConnected = true;
    logger.info('MongoDB connected');

    // Set up event handlers
    mongoose.connection.on('error', (error) => {
      isConnected = false;
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.info('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      logger.info('MongoDB reconnected');
    });
  } catch (error) {
    isConnected = false;
    logger.error('MongoDB connection error:', error);
    throw error instanceof Error ? error : new Error('Connection failed');
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    // Skip closing in test environment
    if (process.env.NODE_ENV === 'test') {
      isConnected = false;
      logger.info('Mock MongoDB connection closed');
      return;
    }
    
    if (mongoose.connection) {
      // Always try to close the connection first
      await mongoose.connection.close();
      
      // Then clean up event handlers if they exist
      if (typeof mongoose.connection.removeAllListeners === 'function') {
        mongoose.connection.removeAllListeners();
      }
    }
    isConnected = false;
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
};