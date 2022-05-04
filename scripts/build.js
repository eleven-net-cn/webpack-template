'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', (err) => {
  throw err;
});

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const chalk = require('chalk');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const { program } = require('commander');

program.option('-a, --analyzer', 'run analyzer server', false).parse();

const { analyzer } = program.opts();
const config = configFactory('production', {
  analyzer,
});
const compiler = webpack(config);
const disableCopyFiles = ['.html', '.ico'];

fs.emptyDirSync(paths.appDist);

fs.copySync(paths.appPublic, paths.appDist, {
  dereference: true,
  filter: (file) => !disableCopyFiles.includes(path.extname(file)),
});

compiler.run((err, stats) => {
  if (err) {
    return console.log(err);
  }

  console.log(chalk.green('Build Completed.'));
});
