---
title: 读懂package.json
date: 2017-03-12 09:57:34
tags: ['Node']
---

作为一个前端工程师，不断地去学习前端新技术是必须的。在这过程中，不断接触开源项目是必不可少的。github上的开源项目，我们发现大多数项目下都有一个package.json文件，package.json存储的是一个严格的json对象。那么今天分析一下package.json中的字段意义。
> 本文主要是对[npm document](https://docs.npmjs.com/files/package.json)中`package.json`的简单翻译

### name
在package.json中最重要的两个字段是name和version，如果没有这两个字段，npm无法安装你的包。name和version就像是你的项目身份证，且必须是唯一的。如果你的包做了改动，那么version也应该改动。        
一些规则：
* name少于214字符
* name不可以以`.`和`_`开头
* name应是URL安全的字符，因为name会出现在URL中（`git clone XXX`）

### version
version应满足`[major, minor, patch]`的格式，version必须能够被`node-semver`解析的. [semver](https://docs.npmjs.com/misc/semver)给出了version的规则限定。

### description
项目的描述信息

### keywords
项目的一些关键字。有助于用户通过关键字搜索到你的项目

### homepage
一个指向你项目主页的url

### bugs
当用户发现了你的bugs时，可以在这里找到你并反馈给你：
```js
{
   "url" : "https://github.com/owner/project/issues",
   "email" : "project@hostname.com"
}
```

### license
指明你的项目许可证，让用户知道以何种权限使用你的项目

### people fields: author, contributors
宣誓你主权的地方啦
```js
"author":{
    "name": "xinhong",
    "email": "xinhong@anjuke.com"
}
```

### files
表明项目下的哪些文件是重要的。效果类似于`.gitignore`文件，区别是前者包含性，后者排除性。

### main
指向你项目入口文件。比如项目名为foo，那么用户需要使用你的项目时，需要书写代码`require('foo')`,并且你的入口文件需要抛出这个对象

### repository
指明你的项目仓库地点。这有助于其他人能够帮助你一起维护项目，最常见的就是GitHub仓库啦：
```js
"repository" :
 {
    "type" : "git",
    "url" : "https://github.com/npm/npm.git"
 }
```

### scripts
scripts包含了在项目开发过程会使用的脚本命令，我们可以运行`npm run command-name`来执行它们：
```js
"scripts":{
   "start": "node server.js"
}
```

### dependencies
**For production**: 指明你项目生产环境时的依赖，即别人使用你的项目代码时必须依赖某些插件方可使用。在这里需要特别说明一下关于依赖项目version的范围规则：
> 版本号满足范式： major.minor.patch 即 主版本.次版本.补丁

* version :必须满足规定的版本
* \>version  :大于某个版本
* \>=version :大于等于某个版本
* <version  :小于某个版本
* <=version  :小于等于某个版本
* ~version :大约等于某个版本。若指明minor，不允许超越minor;若未指明minor，则minor可变
* ^version  :兼容性版本。从左非零版本数值限定，之后版本数值可变
* 1.2.x  :指定某个版本数值可变
* http://...  :指定链接
* \*  :任意版本
* ...

```js
// ~
~1.2.3 := >=1.2.3 <1.(2+1).0 := >=1.2.3 <1.3.0
~1.2 := >=1.2.0 <1.(2+1).0 := >=1.2.0 <1.3.0 (Same as 1.2.x)
~1 := >=1.0.0 <(1+1).0.0 := >=1.0.0 <2.0.0 (Same as 1.x)
~0.2.3 := >=0.2.3 <0.(2+1).0 := >=0.2.3 <0.3.0
~0.2 := >=0.2.0 <0.(2+1).0 := >=0.2.0 <0.3.0 (Same as 0.2.x)
~0 := >=0.0.0 <(0+1).0.0 := >=0.0.0 <1.0.0 (Same as 0.x)

// ^
^1.2.3 := >=1.2.3 <2.0.0
^0.2.3 := >=0.2.3 <0.3.0
^0.0.3 := >=0.0.3 <0.0.4
```

### devDependencies
**For development**: 当其他开发者需要继续开发你的项目时，需要安装的依赖。

### engines
用于指明你的项目运行依赖的node版本或npm版本
```js
{
    "engines":{
       "node": ">=0.10.3",
       "npm": "~1.0.20"
}
}
```

更多的参数可以查看[这个文档](https://docs.npmjs.com/files/package.json)

@update
今天在看[Yarn](https://yarnpkg.com/zh-Hans/)文档的时候，发现有一篇文章对package.json的解析夜挺到位的，[贴出来](https://yarnpkg.com/zh-Hans/docs/package-json)供大家参考
