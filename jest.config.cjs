const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/(.*)$': '<rootDir>/$1',          // <-- Add this line
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}

module.exports = createJestConfig(customJestConfig)