---
title: ES6——Generator函数学习笔记
date: 2017-11-16 16:09:59
tags: ['ES6']
---
本文是学习阮一峰的[《ECMAScript6 入门》](http://es6.ruanyifeng.com/)的学习笔记

# 基本概念
Generator函数是ES6提供的一种异步编程解决方案

Generator 函数是一个状态机，封装了多个内部状态。

执行 Generator 函数会返回一个遍历器对象(Iterator)，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。
```js
function* gen(){
    yield 1
    yield 2
    return 3
}
let g = gen()
// g.next() 返回的是一个包含value 和 done 的对象
console.log(g.next())  // {value: 1, done: false}
console.log(g.next())  // {value: 2, done: false}
console.log(g.next())  // {value: 3, done: true}
console.log(g.next())  // {value: undefined, done: true}

// or
for(var val of g){
    console.log(val)   // 1  2
}
```

总结一下，调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。

由于 Generator 函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。

遍历器对象的next方法的运行逻辑如下:
（1）遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
（2）下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。
（3）如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
（4）如果该函数没有return语句，则返回的对象的value属性值为undefined。

yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，因此等于为 JavaScript 提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。yield只可以使用在Generator函数中，出现在普通函数体内报错.yield表达式如果用在另一个表达式之中，必须放在圆括号里面

除了for...of循环以外，扩展运算符（...）、解构赋值和Array.from方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。

next()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换yield表达式。
> next()是将yield表达式替换成一个值。
throw()是将yield表达式替换成一个throw语句
return()是将yield表达式替换成一个return语句。

```js
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;

gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));

gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

# yield*表达式
使用`yield*`表达式，在一个Generator函数中调用另一个Generator函数
```js
function* inner() {
  yield 'hello!';
}

function* outer1() {
  yield 'open';
  yield inner();
  yield 'close';
}

var gen = outer1()
gen.next().value // "open"
gen.next().value // 返回一个遍历器对象
gen.next().value // "close"

function* outer2() {
  yield 'open'
  yield* inner()
  yield 'close'
}

var gen = outer2()
gen.next().value // "open"
gen.next().value // "hello!"
gen.next().value // "close"
```
从语法角度看，如果yield表达式后面跟的是一个遍历器对象，需要在yield表达式后面加上星号，表明它**返回的是一个遍历器对象**。这被称为yield*表达式。
实际上，任何数据结构只要有 Iterator 接口，就可以被yield*遍历。
```js
let read = (function* () {
  yield 'hello';
  yield* 'hello';
})();

read.next().value // "hello"
read.next().value // "h"  因为字符串原生支持遍历器
```

# Generator函数的this
Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的prototype对象上的方法。但如果把g当作普通的构造函数，并不会生效，因为g返回的总是遍历器对象，而不是this对象。
Generator 函数也不能跟new命令一起用，会报错。
