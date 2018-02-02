---
title: Manifest在webpack打包中的作用
date: 2017-05-26 15:02:52
tags: [webpack]
---

# 何为Manifest
Manifest，英文释义“货物单；旅客名单”。映射到网络中，可以认为是静态资源清单。
在我们使用webpack打包资源的时候，manifest在其中起到了什么作用呢

在使用 webpack 构建的典型应用程序或站点中，有三种主要的代码类型：

* 你或你的团队编写的源码。
* 你的源码会依赖的任何第三方的 library 或 "vendor" 代码。
* webpack 的 runtime 和 manifest，管理所有模块的交互。

本文将重点介绍这三个部分中的最后部分，runtime 和 manifest。

## Runtime
runtime，以及伴随的 manifest 数据，主要是指：在浏览器运行时，webpack 用来连接模块化的应用程序的所有代码。runtime 包含：在模块交互时，连接模块所需的加载和解析逻辑。包括浏览器中的已加载模块的连接，以及懒加载模块的执行逻辑。
比如你在打包后的js文件中一定能看到`webpackJsonp`函数，它就是webpack用来引入模块时定义的函数。

## Manifest
当编译器(compiler)开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。这个数据集合称为 "Manifest"，当完成打包并发送到浏览器时，会在运行时通过 Manifest 来解析和加载模块。无论你选择哪种模块语法，那些 import 或 require 语句现在都已经转换为 __webpack_require__ 方法，此方法指向模块标识符(module identifier)。通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块。


# 作用
在webpack打包时，我们都通常会将会划分chunks，提取公共模块。但仅改动一个模块的代码还是会造成 Initial chunk (libs) 的变化。原因是这个初始块包含着 webpack runtime，而 runtime 还包含 chunks ID 及其对应 chunkhash 的对象。因此当任何 chunks 内容发生变化，webpack runtime 均会随之改变。

假设，webpack的entry如下结构：
```js
{
	entry: {
	    libs: [
	      'vue',
	      'vue-router'
	    ],
	    vendor: [
	      /*
	       * vendor 中均是非 npm 模块，
	       * 用 resolve.alias 修改路径，
	       * 避免冗长的相对路径。
	       */
	      'assets/libs/fastclick',
	      'components/request',
	      'components/ui',
	      'components/bootstrap' // 初始化脚本
	    ],
	    page1: 'src/pages/page1',
	    page2: 'src/pages/page2'
    }
}
```

我们期望能够将`libs`，`vendor`单独打包为一个静态文件，并且配合cache缓存达到持久化，因为这类js文件的改动频率较低，每次版本更新浏览器可以读取到之前的缓存。配置如下：

```js
new webpack.optimize.CommonsChunkPlugin({
  names: ['vendor', 'libs']
})
```

按照webpack构建的顺序，webpack会将runtime和manifest信息打包到`libs`中，我们知道webpack是根据`chunk id`引入资源的，那么当我们修改代码时会导致资源id的变化。因此我们可以进一步提取公共代码，如下：

```js
new webpack.optimize.CommonsChunkPlugin({
  names: ['vendor', 'libs', 'manifest']
})
```

> manifest的名称不是一定的，因为它的作用仅是存放runtime和manifest信息，你可以任意命名。另外，关于chunkid，其实有更好的组织方式，比如[HashedModuleIdsPlugin](https://github.com/webpack/webpack/blob/master/lib/HashedModuleIdsPlugin.js).用 HashedModuleIdsPlugin 可以轻松地实现 chunkhash 的稳定化！

经过这样配置后，经常发生变化的manifest信息被抽离出来单独放在了`manifest.js`中，`libs`和`vendor`则不会发生变化，方便缓存。因为`manifest.js`经常变化，并且非常小，则可以考虑将它直出到html中。这个插件可以帮助实现，[inline-manifest-webpack-plugin](https://github.com/szrenwei/inline-manifest-webpack-plugin)



## 扩展阅读
* [缓存](https://doc.webpack-china.org/guides/caching)：确保 webpack 编译生成的文件能够被客户端缓存
* [webpack中的Manifest](https://doc.webpack-china.org/concepts/manifest/)