import { load } from 'cheerio';
import { getAllNotes } from './storage';
import { buildNoteTree } from './tree';
import type { NoteSummary, SearchNote } from './types';

export { getAllNotes, getNoteBySlug, getIndexContent } from './storage';
export type { Note, NoteMetadata, NoteSummary, NoteTree, SearchNote } from './types';

export function getNoteSummaries(): NoteSummary[] {
  return getAllNotes().map(({ slug, metadata }) => ({ slug, metadata }));
}

/** 一次读取笔记，同时生成侧栏目录树和搜索数据。 */
export function getSidebarData() {
  const notes = getAllNotes();
  const searchNotes: SearchNote[] = notes.map(({ slug, metadata, content }) => {
    const $ = load(content);
    // 保留词语之间的空白并解码 HTML 实体，供搜索摘要使用。
    $('script, style').remove();
    $('br').replaceWith(' ');
    $('p, div, li, pre, blockquote, h1, h2, h3, h4, h5, h6, tr').append(' ');
    return { slug, metadata, content: $.root().text().replace(/\s+/g, ' ').trim() };
  });
  return { tree: buildNoteTree(notes), searchNotes };
}
