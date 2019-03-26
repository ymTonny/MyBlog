---
title: 关于vuex
categories: 
- 技术
---
## vuex数据流
说实话，看了官方文档我并不清楚vuex到底是个什么东西，通过例子，我知道如何使用后，我才慢慢理解一点。我的理解就是：为什么会存在组件不能通信？简单粗暴的回答就是，变量的作用域导致的，vue的每一个组件都有自己的生命周期，都是独立存在的个体。vuex就是在根组件创建一个叫state的全局变量，让不同组件共享这个变量，并且定义了一系列方法和规范，也就是action、mutation等等，去统一触发这个全局变量也就是state。
<!--more-->
## JS

``` bash
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state () {
    return {
      monitorInfo: {
        name: '',
        description: ''
      }
    }
  },
  actions: {
    updateMonitorInfo: ({commit}, info) => {
      commit('UPDATE_MONITOR_INFO', info)
    }
  },
  mutations: {
    UPDATE_MONITOR_INFO: (state, info) => {
      window.localStorage.setItem('monitorInfo', JSON.stringify(info))
      state.monitorInfo = info
    }
  },
  getters: {
    monitorInfo: (state) => {
      if (!state.monitorInfo.name) {
        state.monitorInfo = JSON.parse(window.localStorage.getItem('monitorInfo'))
      }
      return state.monitorInfo
    }
  },
  modules: {
  }
})
export default store
```

## html
```brash
<!-- list 兄弟组件的发送方-->
<template>

</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    data () {
      return {
      }
    },
    computed: {
    },
    methods: {  
      ...mapActions(['updateMonitorInfo']),
      goNextPage (row, routerName) {
        let monitorInfo = {
          name: row.name,
          serviceUrl: row.serviceUrl,
          description: row.info.description
        }
        this.updateMonitorInfo(monitorInfo)
      },
    },
    mounted () {
    }
  }
</script>
```
```brash
<!-- monitor.vue  兄弟组件接收方-->
<template>
  <span>{{monitorInfo.name}}</span>
  <span>{{monitorInfo.description}}</span>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters(['monitorInfo'])
    },
    methods: {   
    },
    mounted () {
    }
  }
</script>
```