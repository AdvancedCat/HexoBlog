---
title: 原生JS获取DOM元素
date: 2018-04-04 14:22:12
tags: ['Javascript']
---

原生JS获取页面DOM元素的一些方法

## [getElementById](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementById)

返回一个匹配特定ID的元素，如果元素未找到，返回null
```js
element = document.getElementById(id);
```

element是[Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element)对象

## [getElementsByTagName](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByTagName)

返回一个包括所有给定标签名称的元素的HTML集合HTMLCollection。 搜寻范围是整个文档。
返回的 HTML集合是动态的, 意味着它可以自动更新自己来保持和 DOM 树的同步而不用再次调用 document.getElementsByTagName() 。
无结果，返回空数组。

```js
elements = document.getElementsByTagName(name);
// or
elements = rootElement.getElementsByTagName(name);
```
elements是[HTMLCollection](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCollection)集合，该集合是自动更新的。

`Element`下也有同名函数`getElementsByTagName`，它搜寻的范围在节点`element`孩子节点中。

## [getElementsByName](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByName)

根据给定的[`name`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/name) 返回一个在 (X)HTML document的节点列表集合。
```js
elements = document.getElementsByName(name);
```
elements是[NodeList](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList)集合。
name是元素的name属性值。
该方法请谨慎使用，因为在IE中会把id属性相同的值也返回。

## [getElementsByClassName](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByClassName)

返回一个包含了所有指定类名的子元素的类数组对象HTMLCollection。(IE9+)

```js
elements = document.getElementsByClassName(names);
// or
elements = rootElement.getElementsByClassName(names);
```

- elements 是一个实时[`集合`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCollection)，包含了找到的所有元素。即元素将同时满足names要求。
- names 是一个字符串，表示要匹配的类名列表；类名通过空格分隔；
- getElementsByClassName 可以在任何元素上调用，不仅仅是 document。 调用这个方法的元素将作为本次查找的根元素.

## [querySelector](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector)

返回文档中匹配指定的选择器组的第一个元素(使用深度优先先序遍历文档的节点 | 并且通过文档标记中的第一个元素，并按照子节点数量的顺序迭代顺序节点)。(IE8+)

```js
element = document.querySelector(selectors);
```

- `element` 是一个 [element](https://developer.mozilla.org/zh-CN/docs/DOM/element) 对象（DOM 元素）。无结果返回null
- `selectors` 是一个字符串，包含一个或是多个 [CSS 选择器](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Getting_Started/Selectors) ，多个则以逗号分隔。

Eg:
```html
<div class="user-panel main">
    <input name="login"/> //这个标签将被返回
</div>

<script>
    var el = document.querySelector("div.user-panel.main input[name=login]");
</script>
```

## [querySelectorAll](https://developer.mozilla.org/zh-CN/docs/Web/API/ParentNode/querySelectorAll)

返回一个 [`NodeList`](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList) 表示元素的列表，把当前的元素作为根与指定的选择器组相匹配。

```js
elementList = document.querySelectorAll(selectors);
```
其中：
- `elementList` 是由元素对象 [`element`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 组成的非动态节点列表 [`NodeList`](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList)。
- `selectors` 是一个或多个[CSS选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)，这些选择器由逗号隔开。

这个例子返回了所有 class 为 "note" 或者 "alert" 的 div 元素的一个列表:
```js
var matches = document.querySelectorAll("div.note, div.alert");
```

