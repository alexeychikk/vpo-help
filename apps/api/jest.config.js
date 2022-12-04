module.exports = {
  preset: '../../jest.preset.js',

  coverageDirectory: '../../coverage/apps/api',
  displayName: 'api',
  setupFiles: ['./testing/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!(csv|csv-parse|csv-generate|csv-stringify|stream-transform)/)',
  ],
};
