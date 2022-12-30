const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const baseConfig = require('./webpack.config');

module.exports = (config) => {
  config = baseConfig(config);
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    ],
  };
};
