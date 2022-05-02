const { entries } = require('./utils');
const paths = require('./paths');
const packageJson = require('../package');
const keysEntries = Object.keys(entries);
const hasIndexPage = keysEntries.includes('index');
const defaultPage = hasIndexPage ? '' : `${keysEntries[0]}.html`;

module.exports = function ({ entry }) {
  const page = entry ? `${entry}.html` : defaultPage;
  const publicPath = process.env.PUBLIC_URL || '/';
  const host = process.env.HOST || '0.0.0.0';

  return {
    publicPath,
    // host,
    contentBase: paths.appPubic,
    contentBasePublicPath: publicPath,
    watchContentBase: true,
    openPage: page,
    index: page,
    inline: true,
    hot: true,
    open: true,
    compress: true,
    disableHostCheck: true,
    transportMode: 'ws',
    quiet: true,
    overlay: false,
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
