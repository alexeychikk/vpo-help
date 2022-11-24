module.exports = {
  preset: '../../jest.preset.js',

  coverageDirectory: '../../coverage/apps/api',
  displayName: 'api',
  setupFiles: ['../../libs/testing/src/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
};
