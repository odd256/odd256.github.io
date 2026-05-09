---
publish: true
tags:
  - quartz_plugin
title: remark42
created: 2024-05-04 01:47:16
updated: 2026-01-29 17:24:55
---

> [!tip]
> remark42 需要部署服务器来提供服务，我使用了 [serv00](https://serv00.com/) 提供的免费服务器部署

serv00 服务器是 FreeBSD 系统，没有 root 权限，想要白嫖 serv00 需要实现以下功能：

1. 安装并配置 remark42 服务
2. 自动 SSH 登录，serv00 要求每 3 个月登录一次才能保证实例不会被销毁，因此需要通过定时任务，每隔一段时间进行登录
3. 开机启动服务，serv00 会不定时重启，通过 pm2 配置重启后自动开启服务实现保活

最后在 quartz 中配置 remark42 能够正常使用就可以了！

> [!quote]
> 更多关于 serv00 的玩法可以参考 [ Saika 大佬的博客](https://blog.rappit.site/2024/01/27/serv00_logs)

# 准备工作

> [!notice]
> serv 00 的注册和申请不过多赘述，点点就能完成，需要注意在使用 SSH 连接主机时，主机地址为 `username.serv00.net`

在安装 remark 42 之前，需要在 serv 00 的 panel 中添加随机端口，步骤如下：

1. 登录 panel
2. 点击 port reservation
3. 点击 Add port，勾选 random，添加
4. 记住端口号，待会要用

除此之外，还需要添加一个服务代理以便服务映射到对应的域名，步骤如下：

1. 登录 panel
2. 点击 WWW websites
3. 点击 Add new website，域名填 `remark.username.serv00.net` 
4. 点击 Advanced settings
5. 选择 Proxy，localhost，端口选择刚刚添加的端口

为了能够正常使用评论系统，我们还需要配置 SSL 证书，让协议从 http 变成 https~~（这一步我好像浪费了每周的申请次数，暂时还没搞好，所以评论暂时不能用）~~：

1. 登录 panel
2. 点击 WWW websites
3. 点击 Manage SSL certificates，添加随机生成的证书

安装 pm2:

```shell
bash <(curl -s https://raw.githubusercontent.com/k0baya/alist_repl/main/serv00/install-pm2.sh)
```

# 安装配置 remark42

在 [Releases · umputun/remark42 (github.com)](https://github.com/umputun/remark42/releases) 中找到对应 remark42 的安装包（serv00 使用的是 FreeBSD），下载至 serv00：

```shell
wget https://github.com/umputun/remark42/releases/download/v1.12.1/remark42.freebsd-amd64.tar.gz
```

解压到刚刚创建的代理位置（domains/username.serv00.net_subdomain/public_html）下：

```shell
tar -xzf remark42.freebsd-amd64.tar.gz -C domains/username.serv00.net_subdomain/public_html && rm -rf remark42.freebsd-amd64.tar.gz
```

测试 remark42，具体参数含义可以参考[官方文档](https://remark42.com/docs/configuration/parameters/)，其中有两个参数需要注意，（1）url 需要填上面填写的子域名，这样 remark 才能正确识别 proxy（2） PORT 就是上面添加的端口：

```shell
./remark42.freebsd-amd64 server --secret=shared_secret_key --url=remark.username.serv00.net --port=PORT --site=digital_garden --auth.github.cid=CID --auth.github.csec=CSEC --auth.same-site=none
```

使用 pm2 启动服务

```shell
pm2 start ./remark42.freebsd-amd64 -- server --secret=shared_secret_key --url=remark.username.serv00.net --port=PORT --site=digital_garden --auth.github.cid=CID --auth.github.csec=CSEC --auth.same-site=none
```

# 自动任务

创建自动登录代码，记得修改其中的用户名@地址和密码：

```shell
cat > auto_connect.sh << EOF
#!/bin/bash

while true; do
  sshpass -p '密码' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -tt 用户名@地址 "exit" &
  sleep 259200  #30天为259200秒
done
EOF
```

添加执行权限：

```shell
chmod +x auto_connect.sh
```

使用 pm2 启动服务：

```shell
pm2 start ./auto_connect.sh
```

之后需要在 panel 中设置定时任务，保证每次重启后可以自动执行 pm2 的任务：

1. 登录 panel
2. 点击 Cron jobs
3. 点击 Add cron job
4. 设置启动时间为：After reboot，Form type 选择 Advanced，命令为：`/home/你的用户名/.npm-global/bin/pm2 resurrect`

最后保存快照：

```shell
pm2 save
```

> [!note]
> - 最后分享一些 pm2 的常用命令：
> 	1. `pm2 list`  查看 pm2 管理的数据
> 	2. `pm2 delete idx` 根据 index 删除 list 中的任务
> 	3. `pm2 save` 保存当前任务

# quartz 插件

> [!quote]
> 为了能在 quartz 中使用，需要自定义前端代码，我参考了[OCDkirby/remark42.quartz](https://github.com/OCDkirby/remark42.quartz)

将代码放入指定位置后，需要创建一个挂载点 load 评论的前端页面，我放在了 `quartz/components/Footer.tsx` 中：`<div id="remark42"></div>`
