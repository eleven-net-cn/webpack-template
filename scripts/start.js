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

program.option('-e, --entry <entry-name>', 'open the entry page at startup').parse();

const { entry } = program.opts();
const config = configFactory('development');
const serverConfig = createDevServerConfig({ entry });
const compiler = webpack(config);
const devServer = new WebpackDevServer(compiler, serverConfig);
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

devServer.listen(port, host, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(chalk.cyan('Starting the development server...\n'));
});

['SIGINT', 'SIGTERM'].forEach(function (sig) {
  process.on(sig, function () {
    devServer.close();
    process.exit();
  });
});

if (process.env.CI !== 'true') {
  process.stdin.on('end', function () {
    devServer.close();
    process.exit();
  });
}
