---
title: 代码评审清单
categories:
 - 技术
tags:
 - js
---
## 前言
#### 前端团队根据情况有时候会有评审代码的要求，但是由于每个开发人员的技术水平不同，代码风格不同，所关注的技术点也不同，为了保证代码的质量以及团队的代码风格统一，因此产生了团队中的CodeReview,为此拟了一份清单,如果你的团队还没有CodeReview，可能这正是你需要的。
## 一、代码静态检查工具
### 1.1、使用eslint工具对javascript代码进行检查。
`eslint`检查的规范继承自`eslint-config-standard`检验规则。
<!--more-->
### 1.2、使用stylelint工具对css样式代码进行检查。
`stylelint`检查的规范继承自`stylelint-config-standard`检验规则。
## 二、命名规范
### 2.1、JS采用Camel Case小驼峰命名
推荐：
``` breach
 studentInfo
```
### 2.2、避免名称冗余
推荐：
``` breach
const Car = {
  money:123,
  color:"red",
  name:"大地"
}
```
不推荐：
``` breac
const Car = {
  Carmoney:123,
  Carcolor:"red",
  Carname:"大地"
}
```
### 2.3、CSS类名采用BEM命名规范
``` breach
.block_element{}     // 代表块block元素中的子元素element
.block--modifier{}  //  代表块block元素的状态
```
### 2.4、命名符合语义化
命名需要符合语义化，如果是函数命名可以采用加上动词前缀
动词      含义
can       判断是否可以执行某个动作
has       判断是否含有某一个值
is          判断是否为某一个值
get        获取某一个值
set        设置某一个值
推荐：
``` breach
// 是否显示
function canShow(){

}
// 设置名称
function setName(){

}
```
## 三、JS推荐写法
### 3.1、每个常量都需要命名
每个常量应该命名，不然看代码的人不知道这个常量的意思。
推荐：
``` breach
const COL_NUM = 10
let row = Math.ceil(num/COL_NUM)
```
不推荐：
``` breach
let row = Math.ceil(num/10)
```
### 3.2、推荐使用字面量
创建对象和数组推荐使用字面量，因为这不仅是性能最优也有助于节省代码量。
推荐：
``` breach
let obj = {
   name:"tonny",
   age:12,
   sex:"男"
}
```
不推荐：
``` breach
let obj = {}
obj.name = "tonny"
obj.age = 12
obj.sex = "男"
```
### 3.3、 函数参数
函数参数越少越好，如果参数超过两个，要使用 ES6的解构语法，不用考虑参数的顺序。
推荐：
``` breach
function createMenu({title,name,value,label}){

}
createMenu({
  title:"ad",
  name:"tonny",
  value:"123",
  label:"button"
})
```
不推荐：
``` breach
function createMenu(title,name,value,label){

}
```
### 3.4、使用参数默认值，代替使用条件语句进行赋值
推荐：
``` breach
function create(name="abc"){

}
```
不推荐：
``` breach
function create(name){
  let newName = name || "abc"
}
```
### 3.5、推荐使用函数式编程
函数式编程可以让代码的逻辑更清晰更优雅，方便测试
推荐：
``` breach
const menu = [
 {name:"a",size:1},
 {name:"b",size:2},
 {name:"c",size:3}
]
let sumMenu = menu.map(item => item.size).reduce((prevsize,nextsize)=> previse+nextsize,0);
```
不推荐：
``` breach
let sum = 0;
for(let i=0;i<menu.length;i++){
  sum+=menu[i].size;
}
```