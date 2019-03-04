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
由于worker是运行在操作系统(real-OS level)层面上的，所以它不能使用浏览器提供的`window` `document` `parent`等全局变量。但可以使用`location` `navigator`等变量，因为使用它们不会直接作用于DOM中。worker可以使用`XMLHttpRequest`或`Fetch`发起网络请求。

* 文件限制
worker不能读取本地文件，它运行的脚本必须来自于网络。

Web Worker主要有三种：
1. 专用Worker，也是最常用的，也是本文介绍的.
2. [Shared Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/SharedWorker) 可被不同的窗体的多个脚本运行，比专用稍微复杂一些。常用于同源多个窗口之间的通信。
3. [Service Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)一般作为web应用程序、浏览器和网络（如果可用）之间的代理服务。他们旨在（除开其他方面）创建有效的离线体验，拦截网络请求，以及根据网络是否可用采取合适的行动，更新驻留在服务器上的资源。他们还将允许访问推送通知和后台同步API。

> 还有`Chrome Worker`以及`音频Worker`，但使用场景很少。


# 基本用法

## Fork一个线程
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

## 如何通信
在上面示例中，我们看到了主线程和worker线程之间是如何通信的。
在主线程中，我们可以调用worker实例的`postMessage`发送消息，`worker.addEventListener('message')`来接收消息。
> worker.addEventListener('message')也可以写成：
> worker.onmessage = function(e){...}

同理，在worker线程中也可以使用`postMessage`和`onmessage`来收发消息。注意到，在worker中我们直接使用的是`self`代表子线程自身，即子线程的全局对象。

## 关闭worker
在主线程中，调用`worker.terminate()`关闭worker。而在worker内部，则调用`self.close`即可关闭自身。

## Worker加载脚本
Worker 内部如果要加载其他脚本，有一个专门的方法`importScripts()`.
```js
importScript('script1', 'script2'); // 可加载多个脚本
```

## 错误处理
主线程和worker线程都可以监听worker是否发生了错误：
```js
worker.onerror = function(err){...}
// or
worker.addEventListener('error', function(err){...})

// 在worker内部也可以监听错误
self.onerror or self.addEventListener('error')
```

## 数据通信
主线程不光可以给worker传递基本数据类型，也可以传递数组或对象，但这种传递是通过值拷贝完成的。即worker获得的数据是原数据的深度拷贝。事实上，浏览器会先将**数据序列化**，然后将序列化后的字符串给worker，worker接收到数据后会再**反序列化**。

如果传递很大，比如文件内容或一个很大的数组，序列化操作会很耗性能。为了解决这个问题，JavaScript允许主线程将二进制数据直接转移给worker，但这种转移是所有权的转移，一旦主线程将数据转移给worker后，浏览器就不能再使用这部分数据了，这是为了解决读写混乱的问题。这种转移数据的方法，叫[Transferable objects](http://w3c.github.io/html/infrastructure.html#transferable-objects)。以下方法实现数据转移：
```js
// Transferable Objects 格式
worker.postMessage(arrayBuffer, [arrayBuffer]);

// 例子
var ab = new ArrayBuffer(1);
worker.postMessage(ab, [ab]);
```

## 同页面脚本
通常情况下，Worker 载入的是一个单独的 JavaScript 脚本文件，但是也可以载入与主线程在同一个网页的代码。
```html
<!DOCTYPE html>
  <body>
    <script id="worker" type="app/worker">
      addEventListener('message', function () {
        postMessage('some message');
      }, false);
    </script>
  </body>
</html>
```

上面是一段嵌入网页的脚本，注意必须指定`<script>`标签的type属性是一个浏览器不认识的值，上例是app/worker。然后，读取这一段嵌入页面的脚本，用 Worker 来处理。

```js
var blob = new Blob([document.querySelector('#worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function (e) {
  // e.data === 'some message'
};
```

上面代码中，先将嵌入网页的脚本代码，转成一个二进制对象，然后为这个二进制对象生成 URL，再让 Worker 加载这个 URL。这样就做到了，主线程和 Worker 的代码都在同一个网页上面。同样的，你也可以这样：

```js
function veryExpensiveStepsInFunc(){
    addEventListener('message', function () {
        postMessage('some message');
    }, false);
}

var blob = new Blob(['('+veryExpensiveStepsInFunc.toString()+')()']);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function (e) {
  // e.data === 'some message'
};
```


# 参考文档

* [一个Web Worker示例](https://nerget.com/rayjs-mt/rayjs.html)
* [MDN - 使用 Web Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
* [Web Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)