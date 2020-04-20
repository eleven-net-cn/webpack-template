# webpack-template

> 为懒人准备的 webpack 模版，可以直接用于生产。这里单纯只做webpack构建、打包、代码的组织等，关于React、Vue等配置并不复杂，可以在需要时添加。随着webpack版本的迭代，会将最新的特性加入，持续更新......

## 文档地址：https://webpack.eleven.net.cn

## 版本

```js
webpack 4 + babel 7
```

## 已添加功能

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

## 运行命令

> 推荐使用yarn进行包管理！

```bash
yarn / yarn install    # 安装全部依赖包

yarn dev               # 启动本地调试
yarn dev:mock          # 启动本地调试，MockJs模拟接口数据
yarn dev:page-a        # 启动本地调试，仅page-a页面
yarn dev:page-b        # 启动本地调试，仅page-b页面

yarn build-dev         # 打包代码，publicPath以/打头（可通过本地起服务访问build后的代码）
yarn http-server       # 启动http-server服务器，可用来访问yarn build-dev打包的代码
yarn build-test        # 打包测试环境代码
yarn build-prod        # 打包生产环境代码

# watch模式，移除了js、css的压缩，节省时间（watch时需要build压缩版代码，可自行修改）。
yarn watch-dev         # 启动watch模式，本地开发环境（通常用不上）
yarn watch-test        # 启动watch模式，测试环境
yarn watch-prod        # 启动watch模式，生产环境
```

## Yarn和NPM的选择？
1. 通常使用NPM做包管理，但此项目使用Yarn，因为Yarn有：速度快、可离线安装、锁定版本、扁平化等更多优点。
2. 如果需要从npm切换到yarn，或者从yarn切换到npm，请整体移除`node_modules`目录，及yarn.lock/package-lock.json文件，因yarn和npm两者的策略不同，导致相同的`package.json`列表安装后的`node_modules`结构是不同的（虽然这并不会引发bug，但建议在切换时清除后重新`install`）。

## Yarn常用命令

```bash
yarn / yarn install                 # 安装全部（package.json）依赖包 —— npm install

yarn run [dev]                      # 启动scripts命令

yarn add [pkgName]                  # 安装依赖包（默认安装到dependencies下） —— npm install [pkgName]
yarn add [pkgName]@[version]        # 安装依赖包，指定版本 —— npm install [pkgName]@[version]
yarn add [pkgName] -D               # 安装依赖包，指定到devDependencies —— npm install [pkgName] -D
yarn remove [pkgName]               # 卸载依赖包 —— npm uninstall [pkgName]

yarn upgrade [pkgName]              # 升级依赖包 —— npm update [pkgName]
yarn upgrade [pkgName]@[version]    # 升级依赖包，指定版本
```

##### 参考文档

1. [yarn中文网](https://yarnpkg.com/zh-Hans/)
2. [yarn安装](https://yarnpkg.com/zh-Hans/)  —— 预警：如果本机已经安装过`NodeJS`，使用`brew`安装`yarn`时，推荐使用`brew install yarn --without-node`命令，否则可能导致其它bug。
3. [yarn命令](https://yarnpkg.com/zh-Hans/docs/usage)
4. [yarn和npm命令对比](https://yarn.bootcss.com/docs/migrating-from-npm/#toc-cli-commands-comparison)

## 目录结构

```bash
webpack-template
     ├─ build                   # webpack配置
     ├─ config                  # 构建（环境）相关配置
     ├─ dist                    # build输出目录
     ├─ dist-watch              # watch模式，build的输出目录
     ├─ node_modules
     ├─ src                     # 源代码目录
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