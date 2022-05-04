'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', (err) => {
  throw err;
});

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');
const { program } = require('commander');
const openBrowser = require('react-dev-utils/openBrowser');
const { entries } = require('../config/utils');

program.option('-e, --entry <entry-name>', 'open the entry page at startup').parse();

const { entry } = program.opts();
const config = configFactory('development');
const serverConfig = createDevServerConfig();
const compiler = webpack(config);
const devServer = new WebpackDevServer(compiler, serverConfig);
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const keysEntries = Object.keys(entries);
const defaultPage = keysEntries.includes('index') ? '' : `${keysEntries[0]}.html`;
const page = entry ? `${entry}.html` : defaultPage;
const openUrl = `http://${host}:${port}/${page}`;

devServer.listen(port, host, (err) => {
  if (err) {
    return console.log(err);
  }

  openBrowser(openUrl);
});

['SIGINT', 'SIGTERM'].forEach(function (sig) {
  process.on(sig, function () {
    devServer.close();
    process.exit();
  });
});

process.stdin.on('end', function () {
  devServer.close();
  process.exit();
});
