/**
 * 区分环境，自动注入 process.env 环境变量
 *  - env-cmd: https://www.npmjs.com/package/env-cmd
 */
module.exports = {
  development: {
    BUILD_ENV: 'development', // 当前编译环境
    PUBLIC_URL: '/',
    devtool: 'cheap-module-source-map', // cheap-source-map 不适用 terser-webpack-plugin 压缩插件
    // PORT: 3000,
    // HOST: '',
  },
  test: {
    BUILD_ENV: 'test',
    PUBLIC_URL: '/',
    devtool: 'cheap-module-source-map',
  },
  production: {
    BUILD_ENV: 'production',
    PUBLIC_URL: '/',
    devtool: 'source-map',
  },
};
