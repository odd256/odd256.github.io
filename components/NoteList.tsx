"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface Note {
  slug: string[];
  metadata: {
    title: string;
    date?: string;
    summary?: string;
    tags?: string[];
    [key: string]: unknown;
  };
}

import { 
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
  ItemGroup
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";

export function NoteCard({
  note, 
  index, 
  variant = "default" 
}: { 
  note: Note; 
  index: number;
  variant?: "default" | "compact";
}) {
  const href = `/${note.slug.join("/")}`;
  const isCompact = variant === "compact";
  
  if (isCompact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Item asChild variant="outline" className="hover:bg-accent transition-all duration-200">
          <Link href={href}>
            <ItemContent>
              <ItemHeader>
                <ItemTitle className="text-base font-bold group-hover/item:text-primary transition-colors">
                  {note.metadata.title}
                </ItemTitle>
                {note.metadata.date && !isNaN(new Date(note.metadata.date).getTime()) && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                     {format(new Date(note.metadata.date), "MM-dd", { locale: zhCN })}
                  </span>
                )}
              </ItemHeader>
              {note.metadata.summary && (
                <ItemDescription className="text-sm line-clamp-1">
                  {note.metadata.summary}
                </ItemDescription>
              )}
              {note.metadata.tags && note.metadata.tags.length > 0 && (
                <ItemFooter className="mt-1 flex-wrap gap-1 justify-start">
                  {note.metadata.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-1.5 py-0 h-5 text-xs font-normal">
                      #{tag}
                    </Badge>
                  ))}
                </ItemFooter>
              )}
            </ItemContent>
          </Link>
        </Item>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Item asChild variant="outline" className="p-0 border-border/40 hover:bg-accent transition-all duration-300 overflow-hidden">
        <Link href={href} className="block w-full p-5">
          <ItemContent className="gap-3">
            <ItemHeader className="items-center">
              <ItemTitle className="text-lg font-bold group-hover/link:text-primary transition-colors leading-tight tracking-tight">
                {note.metadata.title}
              </ItemTitle>
              {note.metadata.date && !isNaN(new Date(note.metadata.date).getTime()) && (
                <span className="text-xs font-medium text-muted-foreground/70 bg-muted px-2 py-0.5 rounded-full whitespace-nowrap ml-auto">
                  {format(new Date(note.metadata.date), "yyyy-MM-dd", { locale: zhCN })}
                </span>
              )}
            </ItemHeader>
            {note.metadata.summary && (
              <ItemDescription className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                {note.metadata.summary}
              </ItemDescription>
            )}
            {note.metadata.tags && note.metadata.tags.length > 0 && (
              <ItemFooter className="flex-wrap gap-1.5 justify-start mt-1">
                {note.metadata.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs font-medium px-2 py-0.5 bg-secondary/50 hover:bg-secondary text-secondary-foreground/80">
                    #{tag}
                  </Badge>
                ))}
              </ItemFooter>
            )}
          </ItemContent>
        </Link>
      </Item>
    </motion.div>
  );
}

export function NoteList({ 
  notes, 
  variant = "default" 
}: { 
  notes: Note[]; 
  variant?: "default" | "compact";
}) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>还没有笔记，去 content/notes 下创建一个吧 👋</p>
      </div>
    );
  }

  return (
    <ItemGroup className={variant === "compact" ? "gap-3" : "gap-4"}>
      {notes.map((note, i) => (
        <NoteCard 
          key={note.slug.join("/")} 
          note={note} 
          index={i} 
          variant={variant}
        />
      ))}
    </ItemGroup>
  );
}
