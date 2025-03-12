module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '/\.[jt]sx?$/': ['ts-jest'],
},
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/types/**/*.ts'],
};
