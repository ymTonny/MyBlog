---
title: git常用操作
categories:
 - 技术
tags:
 - git
---
# 一.clone 项目
clone git上的项目,如下：
``` branch
 git clone git@github.com:ymtonny/myBlog.git
```
# 二.管理分支
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