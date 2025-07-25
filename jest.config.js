/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test{.ts,.tsx}'],
  transform: {
    '^.+\.tsx?$': ['ts-jest', {}],
  },
  moduleNameMapper: {
    '^@minecraft/server$': '<rootDir>/mocks/minecraftServer.ts',
  },
};
