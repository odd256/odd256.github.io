# Yifei 的数字花园

基于 **Next.js 16** 和 **Tailwind CSS 4** 的个人知识库。使用 Markdown 编写笔记，按文件夹组织内容，并生成可部署的静态网站。

## 主要功能

- **Markdown 笔记**：在 `content/` 中编写文章，通过 YAML 元数据设置标题、日期和标签。
- **全文搜索**：使用 Fuse.js 搜索笔记，支持摘要预览和键盘操作。
- **目录树**：通过可折叠的侧栏浏览笔记文件夹。
- **归档与标签**：按标签筛选笔记，支持搜索、排序和分页。
- **数学公式**：通过 KaTeX 渲染 LaTeX 公式。
- **代码高亮**：通过 highlight.js 高亮代码块，支持复制代码。
- **笔记双向链接**：支持 `[[笔记名称]]` 和 `[[笔记名称|显示文字]]` 语法。
- **提示块**：支持 Obsidian 的 `> [!note]`、`> [!faq]` 等语法及折叠效果。
- **文章目录**：根据笔记标题自动生成目录。
- **深色模式**：支持跟随系统以及手动切换主题。
- **静态导出**：生成静态 HTML，可部署到 GitHub Pages 等静态托管平台。

## 本地运行

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

打开 [本地网站](http://localhost:3000) 浏览笔记。

## 项目结构

```text
app/                     # 页面路由与布局
  archive/               # 笔记归档页及其专用交互模块
  [...slug]/             # 笔记详情页
  globals.css            # 全局基础样式与主题变量
  markdown.css           # 正文、代码块、提示块和文章目录样式
components/
  layout/                # 网站页头、页脚和侧栏
  notes/                 # 笔记列表与文件浏览器
  markdown/              # 正文交互、代码复制按钮和折叠提示块
  search/                # 全文搜索界面
  theme/                 # 主题上下文与切换按钮
  icons/                 # 通用图标封装
  ui/                    # shadcn 基础界面模块
  animate-ui/            # 动画图标源码
config/
  site.ts                # 站点信息、排序规则、社交链接和访问统计
content/                 # 按文件夹组织的 Markdown 笔记
  index.md               # 首页正文
lib/
  notes/
    index.ts             # 服务端入口：笔记加载、列表摘要和侧栏数据
    storage.ts           # 文件读取、元数据处理和笔记排序
    tree.ts              # 笔记目录树构建
    types.ts             # 服务端与客户端共用的笔记类型
    paths.ts             # 服务端与客户端共用的笔记路径规则
  markdown.ts            # Markdown 渲染与插件配置
  markdown-callouts.ts   # Obsidian 提示块语法兼容
  dates.ts               # 日期格式化
  utils.ts               # 界面样式类名合并
public/                  # 静态资源
.github/workflows/       # 自动构建与部署流程
```

### 代码组织约定

- 路由专用模块就近放在对应的 `app/` 路由中，例如 `app/archive/ArchiveClient.tsx`。
- 客户端从 `lib/notes/types.ts` 导入笔记类型，从 `lib/notes/paths.ts` 导入路径规则；`lib/notes/index.ts` 是包含文件系统访问的服务端入口。
- 列表通过 `getNoteSummaries()` 获取笔记路径和元数据；侧栏通过 `getSidebarData()` 一次读取笔记，生成目录树和搜索文本。展示层无需处理文章 HTML。
- `app/globals.css` 维护主题和全局基础样式，`app/markdown.css` 集中维护正文、代码块、提示块和目录样式。

## 添加笔记

在 `content/` 下创建 `.md` 文件，并添加 YAML 元数据：

```yaml
---
title: 我的笔记
created: 2026-10-01
updated: 2026-10-26
tags: [学习, 数学]
summary: 这篇笔记的简要介绍。
---
```

文件夹路径对应笔记地址，例如 `content/数学/矩阵论.md` 对应 `/数学/矩阵论`。路径中的空格会在生成地址时转换为连字符 `-`。

首页正文放在 `content/index.md` 中。笔记缺少创建或更新时间时，会回退到文件系统时间。

## 站点配置

编辑 `config/site.ts`：

| 配置字段 | 说明 |
| --- | --- |
| `title` | 站点标题 |
| `description` | 用于搜索引擎优化的站点描述 |
| `url` | 正式站点地址，用于生成元数据基础地址 |
| `notesOrder` | 笔记排序方向：`desc` 为降序，`asc` 为升序 |
| `createdFieldName` | YAML 元数据中的创建时间字段名 |
| `updatedFieldName` | YAML 元数据中的更新时间字段名 |
| `displayDateField` | 列表主要显示的日期：创建时间或更新时间 |
| `links.github` | GitHub 个人主页 |
| `links.twitter` | X 个人主页 |
| `links.email` | 联系邮箱 |
| `analytics.umami` | Umami 访问统计配置，填写 `websiteId` 后启用 |

## 检查、构建与部署

```bash
npm run lint     # 检查代码规范
npx tsc --noEmit # 检查 TypeScript 类型
npm run build    # 构建静态网站，输出到 out/ 目录
npm run preview  # 构建后在本地预览静态网站
```

### GitHub Pages

项目通过 `.github/workflows/deploy.yml` 自动构建并部署：

1. 创建 GitHub 仓库，并在仓库设置中将 Pages 的部署来源设为 GitHub Actions。
2. 将 `config/site.ts` 中的 `url` 修改为网站的正式地址。
3. 推送到 `main` 分支，触发自动构建与部署；也可以手动运行工作流。

部署工作流会将 Pages 的基础路径传给 `PAGES_BASE_PATH`，构建结果保存在 `out/` 中。

### Vercel 与 Netlify

当前生产构建使用 `output: 'export'` 导出静态网站，可将构建命令设为 `npm run build`，发布目录设为 `out/`。如需使用平台提供的 Next.js 服务端能力，可在 `next.config.ts` 中移除静态导出配置。

## 技术栈

- [Next.js 16](https://nextjs.org/)：React 应用框架。
- [Tailwind CSS 4](https://tailwindcss.com/)：界面样式。
- [shadcn/ui](https://ui.shadcn.com/)：基础界面模块。
- [Animate UI](https://animate-ui.com/) 与 [Motion](https://motion.dev/)：交互动画与动画图标。
- [Fuse.js](https://fusejs.io/)：全文搜索。
- [KaTeX](https://katex.org/)：数学公式渲染。
- [highlight.js](https://highlightjs.org/)：代码语法高亮。
- [gray-matter](https://github.com/jonschlinkert/gray-matter)：YAML 元数据解析。
- [markdown-it](https://github.com/markdown-it/markdown-it)：Markdown 渲染。

## 表情渲染与授权

Markdown 表情短代码由 `@mdit/plugin-emoji` 处理。短代码（如 `:smile:`）和直接输入的 Unicode 表情，在正文及目录中都会转换为 [Twemoji](https://github.com/jdecked/twemoji) 的 SVG 图片。图片通过 jsDelivr 加载，版本固定为 17.0.3；代码示例和 HTML 属性中的内容保持原样。

Twemoji 图片采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 授权，署名归 Twitter, Inc. 及其他贡献者所有；Twemoji 代码采用 MIT 许可证。
