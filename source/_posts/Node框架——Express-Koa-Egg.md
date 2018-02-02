---
title: 'Node框架——Express,Koa,Egg'
date: 2018-02-01 18:38:49
tags: ['Node']
---

# Express

> 简单，门槛低，快速

[项目地址](https://github.com/expressjs/express) 36000+ stars
[官网](http://expressjs.com/)  [中文网站](http://www.expressjs.com.cn/)

提供了对Nodejs API的简单封装，帮助开发者快速构建web应用，准入门槛低。
使用[Express application generator](https://expressjs.com/en/starter/generator.html)脚手架工具可以快速生成Express应用

通过使用 Node Express，你可以实现中间件来响应 http 请求，可以定义路由表来定义对不同请求的响应函数，还可以使用模板引擎来输出 html 页面。

# Koa

> 洋葱圈中间件机制，高度可扩展性

[项目地址](https://github.com/koajs/koa) 19000+ stars
[官网](http://koajs.com/)  [中文网站](https://koa.bootcss.com/)

KOA 框架的核心是 ES6 的 generator。KOA 使用 generator 来实现中间件的流程控制，使用try/catch 来增强异常处理，同时在 KOA 框架中你再也看不到复杂的 callback 回调了。
在Node发布V8版本后，支持了`async``await`语法，使得Koa应用的编写更加清晰。

许多 JavaScript/Node.js 的忠实开发者都开始选择使用 KOA 来开发新的项目，因为 KOA 提供了更多的灵活性开发应用程序。

# Meteor

> 挺全面的，全面到已经把你想到的问题都解决了。它集成了Anjularjs,React,MongoDB,Cordova

[项目地址](https://github.com/meteor/meteor/) 39000+ stars
[官网](https://www.meteor.com/)

[Discover Meteor](http://zh.discovermeteor.com/)

# EggJS

> 阿里巴巴提出的一个企业级框架与应用，基于Koa
“约定优于配置”

[项目地址](https://github.com/eggjs/egg/)  6800+ stars
[官网](https://eggjs.org)

# 扩展阅读
* [Meteor.js 是什么？ - wolf3c的回答 - 知乎](https://www.zhihu.com/question/20296322/answer/79431097)
* [如何评价阿里开源的企业级 Node.js 框架 EggJS？ - 天猪的回答 - 知乎](https://www.zhihu.com/question/50526101/answer/144952130)
* [EggJS 2.0 正式发布，性能提升 30%，拥抱 Async](https://zhuanlan.zhihu.com/p/31640541)
