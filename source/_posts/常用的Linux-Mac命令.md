---
title: 常用的Linux/Mac命令
date: 2017-08-26 19:38:21
tags:
---

先安利一下查询Linux命令的网站——[Linux命令大全](http://man.linuxde.net/)

# grep
grep是一个强大的文本搜索命令，并将匹配的行打印出来

## 选项
```shell
-a 不要忽略二进制数据。
-A<显示列数> 除了显示符合范本样式的那一行之外，并显示该行之后的内容。
-b 在显示符合范本样式的那一行之外，并显示该行之前的内容。
-c 计算符合范本样式的列数。
-C<显示列数>或-<显示列数>  除了显示符合范本样式的那一列之外，并显示该列之前后的内容。
-d<进行动作> 当指定要查找的是目录而非文件时，必须使用这项参数，否则grep命令将回报信息并停止动作。
-e<范本样式> 指定字符串作为查找文件内容的范本样式。
-E 将范本样式为延伸的普通表示法来使用，意味着使用能使用扩展正则表达式。
-f<范本文件> 指定范本文件，其内容有一个或多个范本样式，让grep查找符合范本条件的文件内容，格式为每一列的范本样式。
-F 将范本样式视为固定字符串的列表。
-G 将范本样式视为普通的表示法来使用。
-h 在显示符合范本样式的那一列之前，不标示该列所属的文件名称。
-H 在显示符合范本样式的那一列之前，标示该列的文件名称。
-i 忽略字符大小写的差别。
-l 列出文件内容符合指定的范本样式的文件名称。
-L 列出文件内容不符合指定的范本样式的文件名称。
-n 在显示符合范本样式的那一列之前，标示出该列的编号。
-q 不显示任何信息。
-R/-r 此参数的效果和指定“-d recurse”参数相同。
-s 不显示错误信息。
-v 反转查找。
-w 只显示全字符合的列。
-x 只显示全列符合的列。
-y 此参数效果跟“-i”相同。
-o 只输出文件中匹配到的部分。
```

## 案例
在文件中搜索一个单词，命令会返回一个包含“word”的文本
```shell
grep "word" file_name
```

在多文件中查找
```shell
grep "word" file_1 file_2 file_3 ...
```

使用正则表达式选项：
```shell
grep -E "[1-9]+"
或
egrep "[1-9]+"
```

统计文件或者文本中包含匹配字符串的行数 -c 选项：
```shell
grep -c "text" file_name
```

搜索多个文件并查找匹配文本在哪些文件中：
```shell
grep -l "text" file1 file2 file3...
```

在多级目录中对文本进行递归搜索：
```shell
grep "text" . -r -n
# .表示当前目录。
```

在grep搜索结果中包括或者排除指定文件：
```shell
#只在目录中所有的.php和.html文件中递归搜索字符"main()"
grep "main()" . -r --include=*.{php,html}

#在搜索结果中排除所有README文件
grep "main()" . -r --exclude="README"
```


# ifconfig
ifconfig命令被用于配置和显示Linux内核中网络接口的网络参数。
类似于Windows下的`ipconfig`命令

```shell
ifconfig

// You will get it
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
	options=1203<RXCSUM,TXCSUM,TXSTATUS,SW_TIMESTAMP>
	inet 127.0.0.1 netmask 0xff000000
	inet6 ::1 prefixlen 128
	inet6 fe80::1%lo0 prefixlen 64 scopeid 0x1
	nd6 options=201<PERFORMNUD,DAD>
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	ether 8c:85:90:16:4a:94
	inet6 fe80::1465:130e:7d30:991a%en0 prefixlen 64 secured scopeid 0x6
	inet 10.249.23.139 netmask 0xffffff00 broadcast 10.249.23.255
	nd6 options=201<PERFORMNUD,DAD>
	media: autoselect
	status: active
```

inet后面即为IP地址

# du
对文件和目录的磁盘空间使用情况

递归查看当前目录的文件大小（单位B）
```shell
du

// output
32	    ./app-broker-v5/interceptor
57712	./app-broker-v5
289472	.
```

以人类可理解的单位显示大小：
```shell
du -h

// output
 16K	./app-broker-v5/interceptor
 28M	./app-broker-v5
141M	.
```

汇总显示当前目录总大小：
```shell
du -sh

// output
141M  .
```

计算特定文件或文件夹大小：
```shell
du file_name | dir_name
```

# [sed](http://man.linuxde.net/sed)
sed是一种流编辑器，能够配合正则表达式一起使用，功能强大
命令格式：
```shell
sed [option] 'command' file''
```
相当于读取一个文件内容，并对每一行执行一些操作，结果会缓存在临时缓冲区中，进而通过管道流动。也可以直接编辑文件。
例如，编辑文件中某行数据(parser.xxxx.js —> hongxin)：
```shell
sed -i '' "s/\(.*\)parser\.[0-9]*\.css\(.*\)/\1hongxin\2/g" file.js
```

上面`-i`会直接修改文件，`''`则是备份文件，这里没有指定说明没有备份（这并不提倡）。详见`man sed`