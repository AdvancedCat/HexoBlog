---
title: 学习使用Webpack
date: 2017-11-08 10:10:31
tags: ['Javascript','webpack']
---

今天抽了点时间详细去学习一下使用Webpack，以前仅仅是停留在使用层面上。

# Webpack?
依据[Webpack官网](https://webpack.js.org/)上的介绍，Webpack是一个帮助你打包静态资源的打包软件，处理各种依赖关系等。

webpack之所以如此受欢迎，因为以下三个特点：
1.Spliting code
2.Loader
3.Plugins

webpack中主要有四个概念，只要掌握这四个概念，基本可以学会使用webpack
* Entry
Entry告知webpack应该从哪个脚本文件开始构建，进而构建依赖图
* Output
Output会告知webpack应该将打包好的文件放到哪个文件夹中以及如何命名它们
* Loader
webpack本身只会处理javascript文件，指定相关loader会帮助webpack去处理其他的资源，如图片、样式等
* Plugin
Plugin与Loader主要区别在于，loader仅用于如何处理资源，比如讲less编写的样式转换为css格式的样式。
plugin则帮助用户进一步处理资源，比如将经loader处理后的资源压缩处理或混淆处理等

我们来看看完整的webpack.config.js文件：
```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```
可以看出，loader是不需要引进的，而plugin则需要通过require引入

# Webpack Cli
首先通过webpack命令行来看看它可以做什么。

如何安装？
```js
mkdir webpacktest & cd webpacktest
npm install --save-dev webpack
```

现在假设你在`webpacktest`文件夹有一个`hello.js`文件，你写了几行代码:
```js
function sayHello(){
    console.log('Hello world')
}
```
让我们在终端运行一下webpack
```js
webpack hello.js hello.bundle.js
```
可以在终端上看到如下提示：
![](./img/WX20171108-150828@2x.png)
说明webpack已经打包成功，它会在当前目录下生成一个新的文件`hello.bundle.js`文件。

webpack命令内置了很多的选项，有兴趣可以敲击`webpack --help`查看。

# webpack.config.js
webpack当配合配置文件一起使用，才能真正发挥实力，因此我们重点学习一下config文件如何配置。

## entry属性
entry有两种方式指定
1. `entry: string|Array<string>`
```js
const config = {
  entry: './path/to/my/entry/file.js'
};

module.exports = config;
```
如果你的项目中需要的打包的资源并不复杂，仅有若干个资源，那么使用第一种可以快速构建应用。

2. `entry: {[entryChunkName: string]: string|Array<string>}`
```js
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```
第二种是webpack最主要entry的配置方式，配合outpu属性可以自定义打包文件的名称

## output属性
output接受对象，分别制定打包文件的文件名和存放路径.
output与entry配合使用，如果entry使用的第一种方法，那么output则是这样：
```js
const config = {
  output: {
    filename: 'bundle.js',
    path: '/home/proj/public/assets'
  }
};
```
第二种方法对应：
```js
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
}
```
