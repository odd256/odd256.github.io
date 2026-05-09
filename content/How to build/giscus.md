---
publish: true
tags:
  - quartz_plugin
title: giscus
created: 2024-05-04 14:08:17
updated: 2026-01-29 17:24:57
---

> [!tip]
> - giscus 是一个用于博客评论的工具，原理是通过借用 github 中的 discussion 区域进行评论的发布和存储
> - 在 quartz 中需要进行 quartz插件的编写，支持深色模式自动切换，相关代码在下文已给出

自定义 Comments 组件代码如下所示：

```typescript
// quartz/components/Comments.tsx
import commentsScript from "./scripts/comments.inline"
import { QuartzComponentConstructor, QuartzComponent, QuartzComponentProps } from "./types"

const Comment: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {

  return (
    <script src="https://giscus.app/client.js"
      data-repo="odd256/odd256.github.io"
      data-repo-id="R_kgDOLX95UQ"
      data-category="Announcements"
      data-category-id="DIC_kwDOLX95Uc4CdlNe"
      data-mapping="pathname"
      data-strict="0"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="top"
      data-theme="light"
      data-lang="zh-CN"
      data-loading="lazy"
      crossorigin="anonymous"
      async>
    </script>
  )
}

Comment.beforeDOMLoaded = commentsScript
export default (() => Comment) satisfies QuartzComponentConstructor
```

```typescript
// quartz/components/scripts/comments.inline.ts
// 为了实现动态颜色切换，必须重构部分样式
function sendMessage(message: { setConfig: { theme: string } }) {
    const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
    if (!iframe) return;
    iframe.contentWindow?.postMessage({ giscus: message }, 'https://giscus.app');
}
document.addEventListener("themechange", (e) => {
    const theme = e.detail.theme === 'light' ? 'light' : 'dark'

    sendMessage({
        setConfig: {
            theme: theme
        }
    });
})

// first-time loaded
document.addEventListener("DOMContentLoaded", () => {
    const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
    const currentTheme = localStorage.getItem("theme") ?? userPref
    if (currentTheme === "dark") {return} // default is dark theme
  
    const theme = currentTheme === "light" ? "light_protanopia" : "dark_protanopia"
  
    const existingGiscusContainer = document.getElementById('giscus-container');
  
    if (existingGiscusContainer) {
      // Remove the existing Giscus instance
      existingGiscusContainer.innerHTML = '';
    }
  
    // Create a new container element for Giscus
    const newGiscusContainer = document.createElement('div');
    newGiscusContainer.id = 'giscus-container';
    document.body.appendChild(newGiscusContainer);
    
    // Create a new script element with the updated data-theme attribute
    const newScript = document.createElement('script');
    newScript.src = 'https://giscus.app/client.js';
    newScript.setAttribute('data-repo', 'odd256/odd256.github.io');
    newScript.setAttribute('data-repo-id', 'R_kgDOLX95UQ');
    newScript.setAttribute('data-category', 'Announcements');
    newScript.setAttribute('data-category-id', 'DIC_kwDOLX95Uc4CdlNe');
    newScript.setAttribute('data-mapping', 'pathname');
    newScript.setAttribute('data-strict', '0');
    newScript.setAttribute('data-reactions-enabled', '1');
    newScript.setAttribute('data-emit-metadata', '0');
    newScript.setAttribute('data-input-position', 'top');
    newScript.setAttribute('data-theme', theme);
    newScript.setAttribute('data-lang', 'zh-CN');
    newScript.setAttribute('data-loading', 'lazy');
    newScript.setAttribute('crossOrigin', 'anonymous');
    newScript.async = true;
  
    // Append the new script to the Giscus container
    newGiscusContainer.appendChild(newScript);
  })
```

最后在 `quartz.layout.ts` 文件中添加自定义的 Comments 组件即可