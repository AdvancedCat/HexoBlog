---
title: PM2——node进程管理器
date: 2018-01-31 16:50:24
tags: ['node']
---

# PM2
Advanced, production process manager for node.js
[官网](http://pm2.keymetrics.io/)

# Features
* 热重载
不需要停机，0秒重载进程 (是否可以记住应用当前的状态呢？如内存中的变量等)

* 日志集成
可查看应用在存活期间的日志，特别是error log信息

* [API](http://pm2.keymetrics.io/docs/usage/pm2-api/) —— 脚本化管理进程
可以做到脚本化管理应用

* Teminal Monitoring
终端监控

* 原生集群化支持，多进程管理

* PM2可配置化
JS/JSON配置文件


# 安装
```js
npm install -g pm2
```

当完成安装后，pm2会在`$HOME`下新建pm2文件夹：

```js
$HOME/.pm2            与pm2相关的所有文件
$HOME/.pm2/logs       存放所有应用的日志  appname-error-id.log  appname-out-id.log
$HOME/.pm2/pids       所有应用pids
$HOME/.pm2/pm2.log    pm2的使用日志
$HOME/.pm2/pm2.pid    pm2的pid
$HOME/.pm2/rpc.sock   远程连接socket文件
$HOME/.pm2/pub.sock   远程连接相关
$HOME/.pm2/conf.js    pm2的配置文件
```

运行`pm2 logs`可以从以上文件中读取到相关应用的日志和pm2日志


# 命令
* `pm2 start app.js -i 4`
后台运行pm2，启动4个app.js ，也可以把'max' 参数传递给 start，正确的进程数目依赖于Cpu的核心数目

* `pm2 start app.js --name my-api`
命名进程

* `pm2 list`
显示所有进程状态

* `pm2 monit`
监视所有进程

* `pm2 logs`
显示所有进程日志

* `pm2 stop all`
停止所有进程, 可以指定id停止特定进程，id可在list中查看到

* `pm2 restart all`
重启所有进程，可指定id

* `pm2 reload all`
0秒停机重载进程，可指定id

* `pm2 delete all`
杀死所有进程


通过配置文件启动进程：
`pm2 start run.json`

我们可以运行`pm2 ecosystem`,会在项目目录下生成pm2的配置文件`ecosystem.config.js`
一般配置文件如下格式：
```js
module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'API',
      script    : 'app.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    },

    // Second application
    {
      name      : 'WEB',
      script    : 'web.js'
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
```
以上配置文件，会启动三个不同应用，各个应用会有不同配置
配置文件如何配置，请访问官网[配置](http://pm2.keymetrics.io/docs/usage/cluster-mode/)部分

运行`pm2 deploy <configuration_file> <environment> <command>`,发布配置任务


# 其他用途
执行`pm2 start app.js --watch`后，pm2会监听当前目录的所有文件，如果文件发生变化，pm2会重新启动应用。
可以配置监听特定文件夹的文件，这样在我们开发node应用时，可以做到热启动

```js
{
  "watch": ["server", "client"],
  "ignore_watch" : ["node_modules", "client/img"],
  "watch_options": {
    "followSymlinks": false
  }
}
```

# 扩展阅读
* [一个pm2部署的案例](https://zhuanlan.zhihu.com/p/20940096) From 知乎专栏



WRK???
ab命令 —— apache的http压力测试工具
> ab的全称是ApacheBench，是Apache附带的一个小工具，用于进行HTTP服务器的性能测试，可以同时模拟多个并发请求。

