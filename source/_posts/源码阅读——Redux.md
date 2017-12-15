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
比如你有一个postListReducer，这个reducer专门用来处理博客列表相关的操作（增删改查），将`{postList: postListReducer}`传给combineReducers，你会得到`{postList: []}`的store。而postListReducer也仅能处理postList部分的数据，不用关心其他字段。

源码如下（有删减）：
```js
/**
 * 将包含多个reducer函数的对象转换为一个reducer函数
 * @param  {[type]} reducers [description]
 * @return {[type]}          [description]
 */
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  // 将有效的reducer汇集到一个最终对象中
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  // 最终返回一个reducer函数，接受state和action参数
  // 它会遍历每一个之前传入的reducer，每个reducer仅会改变对应key的state
  return function combination(state = {}, action) {

    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      // 每个reducer只管自己的一亩三分地
      nextState[key] = nextStateForKey  // 计算出的state会放入对应key中去
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey  // 这里应对可能reducer返回原来的state
    }
    return hasChanged ? nextState : state
  }
}
```

## bindActionCreators
在你使用Redux后，我们可以通过`store.dispatch(ActionCreator(...))`的形式去分发由ActionCreator生成的action。
我们知道，React很适合组件式开发，那么如果我们需要在子组件中去分发action的时候该如何做呢？可以这样：
```js
<Child {...data} dispatch={store.dispatch}></Child>

//在组件内部我们可以这样调用了
this.props.dispatch(action)
```
这样做有一个问题，如果子组件嵌套较深，那么每个组件我都要传一个dispatch下去，我们希望使用redux时透明的，能否将dispatch保存在actioncreator中，当分发action时自动带出dispatch。答案是可以的，这里我们需要借助bindActionCreators函数来绑定dispatch
```js
render(){
    let {todos, dispatch} = this.props
    /**
     * {
     *    addTodo: Function,
     *    removeTodo: Function
     * }
     */
    let boundActionCreators = bindActionCreators(TodoActionCreators, dispatch)

    return(
        <TodoList todos={todos} {...boundActionCreators} />
    )
}
```
上例摘自[Redux文档](http://cn.redux.js.org/docs/api/bindActionCreators.html)中
在实际应用，我么也可以用的更灵活一些，比如借助`react-redux`中connect方法

源码如下：
```js
function bindActionCreator(actionCreator, dispatch) {
  return function() { return dispatch(actionCreator.apply(this, arguments)) }
}

/**
 * 将dispatch绑定到actionCreator函数中
 * @param  {[type]} actionCreators actionCreator函数或者actionCreator函数对象
 * @param  {[type]} dispatch       [description]
 * @return {[type]}                [description]
 */
export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
```
这段源码是比较简单的，大致意图是进一步封装actionCreator函数，通过闭包的形式将dispatch绑定到actionCreator中。从而使子组件不需要关心dispatch参数，直接分发action


## applyMiddleware
Middleware 可以让你包装 store 的 dispatch 方法来达到你想要的目的。同时， middleware 还拥有“可组合”这一关键特性。多个 middleware 可以被组合到一起使用，形成 middleware 链。其中，每个 middleware 都不需要关心链中它前后的 middleware 的任何信息。
源码如下：
```js
export default function applyMiddleware(...middlewares) {
  return (createStore) => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch
    let chain = []

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```
