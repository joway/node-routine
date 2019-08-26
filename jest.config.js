module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!src/**/*.d.ts"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["text-summary", "json", "html"],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: true,

  // An array of file extensions your modules use
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

  // A map from regular expressions to module names that allow to stub out resources with a single module
  // moduleNameMapper: {},

  // The glob patterns Jest uses to detect test files
  testMatch: ["<rootDir>/src/**/test.{js,jsx,ts,tsx}", "<rootDir>/src/**/*.test.{js,jsx,ts,tsx}"],

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  // testURL: "http://localhost",

  // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
  timers: "fake",

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\]"
    // Replace the above exclusion with the following pattern to include some node modules.
    // "[/\\\\]node_modules[/\\\\](?!NODE_MODULE).+\\.{ts,tsx,js,jsx}"
  ],

  // Indicates whether each individual test should be reported during the run
  verbose: true
};
