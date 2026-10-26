import markdownIt from 'markdown-it';
import matter from 'gray-matter';
import { katex } from '@mdit/plugin-katex';
import { anchor, headerLink, legacySlugify } from '@mdit/plugin-anchor';
import toc from 'markdown-it-toc-done-right';
import { tasklist } from '@mdit/plugin-tasklist';
import { imgLazyload } from '@mdit/plugin-img-lazyload';
import mdHighlight from 'markdown-it-highlightjs';
import { fullEmoji } from '@mdit/plugin-emoji';
import { slugify } from '@/lib/utils';
import twemoji from '@twemoji/api';
import { load } from 'cheerio';
import { markdownCallouts } from './markdown-callouts';

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
      const slug = slugify(link.trim());
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

function applyTwemoji(html: string): string {
  const $ = load(html, {}, false);
  const ignored = 'pre, code, script, style, textarea, title, noscript, svg, math, .katex';

  // Only replace text nodes so attributes, code examples, and formulas stay intact.
  const textNodes = $.root().find('*').addBack().contents().filter((_, node) => node.type === 'text');
  textNodes.each((_, node) => {
    if (node.type !== 'text' || $(node).parents(ignored).length) return;

    // Escape text before parsing because Twemoji returns HTML without sanitizing it.
    const escapedText = md.utils.escapeHtml(node.data);
    const rendered = twemoji.parse(escapedText, {
      base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/',
      folder: 'svg',
      ext: '.svg',
    });
    if (rendered !== escapedText) $(node).replaceWith(rendered);
  });

  return $.root().html() ?? '';
}

const md = new markdownIt({
  html: true,
  linkify: false,
  typographer: true,
})
.use(tasklist, { label: true })
.use(imgLazyload)
.use(mdHighlight, { inline: false })
.use(wikiLinks)
.use(markdownCallouts)
.use(katex)
.use(fullEmoji)
.use(anchor, { slugify: legacySlugify, permalink: headerLink() })
.use(toc, { 
  listType: 'ul', 
  containerClass: 'toc-container',
  callback: (html: string) => {
    currentToc = html;
  }
});

// Emoji tokens contain plain Unicode. Treat them as text so headings and TOC
// include the same characters as emoji typed directly into a note.
md.core.ruler.after('emoji', 'emoji_text', (state) => {
  for (const token of state.tokens) {
    for (const child of token.children ?? []) {
      if (child.type === 'emoji') child.type = 'text';
    }
  }
});

// 处理普通 Markdown 链接中的 .md 结尾
const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
  const hAttr = tokens[idx].attrGet('href');
  if (typeof hAttr === 'string' && hAttr.endsWith('.md') && !hAttr.startsWith('http')) {
    // 转换为 /notes/ 路径并移除 .md
    const newHref = hAttr.startsWith('/') 
      ? `${hAttr.replace(/\.md$/, '')}`
      : `/${hAttr.replace(/\.md$/, '')}`;
    tokens[idx].attrSet('href', newHref);
  }
  return defaultRender(tokens, idx, options, env, self);
};

export function parseMarkdown(content: string, options?: { skipToc?: boolean }) {
  try {
    const { data, content: markdownContent } = matter(content);

    let mdContentToParse = markdownContent || "";
    if (!options?.skipToc && !mdContentToParse.includes("[TOC]")) {
      mdContentToParse = "[TOC]\n\n" + mdContentToParse;
    }

    currentToc = "";
    const html = md.render(mdContentToParse);

    return {
      metadata: data,
      content: applyTwemoji(html),
      toc: applyTwemoji(currentToc)
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
