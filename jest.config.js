const sharedConfig = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/modules/**/services/*.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text", "lcov"],
  moduleNameMapper: {
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
  preset: "ts-jest",
  rootDir: "./",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

module.exports = {
  projects: [
    {
      ...sharedConfig,
      displayName: "unit",
      testMatch: ["<rootDir>/src/**/*.spec.ts"],
    },
    {
      ...sharedConfig,
      displayName: "integration",
      testMatch: ["<rootDir>/tests/**/*.spec.ts"],
      maxWorkers: 1,
      globalTeardown: "<rootDir>/tests/globalTeardown.ts",
    },
  ],
};
