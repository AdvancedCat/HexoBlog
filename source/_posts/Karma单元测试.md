---
title: Karma单元测试
date: 2017-11-16 14:22:56
tags: ['Karma']
---

# Karma?
Javascript 单元测试工具

# 使用背景
公司内部维护使用了一套前端底层的JS框架（简称UI），需要有完整的测试。
UI是运行在浏览器环境中，内部提供了一些常用的函数库，以及根据义务需要封装的UI皮肤。

# 安装
1.全局安装`karma-cli`
```js
npm i -g karma-cli
```

2.项目安装相关依赖
```js
npm i -D karma jasmine-core karma-jasmine
```

# 自动化单元测试
Karma最常用的功能就是它的自动化单元测试
首先在终端运行：`karma init`
依据提示，输入一些配置参数，之后我们可以得到以下的配置文件（根目录下的`karma.conf.js`）:
```js
// Karma configuration
// Generated on Thu Nov 16 2017 11:53:28 GMT+0800 (CST)
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'dist/*.min.css',
        'dist/*.min.js',
        'test/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}


```

之后再在根目录下运行`karma start`,karma会自动运行起Chrome浏览器，并在终端中输出测试结果。
