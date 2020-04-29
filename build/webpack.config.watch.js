const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config.base')
const CleanPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const paths = require('./paths')
const utils = require('./utils')
const devtool = process.env.devtool || false

module.exports = merge(base, {
  output: {
    path: paths.appWatch,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
  },
  devtool: devtool,
  plugins: [
    ...utils.getHtmlWebpackPluginsProd(),
    new CleanPlugin([path.resolve(__dirname, '..', 'dist_watch/*')], {
      allowExternal: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[name].css',
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
  optimization: {
    runtimeChunk: true, // 抽取运行时代码
    splitChunks: {
      chunks: 'all',
      name: false,
      // 缓存组
      cacheGroups: {
        vendor: { // 主要模块
          test: /[\\/]node_modules[\\/](moment)[\\/]/,
          name: 'vendor',
          chunks: 'all',
          maxAsyncRequests: 5,  // 当按需加载时，并行请求的最大数量
          priority: 10, // 缓存组打包的先后优先级
          enforce: true,  // // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
        },
        common: { // 次要模块
          test: /[\\/]node_modules[\\/]/,
          name: 'common',
          chunks: 'all',
          maxAsyncRequests: 5,
          priority: 9,
          enforce: true,
          reuseExistingChunk: true, // 设置是否重用该chunk
        },
      },
    },
  },
})
