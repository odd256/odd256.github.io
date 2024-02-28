---
title: Digital Garden 搭建方法
tags:
  - Writing
publish: true
created: 2023-02-26 16:00:00
updated: 2024-02-28 16:39:51
---

# hexo 生成博客

1. 博客由 Hexo 生成并部署在**github**（相关部署方法已经有很多，这里不赘述）
2. 博客主题：hexo-next
3. 评论插件：gitalk（如果你无法查看评论，可能是因为**你无法访问github**）
4. 博客撰写：Obsidian
5. 静态图片资源存储：腾讯云 OSS 存储

我将文章分成了两个部分，`notebook` 和 `quartz` 两个文件夹，分别保存了我原始的文章和需要发布的文章，在 Obsidian 中编辑完，只需要将文件复制到 `quartz/content` 中即可完成发布，这里可以借助[Obsidian 插件](Obsidian%20食用指北.md#^f10318)进行一键插入 ^531d74

博客的创建需要获取笔记 metadata 信息（包括笔记标题、创建时间、更新时间、标签等），Obsidian 默认是没有这些 metadata 信息的，因此我借助了[Obsidian 插件](Obsidian%20食用指北.md#^a33f83)实现了这一功能

在使用 **hexo** 搭建博客时，我发现了几个缺陷：
1. Obsidian 的双链功能无法在博客中展示
2. Obsidian callout 无法在博客中展示，缺少对应 css

# quartz 生成 Digital Garden

为了能够更好地利用 Obsidian 的特性，我决定改变博客搭建的架构，转向 [quartz](https://github.com/jackyzha0/quartz)（其实是自己太菜😭，没办法自己写插件解决上面提到的问题）

quartz 对 Obsidian 的支持度很高，同时支持 Obsidian 中的 `graph view` 和 `backlink` 功能，基本原理和 hexo 类似，都是通过对笔记处理，生成静态网页进行发布，使用 GitHub Pages 功能可以直接进行博客的部署，不过需要注意，默认会把所有文件都放到 git 下进行管理，因此如果你有私密的笔记，还是建议你如上[发布方法](#^531d74)进行分开管理

quartz 的 Component（组件） 使用：
1. **umami（流量监控）**，为了监控 Digital Garden 的流量信息，我采用了免费开源的 umami 进行数据监控，相关配置信息可以参考 [Configuration (jzhao.xyz)](https://quartz.jzhao.xyz/configuration)
2. **giscus（评论系统）**，评论部分使用了 giscus 作为评论系统，前端挂载在 `<div class="giscus"></div>` 下，它会把 github 的 discussions 作为评论的存储空间，用户评论需要登录 github 并通过 giscus app 进行代理实现评论功能，详细配置可参考[giscus](https://giscus.app/zh-CN)

自定义 Comments 组件代码如下所示：
```typescript
// components/Comments.tsx
import { QuartzComponentConstructor } from "./types"

export default (() => {
  function Footer() {
    return (
        <script src="https://giscus.app/client.js"
            data-repo="odd256/odd256.github.io"
            data-repo-id="xxx"
            data-category="Announcements"
            data-category-id="xxx"
            data-mapping="pathname"
            data-strict="0"
            data-reactions-enabled="1"
            data-emit-metadata="0"
            data-input-position="top"
            data-theme="preferred_color_scheme"
            data-lang="zh-CN"
            data-loading="lazy"
            crossorigin="anonymous"
            async>
        </script>
    )
  }

  return Footer
}) satisfies QuartzComponentConstructor
```