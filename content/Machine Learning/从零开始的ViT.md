---
title: 从零开始的ViT
date: 2023-03-18 09:54:47
tags: 
  - Deep Learning
  - 从零开始系列
publish: true
---

博客随笔内容取自[ViT 论文逐段精读【论文精读】](https://www.bilibili.com/video/BV15P4y137jb/)
一个图片等价于一个$16 \times 16$大小的单词，即如果将一整个图片划分为多个 patch，那么每个 patch 就是一个$16\times 16$的块

对于每一个 patch，我们再通过全连接的方式，将其变成类似 transformer 里的 token，当成输入，从而实现 CNN 到 Transformer 的替换

总的来说，ViT 在超大数据集和超大模型的两方面加持下，实现了对 CNN 的超越

但是，当在中型大小的数据集上，例如 Image-Net 中，如果不添加比较强的约束，ViT 的模型对比同等大小 ResNet 模型的准确度要差，原因是因为 ViT 缺少了 CNN 中存在的归纳偏置（Inductive bias），归纳偏置就是一种先验知识，或者说一种提前做好的假设

在 CNN 中，常说的归纳偏置有两个：

- **局部**（locality）：假设图片上相邻的区域会有相邻的特征
- **平移等变性**（translation equivariance）：$f(g(x))=g(f(x))$，即不论是先做$g$操作还是先做$f$操作，最后的结果都是一样的，这里的$f$可以理解成卷积，$g$可以理解成平移操作
  关于平移等变性和平移不变性的相关介绍，在[神经网络的平移不变性与等变性 - 1. What is Translational Invariance and Equivariance? - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/612151116)中相对容易理解，简单的说就是，平移等变性是指平移操作和 kernel 操作的先后对最后的结果无影响，平移不变性是指某个属性在进行平移后仍然保持属性不变

所以 CNN 可以在数据集较少的情况下，凭借这些先验信息能够有较好的表现，Transformer 则需要有更多的数据支撑

# 模型架构

![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/20230313160102.png)

ViT 结构利用的是 Transformer 的 Encoder 部分，

1. 将待训练图片分割成多个 patch
2. 每个 patch 都过一个线性投影层
3. 由于注意力机制本身是不带位置编码的，因此需要再添加一个位置信息$1,2,3\dots$，维度为$1\times 768$
4. 最后在预测时，通过与 BERT 类似的\<cls\>进行分类预测
