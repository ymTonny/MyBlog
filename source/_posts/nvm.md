---
title: windows使用node多版本
date: 2022-04-03
categories:
  - 技术
tags:
  - 工具
---
## 前言
开发过程中可能会出现，多个项目每个使用的node版本不一致情况，然而鱼与熊掌不可兼得，只能安装一个node版本。如果要多版本我们可以使用nvm工具
<!--more-->
## 1.安装nvm
下载地址：<a href="https://github.com/coreybutler/nvm-windows/releases" target="_blank">点我</a>
## 2. 配置代理
打开安装目录下的`setting.txt`加入以下到末尾
```
node_mirror: http://npmmirror.com/mirrors/node/
npm_mirror: http://npmmirror.com/mirrors/npm/
```
## 3.安装node
nvm常用命令
```
nvm list available // 目前可用的node安装版本列表
nvm list  // 列出目前所安装node版本列表
nvm use 版本号  // 设置当前系统使用node的版本号,切换后可通过node -V查看是否切换成功
nvm install 版本号  // 安装对应node版本到系统
nvm uninstall 版本号 //  卸载对应node版本环境
```