---
publish: true
tags:
  - Linux
  - 输入法
title: Fcitx5 安装教程
created: 2024-11-30 13:28:04
updated: 2026-01-29 17:44:21
---

[fcitx5](https://github.com/fcitx/fcitx5) 是一个很好用的输入法框架，配合 [fcitx5-rime](https://github.com/fcitx/fcitx5-rime) 工具可以实现**全平台中文输入**，缺点在于配置较多，难上手，所以这篇文章以 Arch Linux 为例，安装了一个中文输入法，其他平台类似...

# 安装必要工具

在 Arch Linux 中，我喜欢使用 paru 进行包管理，这样即便是词库有新版本也可以直接通过 `paru -Syu` 更新

```shell
paru -S fcitx5-im # fcitx5 输入法框架，全部安装
paru -S fcitx5-rime # rime 引擎
paru -S rime-ice-git # 非常好用的词库
paru -S fcitx5-themes-candlelight # Linux输入法皮肤
```

# 配置输入法

1. 输入法开机自启：
	- gnome 可以通过 gnome-shell-extension 扩展来进行配置
	- hyprland 可以通过添加 `exec-once = fcitx5 --replace -d` 配置
2. 输入法默认行为和词库配置：我的**双拼方案**在 [rime_backup](https://github.com/odd256/rime_backup) 中，自定义配置可以参考 [rime-ice-wiki](https://dvel.me/posts/rime-ice/)
3. 配置输入法皮肤：
	- windows 平台，参考 [weasel](https://github.com/rime/weasel)
	- macOS 平台，参考 [squirrel](https://github.com/rime/squirrel)
	- Linux 平台，我使用了[fcitx5-mellow-themes](https://github.com/sanweiya/fcitx5-mellow-themes) 皮肤
		- 切换已有皮肤只需修改 `~/.config/fcitx5/conf/classicui.conf` 中的内容 `Theme=spring` 即可

```shell
# ~/.config/fcitx5/conf/classicui.conf
# 垂直候选列表
Vertical Candidate List=False

# 按屏幕 DPI 使用
PerScreenDPI=True

# Font (设置成你喜欢的字体)
Font="Smartisan Compact CNS 13"

# 主题(这里要改成你想要使用的主题名，主题名就在下面)
Theme=spring
```

> [!note]
> 在 windows 下使用输入法，实现双拼自由，可以看看这篇笔记哦 ➡️ [ 教练，我想学打字！](../Misc/教练，我想学打字！.md)