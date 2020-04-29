const resolveApp = require('./utils').resolveApp

module.exports = {
  appBuild: resolveApp('build'),
  appConfig: resolveApp('config'),
  appDist: resolveApp('dist'),
  appWatch: resolveApp('dist_watch'),
  appSrc: resolveApp('src'),
  appAssets: resolveApp('src/assets'),
  appConstant: resolveApp('src/constant'),
  appService: resolveApp('src/service'),
  appPages: resolveApp('src/pages'),
  appCommon: resolveApp('src/common'),
  appComponents: resolveApp('src/components'),
  appUtils: resolveApp('src/utils'),
}
