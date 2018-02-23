---
title: Javascript模块化开发
date: 2018-02-22 16:01:57
tags:
---

按以下模式去封装一些方法和变化是较好的实践：

```js
var UTIL = (function (parent, $) {
	var my = parent.ajax = parent.ajax || {};

	my.get = function (url, params, callback) {
		// ok, so I'm cheating a bit :)
		return $.getJSON(url, params, callback);
	};

	// etc...

	return parent;
}(UTIL || {}, jQuery));
```


# 扩展阅读
* [Javascript模块化编程（一）：模块的写法](http://www.ruanyifeng.com/blog/2012/10/javascript_module.html)
* [JavaScript Module Pattern: In-Depth](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)
* [SeaJS](https://seajs.github.io/seajs/docs/#intro)