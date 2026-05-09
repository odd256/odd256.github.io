---
publish: true
tags: [draft]
created: 2023-12-23 23:00:00
updated: 2024-05-12 02:03:09
title: KDE（核密度估计）
---

# 为什么要用KDE？

在数据探索中，我们想发现数据的分布情况，通常会使用Histogram（直方图）来创建统计图，我们需要对区间进行划分，然后统计数据落在各个区间的频率，就像下面这样：

```python
train_data.hist(bins=50, figsize=(20,20))
```

![Pasted image 20221122162938](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/Pasted%20image%2020221122162938.png)

但这种方法会出现两个需要人为控制的参数：

	1. `bin`的大小

	2. 区间的范围

	参数的不同会对画图结果造成很大影响，并且得到的结果是不光滑的

==但是在KDE中可以得到一个光滑的曲线==

# 什么是KDE

[【中字】kernal density estimation 核密度估计简介_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ir4y1h7Pc/)

核心概念是定义一个核函数，并对其进行累加，然后再做一次归一化：

![Pasted image 20221122164438](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/Pasted%20image%2020221122164438.png)

# 核函数

**核函数三要素**：
![Pasted image 20221122164601](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/Pasted%20image%2020221122164601.png)

核函数的选取对最终的图像影响并不大，但为了图像是光滑曲线，我们通常选择高斯函数

# 带宽选取

![Pasted image 20221122164922](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/Pasted%20image%2020221122164922.png)

带宽$h$越大，则核函数跨度越大，因此我们为了使最后概率和为1，需要再除以1

![Pasted image 20221122165058](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/blog/Pasted%20image%2020221122165058.png)