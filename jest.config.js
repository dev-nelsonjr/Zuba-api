import 'dotenv-safe/config.js'
import { execSync } from 'child_process'

process.env.DB_URL = `${process.env.DB_URL}_testdb02?schema=test_schema`

execSync('yarn prisma migrate deploy')

export default {
  testEnvironment: 'node',
  transform: {

    '^.+\\.m?js$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
};
