---
title: vue路由归纳
date: 2019-04-05
categories:
- 技术
tags:
- vue
---

## vue路由的原理
单页面的一大优势就是，无刷新跳转页面，用户体验好，加载速度快。vue路由的跳转它是无刷新的，共有两种模式，可以通过路由配置文件中去配置`mode`字段，如果不去配置这个`mode`字段，默认路由跳转就为`hash`模式。

`hash`模式，通过在链接后面添加"#"号+路由名字，匹配这个字段的变化去触发`hashchange`事件，动态的渲染出页面。

另外一种模式为`history`模式，即使用浏览器的historyAPI,`pushState`和`replaceState`。通过调用`pushState`去操作浏览器的`history`对象，改变当前链接地址，同时结合`window.onpopstate`监控浏览器的返回前进事件，同样可以实现无刷新的跳转页面。`replaceState`和`pushState`的区别就是，前者代表替换，后者代表插入。

<!--more-->

`history`相对于`hash`，就是没有"#"号，看着十分清爽。但是用hash模式的反而较多，为什么呢？因为`history`模式还需要后端的配置，否则刷新页面就会返回404。

## vue路由两种传参
页面传参就两种，`params`和`query`,`params`是以`/params`方式展示，`query`是以`/?query=`方式展示。写法大致都是相同，不过`query`是用`path`来引入，而`params`是用`name`来引入。注意：接收参数的时候是用`route`而不是`router`。`query`像是ajax中的get,而`params`更像是post,刷新页面时`params`参数会丢失,而`query`参数不会丢失。
``` breach
//query
this.$router.push({
  path:"/abc",
  query:{id:id}
});
//params
this.$router.push({
   name:"abc"
   params:{id:id}
});
//接收参数
this.$route.query.name
this.$route.params.name
```
## vue路由跳转
vue 路由的跳转分成两种，一种是声明式，使用`<router-link>`声明跳转，`to`属性定义跳转的参数。另一种是编程式，使用 `router.go()`、`router.push()`、`router.replace()`方法进行跳转，`go`方法就是与浏览器的history api 的方法相同，可以进行返回上一页等操作。
``` breach
// 字符串
router.push('home')

// 对象
this.$router.push({path: 'home'})

//命名的路由
this.$router.push({name: 'user', params: {userId: 123}})

// 带查询参数，变成/register?plan=private
this.$router.push({path: 'register', query: {plan: "private"}});

//声明式
<router-link :to="{name:'abc',params:{id:id}}"></route-link>
```
## vue路由守卫
vue路由守卫分3种，一种是全局路由守卫，通常在实例化路由之后设置，做通用路由的设置，它所有的路由跳转全部都会执行的操作；一种是单独的路由独享守卫，在单个路由定义的时候设置，所有跳转到这个路由的都会执行，一种是组件内的路由守卫，只在组件内生效。

 全局路由守卫：

 - `router.beforeEach(to,from,next)`
 - `router.afterEach(to,from,next)`

路由独享守卫：
  - `beforeEnter(to,from,next)`

组件内守卫：
  - `beforeRouteEnter(to,from,next)`
  - `beforeRouteUpdate(to,from,next)`  //动态参数路径改变时，组件实例被复用的时候调用
  - `beforeRouteLeave(to,from,next)`   //导航离开组件所在路由时被调用
