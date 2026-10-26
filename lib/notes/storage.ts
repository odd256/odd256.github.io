import fs from 'fs';
import path from 'path';
import { parseMarkdown } from '../markdown';
import { siteConfig } from '@/config/site';
import type { Note, NoteMetadata } from './types';

const postsDirectory = path.join(process.cwd(), 'content');

interface RawNote {
  metadata: Record<string, unknown>;
  content: string;
  toc: string;
}

function getNoteMetadataHelper(fileName: string, rawNote: RawNote): NoteMetadata {
  const { metadata } = rawNote;
  
  // 获取创建和更新时间（支持配置化字段名）
  const createdKey = siteConfig.createdFieldName || 'created';
  const updatedKey = siteConfig.updatedFieldName || 'updated';
  
  let created = metadata[createdKey] as string | undefined;
  let updated = metadata[updatedKey] as string | undefined;

  // 如果 YAML 元数据缺少日期，则回退到文件系统时间
  if (!created || !updated) {
    try {
      const stats = fs.statSync(fileName);
      if (!created) created = stats.birthtime.toISOString();
      if (!updated) updated = stats.mtime.toISOString();
    } catch {
      if (!created) created = created || '';
      if (!updated) updated = updated || '';
    }
  }

  // 根据配置确定主显示日期
  const displayKey = siteConfig.displayDateField || 'updated';
  const mainDate = displayKey === 'created' ? created : updated;

  return {
    title: metadata.title || path.basename(fileName, '.md'),
    date: mainDate,
    created,
    updated,
    ...metadata,
  } as NoteMetadata;
}

export function getAllNotes(): Note[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = getAllFiles(postsDirectory);
  const allNotesData = fileNames
    .filter(fileName => !fileName.endsWith('index.md')) // 过滤掉首页
    .map((fileName) => {
      // 将相对路径转换为笔记路径片段
      const relativePath = path.relative(postsDirectory, fileName);
      const slug = relativePath.replace(/\.md$/, '').split(path.sep);

      const fileContents = fs.readFileSync(fileName, 'utf8');
      const rawNote = parseMarkdown(fileContents);
      const metadata = getNoteMetadataHelper(fileName, rawNote);

      return {
        slug,
        metadata,
        content: rawNote.content,
        toc: rawNote.toc,
      };
    });

  const order = siteConfig.notesOrder || 'desc';

  return allNotesData.sort((a, b) => {
    const dateA = new Date(a.metadata.date || 0).getTime();
    const dateB = new Date(b.metadata.date || 0).getTime();
    
    if (order === 'desc') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });
}

export function getNoteBySlug(slugArray: string[]): Note | null {
  // 对 URL 传来的参数进行解码（如 %20 还原为空格）
  const decodedSlug = slugArray.map(decodeURIComponent);
  let fullPath = path.join(postsDirectory, ...decodedSlug) + '.md';

  // URL 中空格被替换为 '-'，如果文件不存在，尝试还原空格
  if (!fs.existsSync(fullPath)) {
    const spaceSlug = decodedSlug.map(s => s.replace(/-/g, ' '));
    const altPath = path.join(postsDirectory, ...spaceSlug) + '.md';
    if (fs.existsSync(altPath)) {
      fullPath = altPath;
    }
  }

  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const rawNote = parseMarkdown(fileContents);
  const metadata = getNoteMetadataHelper(fullPath, rawNote);

  return {
    slug: slugArray,
    metadata,
    content: rawNote.content,
    toc: rawNote.toc,
  };
}

export function getIndexContent() {
  const indexPath = path.join(process.cwd(), 'content/index.md');
  if (fs.existsSync(indexPath)) {
    const fileContents = fs.readFileSync(indexPath, 'utf8');
    return parseMarkdown(fileContents, { skipToc: true });
  }
  return null;
}

// 递归获取目录下所有 .md 文件
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file: string) => {
    if (file.startsWith('.')) return; // 排除隐藏文件/目录 (如 .obsidian, .git)
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      if (file.endsWith('.md')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}
