---
title: 使用Babel
date: 2017-11-09 10:31:15
tags: ['Babel']
---

# Babel?
> Babel is a JavaScript compiler.

使用Babel可以让你用下一代的语法特性写今天的代码。

# 如何使用

## Babel-CLI
1.安装babel以及preset
```js
npm install --save-dev babel-cli babel-preset-env
```

2.新建`.babelrc`文件或者在`package.json`中配置
```js
echo '{presets:["env"]}' > .babelrc
// or option in package.json
{
    ...,
    "babel":{
        "presets": ["env"]
    }
}
```

babel命令行提供了一些命令，可以敲击`babel --help`查看


## 与项目配合使用
一般而言babel适合与其他构建工具一起使用，如`webpack`,`gulp`等。当然如果应用并不大，也可以单独使用，此时你需要去了解一下[babel API](http://babeljs.io/docs/usage/api/)了。
以下我们以和`webpack`使用为例，如果你需要和`gulp`使用，你可以参考[gulp-babel](https://www.npmjs.com/package/gulp-babel/)

* 安装插件
首先需要知道项目代码需要翻译到哪个目标代码，假设你的项目是用CoffeeScript书写的，需要将代码转换为ES5.你需要安装好以下插件：
```js
npm install --save-dev babel-core babel-loader babel-preset-es2015 coffee-loader coffeescript
```

* 配置webpack
在`webpack.config.js`(webpack 3.X)中如下配置：
```js
{
    ...,
    module: {
        rules: [
            {
                test: /\.coffee$/,
                use: [{
                    loader: 'coffee-loader',
                    options: {
                        sourceMap: true    // 开启sourceMap
                    }
                }]
            }
        ]
    }
}
```

* 新建`.babelrc`
在项目根目录下新建文件`.babelrc`:
```js
{
    presets:[
        'es2015'
    ]
}
```

### presets

babel官方提供了几个常用的[presets](https://babeljs.io/docs/plugins/#presets)：
* env
* es2015
* es2016
* es2017
* latest
* react
* flow

如果你要使用上面的任一preset，均要安装对应的插件`babel-preset-*`

如果你使用了多个presets，则babel会逆序执行相应插件：
```js
{
  "presets": [
    "es2015",
    "react",
    "stage-2"
  ]
}
```
`stage-2`->`react`->`es2015`

更多关于babel的使用，你可以访问[官网](http://babeljs.io/)或者阅读这篇[babel用户手册](https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md)

# Babel插件

如果你想写一个自己的babel插件，你可以阅读一下[这个文章](https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)，对babel的编译原理做了介绍，还是中文的哦。
