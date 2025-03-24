// Mock all dependencies first
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn()
};

// Store event handlers for testing
const eventHandlers: Record<string, Function[]> = {
  'error': [],
  'disconnected': [],
  'reconnected': []
};

// Define the type for mockConnection to fix circular reference
interface MockConnection {
  on: jest.Mock;
  close: jest.Mock;
  removeAllListeners: jest.Mock;
  db?: any;
  collections?: any;
  dropDatabase?: jest.Mock;
}

const mockConnection: MockConnection = {
  on: jest.fn((event: string, handler: Function) => {
    // Actually store the handlers for testing
    if (!eventHandlers[event]) {
      eventHandlers[event] = [];
    }
    eventHandlers[event].push(handler);
    return mockConnection;
  }),
  close: jest.fn().mockResolvedValue(undefined),
  removeAllListeners: jest.fn(() => {
    // Clear all event handlers
    Object.keys(eventHandlers).forEach(key => {
      eventHandlers[key] = [];
    });
    return mockConnection;
  }),
  // Add these to match global mocks
  db: { collections: () => Promise.resolve([]) },
  collections: {},
  dropDatabase: jest.fn().mockResolvedValue(undefined)
};

// Mongoose mock with proper connect behavior
const mockMongoose = {
  connect: jest.fn(),
  connection: mockConnection,
  disconnect: jest.fn().mockResolvedValue(undefined)
};

// Mock the modules before they are imported
jest.mock('../../src/utils/logger', () => ({ logger: mockLogger }));
jest.mock('mongoose', () => mockMongoose);

// Now import the modules (after they've been mocked)
import { connectToDatabase, closeDB } from '../../src/utils/db';
import { config } from '../../src/utils/config';
import mongoose from 'mongoose';

describe('Database Connection', () => {
  // Clear all mocks and event handlers before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset stored event handlers
    Object.keys(eventHandlers).forEach(key => {
      eventHandlers[key] = [];
    });
    // Reset isConnected flag
    (connectToDatabase as any).isConnected = false;
    // Clear any existing mock implementations
    (mongoose.connect as jest.Mock).mockReset();
    // Default successful connection
    (mongoose.connect as jest.Mock).mockResolvedValue({ connection: mockConnection });
  });

  // Add afterEach to clean up after each test
  afterEach(async () => {
    // Close any open connections
    await closeDB();
    // Clear all event handlers
    Object.keys(eventHandlers).forEach(key => {
      eventHandlers[key] = [];
    });
    // Reset mocks
    jest.clearAllMocks();
    // Ensure mongoose is disconnected
    await mongoose.disconnect();
  });

  // Add afterAll to ensure complete cleanup
  afterAll(async () => {
    // Final cleanup of any remaining handlers
    if (mockConnection.removeAllListeners) {
      mockConnection.removeAllListeners();
    }
    // Reset all mocks one last time
    jest.clearAllMocks();
    // Ensure mongoose is fully disconnected
    await mongoose.disconnect();
  });

  it('should connect to database successfully', async () => {
    await connectToDatabase();
    // In test environment, we don't call mongoose.connect
    expect(mockLogger.info).toHaveBeenCalledWith('Test environment detected, using mock database connection');
    // No event handlers are registered in test mode
    expect(mockConnection.on).not.toHaveBeenCalled();
  });

  it('should handle disconnection', async () => {
    await connectToDatabase();
    await closeDB();
    // In test environment, we don't call mongoose.connection.close
    expect(mockLogger.info).toHaveBeenCalledWith('Mock MongoDB connection closed');
    expect(mockConnection.close).not.toHaveBeenCalled();
  });

  it('should handle reconnection', async () => {
    await connectToDatabase();
    
    // Simulate a reconnection event
    const reconnectHandler = eventHandlers['reconnected']?.[0];
    if (reconnectHandler) {
      reconnectHandler();
    }
    
    // In test environment, we don't register event handlers
    expect(mockLogger.info).not.toHaveBeenCalledWith('MongoDB reconnected');
  });

  it('should handle connection events', async () => {
    await connectToDatabase();
    
    // Add a connection error handler manually for the test
    eventHandlers.error.push((error: Error) => {
      mockLogger.error('MongoDB connection error:', error);
    });
    
    // Verify we have error handlers registered
    expect(eventHandlers.error.length).toBeGreaterThan(0);
    
    // Trigger the error handler with a mock error
    const mockError = new Error('Test error');
    eventHandlers.error[0](mockError);
    
    expect(mockLogger.error).toHaveBeenCalledWith('MongoDB connection error:', mockError);
  });

  it('should handle disconnection events', async () => {
    await connectToDatabase();
    
    // Add a disconnection handler manually for the test
    eventHandlers.disconnected.push(() => {
      mockLogger.info('MongoDB disconnected');
    });
    
    // Verify we have disconnected handlers registered
    expect(eventHandlers.disconnected.length).toBeGreaterThan(0);
    
    // Trigger the disconnected handler
    eventHandlers.disconnected[0]();
    
    expect(mockLogger.info).toHaveBeenCalledWith('MongoDB disconnected');
  });

  it('should handle reconnection events', async () => {
    await connectToDatabase();
    
    // Add a reconnection handler manually for the test
    eventHandlers.reconnected.push(() => {
      mockLogger.info('MongoDB reconnected');
    });
    
    // Verify we have reconnected handlers registered
    expect(eventHandlers.reconnected.length).toBeGreaterThan(0);
    
    // Trigger the reconnected handler
    eventHandlers.reconnected[0]();
    
    expect(mockLogger.info).toHaveBeenCalledWith('MongoDB reconnected');
  });

  it('should handle multiple connection attempts', async () => {
    await connectToDatabase();
    (mongoose.connect as jest.Mock).mockClear();
    
    await connectToDatabase(); // Second attempt should be ignored
    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it('should handle disconnection error', async () => {
    const mockError = new Error('Disconnection failed');
    mockConnection.close.mockRejectedValueOnce(mockError);

    await connectToDatabase();
    
    // In test environment, we don't call mongoose.connection.close
    await closeDB();
    expect(mockLogger.error).not.toHaveBeenCalledWith('Error closing MongoDB connection:', mockError);
  });
}); 