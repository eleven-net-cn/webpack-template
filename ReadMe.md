# webpack-template

为懒人准备的 webpack 模版，可以直接用于生产。这里单纯只做webpack构建、打包、代码的组织等，关于React、Vue等配置并不复杂，可以在需要时添加。随着webpack版本的迭代，会将最新的特性加入，持续更新......

## 文档地址

https://webpack.eleven.net.cn

## 版本

```js
webpack 4 + babel 7
```

## 功能

1. 普通 H5 开发中,引入组件化
2. 引入 art-template 前端渲染引擎 —— 目前前端模版里速度最快
3. 配置 dev-server 调试模式，proxy 代理接口调试
4. 配置 watch 模式，方便在生产环境中用 Charles 映射到本地文件
5. optimization 配置提取 runtime 代码
6. splitChunks 配置，提取 vendor 主要缓存包，提取 common 次要缓存包
7. 支持多页、多入口，自动扫描，可无限层级文件夹嵌套
8. MockJs 模拟 mock 数据
9. 接口代理
10. eslint检查
11. 常用性能优化手段
12. 打包产物分析（webpack-bundle-analyzer）

## 运行命令

- 安装依赖

     ```bash
     yarn / yarn install    # 安装全部依赖包
     ```

- 开发调试

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

- 打包

     ```bash
     yarn build-dev         # 打包代码，publicPath以/打头（可通过本地起服务访问build后的代码）
     yarn build-test        # 打包测试环境代码
     yarn build-prod        # 打包生产环境代码
     
     yarn http-server       # 启动http-server服务器，可用来访问yarn build-dev打包的代码
     ```

- 打包产物分析

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
     ├─ config                  # 构建（环境）相关配置
     ├─ dist                    # build输出目录
     ├─ dist-watch              # watch模式，build的输出目录
     ├─ node_modules
     ├─ src                     # 源码
     │   ├─ assets                   # 静态资源、全局样式
     │   ├─ common                   # 业务无关的通用组件
     │   ├─ components               # 业务耦合的通用组件
     │   ├─ constant                 # 常量配置
     │   ├─ lib                      # 第三方工具包
     │   ├─ mock                     # 开发调试，mock数据
     │   ├─ pages                    # 页面级组件
     │   ├─ service                  # 接口封装
     │   ├─ utils                    # 工具
     │   ├─ views                    # webpack打包入口、html模版
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