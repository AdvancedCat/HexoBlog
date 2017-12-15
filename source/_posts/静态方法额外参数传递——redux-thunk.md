---
title: 静态方法额外参数传递——redux-thunk
date: 2017-12-15 11:47:37
tags:
---

今天来看一段仅有14行的代码，它在github上获得了7200+ star。它就是[redux-thunk](https://github.com/gaearon/redux-thunk)
redux-thunk的作用是为redux提供thunk中间件，使得延迟调用dispatch，完成异步请求等功能。

# 源码
先感受一下这14行的代码(v2.0)：
```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

源码很简单，但是有一处让我觉得很不错。
首先createThunkMiddleware工厂函数作用是封装middleware，并返回它。但是我们希望在执行这个中间件的时候，能将额外的参数传递给action，同时这个额外参数希望用户自定义。
这时候可以给返回的这个中间添加静态方法`withExtraArgument`，指向工厂函数，这样就可以传入自定义参数的同时，返回中间件。

```js
const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument(api))
)

// later
function fetchUser(id) {
  return (dispatch, getState, api) => {
    // you can use api here
  }
}
```
