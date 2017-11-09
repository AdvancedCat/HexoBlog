---
title: 常用Webpack插件
date: 2017-11-10 15:30:21
tags: ['webpack']
---

# webpack plugin?
插件是 wepback 的支柱功能。webpack 自身也是构建于，你在 webpack 配置中用到的相同的插件系统之上！

webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。

由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入 new 实例。

```js
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    ...,
    plugins:[
        new CleanWebpackPlugin(['dist'])
    ]
}
```

# 常用的插件

## [CommonsChunkPlugin](https://doc.webpack-china.org/plugins/commons-chunk-plugin)

将应用中引入的公共部分建立一个独立的文件，便于浏览器缓存公共代码。通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存起来到缓存中供后续使用。

用法
```js
const webpack = require('webpack')

const config = {
    entry:{
        vendor: ['underscore', 'jquery'],
        app: './app'
    },
    ...,
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({
            name: 'verdor',    // common chunk的名称, 如上面entry中的vendor
            filename: 'commons.js'  // 为common chunk起一个新的文件名称
            // 其他options
        })
    ]
}
```

## [ExtractTextWebpackPlugin](https://doc.webpack-china.org/plugins/extract-text-webpack-plugin/)

将bundle中的文本单独抽离为独立的文件.

安装
```js
npm install --save-dev extract-text-webpack-plugin
```

用法
```js
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ]
}
```

## [HotModuleReplacementPlugin](https://doc.webpack-china.org/plugins/hot-module-replacement-plugin/)

HMR,模块热替换插件
[这篇教程](https://doc.webpack-china.org/concepts/hot-module-replacement)提到它的作用.

用法
```js
// 通常不需要设置任何属性
new webpack.HotModuleReplacementPlugin()
```

## [HtmlWebpackPlugin](https://doc.webpack-china.org/plugins/html-webpack-plugin/)

HtmlWebpackPlugin简化了HTML文件的创建，以便为您的webpack包提供服务。 这对于在文件名中包含每次会随着变异会发生变化的哈希的webpack bundle尤其有用。

安装
```js
npm install --save-dev html-webpack-plugin
```

用法
```js
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackConfig = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
};
```
它会在`/dist`下生成一个`index.html`文件：
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
  </head>
  <body>
    <script src="index_bundle.js"></script>
  </body>
</html>
```
如果你配合`ExtractTextPlugin`使用，它也会将抽离的单独文件放入对应位置中

具体用法访问它的[Github主页](https://github.com/jantimon/html-webpack-plugin)

## [UglifyjsWebpackPlugin](https://doc.webpack-china.org/plugins/uglifyjs-webpack-plugin/)

代码混淆插件

安装
```js
npm install --save-dev uglifyjs-webpack-plugin
```

用法
```js
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  plugins: [
    new UglifyJSPlugin()
  ]
}
```
