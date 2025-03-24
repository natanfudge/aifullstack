module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      diagnostics: {
        ignoreCodes: [2322, 2339]
      },
      isolatedModules: true
    }]
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  verbose: true,
  testTimeout: 1000,
  maxWorkers: 1,
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Automatically reset mock state between every test
  resetMocks: true,
  // Automatically restore mock state between every test
  restoreMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  // Automatically mock MongoDB
  automock: false,
  // Don't try to find test files in node_modules
  testPathIgnorePatterns: ['/node_modules/'],
  // Force Jest to exit after all tests complete
  forceExit: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false
}; 