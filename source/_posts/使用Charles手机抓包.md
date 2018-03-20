---
title: 使用Charles手机抓包
date: 2018-03-20 21:47:51
tags: 
---

在进行web touch端开发时，需要捕获请求接口分析，对数据的正确性分析。此时有必要通过抓包工具抓取数据包，本文分析使用Charles达到抓包目的。

# Charles

[Charles官网](https://www.charlesproxy.com/)

Charles天生适合抓取移动端数据包，它会在PC侧设置为系统的网络代理服务器，使得所有的网络访问都通过它来完成。它可以抓取HTTP和HTTPS请求。

[这里有详细安装设置教程](http://blog.devtang.com/2015/11/14/charles-introduction/)


# Tips

教程中对安装设置已经很详细，但是我在设置HTTPS抓包始终有问题，包都是unkonwn的，说明安装在手机端的证书没有生效。

如果你的手机现在是 10.3 以上系统，但是之前手机是 10.3 以下的系统，并且你以前用 Charles 调试过，那么你就不会出现“SSLHandshake: Received fatal alert: unknown_ca”的问题。如果你是第一次用 10.3 以上系统手机去调试，你就出问题了。当你按照正常步骤把一切证书安装好后，发现调试 HTTPS 的时候全是x，抓不到包。

我明明安装了 Charles 的证书，为什么抓 HTTPS 包会失败呢？因为 10.3 以上系统需要你在“证书信任设置”中信任 Charles 的证书。

通用 -> 关于本机 -> 证书信任设置 -> 选择 Charles 的证书打开
![](/img/charles5.png)

问题点[这里](https://www.ianisme.com/ios/2502.html)
