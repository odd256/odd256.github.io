import type { MarkdownIt, Token } from 'markdown-it';
import { alert, type MarkdownItAlertOptions } from '@mdit/plugin-alert';

// Keep the original names: CSS intentionally falls back to the note appearance
// for types without a dedicated style, including user-defined types.
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

  // The alert block rule handles standard markers. Adapt only blockquotes it
  // leaves behind (Obsidian folds, same-line bodies, unknown or empty callouts).
  // Working on tokens leaves fences, inline code and source offsets untouched.
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
      // Render before the outer document's TOC is collected. Calling
      // renderInline from a renderer would run core plugins again and reset it.
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
