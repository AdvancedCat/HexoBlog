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

webpack中主要有四个核心概念，只要掌握这四个概念，基本可以学会使用webpack
* Entry
  Entry告知webpack应该从哪个脚本文件开始构建，进而构建依赖图
* Output
  Output会告知webpack应该将打包好的文件放到哪个文件夹中以及如何命名它们
* Loader
  webpack本身只会处理javascript文件，指定相关loader会帮助webpack去处理其他的资源，如图片、样式等
  loader的工作像是预处理(pre-handle)，将源文件转换为js文件，或将图片转换base64编码格式等
* Plugin
  Plugin与Loader主要区别在于，loader仅用于如何处理资源，比如讲less编写的样式转换为css格式的样式。
  plugin则帮助用户进一步处理资源，比如将经loader处理后的资源压缩处理或混淆处理等
  plugin的工作像后处理(post-handle)，将js文件进一步处理（压缩等）
  sss


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



# Webpack原理

从启动webpack构建到输出结果经历了一系列过程，它们是：

1. 解析webpack配置参数，合并从shell传入和`webpack.config.js`文件里配置的参数，生产最后的配置结果。
2. 注册所有配置的插件，好让插件监听webpack构建生命周期的事件节点，以做出对应的反应。
3. 从配置的`entry`入口文件开始解析文件构建AST语法树，找出每个文件所依赖的文件，递归下去。
4. 在解析文件递归的过程中根据文件类型和loader配置找出合适的loader用来对文件进行转换。
5. 递归完后得到每个文件的最终结果，根据`entry`配置生成代码块`chunk`。
6. 输出所有`chunk`到文件系统。

需要注意的是，在构建生命周期中有一系列插件在合适的时机做了合适的事情，比如`UglifyJsPlugin`会在loader转换递归完后对结果再使用`UglifyJs`压缩覆盖之前的结果。



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
![](/img/WX20171108-150828@2x.png)
说明webpack已经打包成功，它会在当前目录下生成一个新的文件`hello.bundle.js`文件。

webpack命令内置了很多的选项，有兴趣可以敲击`webpack --help`查看。

# webpack.config.js
webpack当配合配置文件一起使用，才能真正发挥实力，因此我们重点学习一下config文件如何[配置](https://webpack.js.org/configuration/)。

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


## loader属性
如上面所言，loader帮助我们进行一些预处理的工作

比如将TypeScript编写的代码翻译成js代码，预处理所有css文件
首先需要安装`ts-loader`，终端运行`npm install --save-dev ts-loader css-loader`，配置文件如下：
```js
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
};
```
观察上面module的数据结构，接受一个rules数组，告知webpack应该使用哪个loader。test是正则，当文件满足正则表达式时，调用相应loader预处理。
当我们需要为某个类型文件执行多个loaders时，可以这样写：
```js
module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
```
webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader。在这种情况下，以 .css 结尾的全部文件，都将被提供给 style-loader 和 css-loader。这使你可以在依赖于此样式的文件中 import './style.css'。现在，当该模块运行时，含有 CSS 字符串的 `<style>`标签，将被插入到html文件的`<head>`中。

更多loader的配置方式，可以查看[这里](https://webpack.js.org/concepts/loaders/#using-loaders)

看一个简单的例子
我们的代码是用ES6写的，但代码运行在ES5环境中，因此需要将ES6语法的代码翻译为ES5，我们需要`babel-loader`的帮助。
填写配置文件：
```js
const path = require('path')

module.exports = {
    entry: './src/js/main.js',
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options:{
                        presets: ['es2015']
                    }
                }
            }
        ]
    }
}
```
上面代码中，我们配置了babel的presets为`es2015`，我们需要安装一些插件：
```bash
npm install babel-core babel-loader babel-preset-es2015
```
如果不希望在配置文件中填写options，也可以在根目录下新建一个`.babelrc`文件，内容如下：
```js
{
  "presets": [
    "es2015"
  ]
}
```
更多关于babel的用法，可以访问它的[官网](https://babeljs.io/)

## plugin属性
plugin的角色更多是后处理，帮助用户进一步操作预处理后的文件。
plugin是构造函数，因此使用的时候需要我们去实例化它：
```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    filename: 'my-first-webpack.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```

由于webpack.config.js本身是一个可引入的脚本，因此它本身用什么语言编写无关紧要，即可以用TypeScript或CoffeeScript编写，只要能正确被webpack识别即可。



# 某些困惑点

这篇来自Medium的[Webpack — The Confusing Parts](https://medium.com/@rajaraodv/webpack-the-confusing-parts-58712f8fcad9)文章很好介绍了webpack中的一些困惑点，[这篇文章](https://github.com/chemdemo/chemdemo.github.io/issues/13)是中文翻译，供无法翻墙的朋友看看。建议看原文，写的通俗易懂。




# 常用的Plugin
html-webpack-plugin
clean-webpack-plugin
webpack-dev-server
webpack-dev-middleware
webpack-hot-middleware
uglifyjs-webpack-plugin
