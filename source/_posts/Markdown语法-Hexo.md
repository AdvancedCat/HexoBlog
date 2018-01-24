---
title: Markdown语法(Hexo)
date: 2017-01-28 13:08:29
tags:
---

## 内容目录

## 斜体和粗体
```markdown
*斜体*  **粗体**
```
*这是斜体*
**这是粗体**

## 分级标题
在行首加#号表示不同级别的标题 (H1-H6)，格式如下：
```markdown
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

## 分割线
在单行中使用`***`或者`---`表示分割线

***
上面是分割线

---
我也是分割线

## 删除线
使用`~~`表示删除线
```markdown
~~我是一行错误的文本段。~~
```
~~我是一行错误的文本段。~~

## 超链接
文字超链接：
```markdown
[链接文字](链接地址 "链接名称")
鼠标hover到链接上会显示链接名称
```
[百度](http://www.baidu.com "这是百度网地址")


图片超链接：
```markdown
![图片说明](图片链接 "图片标题")
```
![Google](https://www.google.com/logos/doodles/2018/sergei-eisensteins-120th-birthday-5380775741489152-law.gif "纪念电影人")


引入视频则直接插入`iframe`代码：
```js
<script src="/js/youtube-autoresizer.js"></script>
<iframe width="640" height="360" src="https://www.youtube.com/embed/HfElOZSEqn4" frameborder="0" allowfullscreen></iframe>
```
<script src="/js/youtube-autoresizer.js"></script>
<iframe width="640" height="360" src="https://www.youtube.com/embed/HfElOZSEqn4" frameborder="0" allowfullscreen></iframe>

## 注释
用`\`表示注释，`\`后面的文字解析为纯文本格式
即`\`的作用相当于转义
如：
\#这不是一级标题

## 引用
使用`>`表示文字引用

> 这是被引用的一段文字

## 列表
* **使用`+ - *`表示无序列表**

```markdown
+ 大列表1
  - 中列表1
    * 小列表1
+ 大列表2
```

+ 大列表1
  - 中列表1
    * 小列表1
+ 大列表2

* **使用`数字.`表示有序列表**
```markdown
1. 大列表
 1. 中列表
2. 大列表
```

1. 大列表
 1. 中列表
2. 大列表


## 表格
绘制表格格式如下，`|` 控制分列，`-` 控制分行，`:` 控制对齐方式。
```markdown
| Item     | Value     | Qty   |
| :------- | --------: | :---: |
| Computer | 1600 USD  | 5     |
| Phone    | 12 USD    | 12    |
| Pipe     | 1 USD     | 234   |
```

| Item     | Value     | Qty   |
| :------- | --------: | :---: |
| Computer | 1600 USD  | 5     |
| Phone    | 12 USD    | 12    |
| Pipe     | 1 USD     | 234   |

## 代码块
使用连续三个\`\`\`包裹代码块

```js
// javascript
var name = 'xinhong'
```

```python
// python
def getName():
	return 'xinhong'
```