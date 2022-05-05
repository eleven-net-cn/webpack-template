'use strict';

const { resolveApp } = require('./utils');

module.exports = {
  appPath: resolveApp('.'),
  appPublic: resolveApp('public'),
  appDist: resolveApp('dist'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appNodeModules: resolveApp('node_modules'),
  appTsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
};
