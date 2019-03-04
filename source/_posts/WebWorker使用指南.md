---
title: WebWorker使用指南
date: 2019-03-04 08:26:26
tags: ['Javascript']
---

# 概述
JavaScript程序是运行在单线程上的，可以想象JavaScript程序就像一个超大的TodoList。JS引擎一次只能做一件事情，虽然在浏览器中有多个额外线程帮助我们处理多个任务，如`setTimeout`或UI渲染等。但在遇到计算密集型程序，仍是单线程完成的。这与目前智能设备多核处理器的趋势背道而驰，无法充分发挥出计算机的计算能力。
HTML5提出了`Web Worker`，就是为了让Javascript拥有多线程的能力。它的基本原理是，调起底层操作系统生成线程，将一些任务交给线程完成，完成后再通知主线程。这样在主线程和多线程可以各自处理任务，互不干扰。
Web Worker一旦创建后，就会一直运行，不会受到主线程上活动（事件点击、表单提交）的打断，且时刻获得主线程的消息传递。但是，这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭。

> WebWorker唤起的线程是来自于操作系统唤起的线程，并不是浏览器的行为。它消费的是用户操作系统的线程资源，因此不可过度依赖或占用。否则会影响用户操作系统的性能。

Web Worker的使用应注意以下几点：
* 同源策略
分配给worker使用的脚本文件，应与主线程的脚本文件同源。

* DOM限制
由于worker是运行在操作系统(real-OS level)层面上的，所以它不能使用浏览器提供的`window` `document` `parent`等全局变量。但可以使用`location` `navigator`等变量，因为使用它们不会直接作用于DOM中。worker可以使用`XMLHttpRequest`发起网络请求。

* 文件限制
worker不能读取本地文件，它运行的脚本必须来自于网络。


# 基本用法
1. Fork一个线程
使用worker最简单的方法就是new一个Worker实例：

主线程代码如下：
```js
/*File: main-script.js*/
let worker = new Worker('record.js');
worker.postMessage('My name is main-script.');
worker.addEventListener('message), (e)=>{
    console.log(e.data);
    worker.terminate();   // 关闭worker
}, false);
```

分配给worker的代码如下：
```js
self.addEventListener('message', (e)=>{
    console.log(e.data);
    self.postMessage('Fine, my name is worker.')
}, false);

// self.close() 自己可以关闭自己
```

在浏览器Console控制台中，将看到如下输出：
```js
My name is main-script.   // from worker
Fine, my name is worker.  // from main-script
```

2. 如何通信
在上面示例中，我们看到了主线程和worker线程之间是如何通信的。
在主线程中，我们可以调用worker实例的`postMessage`发送消息，`worker.addEventListener('message')`来接收消息。
> worker.addEventListener('message')也可以写成：
> worker.onmessage = function(e){...}

同理，在worker线程中也可以使用`postMessage`和`onmessage`来收发消息。注意到，在worker中我们直接使用的是`self`代表子线程自身，即子线程的全局对象。

3. 如何关闭worker
在主线程中，调用`worker.terminate()`关闭worker。而在worker内部，则调用`self.close`即可关闭自身。

4. Worker加载脚本
Worker 内部如果要加载其他脚本，有一个专门的方法`importScripts()`.
```js
importScript('script1', 'script2'); // 可加载多个脚本
```

5. 错误处理
主线程和worker线程都可以监听worker是否发生了错误：
```js
worker.onerror = function(err){...}
// or
worker.addEventListener('error', function(err){...})

// 在worker内部也可以监听错误
self.onerror or self.addEventListener('error')
```


更多有趣的用法，请探索[MDN - 使用 Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)