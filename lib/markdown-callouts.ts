import type { MarkdownIt, Token } from 'markdown-it';
import { alert, type MarkdownItAlertOptions } from '@mdit/plugin-alert';

// 保留原始类型名称；没有专属样式的类型（包括自定义类型）
// 会通过 CSS 回退到普通笔记提示块的外观。
const alertNames = [
  'note', 'abstract', 'summary', 'tldr', 'info', 'todo', 'tip', 'hint',
  'important', 'success', 'check', 'done', 'question', 'help', 'faq',
  'warning', 'caution', 'attention', 'failure', 'fail', 'missing',
  'danger', 'error', 'bug', 'example', 'quote', 'cite', 'notice',
];

interface CalloutMeta {
  type: string;
  title: string;
  titleHtml?: string;
  collapsible: boolean;
  defaultCollapsed: boolean;
}

function calloutMeta(token: Token): CalloutMeta {
  return (token.meta?.callout as CalloutMeta | undefined) ?? {
    type: token.markup,
    title: token.markup.charAt(0).toUpperCase() + token.markup.slice(1),
    collapsible: false,
    defaultCollapsed: false,
  };
}

export function markdownCallouts(md: MarkdownIt) {
  md.use(alert, {
    alertNames,
    deep: true,
    openRenderer: (tokens, index) => {
      const { type, collapsible, defaultCollapsed } = calloutMeta(tokens[index]);
      return collapsible
        ? `<details class="callout callout-${type} collapsible" data-callout="${type}"${defaultCollapsed ? '' : ' open'}>\n`
        : `<blockquote class="callout callout-${type}" data-callout="${type}">\n`;
    },
    titleRenderer: (tokens, index) => {
      const { title, titleHtml, collapsible } = calloutMeta(tokens[index]);
      const tag = collapsible ? 'summary' : 'div';
      return `<${tag} class="callout-title">${collapsible ? '<div class="fold-callout-icon"></div>' : ''}<div class="callout-icon"></div><div class="callout-title-inner"><strong>${titleHtml ?? md.utils.escapeHtml(title)}</strong></div></${tag}>\n<div class="callout-content">\n`;
    },
    closeRenderer: (tokens, index) =>
      `</div></${calloutMeta(tokens[index]).collapsible ? 'details' : 'blockquote'}>\n`,
  } satisfies MarkdownItAlertOptions);

  // 标准标记由提示块规则处理；这里只兼容剩余的引用块，
  // 包括 Obsidian 折叠语法、同行正文、未知类型和空提示块。
  // 直接处理词元，避免改动围栏代码块、行内代码和源码位置。
  md.core.ruler.after('block', 'obsidian_alert_compat', (state) => {
    const tokens = state.tokens;
    const quotes: Token[] = [];
    const replacements = new Map<Token, Token[]>();

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'blockquote_close') {
        const opening = quotes.pop();
        if (opening?.type === 'alert_open') {
          token.type = 'alert_close';
          token.tag = opening.tag;
          token.markup = opening.markup;
          token.meta = opening.meta;
        }
        continue;
      }
      if (token.type !== 'blockquote_open') continue;
      quotes.push(token);

      const paragraph = tokens[i + 1];
      const inline = tokens[i + 2];
      const paragraphEnd = tokens[i + 3];
      if (paragraph?.type !== 'paragraph_open' || inline?.type !== 'inline'
        || paragraphEnd?.type !== 'paragraph_close') continue;

      const newline = inline.content.indexOf('\n');
      const firstLine = newline === -1 ? inline.content : inline.content.slice(0, newline);
      const match = firstLine.match(/^\[!(\w+)\]([+-])?[\t ]*(.*)$/);
      if (!match) continue;

      const type = match[1].toLowerCase();
      const collapsible = Boolean(match[2]);
      const meta: CalloutMeta = {
        type,
        title: (collapsible && match[3].trim()) || type.charAt(0).toUpperCase() + type.slice(1),
        collapsible,
        defaultCollapsed: match[2] === '-',
      };
      // 在收集外层文档目录之前渲染标题；若在渲染器中调用
      // renderInline，会再次运行核心插件并重置目录。
      meta.titleHtml = md.renderInline(meta.title, state.env);
      token.type = 'alert_open';
      token.tag = collapsible ? 'details' : 'blockquote';
      token.markup = type;
      token.meta = { ...token.meta, callout: meta };

      const title = new state.Token('alert_title', '', 0);
      title.block = true;
      title.level = token.level + 1;
      title.markup = type;
      title.content = meta.title;
      title.meta = { callout: meta };

      const rest = newline === -1 ? '' : inline.content.slice(newline + 1);
      const sameLineBody = collapsible ? '' : match[3];
      inline.content = sameLineBody ? sameLineBody + (rest ? '\n' + rest : '') : rest;
      replacements.set(token, [token, title]);
      if (!inline.content.trim()) {
        replacements.set(paragraph, []);
        replacements.set(inline, []);
        replacements.set(paragraphEnd, []);
      }
    }

    state.tokens = tokens.flatMap((token) => replacements.get(token) ?? [token]);
  });
}
