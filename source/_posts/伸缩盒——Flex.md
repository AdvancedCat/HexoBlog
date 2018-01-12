---
title: 伸缩盒——Flex
date: 2017-12-26 15:35:34
tags: ['CSS']
---

# FlexBox
Flex,全拼Flexible Box 伸缩盒，是CSS3推出的新的布局方式。让盒模型具有更大的灵活性。

# Flex属性
一个伸缩盒由两个部分组成：Flex容器和Flex项目。容器即父元素，项目即子元素。它们的关系可以参照下面这张图：
![](/img/flexbox/Flex容器与Flex项目的关系.png)

Flex有比较多的属性，以下思维导图罗列2013最新版本的属性写法和可选值:
![](/img/flexbox/Flexbox属性思维导图.png)


我们针对两个部分对主要属性分析一下
# Flex容器
## display: flex
当我们使用伸缩盒时，先要给父元素指定`display:flex;`或`display:inline-flex`的样式，让父元素触发FFC（伸缩格式化上下文），它的作用和BFC元素一致。（BFC特性：浮动不会闯入伸缩容器，且伸缩容器的边界不会与其内容边界叠加）

## flex-direction
`flex-direction`用来指定伸缩盒主轴的方向，即Flex项目的排布方向
* row: 默认值， 主轴的方向为从左至右
* row-reverse: 主轴的方向为从右至左
* column: 主轴方向从上至下
* column-reverse: 主轴方向从下至上

![](//css-tricks.com/wp-content/uploads/2013/04/flex-direction2.svg)


## flex-wrap
`flex-wrap`属性控制伸缩盒是单行还是多行的，也决定了换行时侧轴的方向（新的一行的堆放方向）
* flex-wrap:nowrap;伸缩容器单行显示，默认值；
* flex-wrap:wrap;伸缩容器多行显示；伸缩项目每一行的排列顺序由上到下依次。
* flex-wrap:wrap-reverse;伸缩容器多行显示，但是伸缩项目每一行的排列顺序由下到上依次排列。

![](//css-tricks.com/wp-content/uploads/2014/05/flex-wrap.svg)

## flex-flow
`flex-flow`是`flex-direction`和`flex-wrap`的合并缩写
参数为上面罗列的可选参数
```CSS
.flex-box{
    display: flex;
    flex-flow: column wrap;
}
```

## justify-content
`justify-content`决定了Flex项目在主轴方向的对齐方式。
如果Flex项目未填充满一行，该属性会起作用，它会对多出的空间进行分配。
* justify-content:flex-start;
伸缩项目向主轴的起始位置开始对齐，后面的每元素紧挨着前一个元素对齐。
* justify-content:flex-end;
伸缩项目向主轴的结束位置对齐，前面的每一个元素紧挨着后一个元素对齐。
* justify-content:center;
伸缩项目相互对齐并在主轴上面处于居中，并且第一个元素到主轴起点的距离等于最后一个元素到主轴终点的位置。以上3中都是“捆绑”在一个分别靠左、靠右、居中对齐。
* justify-content:space-between;
伸缩项目平均的分配在主轴上面，并且第一个元素和主轴的起点紧挨，最后一个元素和主轴上终点紧挨，中间剩下的伸缩项目在确保两两间隔相等的情况下进行平分。
* justify-content:space-around;
伸缩项目平均的分布在主轴上面，并且第一个元素到主轴起点距离和最后一个元素到主轴终点的距离相等，且等于中间元素两两的间距的一半。完美的平均分配，这个布局在阿里系中很常见。

<img src="https://cdn.css-tricks.com/wp-content/uploads/2013/04/justify-content-2.svg" alt="">

## align-items
`align-items`用来定义Flex项目在侧轴上的对齐方式
* align-items:flex-start;
伸缩项目在侧轴起点边的外边距紧靠住该行在侧轴起点的边。
* align-items:flex-end;
伸缩项目在侧轴终点边的外边距靠住该行在侧轴终点的边。
* align-items:center;
伸缩项目的外边距在侧轴上居中放置。
* align-items:baseline;
如果伸缩项目的行内轴与侧轴为同一条，则该值与[flex-start]等效。 其它情况下，该值将参与基线对齐。
* align-items:stretch;
伸缩项目拉伸填充整个伸缩容器。此值会使项目的外边距盒的尺寸在遵照「min/max-width/height」属性的限制下尽可能接近所在行的尺寸。

![](https://cdn.css-tricks.com/wp-content/uploads/2014/05/align-items.svg)

## align-content
`align-content`用来定义Flex项目多行时在侧轴上的对齐方式。
当`flex-wrap:nowrap;`时，该属性没有效果
* align-content: stretch;
默认值,各行将会伸展以占用剩余的空间。
* 其他可以参考[justify-content]用法

![](//css-tricks.com/wp-content/uploads/2013/04/align-content.svg)

# Flex项目
## order
`order`属性可以指定Flex项目在容器中排列顺序。默认情况下，Flex项目会按照自身在文档流中顺序显示。使用`order`可以改变Flex项目的顺序。
```css
.flex-item{
    order: <integer>; // default is 0
}
```
<img src="//css-tricks.com/wp-content/uploads/2013/04/order-2.svg" alt="">

## flex-grow
`flex-grow`主要用来决定伸缩容器剩余空间（正值）按比例应扩展多少空间
```css
.flex-item{
    flex-grow: <number>; // default 0
}
```
![](//css-tricks.com/wp-content/uploads/2014/05/flex-grow.svg)

## flex-shrink
`flex-shrink`主要用来决定当Flex项目累加长度唱过容器长度时，如何对Flex项目进行收缩处理.
```css
.flex-item{
    flex-shrink: <number>; // default 1
}
```

## flex-basis
`flex-basis`默认是auto也就是根据可伸缩比率计算出剩余空间的分布之前，伸缩项目主轴长度的起始数值。
若在「flex」缩写省略了此部件，则「flex-basis」的指定值是长度零

## flex
`flex`属性是以上三个属性（flex-grow, flex-shrink, flex-basis）的简写
```css
.flex-item{
    flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ];
}
```

## align-self
`align-self`用来在单独的伸缩项目上覆写默认的对齐方式，这个属性是用来覆盖伸缩容器属性align-items对每一行的对齐方式。也就是说在默认的情况下这两个值是相等的。
```css
.flex-item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```
![](//css-tricks.com/wp-content/uploads/2014/05/align-self.svg)

# 浏览器兼容性
下图是从CANIUSE中截取的Flexbox在各个浏览器兼容性情况：
![](/img/flexbox/Flexbox浏览器兼容性.png)

从图中看出目前flexbox在PC端主流浏览器中支持度较高，IE系除了10、11部分支持外，其他均不支持。
在移动端个别浏览器不支持最新flex语法，需要使用旧版语法。
同时针对不同内核需要书写属性前缀：
```css
-webkit-
-mos-
-ms-
```

# 参考资料
* [W3C-Flex](https://www.w3.org/TR/css-flexbox-1/) : CSS Flexible Box Layout Module Level 1
* [Flex guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) : A Complete Guide to Flexbox
* [MDN - Flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/%E5%BC%B9%E6%80%A7%E6%A1%86%E7%9A%84%E9%AB%98%E7%BA%A7%E5%B8%83%E5%B1%80) : 使用弹性盒子进行高级布局
