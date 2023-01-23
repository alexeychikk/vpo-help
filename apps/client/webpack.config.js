const dotenv = require('dotenv');
const webpack = require('webpack');

module.exports = (config) => {
  dotenv.config({
    path: config.mode === 'production' ? '.env' : 'apps/client/.env.dev',
  });
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({
        'process.env.CLIENT_ENV': JSON.stringify(process.env.CLIENT_ENV),
        'process.env.API_URL': JSON.stringify(process.env.API_URL),
        'process.env.EMAIL_VERIFICATION_ENABLED': JSON.stringify(
          process.env.EMAIL_VERIFICATION_ENABLED,
        ),
      }),
    ],
  };
};
