---
title: DOM元素排序
date: 2017-09-29 19:53:56
tags: ['DOM','Javascript']
---

# 问题
如何给页面中已存在的DOM元素排序？
1. 表格中有一些数据，希望按照某些规则进行排序
2. 父元素下的子元素排序
等等...

# 分析
这个问题的关键是如何以最小的代价去操作这些dom，我们都知道直接操作页面DOM是很耗时的行为，因为操作一次页面DOM就会引发[重排或重绘](/2017/12/19/重排与重绘/).那么如何设计解决这个问题。

* 必须要缓存读取的DOM集合，在JS中完成排序，之后再写会页面中
* 最好能直接用已存在的DOM填充到父元素中，不要使用新建DOM的方式
* 以最少的标记来标识已存在DOM如何做移动

# 关键函数sortElements
根据以上设想，写出以下代码：
```js
function sortElements(childs, comparator){
	if(!childs.length || typeof comparator !== 'function'){
		return
	}

	var sort = [].sort
	var map = [].map

	var placements = map.call(childs,function(item){
		var ownDom = item
		var parentNode = ownDom.parentNode
		var nextSibling = parentNode.insertBefore(
				document.createTextNode(''),
				ownDom.nextSibling
			)

		return function(){

			parentNode.insertBefore(this, nextSibling)
			parentNode.removeChild(nextSibling)
		}
	})

	// 这里有个坑，childs其实是NodeList对象，不是真的数组，需要将它转成数组才能调用后续的sort,map
	var sorted = sort.call([].slice.call(childs), comparator)
	map.call(sorted, function(item, idx){
		placements[idx].call(item)
	})
}
```

`comparator`需要用户指定，用于判断dom谁先谁后

在参考资料中列出了上面使用到的原生API

完整DEMO
```html
<!DOCTYPE html>
<html>
<head>
	<title>子节点排序</title>
</head>
<body>

<ul class="parent">
	<li data-index="6">6</li>
	<li data-index="1">1</li>
	<li data-index="2">2</li>
	<li data-index="5">5</li>
	<li data-index="3">3</li>
	<li data-index="4">4</li>
</ul>

<div>
	<button onclick="clickSortElement()">点击排序</button>
</div>

<script type="text/javascript">
function clickSortElement(){
	var childDoms = document.querySelectorAll('.parent li')

	sortElements(childDoms, function(a, b){
		var aIndex = +a.getAttribute('data-index')
		var bIndex = +b.getAttribute('data-index')
		return aIndex > bIndex ? 1 : -1 
	})
}


function sortElements(childs, comparator){
	if(!childs.length || typeof comparator !== 'function'){
		return
	}

	var sort = [].sort
	var map = [].map

	var placements = map.call(childs,function(item){
		var ownDom = item
		var parentNode = ownDom.parentNode
		var nextSibling = parentNode.insertBefore(
				document.createTextNode(''),
				ownDom.nextSibling
			)

		return function(){

			parentNode.insertBefore(this, nextSibling)
			parentNode.removeChild(nextSibling)
		}
	})

	// 这里有个坑，childs其实是NodeList对象，不是真的数组，需要将它转成数组才能调用后续的sort,map
	var sorted = sort.call([].slice.call(childs), comparator)
	map.call(sorted, function(item, idx){
		placements[idx].call(item)
	})
}

</script>

</body>
</html>
```



# 参考资料
* [insertBefore](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore)
* [createTextNode](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createTextNode)
* [removeChild](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/removeChild)
* [nextSibling](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nextSibling)
* [querySelectorAll](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelectorAll)