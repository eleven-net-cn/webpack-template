# webpack-template

从零搭建 webpack，风格借鉴 [create-react-app/react-scripts](https://vscode.dev/github/facebook/create-react-app)

✅ 支持多页、多入口，自动扫描入口  
✅ 支持 TypeScirpt 开发  
✅ 支持 React 开发  
✅ 支持 watch 功能

熟练使用各类脚手架工具的同时，也期望知晓 webpack 搭建的各项细节，并付诸实践，这是开始这项工作的初衷。

某些需要徒手搭建 webpack 编译的场景，这是一个 Project Template 选项。

## Documentation

https://webpack.eleven.net.cn

## Command

```bash
yarn start
yarn start -e/--entry page-a    # 启动调试，指定自动唤起入口

yarn watch

yarn build
yarn build -a/--analyzer        # 编译打包，启动 analyzer
# 区分环境编译
yarn build-test
yarn build-prod

yarn serve
yarn commit
```

## Construction

```bash
├── config/
│   ├── paths.js
│   ├── utils.js
│   ├── webpack.config.js
│   └── webpackDevServer.config.js
├── dist/
├── public/
│   ├── favicon.ico
│   └── index.html              # src/ 下，第一级目录的同名 .tsx 文件，将会被识别为页面入口文件
├── scripts/
│   ├── build.js
│   ├── start.js
│   └── watch.js
├── src/
│   ├── utils/
│   ├── App.tsx
│   ├── index.tsx
│   └── typings.d.ts
├── .env-cmdrc.js           # 区分环境，自动注入 process.env 环境变量
├── .gitignore
├── ReadMe.md
├── babel.config.js
├── package.json
├── postcss.config.js
├── tsconfig.json
└── yarn.lock
```

## Q&A

1. 如何添加更多页面、入口？

   public/ 目录下新增 html 文件，src/ 目录（第一级）下新增同名入口文件（.tsx）即可，入口将被自动扫描。
