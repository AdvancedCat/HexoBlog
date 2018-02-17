---
title: Node多线程开发
date: 2018-01-24 19:52:10
tags: ['node']
---

# 单线程
Node.js选择V8作为它的执行引擎，

* 高性能
首先，单线程避免了传统PHP那样频繁创建、切换线程的开销，使执行速度更加迅速。 
第二，资源占用小，如果有对Node.js的web服务器做过压力测试的朋友可能发现，Node.js在大负荷下对内存占用仍然很低，同样的负载PHP因为一个请求一个线程的模型，将会占用大量的物理内存，很可能会导致服务器因物理内存耗尽而频繁交换，失去响应。


* 线程安全
避免多线程竞争资源，造成死锁的问题。降低开发者对资源加锁解锁的风险。

* 异步与非阻塞
其实Node.js在底层访问I/O还是多线程的，有兴趣的朋友可以翻看Node.js的fs模块的源码，里面会用到libuv来处理I/O，所以在我们看来Node.js的代码就是非阻塞和异步形式的。


因为单线程的缘故，node.js本身是不适合处理CPU密集型的应用的，比如涉及大量科学计算的应用等。所以node.js是否也可以做到多线程呢？答案是可以的

# 多线程
即便是在目前多核CPU的场景，node.js本身仍只能利用一个cpu运行。


## cluster

设计四个对比实验：
1. node程序单线程，pm2单线程
2. node多线程，pm2单线程
3. node单线程，pm2多线程
4. node多线程，pm2多线程

node的程序是一个计算Fibonacci的程式（递归算法），它属于CPU密集型计算，由此模拟出当服务器CPU被科学计算霸占时，如何做到快速响应其他请求


node单线程服务器：
```js
var express = require('express');
var app = express();
var fibo = function fibo (n) {//定义斐波那契数组算法
   return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}
app.get('/', function(req, res){
  var n = fibo(~~req.query.n || 1);//接收参数
  res.send(n.toString());
});

app.listen(8125);
console.log('listen on 8125');
```

node多线程——用cluster来启动多个进程:
```js
var cluster = require('cluster');//加载cluster模块
var numCPUs = require('os').cpus().length;//设定启动进程数为cpu个数
if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();//启动子进程
  }
} else {
    var express = require('express');
    var app = express();
    var fibo = function fibo (n) {//定义斐波那契数组算法
       return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
    }
    app.get('/', function(req, res){
      var n = fibo(~~req.query.n || 1);//接收参数
      res.send(n.toString());
    });
    app.listen(8124);
    console.log('listen on 8124');
}
```

使用ab命令进行压测
`ab -c 100 -n 100 http://10.249.5.27:8124/?n=35`

> 物理机：8 QEMU Virtual CPU version (cpu64-rhel6)  8核处理器

### 实验结果
本地电脑——四核处理器

* 第一组：node程序单线程，pm2单线程
单个线程处理了100个请求

```js
Requests per second:    8.06 [#/sec] (mean)
Time per request:       12414.219 [ms] (mean)
Time per request:       124.142 [ms] (mean, across all concurrent requests)
Transfer rate:          1.62 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        2    3   0.9      3       5
Processing:   141 6274 3599.2   6372   12408
Waiting:      141 6273 3599.3   6372   12408
Total:        146 6277 3598.4   6375   12410

Percentage of the requests served within a certain time (ms)
  50%   6375
  66%   8312
  75%   9400
  80%  10022
  90%  11309
  95%  11923
  98%  12287
  99%  12410
 100%  12410 (longest request)
```

* 第二组：node程序单线程，pm2多线程
每个线程处理了25个请求

```js
Requests per second:    10.91 [#/sec] (mean)
Time per request:       9165.958 [ms] (mean)
Time per request:       91.660 [ms] (mean, across all concurrent requests)
Transfer rate:          2.19 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        2    3   0.7      3       4
Processing:   313 4660 2683.0   4677    9160
Waiting:      313 4660 2682.8   4677    9160
Total:        318 4663 2682.3   4680    9162

Percentage of the requests served within a certain time (ms)
  50%   4680
  66%   6213
  75%   6985
  80%   7453
  90%   8468
  95%   8945
  98%   9130
  99%   9162
 100%   9162 (longest request)
```

* 第三组：node多线程，pm2单线程
每个线程处理了25个请求

```js
Requests per second:    10.95 [#/sec] (mean)
Time per request:       9135.305 [ms] (mean)
Time per request:       91.353 [ms] (mean, across all concurrent requests)
Transfer rate:          2.20 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        6   14   3.5     14      17
Processing:   333 4670 2687.3   4664    9116
Waiting:      332 4670 2687.5   4664    9116
Total:        340 4684 2688.3   4680    9129

Percentage of the requests served within a certain time (ms)
  50%   4680
  66%   6257
  75%   6988
  80%   7559
  90%   8432
  95%   8835
  98%   9127
  99%   9129
 100%   9129 (longest request)
```

* 第四组：node多线程，pm2多线程
每个线程处理了25个请求

```js
Requests per second:    10.17 [#/sec] (mean)
Time per request:       9831.550 [ms] (mean)
Time per request:       98.315 [ms] (mean, across all concurrent requests)
Transfer rate:          2.05 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        2    6   1.8      5       8
Processing:   383 5051 2861.0   5065    9821
Waiting:      383 5051 2861.0   5064    9821
Total:        391 5057 2859.2   5070    9823

Percentage of the requests served within a certain time (ms)
  50%   5070
  66%   6683
  75%   7562
  80%   8104
  90%   9016
  95%   9483
  98%   9777
  99%   9823
 100%   9823 (longest request)
```

> 实验结果名称解释
Requests per second  服务器每秒处理的请求数
Time per request:       9831.550 [ms] (mean)   平均每个请求处理的时间
Time per request:       98.315 [ms] (mean, across all concurrent requests)  平均每个请求的等待间隙时间

同样的，我也在拥有8核处理器的物理机上做了两组实验：
1. node程序单线程，pm2单线程
```js
Requests per second:    8.01 [#/sec] (mean)
Time per request:       12487.559 [ms] (mean)
Time per request:       124.876 [ms] (mean, across all concurrent requests)
Transfer rate:          1.61 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        1    1   0.3      1       1
Processing:   148 6339 3612.4   6409   12486
Waiting:      146 6339 3612.5   6409   12486
Total:        149 6340 3612.2   6410   12486

Percentage of the requests served within a certain time (ms)
  50%   6410
  66%   8405
  75%   9518
  80%  10136
  90%  11372
  95%  11989
  98%  12363
  99%  12486
 100%  12486 (longest request)
```

2. node多线程，pm2多线程
平均每个线程处理了13个请求

```js
Requests per second:    49.50 [#/sec] (mean)
Time per request:       2020.015 [ms] (mean)
Time per request:       20.200 [ms] (mean, across all concurrent requests)
Transfer rate:          9.96 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        1    1   0.2      1       1
Processing:   159 1047 544.9   1035    2018
Waiting:      157 1046 545.2   1034    2018
Total:        161 1047 544.7   1035    2019

Percentage of the requests served within a certain time (ms)
  50%   1035
  66%   1319
  75%   1542
  80%   1599
  90%   1824
  95%   1878
  98%   1954
  99%   2019
 100%   2019 (longest request)
```

### 结论
如果node程序对进程间通信没有要求，那么尽量node写单线程程序，而使用pm2开启多线程即可.
这样减少代码出错风险，增加可运维性

即便是CPU密集型运算，开启多线程后，仍然可以以较快速度完成运算并返回结果。这是V8引擎和多线程共同带来的特性。

## libuv


## 守护你的进程

### 异常捕获
Node是单线程的，那么不可避免会出现宕机的情况。那么如何守护好进程呢？需要从错误机制上分析

Node中处理事件一般会用回调来实现异步操作的流程，在同步过程中出错，node会抛出相应错误。如果此时没有捕获到这个错误，那么node就会停止运行

1. Node提供捕获全局错误的方法：
```js
process.on('uncaughtException', function (err) {
  //打印出错误
  console.log(err);
  //打印出错误的调用栈方便调试
  console.log(err.stack)；
});
```
但不提倡使用它，因为你使用它，说明你对node并不熟，哈哈。不过这是个备胎方法

2. 在可能出错的地方捕获异常
即使用`try{}catch(e){}`语法

3. 中间件监听
这里需要配合Node服务框架来完成，如`Express`,`Koa`等，有一些好用的中间件监听错误，并得到及时处理，不至于宕机

### 重启服务
当服务宕机后，可以立即重启，目前有以下工具可以使用

1. [node-forever](https://github.com/foreverjs/forever)
2. [pm2](http://pm2.keymetrics.io/)
3. [supervisor](http://supervisord.org/)


通过benchmark实验，当使用`pm2 reload/restart`重启进程时，可以在100ms以内完成重启（会因应用复杂情况有所不同）。如果该应用设计到内存数据缓存，则缓存会在重启时丢失。在客户端请求中，重启期间会断开连接，由于重启时间很短，对用户是无感的（登录状态会丢失）。因此，可以考虑将内存数据在重启前存入数据库或本地文件中，在重启后重新读入。

结论：pm2可以在用户无感情况下完成对应用的重启。


### 日志收集
方案：
1. 异常捕获后，可以将错误信息存储于本地数据表中或存于文件系统中，或者通过发码实时监测
2. 在使用重启服务工具时，本身也可以获取到相应日志用于分析。具体信息请访问官网

# 扩展阅读
* [Node进程](https://github.com/DoubleSpout/threadAndPackage/blob/master/chapter.7.thread_and_process.md)
* [拿什么守护你的Node.JS进程： Node出错崩溃了怎么办？](http://ourjs.com/detail/5417e6ea4f1286640f000002)
* [关于Node进程管理器PM2使用技巧和需要注意的地方](https://github.com/jawil/blog/issues/7)