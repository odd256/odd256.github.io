---
title: Obsidian 食用指北
tags:
  - Writing
publish: true
created: 2024-02-28 15:27:52
updated: 2026-05-10 00:34:22
---

[Obsidian](https://obsidian.md/) 是一个全平台笔记软件。本文从**笔记撰写**、**笔记发布**、**笔记备份**、**其它插件**四个角度，分享我的 Obsidian 使用经验。

# 笔记撰写

以下插件聚焦于写作体验本身——让码字更流畅、格式更统一。

## 写作体验增强

- **Easy Typing** ⭐：强化文字输入体验，包括自动大小写、括号补全等
- **Latex Suite** ⭐：扩展 Latex 语法，让公式输入速度起飞
- **Ozan's Image in Editor Plugin**：在源码模式也能看到图片，提高码字效率；不习惯也可使用 Obsidian 自带的 Live Preview 模式
- **Word Splitting for Simplified Chinese in Edit Mode and Vim Mode**：中文分词，让光标按中文语义跳转，更符合直觉
- **Admotion**：个性化 Callout 样式，让笔记更美观
- **Commander**：创建快捷按钮，常用操作一键触发，减少鼠标操作

## 笔记格式化与 metadata 自动补全

^a33f83

使用 **Linter** ⭐ 插件，可以在保存时自动格式化笔记，并补全 YAML frontmatter 中的标题和时间戳。

使用到的插件：

1. Linter

步骤：

1. 设置 Linter 触发条件
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/202402281631187.png)
2. 在 yaml 的 panel 中设置文章标题
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/202402281632734.png)
3. 在 yaml 的 panel 中设置文章创建和修改时间
	![image.png](https://obsidian-pic-1258776558.cos.ap-nanjing.myqcloud.com/202402281633875.png)

设置完成后，只要按 `Ctrl+S` 或切换到新笔记，就会自动更新 metadata。

# 笔记发布

笔记写完后，通过 GitHub Publisher 将选定的笔记发布为静态网站。

## 发布到 GitHub Pages

^3ad91e

使用 **GitHub Publisher** ⭐ 插件，可以按需 push 指定的 markdown 文件至 GitHub 仓库，并通过 pull request 进行合并，最终发布为静态网站。

使用到的插件：

1. GitHub Publisher

步骤：

1. 配置 GitHub 的 token
2. 导入配置文件
```json
{
  "github": {
    "branch": "main",
    "automaticallyMergePR": true,
    "dryRun": {
      "enable": false,
      "folderName": "github-publisher"
    },
    "api": {
      "tiersForApi": "Github Free/Pro/Team (default)",
      "hostname": ""
    },
    "workflow": {
      "commitMessage": "[PUBLISHER] MERGE",
      "name": ""
    },
    "verifiedRepo": true
  },
  "upload": {
    "behavior": "obsidian",
    "defaultName": "content",
    "rootFolder": "",
    "yamlFolderKey": "",
    "frontmatterTitle": {
      "enable": true,
      "key": "title"
    },
    "replaceTitle": [],
    "replacePath": [],
    "autoclean": {
      "includeAttachments": true,
      "enable": false,
      "excluded": []
    },
    "folderNote": {
      "enable": true,
      "rename": "_index.md",
      "addTitle": {
        "enable": true,
        "key": "title"
      }
    },
    "metadataExtractorPath": "",
    "subFolder": ""
  },
  "conversion": {
    "hardbreak": false,
    "dataview": true,
    "censorText": [],
    "tags": {
      "inline": false,
      "exclude": [],
      "fields": []
    },
    "links": {
      "internal": false,
      "unshared": false,
      "wiki": false,
      "wikiDisplayText": false,
      "slugify": false,
      "unlink": false,
      "relativePath": true,
      "textPrefix": "/",
      "slugifyAnchor": "disable"
    }
  },
  "embed": {
    "attachments": false,
    "overrideAttachments": [],
    "keySendFile": [],
    "notes": true,
    "folder": "",
    "convertEmbedToLinks": "keep",
    "charConvert": "->",
    "unHandledObsidianExt": [],
    "sendSimpleLinks": true,
    "forcePush": true,
    "useObsidianFolder": true
  },
  "plugin": {
    "shareKey": "publish",
    "excludedFolder": [],
    "copyLink": {
      "enable": false,
      "removePart": [],
      "addCmd": false,
      "transform": {
        "toUri": true,
        "slugify": "lower",
        "applyRegex": []
      }
    },
    "setFrontmatterKey": "Set"
  }
}
```
> [!caution]
> 上述配置文件中， `shareKey` 参数指定了需要上传文件的 metadata，在我的配置中，如果文件的 `publish` 参数为 `true` 才进行上传，通过这种方式可以避免上传私密笔记至公开仓库中。如果需要对私密文件进行备份，则可以通过 Obsidian Git 插件备份至私密仓库中。

# 笔记备份

笔记是长期积累的资产，容不得丢失。我通过**多端同步**和**版本备份**两道防线来保障数据安全。

## 多端同步

使用 **Remotely save** ⭐（推荐维护版 Remotely secure）实现多端数据同步，存储后端使用腾讯 COS 对象存储。

核心思路：利用云存储的版本管理和跨区域复制能力，让手机、平板、PC 上的笔记保持一致。

## 图片数据处理

备份前需先处理图片——图片体积远大于文本，直接同步会消耗大量流量并增加失败率。

我的策略是：**粘贴即上传**。使用 **Image Auto Upload** 插件，在插入图片时自动上传至腾讯 COS，返回图片链接给 Obsidian 渲染。这样本地不存图片，备份和同步只处理纯文本，速度快且省钱。

## 版本备份

使用 **Obsidian Git** ⭐ 将笔记备份到 Git 仓库。设置为每 120 秒自动提交，启动时自动拉取，用 merge 方式处理冲突。

私密笔记备份到私有仓库，公开笔记通过 GitHub Publisher 发布到公开仓库——两套仓库各司其职。

> [!info]
> 详细配置步骤见 [[笔记备份与同步|笔记备份与同步]]，整套方案（腾讯 COS + Remotely save + Image Auto Upload + Obsidian Git）费用可控制在 10 元/年内。

# 其它插件分享

一些不直接属于笔记撰写、发布和备份流程，但同样实用的插件。

## 界面与样式

- **Style Settings**：配合社区主题使用，可在设置面板中自定义 CSS 变量，精细调整主题的配色、字体、间距等外观细节
- **Highlightr**：高亮文本标记，支持多种颜色（黄、绿、蓝、红等），方便在笔记中做视觉标注。配合 Commander 可在页面顶部添加快捷高亮按钮
- **Emoji Toolbar**：emoji 选择器，点击即可快速插入 emoji，同样可通过 Commander 挂载到快捷按钮区

## 效率工具

- **Homepage**：设置启动时自动打开的首页笔记，替代默认的空白页或最近文件，适合以工作台笔记作为入口
- **Table Editor**：增强的 Markdown 表格编辑体验，支持 Tab/Enter 快捷键在单元格间跳转、自动对齐列宽，操作接近 Excel
- **Hotkeys+**：补充了一组 Obsidian 内置之外实用快捷键，如快速切换文件、跳转到指定标题等
