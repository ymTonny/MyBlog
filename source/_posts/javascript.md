---
title: javascript数据属性和访问器属性
date: 2019-06-19
categories:
 - 技术
tags:
 - js
---
## 前言
在`javascript`中，我们访问对象的时候可以直接通过`obj.name`进行访问，删除时可以直接通过`delete obj.name`进行删除，那么你真的知道它为什么能直接访问或则删除么？如果你知道`javascript`中的数据属性，那就自然知道为什么能访问了；如果不知道呢，咱就接着往下看。
<!--more-->
``` breach
 let obj = {
    name:"abc"
 }
 console.log(obj.name)
```
## 数据属性
在`javascript`中数据属性分为以下几种：
 - `configurable`:表示能否通过delete删除属性，从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。默认为true。
 - `enumerable`:表示能否通过`fon-in`循环返回属性，默认为true。
 - `writable`:表示能否修改属性的值，默认为true。
 - `value`:表示属性的数据值。默认为undefind。

接下来我们尝试理解上面的含义，首先创建一个对象：
``` breach
 let obj = {
   name:"张三",
   age:12
 }
```
### 1.configurable
根据configurable的定义，我们通过`Object.defineProperty`修改obj的name属性的数据属性`configurable`为false
``` breach
  Object.defineProperty(obj,"name",{
   configurable:false
  }
```
根据上面的定义，我们把configurable设为false时，我们不能通过delete进行删除属性,不能修改属性的特性，不能把属性修改为访问器属性。
删除属性：
![image](http://wx1.sinaimg.cn/large/005SNrnIgy1g281hehvbwj30cr064mx9.jpg)
修改属性特性：
![image](http://wx4.sinaimg.cn/large/005SNrnIgy1g281m3gn70j30b70353yg.jpg)
当我们把configurable属性修改为false的时候就不能再改回为true了，同时修改enumerable属性也会受到限制，当尝试修改时会报错。
### 2.enumerable
根据上面的定义，我们重新定义并修改name属性的enumerable为false，然后用for in遍历属性对象。
``` breach
  Object.defineProperty(obj,"name",{
    enumerable:false
  })
  for(let key in obj){
    console.log(key+"--"+obj[key])
  }
  //输出
  age--12
```
因为属性name的enumerable修改为了false,所以当我们用for in循环遍历obj对象时，我们无法遍历到name属性，所以上面代码只会打印age属性。
### 3.writable和value
value属性的值是否能被修改是根据writable确定的，当我们把writable的值设为true的时候，value可以被修改，否在反之。
![image](http://wx1.sinaimg.cn/large/005SNrnIgy1g2821jk29pj30by05jdfu.jpg)
所以，当writable为false时，我们不能修改属性值，这里需要注意的是，如果configurable为false，此时我们可以将writable,但如果再设回为true就会报错。

## 访问器属性
访问器属性一共有四个，分别为`configurable`,`enumerable`,`get`,`set`，其中configurable和enumerable和数据属性中的是一样的，这里就不再进行说明

 - get:在读取属性的时候会调用，默认值为undefind。
 - set:在设置属性的时候会调用，默认为undefind。

同样的我们可以通过`Object.defineProperty`对访问器属性进行设定。有兴趣的小伙伴下来自己试试吧，今天没时间啦(*^_^*)。

