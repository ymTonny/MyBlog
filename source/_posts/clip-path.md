---
title: 玩转clip-path
categories:
 - 技术
tags:
 - css
---
# 一.基本概念
什么是`clip-path`呢？简而言之就是实现裁剪的`css`属性,我们可以通过该属性创建一个只有元素的部分区域可以显示的剪切区域。区域内的部分显示，区域外的部分隐藏。通过指定路径就可以创建出自己想要的形状，这样网页中的布局就可以是多种多样的了。

在`clip-path`出现之前，css还有个属性`clip`也支持裁剪，但是它只支持矩形裁剪,同时它只对`position:absolute`和`position:fixed`的元素生效。使用如下：
``` branch
 clip: rect(50px,50px,50px,50px) //标准写法
 clip: rect(50px 50px 50px 50px) //兼容浏览器写法
```
目前所有主流浏览器都支持`clip`,但是因为其局限性,`clip`已经被`clip-path`代替。`clip-path`为我们带来了更多的可能，让我们制作出更多有趣的图案。
<!--more-->
# 二.用法实例
## 1.基本图形：inset
```branch
inset()//定义一个矩形,注意:此处矩形不是 rect 而是 inset.
//语法
inset()可以传入5个参数，分别对应top,right,bottom,left的裁剪位置,和round radius（可选项 圆角）。

//示例
clip-path:inset(15% 20% 15% 20%)
```
 <div style="width:200px;height:200px;margin:auto">![avatart](https://s2.ax1x.com/2019/03/27/Aa7B0s.png)</div>
 
## 2.基本图形：circle
```branch
circle()//定义一个圆形
//语法
circle()//可以传入2个参数，用at分开,分别对应圆的半径,圆心位置。圆心默认为元素中心点。
//示例
clip-path:circle(50% at 50% 50%)
```
 <div style="width:200px;height:200px;margin:auto">![avatart](https://ws2.sinaimg.cn/mw690/005SNrnIgy1g1hef0awp6j308r08gq6d.jpg)</div>
 
## 3.基本图形：ellipse
``` branch
ellipse()//定义一个椭圆
//语法
ellipse(x y at positon)//x为椭圆的x轴半径,y为椭圆的y轴半径,position为椭圆中心位置。
//示例
clip-path:ellipse(25% 40% at 50% 50%)
```
 <div style="width:200px;height:200px;margin:auto">![avatart](https://ws2.sinaimg.cn/mw690/005SNrnIgy1g1hekwf3c2j308i089myl.jpg)</div>
## 4.基本图形：polygon
``` branch
plygon()//定义一个多边形
//语法
polygon(fill-rule,[x y])//fill-rule(可选)表示填充规则用来确定该多边形内部,值有nonzero 和evenodd，默认为evenodd。后面的每一对表示连接点的坐标。
//示例
clip-path: polygon(50% 0%, 0 100%, 100% 100%);
clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);
```
 <div style="display:flex;justify-content:space-around;">![avatart](https://ws2.sinaimg.cn/mw690/005SNrnIgy1g1hez6l3rej309208sdi4.jpg)
 ![avatart](https://ws4.sinaimg.cn/mw690/005SNrnIgy1g1hf2dedn8j308x08q0vd.jpg)
 </div>
## 5.其他属性
除了`inset`，`circle`，`ellipse`，`polygon`属性外，`clip-path`还具有`url`，`geometry-box`等属性值，具体可以参考
<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path" target="_blank">MDN</a>
 
# 三.兼容性
![avatart](https://wx4.sinaimg.cn/large/005SNrnIgy1g1hfchdbflj30z5073gm1.jpg)

