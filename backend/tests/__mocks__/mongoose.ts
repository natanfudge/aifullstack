import { jest } from '@jest/globals';

const mockMongoose = {
  connect: jest.fn(),
  connection: {
    readyState: 1,
    close: jest.fn(),
    db: {
      collections: jest.fn()
    }
  },
  Schema: jest.fn(),
  model: jest.fn(),
  models: {},
  modelNames: jest.fn()
};

module.exports = mockMongoose; 