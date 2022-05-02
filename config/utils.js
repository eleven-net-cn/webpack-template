const fs = require('fs');
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath) => {
  return path.resolve(appDirectory, relativePath);
};

/**
 * 获取文件
 * @param {String} filesPath 文件目录
 * @returns {Object} 文件集合(文件名: 文件路径)
 */
const getFiles = (filesPath) => {
  let files = glob.sync(filesPath);
  let obj = {};
  let filePath, basename, extname;

  for (let i = 0; i < files.length; i++) {
    filePath = files[i];
    extname = path.extname(filePath); // 扩展名 eg: .html
    basename = path.basename(filePath, extname); // 文件名 eg: index
    // eg: { index: '/src/views/index/index.js' }
    obj[basename] = path.resolve(appDirectory, filePath);
  }
  return obj;
};

/**
 * 打包入口
 *  - 与 public/*.html 文件同名的将会作为入口
 *  - 入口 js 的名称不允许重名
 */
const entries = getFiles('src/*.tsx');

/**
 * 页面的模版
 *  - 允许文件夹层级嵌套
 *  - html 的名称不允许重名
 */
const templates = getFiles('public/**/*.html');

const getEntries = () => {
  let entry = {};

  for (let name in entries) {
    entry[name] = entries[name];
  }
  return entry;
};

const createHtmlWebpackPlugins = (webpackEnv) => {
  const isEnvProduction = webpackEnv === 'production';

  let htmlWebpackPlugins = [];
  let setting = null;

  for (let name in templates) {
    setting = {
      filename: `${name}.html`,
      template: templates[name],
      inject: false,
    };

    if (isEnvProduction) {
      setting.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      };
    }

    // (仅)有入口的模版自动引入资源
    if (name in getEntries()) {
      setting.chunks = ['manifest', 'vendor', 'common', name];
      setting.inject = true;
    }
    htmlWebpackPlugins.push(new HtmlWebpackPlugin(setting));
    setting = null;
  }

  return htmlWebpackPlugins;
};

module.exports = {
  resolveApp,
  entries,
  getEntries,
  createHtmlWebpackPlugins,
};
