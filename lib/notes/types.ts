export interface NoteMetadata {
  title: string;
  date?: string;
  created?: string;
  updated?: string;
  summary?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface NoteSummary {
  slug: string[];
  metadata: NoteMetadata;
}

export interface Note extends NoteSummary {
  content: string;
  toc: string;
}

/** 用于全文搜索的纯文本，不包含渲染后的 HTML 和目录。 */
export interface SearchNote extends NoteSummary {
  content: string;
}

export interface NoteTree {
  name: string;
  type: 'file' | 'directory';
  slug?: string[];
  children?: NoteTree[];
}

