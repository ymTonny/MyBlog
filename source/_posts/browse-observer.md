---
title: 浏览器的观察器API
date: 2022-06-17
categories:
  - 技术
tags:
  - js
---
## 前言
一次偶然机会做到图片懒加载，常规操作就是监听`scroll`事件，获取img元素相对于视口的顶点的位置`el.getBoundingClientRect().top`,只要这个值小于视口的高度`window.innerHeight`就说明进入了可视区域,这个时候就可以加载图片了。但是`scroll`事件计算量太大密集影响性能，经查阅资料发现浏览器的API,`IntersectionObserver`交叉观察器,可自动观察目标元素与根元素交叉区域变化，以此判断元素可见，利用这个岂不是就能实现懒加载。后来又遇到设置异步组件dom高度，并且要有`transition`动画效果，看了同事的方式始终觉得不太好，外部会操作到组件内部的方法才能设置高度,后来我调研查阅资料，知道了`MutationObserver`API。郁闷，，，索性了解下浏览器的观察器吧。
<!--more-->
## 一.什么是浏览器观察器
针对一些不是由用户直接触发的事件，如DOM大小改变，子节点变动，DOM从可见到不可见等，浏览器提供一系列特定的api去监听变化，这些就是浏览器的观察器。
## 二.浏览器的观察器有哪些
一共5种: `IntersectionObserver`(交叉观察器)、`MutationObserver`(变化观察器)、`ResizeObserver`(大小观察器)、`PerformanceObserver`(性能观察器)、`ReportingObserver`(报告观察器)。
### 2.1 IntersectionObserver交叉观察器
该观察器自动观察目标元素与根元素交叉区域的变化。默认根元素为文档视口，交叉区域的变化决定了用户在当前视口能否看见元素，因此被用做'元素可见性'观察。如:图片懒加载、曝光量等。
#### 2.1.1 基础用法
通过`new IntersectionObserver(callback, options)`创建一个实例observer，并按照options配置,指定root、根元素的外边距、执行callback的交叉比例的阈值threshold。
```
let options = {
  root: document.getElementById("#parentBox"), //指定根元素，必须是目标元素的父级；默认文档根视口
  rootMargin: "0 0 0 0 ", // 根元素的外边距，用于扩展或缩小矩形的大小，从而影响交叉区域的大小
  threshold: [0] // 执行callback的条件，当为数组时，每次达到该值都会触发callback,要使目标元素完全进入也触发可设置[0,1]
}
let callback = (entries, observer) => {
  // entries为数组，每条数据都是一个entry对象，代表被观察的元素的对象
  entries.forEach(entry => {
    // entry.time: 可见性发生变化的时间，一个时间戳
    // entry.target: 目标元素DOM
    // entry.intersectionRatio: 可见区域的比例
    // entry.intersectionRect: 交叉可见区域的矩形块信息
    // entry.isIntersecting: true从不可见到可见 false从可见到不可见
    // entry.rootBounds: 根元素的位置信息
  });
}
// 实例化观察器
let observer = new IntersectionObserver(callback, options);
```
observer.observe(targetNode)指定目标元素targetNode1, targetNode2开始观察
```
observe参数为一个dom节点,要观察多个dom时，需多次调用observe
observer.observe(targetNod1) // 开始观察
observer.disconnect() // 关闭观察器
observer.unobserve(target) // 停止观察特定目标元素
observer.takeRecords() // 返回所有观察目标对象数组
```
### 2.2 MutationObserver变化观察器
该观察器观察目标元素的属性和子节点的变化。目标元素DOM发生变化就会触发回调函数，不过是异步触发，dom变动并不会马上触发，它会等当前所有dom操作都结束才会触发。
#### 2.2.1 基础用法
通过`new MutationObserver(callback)`创建一个实例observer，定义callback(mutaionList,observer)回调函数,mutationList包含目标元素dom变化相关对象的数组，每个成员都是一个`MutationRecord`对象。
```
let callback = (mutationList, observer) => {
  mutationList.forEach(mutation => {
    // mutation.target 发生变动的DOM节点
    // mutation.previousSibling 前一个同级节点没有返回null
    // mutation.nextSibling 下一个同级节点没有返回Null
    // mutation.type // 目标元素变化类型 'childList' | 'attributes' | 'characterData'
    // childList 子节点发生变化时候 (mutation.addedNodes 新增的dom节点) (mutation.removedNodes 删除的dom节点)
    // attributes 观察的dom节点的属性发生变化时 (mutation.attributeName 发生变化的属性name) (mutation.oldValue 该属性变化之前的值)
  })
}
let observer = new MutationObserver(callback);
```
`observer.observe(target, options)`通过配置options指定要观察的特定的变动，并开始观察目标dom，其中options里的`childList`、`attributes`、`characterData`三个必须有一个为true,若均未指定将会报错.
```
let options = {
  childList: true, // 默认值为false,是否观察子节点添加和删除
  attributes: true, // 默认值为false,是否观察目标节点属性改变
  charactorData: false, // 无默认值， 是否观察文本节点变化
  subtree: true, // 是否观察后代节点,默认false
  attributeOldValue: true, // 观察属性变动时，是否记录变动前的值
  charactorDataOldValue: true, // 观察文本节点变动时，是否记录变动前的值
  attributeFilter: [] // 数组,表示要观察的特定属性
}
observer.observe(document.getElementById("#someElement"), options) // 开始观察元素
observer.disconnect() // 停止观察
```
### 2.3 ResizeObserver大小观察器(实验中)
该观察器可以监听到目标元素的内容区域的边界框改变，内容区域需要减去内边距padding。每次元素内容或边框大小改变都会通知到观察者
#### 2.3.1基础用法
通过`new ResizeObserver(callback)`创建一个实例observer, 定义callback(entries, observer)回调函数，entries包含目标元素大小变化的相关信息的数组，每个成员都是一个`ResizeObserverEntry`对象。
```
let callback = (entries, observer) => {
  entries.forEach(entry=> {
    // entry.target 目标元素
    // entry.borderBoxSize 目标元素新边框大小的对象
    // entry.contentBoxSize 新内容框大小的对象
    // entry.contentRect 新大小的对象
    // entry.devicePixelContentBoxSize 以设备像素为单位的新内容框大小的对象
  })
}
let observer = new ResizeObserver(callback);
observer.observe(document.getElementById("#someElement")) // 开始观察对应元素
```
### 2.4 PerformanceObserver性能观察器
该观察器用于记录performance的数据行为,一旦记录了就会触发回调.
#### 2.4.1基础用法
通过`new PerformanceObserver(callback)`创建一个实例observer，定义callback(list, observer)回调函数，list.getEntries()为包含options中指定的相关performance数据的对象的数组，每一个成员都是一个`PerformanceObserverEntry`对象.
```
let callback = (list, observer) => {
  list.getEntries().forEach(entry=>{
    // entry 按startTime排序的performance上报的对象
    // entry.name 资源名称，是资源的绝对路径的名称
    // entry.entryType 资源类型，类型不同数组的对象结构也不同
    // entry.startTime 开始时间
    // entry.duration 加载时间
    // entry.entryType == 'paint' && entry.name == 'first-paint' 首次绘制，绘制body
    // entry.entryType == 'paint' && entry.name == 'first-contentful-paint' 首次有内容的绘制，第一个dom元素绘制完成
    // entry.entryType == 'paint' && entry.name == 'first-meaningful-paint' 首次有意义的绘制
  })
}
let observer = new PerformanceObserver(callback);
let options = {
  // entryTypes不能为空
  entryTypes: [
    'longTask', // 长任务(>50ms)
    'frame', // 帧的变化，常用于动画监听，使用时注意兼容
    'navigation', // 页面加载||刷新||重定向
    'resource', // 资源加载
    'mark',//  自定义记录的某个时间点
    'measure',//  自定义记录的某个时间段
    'paint'//  浏览器绘制
  ]
}
observer.observe(options) // 当记录的性能指标在指定的entryTypes中时，将调用回调函数；
```