---
title: for循环应该这么用
categories:
 - 技术
tags:
 - js
---
从最开始学的for循环的遍历方法，再到后来连续不断出来的各种循环遍历方法，其实最大的区别就是应用的场景不同。而我们需要知道的是，什么情况下用哪一种方法合适。

---
<!--more-->
下面我就以例子介绍每种方法再什么情况下用最合适：
``` breach
let arr = [
 {id:"1",money:10},
 {id:"2",money:30},
 {id:"3",money:40},
 {id:"4",money:50},
 {id:"5",money:60},
 {id:"6",money:80}
];
```
## 1.给每一组数据的`money`都增大一点
这个时候可用到`forEach`方法:
``` breach
arr.forEach(item => { item.money += 10 }));
```
`map`方法它说它也可以:
``` breach
arr.map(item => { item.money += 10 });
```
`map`补充说，我还可以给你把money统计成一个新的数组给你；
``` breach
let money = arr.map(item => { return item.money += 10 });
//[20,40,50,60,70,90]
```
###`forEach`和`map`最大的区别就在于`forEach`没有返回值。
## 2.只要这组数据中money大于50的数据（筛选）
从题目看就知道，筛选这种事一般都是`filter`来做的:
``` breach
let filones = arr.filter(item => { return item.money>=50 });
//[{id:"4",money:50},{id:"5",money:60},{id:"6",money:80}]
```
## 3.这组数据中有money大于50的么 （有符合）
这题意思就是，这组数据只要有money大于50的就符合，这个时候`some`就很有用了：
``` breach
let flag = arr.some(item => { return item.money>50 });
//true
```
`some`它会去遍历查找满足条件的，当第一条就符合的时候，就会立即返回告诉你有符合的了，后面的就不用检查了。
## 4.这组数据中money全是大于50的么？
这个时候every就想知道这组数据中难道每条都大于50？
``` breach
let flag = arr.every(item => {return item.money>50 })
//false
```
当每条数据都要去检查的时候，像这样会非常耗费性能;我们可以考虑反向检查，通过`some`检查是否有小于50的数据，再取反。
``` breach
let flag = !arr.some(item => {return item.money<50 });
//false
```
## 5.这组数据money总和是多少呢
我们可以先通过用`map`将`money`取出来，再用`reduce`计算其总和。
``` breach
let moneys = arr.map(item => {return item.money });
let sum = moneys.reduce((sum,moneys)=>{ return moneys+sum},0)
```