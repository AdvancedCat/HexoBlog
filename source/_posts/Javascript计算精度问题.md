---
title: Javascript计算精度问题
date: 2017-10-29 15:01:45
tags: [Javascript]
---

Javascript是弱类型语言，在进行浮点数计算时会有误差出现（这在很多语言中都是存在的，只是其他语言内部会去规避误差风险）。如果系统中有较多的浮点数计算步骤且对计算结果有准确度要求，则需要手动书写代码去规避。如下：

![image.png](http://upload-images.jianshu.io/upload_images/280956-0e24421bc8f4c197.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

解决的主要思路是将浮点数转换为整数进行计算，然后再转换为正确结果。

## 双数四则运算

以下代码可以参考：

```js
//加法函数
function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
}

//减法函数
function accSub(arg1,arg2){
     var r1,r2,m,n;
     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
     m=Math.pow(10,Math.max(r1,r2));
     //last modify by deeka
     //动态控制精度长度
     n=(r1>=r2)?r1:r2;
     return ((arg1*m-arg2*m)/m).toFixed(n);
}

//乘法函数
function accMul(arg1,arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}

//除法函数
function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    with(Math){
		r1=Number(arg1.toString().replace(".",""));
		r2=Number(arg2.toString().replace(".",""));
		return accMul((r1/r2),pow(10,t2-t1));
	}
	
}

// 可以绑定至Number原型链上方便调用
Number.prototype.add = function(arg){
	return accAdd(this,arg)
}
Number.prototype.sub = function(arg){
	return accSub(this,arg)
}
Number.prototype.mul = function(arg){
	return accMul(this,arg)
}
Number.prototype.div = function(arg){
	return accDiv(this,arg)
}

console.log('0.1+0.2=',(0.1).add(0.2))
console.log('10.3-9.2=',(10.3).sub(9.2))
console.log('8.1*0.7=',(8.1).mul(0.7))
console.log('0.21/0.7=',(0.21).div(0.7))
```




## 多数据三则运算

以下代码仅列出了三则运算：加减乘。并未列出除法运算，因为除法本身具有特殊性，无法保证所得结果一定是除的尽的。 

会用到的工具函数：

```js
// 获得数据的小数部分 2.25 -> 25
function getDecimals(num){
	if(num == void 0){
		return ''
	}

	var arr = (''+num).split('.')
	return (arr.length > 1 ? arr[1] : '')
}

// 获得一列数中小数点后位数的最大值  [0.25, 6.2598] -> 4  
function getMaxDecimalBits(args){
	var i, m = 0, len, t

	if( !args || !args.length) return 0;

	len = args.length

	for( i = 0; i < len; i++){
		t = getDecimals(args[i]).length
		m = t > m ? t : m
	}

	return m
}
```



算法思想都是一致的，取得一列数中小数点位数最大数，各乘以最大公因子。再对最后的结果进行处理。

### 加法

```js
function addNum(){
	var args = [].slice.call(arguments),
		len = args.length,
		result = 0,
		m = 0, i, factor

	if(!len) return 0;

	m = getMaxDecimalBits(args)
	factor = Math.pow(10, m)

	for( i = 0; i < len; i++){
		result+=(args[i] * factor)
	}

	return result / factor
}
```

### 减法

```js
function subNum(){
	var args = [].slice.call(arguments),
		len = args.length,
		result, m, i, factor

	if(!len) return 0;

	m = getMaxDecimalBits(args)
	factor = Math.pow(10, m)

	result = args[0] * factor
	for( i=1; i<len; i++){
		result -= (args[i] * factor)
	}

	return result / factor
}
```

### 乘法

```js
function multiNum(){
	var args = [].slice.call(arguments),
		len = args.length,
		m, factor, i, result = 1

	if(!len) return 0;

	m = getMaxDecimalBits(args)
	factor = Math.pow(10, m)

	for(i=0; i<len; i++){
		result *= (args[i] * factor)
	}

	return result / Math.pow(factor, len)
}
```

