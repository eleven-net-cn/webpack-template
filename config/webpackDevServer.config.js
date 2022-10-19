'use strict';

const paths = require('./paths');
const packageJson = require('../package');

module.exports = function () {
  const publicPath = process.env.PUBLIC_URL || '/';

  return {
    publicPath,
    contentBase: paths.appPubic,
    contentBasePublicPath: publicPath,
    watchContentBase: true,
    inline: true,
    hot: true,
    open: false,
    compress: true,
    disableHostCheck: false,
    transportMode: 'ws',
    quiet: true,
    overlay: {
      errors: true,
      warnings: false,
    },
    clientLogLevel: 'none',
    stats: 'errors-warnings',
    historyApiFallback: {
      disableDotRule: true,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    proxy: packageJson.proxy,
    before(app) {},
  };
};
