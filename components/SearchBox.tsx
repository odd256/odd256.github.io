"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

const SNIPPET_LENGTH = 80;

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSnippet(content: string, query: string): string {
  if (!content) return "";
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerContent.indexOf(lowerQuery);

  if (idx === -1) {
    return content.length > SNIPPET_LENGTH
      ? content.slice(0, SNIPPET_LENGTH) + "..."
      : content;
  }

  const context = Math.floor((SNIPPET_LENGTH - query.length) / 2);
  const start = Math.max(0, idx - context);
  const end = Math.min(content.length, start + SNIPPET_LENGTH);

  let snippet = content.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";
  return snippet;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200/60 dark:bg-yellow-700/40 rounded-sm px-0.5 text-foreground">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

interface NoteMetadata {
  title: string;
  date?: string;
  summary?: string;
  tags?: string[];
  [key: string]: unknown;
}

interface SearchBoxProps {
  notes: {
    slug: string[];
    metadata: NoteMetadata;
    content: string;
  }[];
}

export function SearchBox({ notes }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(() => {
    return new Fuse(notes, {
      keys: [
        { name: "metadata.title", weight: 0.4 },
        { name: "content", weight: 0.3 },
        { name: "metadata.summary", weight: 0.2 },
        { name: "metadata.tags", weight: 0.1 },
      ],
      threshold: 0.4,
    });
  }, [notes]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse
      .search(query)
      .slice(0, 10)
      .map((r) => ({
        ...r.item,
        snippet: getSnippet(r.item.content, query),
      }));
  }, [fuse, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useCallback(
    (slug: string[]) => {
      setIsOpen(false);
      setQuery("");
      router.push(`/${slug.join("/")}`);
    },
    [router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          navigate(results[highlightedIndex].slug);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
      <Input
        ref={inputRef}
        placeholder="搜索笔记..."
        className={cn(
          "pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all",
          query && "pr-10",
        )}
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (query.trim()) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
          tabIndex={-1}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {results.length > 0 ? (
            <ScrollArea className="max-h-[320px]">
              <ul className="py-1">
              {results.map((note, index) => (
                <li key={note.slug.join("/")}>
                  <button
                    className={cn(
                      "w-full text-left px-3 py-2.5 hover:bg-accent transition-colors",
                      index === highlightedIndex && "bg-accent",
                    )}
                    onClick={() => navigate(note.slug)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium truncate">
                        {note.metadata.title}
                      </span>
                      {note.metadata.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground flex-shrink-0"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {note.snippet && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 break-all">
                        <Highlight text={note.snippet} query={query} />
                      </p>
                    )}
                    {note.metadata.date && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(note.metadata.date)}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            </ScrollArea>
          ) : query.trim() ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Search className="size-8 opacity-30 mb-2" />
              <p className="text-sm">未找到相关笔记</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
