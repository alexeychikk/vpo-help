const Dotenv = require('dotenv-webpack');

module.exports = (config) => {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new Dotenv({
        path: config.mode === 'production' ? '.env' : 'apps/client/.env.dev',
      }),
    ],
  };
};
