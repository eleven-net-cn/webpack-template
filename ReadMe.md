# webpack-template

为懒人准备的 webpack 模版，演示从零纯手工搭建 webpack 的详细配置，移除示例的组件即可直接用于生产。

这里单纯只做 webpack 构建、打包、代码的组织等示例，用简单的 js 去编写示例组件，关于 React、Vue 等配置并不复杂，可以在需要时添加。

随着 webpack 版本的迭代，会将最新的特性加入，持续更新...

## 文档地址

https://webpack.eleven.net.cn

## 版本

```bash
webpack 4 + babel 7
```

## 运行命令

安装依赖

```bash
yarn / yarn install    # 安装全部依赖包
```

开发调试

```bash
yarn start/dev         # 启动本地调试
yarn dev:mock          # 启动本地调试，MockJs模拟接口数据
yarn dev:page-a        # 启动本地调试，仅page-a页面
yarn dev:page-b        # 启动本地调试，仅page-b页面

# watch模式，移除了js、css的压缩，节省时间（watch时需要build压缩版代码，可自行修改）。
yarn watch-dev         # 启动watch模式，本地开发环境（通常用不上）
yarn watch-test        # 启动watch模式，测试环境
yarn watch-prod        # 启动watch模式，生产环境
```

打包

```bash
yarn build-dev         # 打包代码，publicPath以/打头（可通过本地起服务访问build后的代码）
yarn build-test        # 打包测试环境代码
yarn build-prod        # 打包生产环境代码

yarn http-server       # 启动http-server服务器，可用来访问 build 在本地的代码
```

打包产物分析

```bash
yarn analyzer          # 查看最近一次打包的产物分析（webpack-bundle-analyzer）
```

## 目录

```bash
webpack-template
   ├─ analyzer                # 打包产物分析
   │   ├─ index.html               # 分析报告
   │
   ├─ build                   # webpack配置
   │   ├─ paths.js
   │   ├─ utils.js
   │   ├─ webpack.config.base.js
   │   ├─ webpack.config.build.js
   │   ├─ webpack.config.dev.js
   │   ├─ webpack.config.watch.js
   │
   ├─ config/                 # 构建（环境）相关配置
   ├─ dist/                   # build输出目录
   ├─ dist_watch/             # watch模式，build的输出目录
   ├─ node_modules/
   ├─ src                     # 源码
   │   ├─ assets/                  # 静态资源、全局样式
   │   ├─ common/                  # 业务无关的通用组件
   │   ├─ components/              # 业务耦合的通用组件
   │   ├─ constant/                # 常量配置
   │   ├─ lib/                     # 第三方工具包
   │   ├─ mock/                    # 开发调试，mock数据
   │   ├─ pages/                   # 页面级组件
   │   ├─ service/                 # 接口封装
   │   ├─ utils/                   # 工具
   │   ├─ views                    # webpack打包入口、html模版（文件夹可可以无限层级，并且任意命名，同一页面的 html 模版、js 入口需同名）
   │        ├─ page-a                    # page-a
   │        │     ├─ page-a.html                  # html 模版
   │        │     ├─ page-a.js                    # js 入口
   │        │
   │        ├─ page-b                    # page-b
   │              ├─ page-b.html                  # html 模版
   │              ├─ page-b.js                    # js 入口
   │
   ├─ .babelrc                # babel配置
   ├─ .eslintignore           # eslint忽略配置
   ├─ .eslintrc.js            # eslint配置
   ├─ .gitignore
   ├─ package.json
   ├─ postcss.config.js       # postcss配置
   ├─ README.md
   ├─ yarn.lock               # yarn锁定版本配置文件（自动生成）
```

## 功能

1. 支持多页、多入口，自动扫描，可无限层级文件夹嵌套
2. 区分编译环境 `development/test/uat/production`
3. 演示普通 H5 开发中，组件化示例
4. 引入 art-template 前端渲染引擎 —— 目前前端模版里速度最快
5. dev-server
6. proxy 代理接口调试
7. 增加 watch 模式，方便在生产环境中用 Charles 映射到本地文件
8. optimization 提取 runtime 代码
9. splitChunks 提取 vendor 主要缓存包，提取 common 次要缓存包
10. MockJs 模拟 mock 数据
11. eslint 检查
12. 常用性能优化手段
13. 打包产物分析（webpack-bundle-analyzer）
14. 增加 webpack.IgnorePlugin 常规处理 moment 庞大的 local 文件（同 create-react-app）
