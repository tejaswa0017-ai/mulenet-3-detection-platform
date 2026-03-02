module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts', '**/?(*.)+(pbt.test).ts'],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/*.test.ts',
    '!packages/*/src/**/*.pbt.test.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 90,
      branches: 85,
      functions: 90,
      statements: 90,
    },
  },
  moduleNameMapper: {
    '^@mulenet/types$': '<rootDir>/packages/types/src',
    '^@mulenet/fibo-adapter$': '<rootDir>/packages/fibo-adapter/src',
    '^@mulenet/entity-resolver$': '<rootDir>/packages/entity-resolver/src',
    '^@mulenet/graph-store$': '<rootDir>/packages/graph-store/src',
    '^@mulenet/tgn$': '<rootDir>/packages/tgn/src',
    '^@mulenet/privacy-engine$': '<rootDir>/packages/privacy-engine/src',
    '^@mulenet/risk-scorer$': '<rootDir>/packages/risk-scorer/src',
    '^@mulenet/explainability$': '<rootDir>/packages/explainability/src',
    '^@mulenet/compliance$': '<rootDir>/packages/compliance/src',
    '^@mulenet/edge-node$': '<rootDir>/packages/edge-node/src',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  testTimeout: 30000,
  verbose: true,
};
