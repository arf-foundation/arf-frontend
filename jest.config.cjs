const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  // e2e/*.spec.ts are Playwright tests (yarn e2e), not Jest tests.
  // Plain '/e2e/', not '<rootDir>/e2e/': on Windows the expanded rootDir's
  // backslashes break the pattern. next/jest already adds node_modules and .next.
  testPathIgnorePatterns: ['/e2e/'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/(.*)$': '<rootDir>/$1',          // <-- Add this line
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}

module.exports = createJestConfig(customJestConfig)