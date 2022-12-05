const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (config) => {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    ],
  };
};
