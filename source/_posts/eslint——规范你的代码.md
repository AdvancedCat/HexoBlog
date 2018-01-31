---
title: eslint——规范你的代码
date: 2018-01-31 11:40:46
tags: ['Javascript']
---

# ESLint

ESLint是目前比较流行的js检查工具，它利用AST处理规则，虽然速度上不及JSLint，但做到了规则完全可配置，收到广泛欢迎。下图看出它们的下载趋势：

![](/img/eslint下载趋势.jpg)

ESLint的目标是提供一个插件化的javascript代码检测工具

# 安装与使用
## Local
一般使用eslint都是搭配项目的，因此本地安装是首选

```js
// 1.安装
yarn add -D eslint

// 2.生成配置文件
./node_modules/.bin/eslint --init 
执行该命令后会进入一个eslint配置的选择题过程，按你的需求简单配置即可，配置内容后面还是可以修改的

// 3.检测你的js文件
./node_modules/.bin/eslint yourfile.js
```

与eslint搭配使用的插件也需要本地安装，谁用谁负责安装，哈哈

## Global
与local类似，仅仅是命令可以全局调用
```js
npm install -g eslint
```

## 与webpack集成
单独使用eslint的话，你需要每次都要手动去调起`eslint xxx.js`，非常麻烦，可以配合构建工具一起使用会更加的方便。
以下与webpack搭配使用（谁叫webpack太火了呢）

首先安装`[eslint-loader](https://www.npmjs.com/package/eslint-loader)`以及`babel-eslint`,后者是更改eslint的解析器，配合babel使用

```js
yarn add -D eslint-loader babel-eslint
```

在`.eslintrc`中配置如下：
```js
module.exports = {
    "extends": "eslint:recommended",
    "env":{
    	"browser": true,
    	"commonjs": true
    },
    "parser": "babel-eslint"
}
```

# 配置
上面提到eslint强大的能力提现在它的可配置性上，简单分析一下它可配置的特性

## 配置文件

一个配置文件大致这个样子的：
```js
module.exports = {
    "extends": "eslint:recommended",
    "env":{
    	"browser": true,
    	"commonjs": true
    },
    "parser": "babel-eslint",
    "globals": {
    	"globalVar": true
    },
    "rules":{
    	"no-console": process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
}
```

* extends
告知eslint默认使用何种规则集合，一般我们使用`eslint:recommended`即可，或者其他业内规范，比如`airbnb`,`google`,`standard`。区别主要在（缩进、引号、换行等方面）
使用其他规范，则安装对应插件即可，如`eslint-config-airbnb`,`eslint-config-google`

* env
用于指定代码的运行环境，根据环境不同，规则也会不同.可以在`.eslintrc`中配置环境，也可以在单个文件中通过注释添加环境：`/* eslint-env node,mocha */`

常见环境配置项有`browser`,`node`,`es6`等.
具体环境可选项，可点击查看[Specifying Environments](http://eslint.cn/docs/user-guide/configuring#specifying-environments)

* parser
ESLint 默认使用`Espree`作为其解析器，你可以在配置文件中指定一个不同的解析器。

> 这个值得研究一下，甚至可以自己写一个解析器。这是了解解析器的切入口

* parserOptions
ESLint 允许你指定你想要支持的 JavaScript 语言选项。默认情况下，ESLint 支持 ECMAScript 5 语法。你可以覆盖该设置启用对 ECMAScript 其它版本和 JSX 的支持。
```js
"parserOptions": {
    "ecmaVersion": 6,   // 支持ES6
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true
    }
}
```

* rules
当我们配置`eslint:recommended`时，eslint会帮助默认开启一些规则，比如`no-console`指定在代码中不可以使用`console`。
此时，我们期望在开发模式下跳过校验，而在生产环境下开启校验，如上配置即可。多种配置方式：
```js
"rules": {
	"eqeqeq": "off",   // 0
	"curly": "warn",   // 1
	"quotes": ["error","double"] // 2 (当被触发的时候，程序会退出)
}
```

更多规则可以查看[eslint默认规则](http://eslint.cn/docs/rules/)

* globals
默认情况下，eslint针对文件未定义的变量会提示错误或警告，例如应用中某个变量`globalVar`可以全局调用。则需要在`globals`
true - 允许变量被重写
false - 不允许变量被重写

***
更多配置项可以前往[eslint配置页](http://eslint.cn/docs/user-guide/configuring)查看

# 扒代码
[eslint主页](https://github.com/eslint/eslint)
未完待续

# 扩展阅读
* [ESLint中文文档](http://eslint.cn/)
