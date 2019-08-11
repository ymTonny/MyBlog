---
title: electron打包react项目
date: 2019-06-13
categories:
 - 技术
tags:
 - react
---
## 前言
懂的小伙伴大概已经知道这是个什么了，那么不懂的小伙伴听我大致道来。也许你不甘心只写网页，也想写一个电脑上的exe程序那种；或者你有项目需求必须要写个exe程序，但是你只会前端，没关系，看了这篇文章你也就能写出一个exe程序了。
<!--more-->
## 一、安装electron
 - 为了方便以后使用，建议进行全局安装，这样任何文件夹下面就都能使用`electron`了。
``` breach
//安装命令
npm install electron  --g
//npm如果太慢的话，我们就改用国内镜像，国内镜像安装如下:
npm install cnpm -g  --registry=https://registry.npm.taobao.org
cnpm install electron --save
```
## 二、react使用electron

### 添加electron包
``` breach
npm install electron --save
//安装打包工具
npm install electron-packager --save-dev
```
### 相关配置
#### 配置main.js
在项目根目录(不是src目录)下新建一个main.js，写入如下配置：
``` breach
//引入electron并创建一个BrowserWindow
const {app,BrowserWindow} = require("electron");
const path = require("path");
const url = require("path");
//保持window对象的全局引用，避免Javascript对象被垃圾回收时，窗口被自动关闭
let win;

function createWindow(){
 //创建浏览器窗口，宽高随意
  win = new BrowserWindow({width:800,height:600});
 
 //加载应用----  适用桌面应用
 /*win.loadURL(url.format({
   pathname:path.join(_dirname+"./build/index.html"),
   protocol:"file:"
   slashes:true
 }))*/
 // 加载应用---- 适用react
 win.loadURL("http://localhost:3000/");
 //打开开发者工具,默认不打开
 win.webContents.openDevTools();
 
 //关闭window时触发
 win.on("closed",function(){
   win = null
 })
}
//当electron初始化完成后并开始创建浏览器窗口时运行
app.on("ready",createWindow);

//所有窗口关闭时，退出应用
app.on("window-all-closed",function({
// macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit()
  }
}))

app.on('activate', function () {
   // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (win === null) {
    createWindow()
  }
})
```
#### 配置package.json
``` breach
{
  "name": "platform",
  "version": "1.0.0",
  "description": "This is a food and beverage management system",
  "main": "main.js", //配置electron启动文件
  "homepage": ".", //配置electron打包后静态static不能访问
  "DEV":false,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "babel-node devServer.js --progress --colors",
    "dist": "webpack --config webpack.config.pro.js --progress --colors ",
    "build": "webpack --progress",
    "electron-start": "electron .", //配置运行桌面应用指令
    //配置打包为桌面应用指令
    "packager": "electron-packager ./ react-electron --win --out ~/ --electron-version 1.7.10",
    "dev": "babel-node devServer.js --progress --colors ./node_modules/.bin/electron ./main"
  },
```
### 开始打包
在项目根目录运行
``` breach
npm run packager
```

