---
publish: true
tags:
  - Linux
title: 安装Arch Linux系统
created: 2025-01-19 21:57:12
updated: 2025-01-19 22:46:06
---

> [!note]
> 安装配置：
> - 双硬盘
> - 双系统，一个盘装 Linux，一个盘装 Windows（Windows 已安装）
> - Intel CPU + NVIDIA 显卡的笔记本

> [!attention]
> 由于在安装过程中，需要从仓库下载额外的程序，但这些程序在国内的下载速度非常慢，所以最好提前准备梯子来提高下载速度（本文中的安装过程不需要使用梯子，但日常使用会需要）

1. 下载镜像，推荐使用国内镜像源下载，我使用的是 [USTC 的镜像](https://mirrors.ustc.edu.cn/archlinux/iso/)
2. 使用 [rufus](https://rufus.ie/en/) 工具烧录到 U 盘
3. 在电脑开机时，进入 EFI Setting 界面，并设置 U 盘为第一启动选项，保存并退出（如果你使用过 PE 安装 windows 系统，这些操作应该非常简单）
4. 进入 Arch Linux 的 PE 系统（只有命令行工具）
5. 连接 Wi-Fi（如果你使用有线网络直接联网，这一步可以直接跳过）
	- 先查看物理设备：`ip link`，我的无线网络是 `wlan0`
	- 我的 Wi-Fi 默认是关闭状态（blocked），因此需要先开启 Wi-Fi
		- `rfkill unblock wifi    #取消禁用wifi设备`
		- `ip link set wlan0 up # 开启wlan0`
	- 输入 `iwctl` 进入网络无线管理工具中连接无线网
		- `station wlan0 scan`
		- `station wlan0 get-networks`
		- `station wlan0 connect <network name>`
		- `station wlan0 show`  
		- `exit　　# 回到命令行`
6. 在命令行下输入 `archinstall` 进行安装
	- 如果一直在 check version 中，可以执行 `archinstall --skip-version-check` 跳过版本检查步骤
	- archinstall 脚本中基本上是傻瓜式安装了，需要什么选什么，不过需要注意两点：
		1. 在选择 `Disk Configuration` 时，需要选择安装的硬盘，千万别选成了安装 windows 的那个盘了
		2. `Mirrors` 设置中，选择 `China`，会自动导入国内镜像源，可以加快系统安装的速度
		3. 在 `Network configuration` 中，我选择了直接复制当前网络配置，如果你选择其他网络配置，系统安装好后需要再配置一次才能联网
7. 安装完系统后 `reboot` 就可以进入新系统啦~

为了能够正常下载和更新软件，最好配置两个镜像源（我这里都选择 USTC 的）：

- [Arch Linux 镜像源](https://mirrors.ustc.edu.cn/help/archlinux.html)
- [Arch Linux CN](https://mirrors.ustc.edu.cn/help/archlinuxcn.html)