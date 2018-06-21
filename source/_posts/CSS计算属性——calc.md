---
title: CSS计算属性——calc
date: 2018-06-21 17:13:40
tags: ['CSS']
---

## 概述
calc是CSS3提出用于计算CSS属性的函数，在任何需要计算如lenght、percent、time、number等地方都可以使用它。

calc可以嵌套，当在calc中出现另一个calc计算函数时，可以简单认为是一个括号：
```css
.one-style{
    width: calc( calc(10px / 2) + 20% );  // 相当于 width: calc( ( 10px / 2 ) + 20% );
}
```

## 语法
```css
/* property: calc(expression); */
width: calc(100% - 10px);
```
表达式expression可以是任意四则运算（+、-、*、/）组合的数学表达式，借助括号来调整计算优先级。
可以使用百分比、px、em、rem等单位；
可以混合使用各种单位进行计算。

> * 除法运算时，除数不可以是0，否则HTML报错
* 运算符（特别是+或-）两边始终保留空白符，否则会被认为是正负号处理

## 性能
在现代浏览器中（Chrome,FF）,CSS渲染引擎独立于JS引擎，因此不再担心性能问题。根据[这个benchmark](https://jsperf.com/css-calc-benchmarking)可以看出，calc计算属性的耗时和直接赋值属性的耗时相当。
在旧版本浏览器中（IE78），calc的性能则相对较慢，在小范围仍可使用，尽量减少计算复杂度。如`calc( 100% / 3 - 2 * 1em - 2 * 1px)`就算比较复杂了。
移动端嘛，尽管使用它吧。

## 兼容性
firefox 4.0+已经开支支持calc()功能，需要使用-moz-calc()私有属性；
chrome从19 dev版，开始支持私有的-webkit-calc()写法；
IE9支持原生写法，calc()；

