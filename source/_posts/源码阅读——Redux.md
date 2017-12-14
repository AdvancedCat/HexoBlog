---
title: 源码阅读——Redux
date: 2017-12-14 09:50:20
tags: ['Javascript']
---

# 何为Redux
Redux是一个为JavaScript应用设计的可预测状态容器。GitHub官网是[https://github.com/reactjs/redux](https://github.com/reactjs/redux)
严格的单向数据流动是Redux架构的核心

# 三大原则
Redux遵循三大原则：
1. 单一数据源
整个应用的state被储存在一棵object tree中，并且这个object tree只存在于唯一一个store中。
也就是说整个应用只有一个store，读取数据都是从这个store中进行
2. State是只读的
唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。
action的作用仅仅表达一种修改的意向，整个应用的修改操作都被集中起来。我们可以对action进行记录追踪，方便调试观察。
3. 使用纯函数进行修改
为了描述 action 如何改变 state tree ，你需要编写 reducers。
Reducer 只是一些纯函数，它接收先前的 state 和 action，并返回**新的 state**。

# 源码
分析Redux的源码是很有趣的事情，Redux的源码很少，打包压缩后仅有2KB左右。它封装了几个关键的函数，就是这些函数应用了函数式编程的技巧，封装了私有变量，造就了Redux的三大原则。
PS:本博客中不分析参数检查部分的代码，有兴趣的可以去gitbub上看看

## createStore
顾名思义，createStore函数返回一个store对象，store对象上会定义一些应用使用的钩子函数，帮助操作内部封装隐藏的state

源码如下（有删减）:
```js
/**
 * 创建一个Store，来维护一颗状态树
 * @param  {[type]} reducer        纯函数，接受state和action，触发相应事件
 * @param  {[type]} preloadedState 初始state
 * @param  {[type]} enhancer       给第三方中间件使用，在Redux中指的是applyMiddleware
 * @return {[type]}                返回store，暴露公开API用于读取state，分发action，注册事件
 */
export default function createStore(reducer, preloadedState, enhancer) {
  // 类型检查...

  //  私有变量，外界尽可以通过暴露出的API函数去修改这些私有变量
  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false

  // 确保对nextListeners的操作不会影响到currentListeners
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  // 获取当前的状态
  // 事实上，我们仍可以通过引用的形式去修改内部的state。如果你这样做了，那你就从一开始就没想清楚去使用redux
  function getState() {
    return currentState
  }

  // 注册事件，所有事件会push到listeners数组中，在触发dispatch时依次执行
  // subscribe返回解除listener的函数，这里用到了闭包
  function subscribe(listener) {
    // 类型检查...
    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  // 核心函数，分发action，这是唯一可以改变state的途径
  // 它会将state和action传给reducer纯函数，reducer执行完毕后返回新的state
  // 请记住，dispatch是你应用时刻关注的钩子函数。因为只有它才能真正触发修改state的行为
  function dispatch(action) {
    // 类型检查...
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    const listeners = currentListeners = nextListeners
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }

  // 替换reducer
  function replaceReducer(nextReducer) {
    // 类型检查...
    currentReducer = nextReducer
    dispatch({ type: ActionTypes.INIT })
  }

  // 暴露API
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  }
}
```

## combineReducers
如果应用比较简单，我们可以只写一个reducer，将所有的action都集中到一处去，之后参数传给createStore.
但是随着应用越来越大，你可能有很多action，如果都放入一个reducer中，显然变得不可维护。于是期望可以拆分reducer，每个reducer仅关心store tree中某个分支（即state中部分key），且仅返回这部分分支内容。其他分支内容你并不关心。
为了解决这个问题，Reudex提供了combineReducers函数。
combineReducers接受一个reducers对象，每一个key对应了一个reducer，这个key之后也将反应到state中。
比如你有一个postListReducer，这个reducer专门用来处理博客列表相关的操作（增删改查），将``

如果你需要将reducer拆分，比如
