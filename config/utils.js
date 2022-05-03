const fs = require('fs');
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath) => {
  return path.resolve(appDirectory, relativePath);
};

const getFiles = (filesPath) => {
  const files = glob.sync(filesPath);
  let obj = {},
    filePath,
    basename,
    extname;

  for (let i = 0; i < files.length; i++) {
    filePath = files[i];
    extname = path.extname(filePath);
    basename = path.basename(filePath, extname);
    obj[basename] = path.resolve(appDirectory, filePath);
  }

  return obj;
};

const getEntries = () => {
  const files = getFiles('src/*.tsx');

  let entry = {};

  for (const name in files) {
    if (templates.hasOwnProperty(name)) {
      entry[name] = files[name];
    }
  }

  return entry;
};

const isNotMulti = (entries) => {
  const keys = Object.keys(entries);
  return keys.length === 1;
};

const templates = getFiles('public/**/*.html');
const entries = getEntries();

const createEntry = () => {
  if (isNotMulti(entries)) {
    return Object.values(entries)[0];
  }

  let entry = {};

  // multi entry/page
  for (const name in entries) {
    if (name === 'index') {
      entry.main = entries[name];
      continue;
    }

    entry[name] = entries[name];
  }

  return entry;
};

const createHtmlWebpackPlugins = (webpackEnv) => {
  const isEnvProduction = webpackEnv === 'production';
  const chunks = ['manifest', 'vendor', 'common'];

  let htmlWebpackPlugins = [];
  let options;

  for (const name in templates) {
    options = {
      filename: `${name}.html`,
      template: templates[name],
      inject: false,
    };

    if (isEnvProduction) {
      options.minify = {
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

    if (entries.hasOwnProperty(name)) {
      // multi entry/page
      if (!isNotMulti(entries)) {
        const chunkName = name === 'index' ? 'main' : name;
        options.chunks = [`runtime-${chunkName}`, 'vendor', 'common', chunkName];
      }
      options.inject = true;
    }
    htmlWebpackPlugins.push(new HtmlWebpackPlugin(options));
  }

  return htmlWebpackPlugins;
};

module.exports = {
  resolveApp,
  entries,
  createEntry,
  createHtmlWebpackPlugins,
};
