---
publish: true
tags:
  - Linux
  - Hyprland
title: 从零开始的Hyprland
created: 2024-11-28 21:54:40
updated: 2026-02-02 22:47:31
---

> [!note]
> Hyprland 是一个 Linux 下的窗口管理器，但它是为 Wayland 环境设计的，而 Wayland 是一个显示服务器协议。简单来说，Hyprland 可以提供好看的桌面，它是基于 Wayland 协议的。在本文中的配置是基于Arch Linux + Hyprland 构建的，其他发行版类似，Hyprland 入坑之旅就开始啦🥳
> 需要注意的是，这是一个入门~~（入坑）~~教程，现在基本上把 Arch Linux 作为我的主力系统了，随着我的深入使用这篇文章还会持续更新，现在围绕的主题还是 hyprland，欢迎随时评论交流~

> [!attention]
> 在使用 Hyprland 时，请**仔细阅读** [Hyprland wiki](https://wiki.hyprland.org/)，wiki 上能解决你的大部分问题

# Nvidia GPU 带来的问题

由于众所周知的原因，Linux 对 Nvidia 显卡的支持还不完善，目前还存在以下使用问题，如果你是一个 Nvidia 显卡的玩家，但又不愿意折腾，请慎重使用 Hyprland（AMD 显卡用户狂喜）：

- [ ] 笔记本为 Nvidia 独显时，外接显示器无法显示。
	- 需要关闭混合模式，并在 BIOS 中屏蔽集显才能正常使用，具体操作方法可见 [Hyprland wiki-Nvidia Secition](https://wiki.hyprland.org/Nvidia/)
- [ ] 在 Electron 软件中，会无法出现使用输入法或 UI 模糊问题
	- 这是由于 Electron 默认在 XWayland 协议下运行（可以在 `hyprctl clients` 命令下查看程序的具体协议）一些 Wayland 功能不支持导致的
	- 为了能正常使用 app，可以在启动程序中，添加参数解决，具体步骤如下：
		1. 复制桌面文件 `/usr/share/applications/xxx.desktop` 到 `.local/share/applications/` 目录下
		2. 打开刚刚复制后的文件，在 `exec xxx` 末尾添加 `--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime`
		3. 重启软件即可

如果你不爱折腾，接受不了以上痛点，也可以使用 Arch Linux 的发行版，比如：EndeavourOS、ManjaroOS 等作为主力系统也完全没问题！

在我这段时间的体验中，我感受到了 Linux 的美好，包括但不限于：高度定制化的系统美化、方便快捷的包管理方式、活跃且包容的社区氛围、~~不断查资料阅读的爽快体验~~，所以如果你厌倦了 Windows，相信我，Linux 是打开计算机新大门的钥匙！

---
> [!tip]
> Arch Linux 的详细安装过程可以查看[安装Arch Linux系统](安装Arch%20Linux系统.md)

# 安装 Hyprland

我是个懒虫，`Hyprland` 的安装配置过于繁琐，为了能直接体验，我选择了使用第三方 [HyDE](https://github.com/HyDE-Project/HyDE) 进行安装，安装后可以直接使用


> [!note]
>  工具推荐：
>  - [Fcitx5](Fcitx5%20安装教程.md)：一个特别好用的输入法框架！