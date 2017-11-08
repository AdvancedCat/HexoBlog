
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
