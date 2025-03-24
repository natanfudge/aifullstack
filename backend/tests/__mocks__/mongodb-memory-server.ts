const mockMongoMemoryServer = {
  MongoMemoryServer: {
    create: jest.fn(),
    prototype: {
      getUri: jest.fn(),
      stop: jest.fn()
    }
  }
};

module.exports = mockMongoMemoryServer; 