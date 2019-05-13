const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const utils = require('./utils')
const paths = require('./paths')
const env = require('../config/env')
const devtool = process.env.devtool || false
const BUILD_ENV = process.env.BUILD_ENV
// 抽离css的hash命名与热更新有冲突，热更新时使用style-loader。
const styleLoader = process.env.USE_HMR ? 'style-loader' : MiniCssExtractPlugin.loader
const envCustom = env[BUILD_ENV]

// 注入自定义的process.env环境变量
if(BUILD_ENV && envCustom && typeof envCustom === 'object') {
  for(let key in envCustom) {
    process.env[key] = envCustom[key]
  }
}

module.exports = {
  entry: utils.getEntries(),
  output: {
    path: paths.appDist,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
    publicPath: process.env.publicPath || '/',
  },
  devtool: devtool,
  resolve: {
    extensions: ['.js', '.json', '.css', '.less', '.art'],
    alias: {
      zepto: utils.resolveApp('src/lib/zepto.min.js'),
      config: paths.appConfig,
      src: paths.appSrc,
      assets: paths.appAssets,
      constant: paths.appConstant,
      service: paths.appService,
      pages: paths.appPages,
      common: paths.appCommon,
      components: paths.appComponents,
      utils: paths.appUtils,
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          attrs: ['link:href', 'img:src', 'img:data-src', 'audio:src'],
        },
      },
      {
        test: /\.(less|css)$/,
        use: [styleLoader, 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: paths.appSrc,
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.art$/,
        loader: 'art-template-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/assets/images/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/assets/media/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(ico)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'static/assets/images/[name].[hash:7].[ext]',
        },
      },
      {
        // require.resolve()是nodejs用来查找模块位置的方法,返回模块的入口文件.
        test: require.resolve('../src/lib/zepto.min.js'),
        loader: 'exports-loader?window.Zepto!script-loader',
      },
    ],
  },
  plugins: [
    // 大量需要使用到的模块，在此处一次性注入，避免到处import/require。
    new webpack.ProvidePlugin({
      $: 'zepto',
      Zepto: 'zepto',
      moment: 'moment',
    }),
    // 应用中需要的process.env变量，在此注入才能使用。
    new webpack.DefinePlugin({
      BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),  // 编译环境（development/test/production）
      IS_MOCK: JSON.stringify(process.env.IS_MOCK), // 是否启用mock模拟数据
    }),
  ],
}
