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

apps中可配置的项目：
```js
name  应用进程名称；
script  启动脚本路径；
cwd  应用启动的路径，关于script与cwd的区别举例说明：在/home/polo/目录下运行/data/release/node/
index.js，此处script为/data/release/node/index.js，cwd为/home/polo/；
args  传递给脚本的参数；
interpreter  指定的脚本解释器；
interpreter_args  传递给解释器的参数；
instances  应用启动实例个数，仅在cluster模式有效，默认为fork；
exec_mode  应用启动模式，支持fork和cluster模式；
watch  监听重启，启用情况下，文件夹或子文件夹下变化应用自动重启；
ignore_watch  忽略监听的文件夹，支持正则表达式；
max_memory_restart  最大内存限制数，超出自动重启；
env  环境变量，object类型，如{"NODE_ENV":"production", "ID": "42"}；
log_date_format  指定日志日期格式，如YYYY-MM-DD HH:mm:ss；
error_file  记录标准错误流，默认$HOME/.pm2/logs/XXXerr.log，代码错误可在此文件查找；
out_file  记录标准输出流，默认$HOME/.pm2/logs/XXXout.log)，如应用打印大量的标准输出，会导致pm2日志过大；
min_uptime  应用运行少于时间被认为是异常启动；
max_restarts  最大异常重启次数，即小于min_uptime运行时间重启次数；
autorestart  默认为true, 发生异常的情况下自动重启；
cron_restart  crontab时间格式重启应用，目前只支持cluster模式；
force  默认false，如果true，可以重复启动一个脚本。pm2不建议这么做；
restart_delay  异常重启情况下，延时重启时间；
```


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

