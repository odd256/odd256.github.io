---
title: WSL的折腾之旅
tags:
  - WSL
  - 配置
publish: true
created: 2023-02-08 01:04:00
updated: 2024-02-28 15:29:28
---


# 安装 WSLg

```bash
## 更新所有的源
sudo apt update

## Gedit
sudo apt install gedit -y
```

在vscode中可以运行matplotlib：
![](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/Pasted%2520image%252020221121213950.png)

# 安装 MySQL

## 安装 systemd

由于 mysql 是依赖于 systemd 才能启动的，因此在安装 mysql 之前，需要先启用 systemd

systemd 就相当于 windows 中的任务管理器，它负责 Linux 系统中所有 service 的管理，service 被一个“unit file”所管理，`unit file` 中详细定义了服务的名称、启动顺序、启动依赖等等...

在 WSL 中，由于历史问题，WSL 一开始是不支持 systemd 的，但后来逐渐支持并默认不启用 systemd 功能，因此需要进行**手动开启**，开启方式如下：

1.  在命令行中输入：

```shell
sudo vi /etc/wsl.conf
```

2.  打开并编辑 `wsl.conf` 文件：

```
[boot]
systemd=true
```

3.  关闭并重启 WSL

```shell
exit # 退出当前会话
wsl --shutdown # 关闭WSL
wsl ~ # 打开wsl并进入~目录
```

## 安装 MySQL

按照官方文档操作：[使用 WSL 添加或连接数据库 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-database)

命令一股脑的列在了下面，一个个执行就完事了：

```shell
sudo apt update # 更新索引
sudo apt install mysql-server # 安装mysql
mysql --version # 验证是否安装完成，并输出版本号
sudo mysql_secure_installation # 首次进行安装，会设置密码等
```

安装完成后是一些常用的指令，罗列如下：

```shell
sudo /etc/init.d/mysql start # 启动mysql服务
mysql -u root -p # 进入mysql
```

```mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '你的密码';  # 修改密码
```

## 我踩到的坑

`mysql_secure_installation`在我的WSL上好像没有那么好用，中间报错，我强制退出了，重新进入时mysql要求我输入密码，默认的密码位置如下：

```shell
sudo cat /etc/mysql/debian.cnf
```

输出内容如下：

```
# Automatically generated for Debian scripts. DO NOT TOUCH!
[client]
host     = localhost
user     = debian-sys-maint
password = ugUio5lg73EqTGFB
socket   = /var/run/mysqld/mysqld.sock
[mysql_upgrade]
host     = localhost
user     = debian-sys-maint
password = ugUio5lg73EqTGFB
socket   = /var/run/mysqld/mysqld.sock
```

其中 mysql_upgrade 中的 password 就是我们的默认密码

# 代理配置

## 2023-12-24 更新

在 wsl2 的 2.0 以上版本中，wsl2 可以和主机共享代理

1. 首先使用命令 `wsl -v` 查看 wsl2 的版本：
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/202312240033042.png)

2. 如果你的 wsl2 版本大于 2.0，那么就可以在 `C:\Users\<your_username>` 中创建 `.wslconfig` 文件，并写入以下内容：
	```shell
	[experimental]
	autoMemoryReclaim=gradual  
	networkingMode=mirrored
	dnsTunneling=true
	firewall=true
	autoProxy=true
	```

3. 使用 `wsl --shutdown` 关闭并重启即可


-----
- 使用软件：Clash For Windows
- 配置如图：
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230501005858.png)
CFW 的配置较为简单，需要分别打开 `Allow LAN` 按钮和 `System Proxy` 按钮

难点在 WSL 里的代理设置，设置代码如下：
```shell
###
# 由于wsl的ip地址是随机分配的，
# 因此我们每次登录shell需要重新获取当前wsl的ip
###
export HOSTIP=$(cat /etc/resolv.conf | grep "nameserver" | cut -f 2 -d " ")
export http_proxy="http://$HOSTIP:7890"
export https_proxy="http://$HOSTIP:7890"
export all_proxy="socks5://$HOSTIP:7890"
export ALL_PROXY="socks5://$HOSTIP:7890"
```

```shell
###
# 这段代码比上一段代码好在可以随时设置代理的状态
# 需要使用代理时命令行输入setp
# 不需要使用代理时命令行输入unsetp
###
hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*') 
alias setp='export https_proxy="http://${hostip}:7890";export http_proxy="http://${hostip}:7890";export all_proxy="socks5://${hostip}:7890";export ALL_PROXY="socks5://${hostip}:7890";'
alias unsetp='unset https_proxy; unset http_proxy; unset all_proxy; unset ALL_PROXY;'
```

将内容添加到 `~/.zshrc` 文件中，并输入 `source .zshrc` 进行环境变量刷新
使用 `curl www.google.com -v` 可以测试代理是否正常工作

## 我踩到的坑

在做完上述步骤后，使用测试命令 `curl www.google.com -v` 并没有成功输出，反而是一直卡在连接步骤，后来查询资料后发现是没有配置 windows 防火墙！

防火墙配置步骤：
- 找到设置位置：控制面板->系统和安全->Windows Defender 防火墙->允许应用通过 Windows 防火墙
- **点击更改设置**，选中 CFW 应用，并**点击下方确定按钮保存**
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230501010857.png)

配置完后，就能成功访问 Google 了

# WSL 调用摄像头

在 windows 下，摄像头可以通过 python 的 opencv 库进行访问，但是相同的代码移动到 WSL 后，会提示找不到摄像头设备，因此我们需要通过一定的方法打通 windows->WSL 的摄像头数据流，最终我采用的方案是 ffmpeg
[WSL2 中获取摄像头数据流 – IYATT-yx 的博客](https://blog.iyatt.com/?p=10249)

## 配置 ffmpeg

1. 在 github 上找到对应的 [ffmpeg](https://github.com/BtbN/FFmpeg-Builds/releases)，并下载解压
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230830132708.png)

2. 配置环境变量
	在系统环境变量中，配置 `ffmpeg/bin` 的 `Path` **用户环境变量**
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230830132905.png)
	配置好后在命令行中运行 `ffmpeg` 可以得到如下结果：
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230830132957.png)

## 创建 ffmpeg 视频流

1. 查询 WSL 的 ip
	在 WSL 中，使用 `ip addr show` 查看 ip
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230830133519.png)
2. 查询摄像头名称
	在 windows 中，使用命令 `ffmpeg -list_devices true -f dshow -i dummy` 查询设备名称
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230830133621.png)
3. 发送数据流
	在 windows 中，使用 `ffmpeg -f dshow -i video="摄像头名称" -preset ultrafast -tune zerolatency -vcodec libx264 -f mpegts udp://[IP]:[Port]` 发送数据流，**摄像头名称**就是 step 2 中我们查询的 windows 设备名称，**IP** 就是 step 1 中我们查询的 WSL ip，**Port**随意，只要是没被占用的就行
> [!example]
> 下面是一个操作案例：
> ```shell
> ffmpeg -f dshow -i video="Integrated Camera" -preset ultrafast -tune zerolatency -vcodec libx264 -f mpegts udp://172.21.1.88:5555
> ```
> 结果如图所示：
> ![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230830134308.png)

##  WSL 访问摄像头数据流

因为已经是 udp 数据流了，因此访问的方法有很多，下面以 opencv-python 为例：
```python
import cv2

# Configuration
address = "udp://localhost:5555"

# Access video
cap = cv2.VideoCapture(address)

if not cap.isOpened():
    raise Exception("no video stream")

while cap.isOpened():
    ret, frame = cap.read()
    if ret:
        cv2.imshow("frame", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
```