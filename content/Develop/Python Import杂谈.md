---
title: Python Import杂谈
tags:
  - Python
publish: true
created: 2023-03-14T19:45
updated: 2024-02-26T12:38
---

- 参考资料：
	-  [【python】关于import你需要知道的一切！一个视频足够了_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1K24y1k7XA/)

# 事情起因

最近在阅读别人的文章，读完了大半部分打算跟着作者开源的代码看看实现细节，结果装好了依赖，跟着输入readme.md的命令，一运行就直接报错：`ModuleNotFoundError: No module named 'project'`，本来以为可能是缺少了必要的`__init__.py`文件导致编译器无法识别，但是在多次尝试后仍然无效，在查找了大量的资料后，我才发现`import`没我想象中那么简单...

# 概念引入

## Module和Package

- Module 表示的是模块，通常是一个 `.py` 文件，在操作系统中，对应的是一个**文件**，<mark style="background: #FF5582A6;">Module 是一个 Python Object</mark>
- Package 表示的是包，通常是一个层级目录，在操作系统中，对应的是一个**文件夹**

在官方文档的描述中，Package就比Module多了一个`__path__`属性
在 Python3中，一个文件夹就是一个 Package，不需要 `__init__.py` 文件

__init__.py 通常出现在 Package 中，当在 Python 文件中导入 Package 时，先找到对应的 Package，然后查看是否存在__init__.py 这个文件，如果有就运行，如果没有就不运行
> [!attention]
> 注意：如果只引入 Package，不会自动导入该 Package 下的 Module，如果需要使用 Module，需要 `import package.module`

# import 引入模块

## 运行步骤

1. 在缓存中寻找是否存在？如果已经在内存中，直接使用；否则继续寻找
2. 首先看是不是`builtin Module`，如果是内置模块，则调用；否则在`sys.path`寻找
3. 在sys.path中按照顺序寻找，一旦找到就停止并使用；否则报错`ModuleNotFoundError: No module named 'xxx'`
4. 在找到后，就会创建一个`module对象`，并load到内存中，方便后续程序再调用

## import variants

- import ... as ... ：引入变量并重新命名
- from ... import ... ：从模块中引入特定函数/对象
- from ... import ... as ... ：以上两种的组合

## 绝对引入和相对引入
- 绝对引入：在写入时需要添加 Pacakge 名和 Module 名，例如 `import mypackage.mymodule`，但如果我们修改了 Package 名，则这里的 `mypackage` 也得相应修改
- 相对引入：在同一个 Package 下，可以使用 `import .mymodule` 来对模块进行引用，这样的好处是：如果修改了包名，但内部的相对位置不变，是不需要重新 `import` 的

> [!note]
> 从原理上来说，绝对引入和相对引入是一个东西，只不过相对引入会先搜索绝对路径，找到后再进行绝对引入

## 绝对路径和相对路径

原因在于每次文件运行时，都只把当前的文件绝对路径放入了sys.path路径，于是自然而然想到了两种办法来缓解问题：
1. 绝对路径改相对路径
2. 直接动手修改sys.path路径

相对路径与之前在计算机中学习的概念没有太大变化，是相对于当前文件的路径进行变化的！

## sys.path

其实就像在import运行步骤中所述，模块是在sys.path中找的，如果没有找到，说明在sys.path中是不存在的，因此暴力一点可以直接添加一个sys.path

修改main.py：
```
import sys
sys.path.append('/home/odd/Projects/pyg_learning')
from project.data.test import ttt

if __name__ == '__main__':
    ttt()
```

这样就成功输出了结果！

但这样始终是**不优雅**的，因为在运行的文件前每次都要添加这一句话十分麻烦，于是就有了python -m方法

# python 和 python -m

python是将python文件当作一个脚本程序运行，因此它的绝对路径就是当前路径，当然找不到父级路径
python -m 是将一个package当作一个脚本运行，因此会把整个包看成一个整体，于是就可以解决上述的问题，它可以寻找到引用的module，但需要注意的是，由于是当成包运行，所以嵌套的规则是：`xxx.xxx.xxx`，而不是`xxx/xxx/xxx`（这也是开头readme.md作者犯的错误）