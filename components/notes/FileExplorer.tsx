"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accordion } from "@animate-ui/react/primitives/radix-ui/accordion";
import { Highlight, HighlightItem } from "@animate-ui/react/primitives/effects/highlight";
import { AnimateIcon } from "@animate-ui/react/icons";
import type { NoteTree } from "@/lib/notes/types";
import { slugify } from "@/lib/notes/paths";
import { cn } from "@/lib/utils";
import { FolderOpen } from "@/components/animate-ui/icons/hugeicons/folder-open";
import { File01 } from "@/components/animate-ui/icons/hugeicons/file-01";

interface FileExplorerProps {
  tree: NoteTree[];
}

export function FileExplorer({ tree }: FileExplorerProps) {
  const [openPaths, setOpenPaths] = useState<string[]>([]);

  return (
    <Accordion.Root type="multiple" value={openPaths} onValueChange={setOpenPaths} className="relative w-full">
      <Highlight hover controlledItems mode="parent" className="pointer-events-none rounded-md bg-accent/40">
        <div className="relative flex flex-col gap-0.5">
          {tree.map((node) => (
            <ExplorerNode key={node.name} node={node} path={slugify(node.name)} openPaths={openPaths} />
          ))}
        </div>
      </Highlight>
    </Accordion.Root>
  );
}

function ExplorerNode({ node, path, openPaths }: {
  node: NoteTree;
  path: string;
  openPaths: string[];
}) {
  const pathname = usePathname();

  if (node.type === "directory") {
    const isOpen = openPaths.includes(path);

    return (
      <Accordion.Item value={path} className="border-none">
        <Accordion.Header>
          <HighlightItem value={path} asChild>
            <AnimateIcon animateOnHover animateOnTap completeOnStop asChild>
              <Accordion.Trigger className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                <FolderOpen aria-hidden size={16} className={cn(
                  "size-4 shrink-0 transition-colors",
                  isOpen ? "fill-primary/10 text-primary" : "text-muted-foreground/60 group-hover:text-primary/70",
                )} />
                <span className="truncate font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {node.name}
                </span>
              </Accordion.Trigger>
            </AnimateIcon>
          </HighlightItem>
        </Accordion.Header>
        <Accordion.Content className="ml-3.5 border-l border-border/40 pl-3">
          <div className="flex flex-col gap-0.5 py-0.5">
            {node.children?.map((child) => (
              <ExplorerNode key={child.name} node={child} path={`${path}/${slugify(child.name)}`} openPaths={openPaths} />
            ))}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    );
  }

  const href = `/${node.slug?.map(slugify).join("/")}`;
  const isActive = pathname === href || decodeURIComponent(pathname) === href;

  return (
    <HighlightItem value={href} asChild>
      <AnimateIcon animateOnHover animateOnTap completeOnStop asChild>
        <Link href={href} aria-current={isActive ? "page" : undefined} className="group relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
          <File01 aria-hidden size={16} className={cn(
            "size-4 shrink-0 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary",
          )} />
          <span className={cn("truncate transition-colors", isActive ? "font-semibold text-primary" : "text-muted-foreground group-hover:text-foreground")}>
            {node.name}
          </span>
          {isActive && <span className="absolute inset-y-2 left-0 z-10 w-0.5 rounded-full bg-primary" />}
        </Link>
      </AnimateIcon>
    </HighlightItem>
  );
}
