'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', (err) => {
  throw err;
});

const webpack = require('webpack');
const fs = require('fs-extra');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const config = configFactory('production', {
  watch: true,
});
const compiler = webpack(config);

fs.emptyDirSync(paths.appDist);

compiler.watch({}, (err, stats) => {
  if (err) {
    console.log(err);
  }

  console.log(
    stats.toString({
      chunks: false,
      colors: true,
    }),
  );
});
