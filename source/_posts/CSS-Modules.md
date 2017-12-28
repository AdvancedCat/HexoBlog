---
title: CSS Modules
date: 2017-12-27 22:28:26
tags: ['CSS']
---

# 痛点
我们在开发页面的时候，经常是需要写一些样式文件的。自从React，Vue兴起后，组件化开发日益火热。
组件化开发过程中，我们编程思维颗粒度更细，在写样式时，仅仅会针对这个单独组件，难免会与其他的组件样式冲突，导致重名样式覆盖。
比如，A组件有个`title`样式：
```css
.title{
    color: red;
}
```
而在B组件中也有同名`title`样式：
```css
.title{
    color: blue;
}
```
当在同一页面中使用A B组件时，样式就会冲突。

那么有没有什么好的办法解决这个问题呢？

有一种css组织方式——[BEM](https://en.bem.info/methodology/css/),为每个class起一个有意义的名称，尽可能避免重名问题。但是，它的命名过于繁琐和冗长，虽然便于管理，但是对开发者而言不够友好。

试试CSS Modules吧

# [CSS Modules](https://github.com/css-modules/css-modules)
CSS Modules是一个样式文件，这个样式文件中所有样式类（class）和动画名称默认都是本地作用域的。通过模块引入的方式访问。

> 注意，CSS Modules只对样式类做转换，即如果你配合webpack使用后，它会把样式类以base64形式转换。如果在CSS Modules中使用id选择器、伪类、标签选择器，它不会做任何转换

CSS Modules引入了模块依赖和局部作用域的概念，让css文件以模块的方式引入.这与webpack的思想不谋而合，在webpack中，所以资源都是模块，并且webpack中也可以针对模块使用不同的loader处理资源。

我们先看看，CSS Module的基本内容，再看看搭配webpack如何做到css模块的引入。

## 命名
CSS Modules提倡使用驼峰式书写类名，但并不是强制的
```css
.bannerBg {
  color: green;
}
```
这样做的原因是，如果你使用了react或者vue，那么你通过引入样式文件就一切很自然了：
```js
// For React
import style from './style.css'

<App className={style.bannerBg} />
```

## 作用域
在CSS Modules中，有本地作用域和全局作用域之分，使用`:local()`和`:global()`标识，默认情况下都是本地作用域的
如果在全局作用域下，其他组件也可以访问到样式类名
```css
.normal {
  color: green;
}

/* 以上与下面等价 */
:local(.normal) {
  color: green;
}

/* 定义全局样式 */
:global(.btn) {
  color: red;
}

/* 定义多个全局样式 */
:global {
  .link {
    color: green;
  }
  .box {
    color: yellow;
  }
}
```

## 组合
允许开发者自由组合多个样式类
```css
.className {
  color: green;
  background: red;
}

.otherClassName {
  composes: className;
  color: yellow;
}
```
上面`otherClassName`组合了`className`的属性，但自身`color`会覆盖其他类`className`的同名属性。
`otherClassName`必须在之前声明好。

可以组合多个类`composes: classNameA classNameB;`

也可以组合全局类,以及组合来自其他文件的类
```css
.otherClassName {
  composes: globalClassName from global;
}

.otherClassName {
  composes: className from './another.css';
}
```

# 应用
知道了CSS Modules的内容，当然需要用它，不然学它做什么(黑人问号脸...)

我们以React为例，使用webpack进行打包。首先如果需要开启CSS Modules，我们需要在webpack中声明：
```js
// webpack.config.js
...
module:{
    loaders: [{
        test: /\.css$/,
        loader: "style-loader!css-loader?modules"
    }]
}
...
```

一个App组件：
```CSS
// style.css
.title{
    color: red;
}
```
```jsx
const style from './style.css'

export default ()=>{
    return(
        <h1 className={style.title}></h1>
    )
}
```
当我们访问页面时，这个组件内部`h1`标签的变成了
```html
<h1 class="_3zyde4l1yATCOkgn-DBWEL">
  Hello World
</h1>
```
`h1`的class属性值变成了base64编码，这样就避免了样式的重名。


更多的用例，你可以看一下阮大神的博文——[CSS Modules](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

# 约定
既然有个规范，那就有一些使用的约定，非强制性的约定，但使用后还是很有好处的。

* 不使用选择器，只使用 class 名来定义样式
* 不层叠多个 class，只使用一个 class 把所有样式定义好
* 所有样式通过 composes 组合来实现复用
* 不嵌套

# 参考资料
* [CSS Modules](https://github.com/css-modules/css-modules)
* [CSS Modules 详解及 React 中实践](https://zhuanlan.zhihu.com/purerender/20495964)
