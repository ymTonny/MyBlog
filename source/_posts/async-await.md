---
title: async-await
categories:
 - 技术
tags:
 - js
---
## 简介
   `Asyns-Await`,异步编程的最高境界，就是根本不用担心它异步。`async`函数就是隧道尽头的亮光，大部分人会认为它是异步操作的终极解决方案。`async-await`和`promise`的关系，两者不存在谁代替谁，因为`async-await`寄生于`Promise`.`Generator`的语法糖。`async`和`await`在干什么？`async`用于申明一个`function`函数是异步的，而`await`可以认为是`async await`的简写，等待一个异步函数执行完成。
## 基本用法
``` breach
async function demo(params){
  
}
//async 函数返回的是一个Promise对象
demo();
```
<!--more-->
## 规则
  
 - async表示这是一个async函数，await只能用在这个函数里面。
 - await表示这里等待promise返回结果后，再继续执行。
 - await后面应该跟着一个promise对象（普通函数亦可，但await就无意义了）。
 - await不能单独使用，必须搭配aync函数来使用。
 - await等待的虽然是一个promise对象，但是不必写.then(...),直接可以得到返回值。
``` breach
async function demo(params){
   let result = await Promise.resolve(123);
   console.log(result)
}

demo();
```
## 捕捉错误
像`Promise`有`.then(...),.catch(...)`来捕捉正确与错误，而`async`这两个都不用写，那么我们就可以直接用标准的`try catch`语法捕捉错误。
``` breach
let sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            // 模拟出错了，返回 ‘error’
            reject('error');
        }, time);
    })
};

let start = async function () {
    try {
        console.log('start');
        await sleep(3000); // 这里得到了一个返回错误
        
        // 所以以下代码不会被执行了
        console.log('end');
    } catch (err) {
        console.log(err); // 这里捕捉到错误 `error`
    }
};
```
## 循环多个await
`await`看起来像是同步代码,所以写在for循环内，不必担心需要闭包才能解决。
``` breach
..省略以上代码

let start = async function () {
    for (let i = 1; i <= 10; i++) {
        console.log(`当前是第${i}次等待..`);
        await sleep(1000);
    }
};
```


