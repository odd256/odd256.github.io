---
publish: true
tags:
  - Python
title: 如何管理好Python项目
created: 2025-01-15 21:17:09
updated: 2025-01-20 19:56:27
---

# 为什么不使用 Anaconda？

作为一个 Python 开发者，我一直沉浸在 Anaconda 带来的巨大便利中：

- 多虚拟环境（python 版本）管理
- 安装、删除 Python 第三方库并自动解析依赖

但随着使用的深入，我发现 Anaconda 存在一些严重的问题：

1. **失败的依赖管理**，尽管可以解析依赖关系，但当项目依赖复杂的时候解析的非常慢，有的时候等解析完了直接报错：`无法解析依赖冲突`，我直接一个大崩溃... 白白浪费了时间还没有解决问题
2. **谜一样的项目复现**，有的时候难免需要复现其他人的实验，但 Python 的第三方库受到平台、Python 版本、CUDA 版本等因素的影响，`requirements.txt` 文件会把一大堆无关依赖显示出来，不方便阅读，而且安装好了大概率报错，这导致可能配置实验环境就需要搞半天
3. **Anaconda 太臃肿了**，这算是一个小吐槽，在安装时 Anaconda 的体积就非常大，虽然在换用 `miniconda` 后有缓解问题，但 `conda init shell` 启动过慢导致我打开命令行也会产生很大延时...

# uv 管理工具

[uv](https://github.com/astral-sh/uv) 是一个用 Rust 编写的 Python 包和项目管理器。

安装非常简单，官网一条指令就能完成安装，具体操作见[官方文档](https://github.com/astral-sh/uv)

如何从零开始创建 python 项目？

1. 安装/卸载指定 python 版本 
	-  `uv python install 3.xx`
	- 卸载：`uv python uninstall 3.xx`
	- 查看所有 python 版本：`uv python list`
2. 创建 python 项目
	- `uv init project_name` 如果你想创建一个 python 包项目可以使用：`uv init --package example-pkg`
	- 这个过程会自动在项目目录中创建一个 `.venv` 文件夹，用来存放当前项目的依赖
	- 或者在项目目录下使用 `uv init --python 3.12` 直接指定 python 版本
1. 选择合适的 Python 版本
	- 在创建 python 项目时，会选择默认的 python 版本，可以通过 `uv python pin 3.xx` 对版本进行指定
2. 添加/删除版本依赖
	- `uv add torch==2.2.2` 对依赖进行添加
	- 删除可以使用 `uv remove torch
	- 需要注意的是，好像在添加时直接输入包名即可，例如上面的 Pytorch 我一般都使用 `conda/pip install pytorch` 进行安装，在 uv 中直接使用 `torch` 包名即可
3. 如何从一个新项目中快速导入依赖
	- `uv sync`