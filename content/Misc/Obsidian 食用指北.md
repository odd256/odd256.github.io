---
title: Obsidian 食用指北
tags:
  - Writing
publish: true
created: 2024-02-28 15:27:52
updated: 2024-02-29 01:25:20
---

# 插件分享

[Obsidian](https://obsidian.md/) 是一个全平台笔记软件，总结了一些插件分享如下：
- 插件分享：
	- [Remotely save](笔记备份与同步.md) ⭐：多端同步工具，存储使用的是云对象存储
	- Linter⭐：自动格式化笔记
	- Admotion：用来个性化 callout
	- Commander： 创建快捷按钮
	- Easy Typing ⭐：可以强化文字输入体验，包括自动大小写、括号补全等
	- Latex Suite⭐：扩展 Latex 语法，让公式输入速度起飞
	- Obsidian Git⭐：备份工具，可以备份到指定代码仓库
	- Ozan's Image in Editor Plugin：可以在源码模式看到图片，提高码字效率，不习惯也可以使用 Obsidian 自带的 live preview 模式
	- Word Splitting for Simplified Chinese in Edit Mode and Vim Mode：中文分词
	- Shell commands⭐：究极好用的命令行工具，可以通过命令行完成你想完成的任何操作！

# 自定义功能

虽然上面列举了很多插件，但这些插件的自定义程度很高，为了更好的使用，我分享了一些我自己常用的插件设置

## 一键发布

^f10318

使用到的插件：
1. Commander
2. Shell commands

步骤：
1. 在 Shell commands 中设置 shell 语句，windows 中为：`xcopy "{{file_path:absolute}}"  "{{_blog_path}}\{{folder_path:relative}}\" /y`，其中 `_blog_path` 是全局自定义变量，是博客中存放笔记的位置，需要自行在 Shell commands 的 Variables 菜单中配置
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/202402281621171.png)
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/202402281621963.png)
2. 在需要的地方右击创建图标，并设置为点击执行 Shell commands 中刚刚设置的指令

## metadata 自动补全

^a33f83

使用到的插件：
1. Linter

步骤：
1. 设置 Linter 触发条件
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/202402281631187.png)
2. 在 yaml 的 panel 中设置文章标题
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/202402281632734.png)
3. 在 yaml 的 panel 中设置文章创建和修改时间
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/202402281633875.png)

设置完成后，只要按住 ctrl+s 或转到新的笔记就会更新 metadata