import type { NoteSummary, NoteTree } from './types';

export function buildNoteTree(allNotes: NoteSummary[]): NoteTree[] {
  const tree: NoteTree[] = [];

  allNotes.forEach(note => {
    let currentLevel = tree;
    note.slug.forEach((part, index) => {
      const isLast = index === note.slug.length - 1;
      let existing = currentLevel.find(item => item.name === part);

      if (!existing) {
        existing = {
          name: part,
          type: isLast ? 'file' : 'directory',
          slug: isLast ? note.slug : undefined,
          children: isLast ? undefined : []
        };
        currentLevel.push(existing);
      }
      
      if (existing.children) {
        currentLevel = existing.children;
      }
    });
  });

  // 递归排序：目录在前，文件名在后
  const sortTree = (nodes: NoteTree[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    nodes.forEach(node => {
      if (node.children) sortTree(node.children);
    });
  };

  sortTree(tree);
  return tree;
}

