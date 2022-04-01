---
title: vueCli+vant+tsx使用问题
date: 2022-03-31
categories:
  - 技术
tags:
  - vue
---
在vueCli+ts中按需引用vant没有样式？生产环境打包无vant样式？build失败？那是因为你没有配置这些
<!--more-->
## 一、按需引用vant无样式
如果你通过以下配置后依然无样式，可在`vue.config.js`中配置css下面的`requireModuleExtension: true`属性,再重启服务查看
```branch
babel.config.js
plugins: [
  "import",
    {
      "libraryName": "vant",
      "style": true
    },
  "vant"
]
vue.config.js
{
  loader: "ts-loader",
  options: {
    getCustomTransformers: () => ({
      before: [
        require("ts-import-plugin")({
          libraryName: "vant",
          libraryDirectory: "es",
          style: true
        })
      ]
    }),
    compilerOptions: {
      module: "es2015"
    }
  }
}
```
## 二、生产环境打包无按需引入vant样式
配置`vue.config.js`中的`parallel: false`属性,该属性为是否使用thread-loader来解析babel或typescript,当配置为true时, 会将你的`loader`放在一个`work池`中，`work池`中的`loader`会受到一些限制，如：
* 这些`loader`不能产生新文件
* 无法获取`webpack`的选项配置
## 三、配置了ts-loader后，项目打包失败
```branch
{
  loader: "ts-loader",
  options: {
    happyPackMode: true, // 配置此属性
  }
}
```
## 四、如何使用vue.config.ts
通过查阅vue-cli-service源码后，发现启动时会有一个获取全局变量`VUE_CLI_SERVICE_CONFIG_PATH`,来确定使用的文件，如无配置将使用`vue.config.js`,因此可使用如下配置
1. 安装`cross-env ts-node`
2. 配置`tsconfig.json`
3. 修改`script命令`
```
tsconfig.json // 让ts-node支持编译js
{
  "ts-node": {
    "transpileOnly": true,
    "compilerOptions": {
      "module": "commonjs"
    }
  }
}
package.json
{
  "script": {
    "service": "cross-env VUE_CLI_SERVICE_CONFIG_PATH=./vue.config.ts ts-node ./node_modules/@vue/cli-service/bin/vue-cli-service.js",
    "serve": "npm run service serve" // 等同于vue-cli-service serve 如需携带参数可通过 -- --mode dev
  }
}
```
## 五、node低版本运行服务，ts-node启动失败
报错 `catch { Unknown Error token`, 原因是因为低版本node无法支持识别 `catch{}`不带括号,解决方案
1. 升级`node`版本
2. 无法升级node时，可通过打补丁
  * 安装`patch-package`,使用`yarn`命令时还需安装`postinstall-postinstall`,`npm`无需安装
  * 修改`node_modules`中包的源码
  * `package.json`中增加一条命令`"postinstall": "patch-package"`
  * 运行`npm run patch-package ts-node`生成补丁包，后续重新安装包就都不会影响到。