const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      plugins: [
        ...config.resolve.plugins,
        new TsconfigPathsPlugin({ configFile: 'apps/auth/tsconfig.app.json' }),
      ],
    },
    watchOptions: {
      aggregateTimeout: 500,
      poll: 1000,
    },
  };
};
