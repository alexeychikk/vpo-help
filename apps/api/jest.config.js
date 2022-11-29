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
};
