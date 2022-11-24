const nxPreset = require('@nrwl/jest/preset');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.base.json');

const config = {
  ...nxPreset,
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      lines: 95,
      branches: 95,
    },
  },
  errorOnDeprecated: true,
  globals: {
    'ts-jest': { isolatedModules: true },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs', 'html'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
      prefix: process.cwd(),
    }),
  },
  preset: 'ts-jest',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.config/',
    '/.github/',
    '/.vscode/',
    '/tmp/',
  ],
};

module.exports = config;
