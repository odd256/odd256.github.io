import markdownIt from 'markdown-it';
import matter from 'gray-matter';
import { katex } from '@mdit/plugin-katex';
import anchor from 'markdown-it-anchor';
import toc from 'markdown-it-toc-done-right';
import taskLists from 'markdown-it-task-lists';
import mdHighlight from 'markdown-it-highlightjs';

// 更健壮的 Obsidian Callout 渲染逻辑
function obsidianCallouts(md: any) {
  md.core.ruler.after('block', 'obsidian_callouts', (state: any) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'blockquote_open') continue;

      // 寻找对应的 blockquote_close
      let closeIdx = -1;
      let depth = 0;
      for (let j = i; j < tokens.length; j++) {
        if (tokens[j].type === 'blockquote_open') depth++;
        if (tokens[j].type === 'blockquote_close') depth--;
        if (depth === 0) {
          closeIdx = j;
          break;
        }
      }

      if (closeIdx === -1) continue;

      // 检查内容是否包含 [!type]
      const paragraphOpen = tokens[i + 1];
      if (!paragraphOpen || paragraphOpen.type !== 'paragraph_open') continue;
      
      const inlineToken = tokens[i + 2];
      if (!inlineToken || inlineToken.type !== 'inline') continue;

      const content = inlineToken.content || "";
      const match = content.match(/^\[!(\w+)\][+-]?\s*(.*)/);
      if (!match) continue;

      const type = match[1].toLowerCase();
      const isCollapsible = content.includes(']+') || content.includes(']-');
      const isDefaultCollapsed = content.includes(']-');
      const typeName = type.charAt(0).toUpperCase() + type.slice(1);
      const rawTitle = isCollapsible ? (match[2] || typeName) : typeName;
      // 渲染标题中的 Markdown
      const title = md.renderInline(rawTitle);

      // 临时存储元数据以便渲染器使用
      tokens[i].meta = { type, isCollapsible, isDefaultCollapsed, title };
      tokens[i].attrJoin('class', `callout callout-${type} ${isCollapsible ? 'collapsible' : ''}`);
      tokens[i].attrSet('data-callout', type);
      
      // 处理内容行
      if (isCollapsible) {
        // 折叠类型：清理标题行，因为它已作为 summary 标题显示
        inlineToken.content = content.replace(/^\[!(\w+)\][+-]?\s*.*/, '').trim();
      } else {
        // 非折叠类型：[!type] 后面的内容作为正文的第一行
        inlineToken.content = (match[2] || "").trim();
      }

      i += 3;
    }
  });

  // 自定义渲染逻辑以支持 details/summary
  const defaultBlockquoteOpen = md.renderer.rules.blockquote_open || function(tokens: any, idx: any, options: any, env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };
  const defaultBlockquoteClose = md.renderer.rules.blockquote_close || function(tokens: any, idx: any, options: any, env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.blockquote_open = function(tokens: any, idx: any, options: any, env: any, self: any) {
    const token = tokens[idx];
    if (token.meta && token.meta.isCollapsible) {
      const { type, isDefaultCollapsed, title } = token.meta;
      return `<details class="callout callout-${type} collapsible" ${isDefaultCollapsed ? '' : 'open'} data-callout="${type}">
        <summary class="callout-title">
          <div class="fold-callout-icon"></div>
          <div class="callout-icon"></div>
          <div class="callout-title-inner"><strong>${title}</strong></div>
        </summary>
        <div class="callout-content">`;
    }
    if (token.meta) {
      const { type, title } = token.meta;
      return `<blockquote class="callout callout-${type}" data-callout="${type}">
        <div class="callout-title">
          <div class="callout-icon"></div>
          <div class="callout-title-inner"><strong>${title}</strong></div>
        </div>
        <div class="callout-content">`;
    }
    return defaultBlockquoteOpen(tokens, idx, options, env, self);
  };

  md.renderer.rules.blockquote_close = function(tokens: any, idx: any, options: any, env: any, self: any) {
    // 寻找对应的 open token
    let openToken = null;
    for (let j = idx; j >= 0; j--) {
      if (tokens[j].type === 'blockquote_open') {
        openToken = tokens[j];
        // 简单深度检查（可选）
        break;
      }
    }
    if (openToken && openToken.meta && openToken.meta.isCollapsible) {
      return `</div></details>`;
    }
    if (openToken && openToken.meta) {
      return `</div></blockquote>`;
    }
    return defaultBlockquoteClose(tokens, idx, options, env, self);
  };
}

// 自定义 WikiLinks 渲染插件 (处理 [[Note Name]])
function wikiLinks(md: any) {
  md.inline.ruler.after('emphasis', 'wikilink', (state: any, silent: boolean) => {
    const max = state.posMax;
    if (state.src.charCodeAt(state.pos) !== 0x5B /* [ */) return false;
    if (state.src.charCodeAt(state.pos + 1) !== 0x5B /* [ */) return false;

    let start = state.pos + 2;
    let end = state.src.indexOf(']]', start);
    if (end === -1) return false;

    if (!silent) {
      const content = state.src.slice(start, end);
      const [link, alias] = content.split('|');
      const token = state.push('link_open', 'a', 1);
      
      // 这里的链接逻辑需要根据实际笔记路径调整
      const slug = link.trim().replace(/\s+/g, '%20');
      token.attrs = [['href', `/${slug}`], ['class', 'wikilink']];
      
      const textToken = state.push('text', '', 0);
      textToken.content = (alias || link).trim();
      
      state.push('link_close', 'a', -1);
    }

    state.pos = end + 2;
    return true;
  });
}

let currentToc = "";

const md = new markdownIt({
  html: true,
  linkify: false,
  typographer: true,
})
.use(taskLists, { label: true, labelAfter: true })
.use(mdHighlight, { inline: false })
.use(wikiLinks)
.use(obsidianCallouts)
.use(katex)
.use(anchor, { permalink: anchor.permalink.headerLink() })
.use(toc, { 
  listType: 'ul', 
  containerClass: 'toc-container',
  callback: (html: string) => {
    currentToc = html;
  }
});

// 处理普通 Markdown 链接中的 .md 结尾
const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
  const hAttr = tokens[idx].attrGet('href');
  if (hAttr && hAttr.endsWith('.md') && !hAttr.startsWith('http')) {
    // 转换为 /notes/ 路径并移除 .md
    const newHref = hAttr.startsWith('/') 
      ? `${hAttr.replace(/\.md$/, '')}`
      : `/${hAttr.replace(/\.md$/, '')}`;
    tokens[idx].attrSet('href', newHref);
  }
  return defaultRender(tokens, idx, options, env, self);
};

export function parseMarkdown(content: string) {
  try {
    const { data, content: markdownContent } = matter(content);
    
    // 自动插入 [TOC] 标记，确保提取目录
    let mdContentToParse = markdownContent || "";
    if (!mdContentToParse.includes("[TOC]")) {
      mdContentToParse = "[TOC]\n\n" + mdContentToParse;
    }

    currentToc = "";
    const html = md.render(mdContentToParse);

    return {
      metadata: data,
      content: html,
      toc: currentToc
    };
  } catch (e) {
    console.error("Error parsing markdown:", e);
    return {
      metadata: {},
      content: "<p>Error parsing content</p>",
      toc: ""
    };
  }
}
