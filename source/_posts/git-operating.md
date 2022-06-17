---
title: git常用操作
date: 2019-07-02
categories:
 - 技术
tags:
 - git
---
# 一.ssh key生成
```
ssh-keygen -t rsa -C "email"
```
# 二.clone 项目
clone git上的项目,如下：
``` branch
 git clone git@github.com:ymtonny/myBlog.git
```
# 三.管理分支
## 1.查看分支
<!--more-->
### 1.1.查看本地分支
使用git branch命令,如下：
``` branch
    git branch 
    * master
```
*标识的是你当前所在的分支
### 1.2.查看远程分支
命令如下：
``` branch
   git branch -r
```
### 1.3.查看所有分支
命令如下：
``` branch
   git branch -a
```
## 2.本地创建新分支
命令如下：
``` branch
   git branch [branch name]
```
## 3.切换到新分支
命令如下：
``` branch
   git checkout [branch name]
```
## 4.创建+切换分支
命令如下：
``` branch
   git checkout -b [branch name]
```
## 5.将新分支上传到远程分支中
命令如下：
``` branch
   git push origin [branch name]
```
## 6.删除本地分支
命令如下：
``` branch
   git branch -d [branch name]
```
## 7.删除远程分支
命令如下：
``` branch
   git push origin :[branch name]
```
分支名前冒号代表删除。
## 8.一次删除本地存在的远程没有的分支
```
git remote show origin
git remote prune
```
## 9.本地文件夹关联远程仓库
```
git remote add origin [仓库git链接]
//推送代码
git push -u origin master //-u 使其与远程关联 简化后期推送操作
```
## 10.撤销add, commit, 修改commit信息
```
//撤销add
git reset
//撤销commit
git reset HEAD^ //同时撤销add,保留工作区修改内容
git reset --soft HEAD^ //不撤销add, 保留修改内容
git reset --hard HEAD^ //同时撤销add,删除修改的内容
git commit -amend // 修改commit信息
```
## 11.克隆远程部分文件夹
```
git init 初始化
git remote add origin git@github.com:ymtonny/myBlog.git // 增加远端地址
git config core.sparsecheckout true // 设置Sparse Checkout 为true
echo "demo/demo" >> .git/info/sparse-checkout 将要拷贝的文件夹相对路径写入配置文件
git pull origin master // 拉取代码， 这个时候只有demo/demo文件夹内容
```