---
title: JS模板引擎
date: 2018-01-25 17:54:01
tags: [Javascript]
---

# 常见的几种JS模板引擎

## ArtTemplate
High performance JavaScript templating engine https://aui.github.io/art-template/

性能
![](/img/arttemplate性能图.png)

标准语法
```html
{{if user}}
  <h2>{{user.name}}</h2>
{{/if}}
```
原始语法
```html
<% if (user) { %>
  <h2><%= user.name %></h2>
<% } %>
```

渲染模板
```js
var template = require('art-template');
var html = template(__dirname + '/tpl-user.art', {
    user: {
        name: 'aui'
    }
});
```

[中文文档](http://aui.github.io/art-template/zh-cn/)

## Swig
Swig is an awesome, Django/Jinja-like template engine for node.js.
[项目地址](https://github.com/paularmstrong/swig/)

创建模板
```html
<h1>{{ pagename|title }}</h1>
<ul>
{% for author in authors %}
  <li{% if loop.first %} class="first"{% endif %}>
    {{ author }}
  </li>
{% endfor %}
</ul>
```

渲染模板
```js
var swig  = require('swig');
swig.renderFile('/path/to/template.html', {
    pagename: 'awesome people',
    authors: ['Paul', 'Jim', 'Jane']
});
```

渲染结果
```html
<h1>Awesome People</h1>
<ul>
  <li class="first">Paul</li>
  <li>Jim</li>
  <li>Jane</li>
</ul>
```

语法偏向于python，和JavaScript有点不符