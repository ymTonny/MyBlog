---
title: 防抖与节流
categories:
 - 技术
tags:
 - vue
---
## 什么是节流与防抖呢
在开发环境中，我们经常会遇见这样的问题，一个按钮连续点击就会连续调用`api`，从而使之出现不必要的麻烦。那么我们要怎么解决这样的问题呢？解决方法有很多，但是这里我想说的是利用函数防抖与节流来解决这样的问题，至于为什么我要使用防抖与节流来解决这样的问题看了下面你们就知道啦。

 - 函数防抖： 一个任务频繁触发的情况下，只有任务触发的间隔时间超过指定间隔的时候，任务才会去执行。
 - 函数节流：在指定的时间间隔里只会去执行一次任务。
<!--more-->
## 函数节流(throttle)
在这里我以判断页面滚动到底部为例，平常普通的做法就是通过监听 `window` 的 `scroll` 事件，然后在函数体内写入判断是否滚动到底部的逻辑：
``` branch
$(window).on("scroll",function(){
  //判断是否滚动到底部逻辑,只要浏览器滚动就会进入此函数体
  let pageHeight = $("body").height(), //页面高度
      scrollTop = $(window).scrollTop(), //滚动条距离顶部的距离
      winHeight = $(window).height(),  //浏览器窗口的高度
      thred = pageHeight - scrollTop - winHeight;
      if(thred > -100 && thred <=20){
        console.log(end)
      }
})
```
这样做的话有一个缺点就是耗性能，因为在滚动的时候，浏览器无时无刻都在计算着滚动条是否滚动到底部的逻辑，然而在实际场景中我们并不需要这样做，实际上工作中我们可能是这样：在滚动的过程中，隔一段时间再去计算滚动到底部的逻辑。而函数节流所做的工作就是每隔一段时间就去执行一次原本无时无刻执行的函数。所以在滚动中用它是不错的选择：
``` branch
function Throttling(fn,time = 1000){
  let timer = null;  // 保存此标记判读是否执行函数
  return function(){
    if(!timer) {
        timer = setTimeout(()=>{
          fn.apply(this,arguments);
         timer = null;// 这里设置为null，是为了实现滚动经过400ms过后再次执行函数
        },time)
    }
  }
}
//使用方法
$(windwo).on("scroll",Throttling(
 function(){
  ...
 }
),400)
```
## 函数防抖(debounce)
在这里我以注册用户为例,大多数网站的验证用户是否被注册都是通过 `input` 框中输入的时候去验证是否被注册，而不是在 `input` 失去焦点的时候去验证，大概是为了提高用户体验而这样做的吧。
``` branch
$(".username").on("input",function(){
 $.ajax({
   ...
 })
})
```
显而易见这样的做法是不好的，当用户在 `input` 框中输入每一个字符时都会去调用后台接口验证用户是否被注册，这样不仅对服务器的压力增加，同时体验反而也没有原本的失去焦点效果好。理想的做法就是，当用户输入第一个字符过后的一段时间内如果还有字符输入的话，就暂时不去请求后台`api`验证用户是否被注册,函数防抖就是为了解决这样的问题。
``` branch
function debounce(fn,time = 1000){
  let timer;
  return function(){
     clearTimeout(timer); // 当键盘连续输入时候,不执行函数
     timer = setTimeout(()=>{
       fn.apply(this,arguments);//传入this,是为了让fn函数中的this指向.apply中的第一个参数
     },time)
  }
}
//使用方法
$(".username").on("input",debounce(function(){
  $.ajax({
    ...
  })
}))
```
