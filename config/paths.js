const { resolveApp } = require('./utils');

module.exports = {
  appPublic: resolveApp('public'),
  appDist: resolveApp('dist'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
};
