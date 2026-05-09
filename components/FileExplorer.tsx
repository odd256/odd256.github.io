"use client";

import { NoteTree } from "@/lib/notes";
import { Folder as FolderIconLucide, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, slugify } from "@/lib/utils";
import { motion } from "motion/react";
import { 
  Files, 
  FilesHighlight, 
  FolderItem, 
  FolderHeader, 
  FolderTrigger, 
  FolderContent, 
  Folder, 
  FolderIcon, 
  FolderLabel, 
  FolderHighlight,
  File,
  FileIcon,
  FileLabel,
  FileHighlight
} from "@/components/animate-ui/primitives/radix/files";

interface FileExplorerProps {
  tree: NoteTree[];
}

export function FileExplorer({ tree }: FileExplorerProps) {
  return (
    <div className="w-full">
      <Files className="w-full">
        {/* FilesHighlight 内部包含了 Highlight 容器，它作为 Provider 提供上下文 */}
        <FilesHighlight hover className="bg-accent/40 rounded-md">
          <div className="space-y-0.5">
            {tree.map((node) => (
              <ExplorerNode key={node.name} node={node} path={slugify(node.name)} />
            ))}
          </div>
        </FilesHighlight>
      </Files>
    </div>
  );
}

function ExplorerNode({ node, path }: { node: NoteTree; path: string }) {
  const pathname = usePathname();

  if (node.type === "directory") {
    return (
      <FolderItem value={path} className="border-none">
        <FolderHeader>
          <FolderHighlight value={path}>
            <FolderTrigger className="p-0 hover:bg-transparent w-full">
              <Folder className="flex items-center gap-2 px-2 py-1.5 w-full text-sm cursor-pointer group">
                <FolderIcon 
                  closeIcon={<FolderIconLucide className="w-4 h-4 text-muted-foreground/60 transition-colors group-hover:text-primary/70" />} 
                  openIcon={<FolderIconLucide className="w-4 h-4 text-primary fill-primary/10" />} 
                />
                <FolderLabel className="truncate text-muted-foreground group-hover:text-foreground font-medium transition-colors">
                  {node.name}
                </FolderLabel>
              </Folder>
            </FolderTrigger>
          </FolderHighlight>
        </FolderHeader>
        <FolderContent className="ml-3.5 pl-3 border-l border-border/40">
          <div className="py-0.5 space-y-0.5">
            {node.children?.map((child) => (
              <ExplorerNode key={child.name} node={child} path={`${path}/${slugify(child.name)}`} />
            ))}
          </div>
        </FolderContent>
      </FolderItem>
    );
  }

  const href = `/${node.slug?.map(slugify).join("/")}`;
  const isActive = pathname === href || decodeURIComponent(pathname) === href;

  return (
    <FileHighlight value={href}>
      <Link href={href} className="block outline-none">
        <File className="relative flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-all group cursor-pointer">
          <FileIcon>
            <FileText className={cn(
              "w-4 h-4 shrink-0 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary"
            )} />
          </FileIcon>
          <FileLabel className={cn(
            "truncate transition-colors",
            isActive ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
          )}>
            {node.name}
          </FileLabel>
          {isActive && (
            <motion.div 
              layoutId="active-nav-indicator"
              className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-full z-10" 
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </File>
      </Link>
    </FileHighlight>
  );
}
