module.exports = {
  preset: '../../jest.preset.js',

  coverageDirectory: '../../coverage/apps/auth',
  displayName: 'auth',
  setupFiles: ['../../libs/testing/src/setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
};
