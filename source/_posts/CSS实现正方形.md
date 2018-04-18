---
title: CSS实现正方形
date: 2018-04-18 19:53:56
tags: ['CSS']
---

## 背景

今天需要完成一个样式需求：图片区域是正方形，同时需要满足自适应。效果如下：

![](/img/CSS图片正方形展示.jpg)

图中红色框中的图片需要宽高一致，正方形显示。



## CSS方案

```html
<div class="wrap">
	<div class="square">
		<div class="content""">content</div>
	</div>
</div>
```
```css
.wrap{
    width: 200px;
    height: 200px;
}
```

方案一： **vw** [REC](https://www.w3.org/TR/css3-values/#viewport-relative-lengths)
*viewport width*，基于视口的宽度。
屏幕的宽度被分为100个vw，这样元素可以依据视口的宽度来设置宽度值。vw是长度单位，因此可以用于任何尺寸标注，如高度、padding、margin等。
与vw一致概念是vh，基于视口的高度。
```css
.square{
    width: 50vw;
    height:50vw;
}
```
这是目前最优的解决方案，缺点是兼容性较差。详见[Can I Use](https://caniuse.com/#search=vw)


方案二：设置垂直方向的padding，撑开容器
在css容器中，padding和margin可以赋值为百分数。这个百分数是基于**父元素的宽度**设置的。只要将容器垂直方向的padding设置为宽度一样的百分数，就可以自适应为正方形了。
```css
.square{
    width: 100%;
    padding-top: 100%;
}
```
这里有个问题，正方形div中如果放入内容后，内部产生高度。则需要如下处理：
```css
.square{
    position: relative;
    height: 0;
    width:100%;
    padding-top:100%;
}
.content{
    position: absolute;
    ...
}
```

方案三：对方案二的进阶
如果需要限定高度，如`max-height:180px;`。由于`max-height`属性是依赖于content height的，所以方案二不起作用。做如下调整：
```css
.wrap{
    width: 250px;
    height: 250px;
}
.square{
    position: relative;
    width: 100%;
    background: red;
    max-height: 180px;
}
.square:after{
    content: ' ';
    display: block;
    padding-top: 100%;
}
.content{
    position: absolute;
    top: 0;
}
```

## JS方案
使用js肯定可以做到正方形，但效率肯定没css好。不做介绍。