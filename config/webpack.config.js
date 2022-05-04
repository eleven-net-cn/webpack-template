const webpack = require('webpack');
const path = require('path');
const resolve = require('resolve');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DEFAULT_EXTENSIONS } = require('@babel/core');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Webpackbar = require('webpackbar');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { createEntry, createHtmlWebpackPlugins } = require('./utils');
const paths = require('./paths');

const shouldUseSourceMap = !!process.env.devtool;
const shouldDropDebugger = process.env.BUILD_ENV === 'production';
const shouldDropConsole = process.env.BUILD_ENV === 'production';

module.exports = function (webpackEnv, options = {}) {
  const { analyzer, watch } = options;
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const styleLoader = isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader;

  return {
    mode: webpackEnv,
    entry: createEntry(),
    output: {
      path: paths.appDist,
      pathinfo: isEnvDevelopment,
      filename:
        isEnvDevelopment || watch ? 'static/js/[name].js' : 'static/js/[name].[chunkhash:7].js',
      chunkFilename:
        isEnvDevelopment || watch ? 'static/js/[name].js' : 'static/js/[name].[chunkhash:7].js',
      publicPath: process.env.PUBLIC_URL || '/',
      futureEmitAssets: true,
      globalObject: 'this',
    },
    devtool: process.env.devtool || false,
    // Webpack noise constrained to errors and warnings
    stats: 'errors-warnings',
    performance: {
      hints: false, // 关闭文件体积较大提示
    },
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    resolve: {
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx', '.json', '.css', '.less'],
      alias: {
        '@': paths.appSrc,
        src: paths.appSrc,
      },
    },
    module: {
      rules: [
        // Process application JS with Babel.
        // The preset includes JSX, Flow, TypeScript, and some ESnext features.
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: paths.appSrc,
          loader: require.resolve('babel-loader'),
          options: {
            customize: require.resolve('babel-preset-react-app/webpack-overrides'),
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            // See #6846 for context on why cacheCompression is disabled
            cacheCompression: false,
            compact: isEnvProduction,
          },
        },
        // Process any JS outside of the app with Babel.
        // Unlike the application JS, we only compile the standard ES features.
        {
          test: /\.(js|mjs)$/,
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            presets: [[require.resolve('babel-preset-react-app/dependencies'), { helpers: true }]],
            cacheDirectory: true,
            // See #6846 for context on why cacheCompression is disabled
            cacheCompression: false,

            // Babel sourcemaps are needed for debugging into node_modules
            // code.  Without the options below, debuggers like VSCode
            // show incorrect code and set breakpoints on the wrong lines.
            sourceMaps: true,
            inputSourceMap: true,
          },
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            attrs: ['link:href', 'img:src', 'img:data-src', 'audio:src'],
          },
        },
        {
          test: /\.css$/,
          use: [styleLoader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.less$/,
          use: [styleLoader, 'css-loader', 'postcss-loader', 'less-loader'],
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
      ],
    },
    plugins: [
      new Webpackbar(),
      isEnvProduction && new CleanWebpackPlugin(),
      ...createHtmlWebpackPlugins(webpackEnv),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: watch ? 'static/css/[name].css' : 'static/css/[name].[contenthash:7].css',
          chunkFilename: watch ? 'static/css/[name].css' : 'static/css/[name].[contenthash:7].css',
        }),
      isEnvProduction && new webpack.HashedModuleIdsPlugin(),
      isEnvDevelopment && new webpack.NamedModulesPlugin(),
      analyzer && new BundleAnalyzerPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
        },
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new ForkTsCheckerWebpackPlugin({
        async: isEnvDevelopment,
        typescript: {
          typescriptPath: resolve.sync('typescript', {
            basedir: paths.appNodeModules,
          }),
          configOverwrite: {
            compilerOptions: {
              sourceMap: isEnvProduction
                ? shouldUseSourceMap
                : isEnvDevelopment,
              skipLibCheck: true,
              inlineSourceMap: false,
              declarationMap: false,
              noEmit: true,
              incremental: true,
              tsBuildInfoFile: paths.appTsBuildInfoFile,
            },
          },
          context: paths.appPath,
          diagnosticOptions: {
            syntactic: true,
          },
          mode: 'write-references',
          // profile: true,
        },
        issue: {
          // This one is specifically to match during CI tests,
          // as micromatch doesn't match
          // '../cra-template-typescript/template/src/App.tsx'
          // otherwise.
          include: [
            { file: '../**/src/**/*.{ts,tsx}' },
            { file: '**/src/**/*.{ts,tsx}' },
          ],
          exclude: [
            { file: '**/src/**/__tests__/**' },
            { file: '**/src/**/?(*.){spec|test}.*' },
            { file: '**/src/setupProxy.*' },
            { file: '**/src/setupTests.*' },
          ],
        },
        logger: {
          infrastructure: 'silent',
        },
      }),
      new ESLintWebpackPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        failOnError: isEnvProduction,
        context: paths.appSrc,
        cache: true,
        cacheLocation: path.resolve(paths.appNodeModules, '.cache/.eslintcache'),
        // ESLint class options
        cwd: paths.appPath,
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app/base')],
          rules: {
            // 'react/react-in-jsx-scope': 'error',
          },
        },
      }),
    ].filter(Boolean),
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // cheap-source-map选项不适用于此插件（TerserPlugin）
        new TerserWebpackPlugin({
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
              comments: false, // 移除注释
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
            parser: safePostCssParser, // https://github.com/postcss/postcss-safe-parser
            map: shouldUseSourceMap
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
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
      splitChunks: {
        chunks: 'all',
        name: isEnvDevelopment,
        cacheGroups: {
          // 基础依赖，提取为 vendor，方便走浏览器强缓存
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom|moment)[\\/]/,
            name: 'vendor',
            chunks: 'all',
            maxAsyncRequests: 5, // 当按需加载时，并行请求的最大数量
            priority: 10, // 缓存组打包的先后优先级
            /**
             * 若 cacheGroup 中没有设置 minSize，则据此判断是否使用上层的 minSize
             *  - true，使用 0
             *  - false，使用上层 minSize
             */
            enforce: true,
          },
          // 低频依赖，node_modules 依赖更新时变化
          common: {
            test: /[\\/]node_modules[\\/]/,
            name: 'common',
            chunks: 'all',
            maxAsyncRequests: 5,
            priority: 9,
            enforce: true,
            reuseExistingChunk: true, // 是否重用该 chunk
          },
        },
      },
    },
  };
};
