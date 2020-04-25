const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config.base')
const CleanPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const utils = require('./utils')

const shouldUseSourceMap = !!process.env.devtool
const shouldDropDebugger = process.env.BUILD_ENV === 'production'
const shouldDropConsole = process.env.BUILD_ENV === 'production'

module.exports = merge(base, {
  output: {
    filename: 'static/js/[name].[chunkhash:7].js',
    chunkFilename: 'static/js/[name].[chunkhash:7].js',
  },
  plugins: [
    ...utils.getHtmlWebpackPluginsProd(),
    new CleanPlugin([
      path.resolve(__dirname, '..', 'dist/*'),
      path.resolve(__dirname, '..', 'analyzer/*'),
    ], {
      allowExternal: true,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.resolve(__dirname, '..', `analyzer/index.html`)
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:7].css',
      chunkFilename: 'static/css/[name].[contenthash:7].css',
    }),
    new webpack.HashedModuleIdsPlugin(),
  ],
  optimization: {
    // 抽取运行时代码
    runtimeChunk: {
      name: 'manifest',
    },
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
    // minimize: true, // mode: production 默认为 true
    minimizer: [
      // cheap-source-map选项不适用于此插件（TerserPlugin）
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
            drop_debugger: shouldDropDebugger, // 删除debugger
            drop_console: shouldDropConsole, // 删除console
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,  // 移除注释
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
            beautify: false, // 不美化输出
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: shouldUseSourceMap,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,  // https://github.com/postcss/postcss-safe-parser
          map: !shouldUseSourceMap
            ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true,
              }
            : false,
        },
      }),
    ],
  },
})
