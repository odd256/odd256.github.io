"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { NoteList } from "@/components/NoteList";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Tag as TagIcon, 
  X,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 8;

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

interface ArchiveClientProps {
  initialNotes: Note[];
}

export default function ArchiveClient({ initialNotes }: ArchiveClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const tag = searchParams?.get("tag");
    if (tag) setSelectedTag(tag);
  }, [searchParams]);

  // 提取所有唯一标签及其出现次数
  const tagStats = useMemo(() => {
    const stats = new Map<string, number>();
    initialNotes.forEach((note) => {
      note.metadata.tags?.forEach((tag) => {
        stats.set(tag, (stats.get(tag) || 0) + 1);
      });
    });
    return Array.from(stats.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [initialNotes]);

  // 计算过滤后的笔记
  const filteredNotes = useMemo(() => {
    return initialNotes.filter((note) => {
      const matchesSearch = 
        note.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.metadata.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.metadata.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTag = !selectedTag || note.metadata.tags?.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }, [initialNotes, searchQuery, selectedTag]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredNotes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotes = filteredNotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setCurrentPage(1);
  };

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis-1");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push("ellipsis-2");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 左侧：笔记列表 (占据 8 列) */}
        <div className="lg:col-span-8 space-y-8">
          <header className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  所有笔记
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Layers className="size-4" />
                  共 {initialNotes.length} 篇文章
                  {filteredNotes.length !== initialNotes.length && (
                    <span className="text-primary font-medium">
                      （已过滤出 {filteredNotes.length} 篇）
                    </span>
                  )}
                </p>
              </div>
              
              {(searchQuery || selectedTag) && (
                <button 
                  onClick={clearFilters}
                  className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors bg-muted/50 px-3 py-1.5 rounded-full border border-border/50"
                >
                  <X className="size-3" />
                  清除筛选
                </button>
              )}
            </div>
            <Separator className="opacity-50" />
          </header>

          <main className="min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={searchQuery + selectedTag + currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {filteredNotes.length > 0 ? (
                  <>
                    <NoteList notes={currentNotes} />
                    
                    {totalPages > 1 && (
                      <div className="mt-12 py-4">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10 transition-colors"}
                                text="上一页"
                              />
                            </PaginationItem>
                            
                            {getPageNumbers().map((page, index) => (
                              <PaginationItem key={index}>
                                {page === "ellipsis-1" || page === "ellipsis-2" ? (
                                  <PaginationEllipsis />
                                ) : (
                                  <PaginationLink
                                    href="#"
                                    isActive={currentPage === page}
                                    onClick={(e) => { e.preventDefault(); handlePageChange(page as number); }}
                                    className="cursor-pointer transition-all duration-200"
                                  >
                                    {page}
                                  </PaginationLink>
                                )}
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary/10 transition-colors"}
                                text="下一页"
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4 bg-muted/20 rounded-2xl border border-dashed border-border/60">
                    <Search className="size-12 opacity-20" />
                    <p className="text-lg">未找到相关笔记</p>
                    <button 
                      onClick={clearFilters}
                      className="text-primary hover:underline text-sm"
                    >
                      尝试清除筛选条件
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* 右侧：侧边栏 (占据 4 列) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* 搜索框 */}
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Search className="size-4 text-primary" />
                快速搜索
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="标题、摘要或标签..."
                  className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 标签云 */}
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TagIcon className="size-4 text-primary" />
                热门标签
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tagStats.length > 0 ? (
                  tagStats.map(({ name, count }) => (
                    <Badge 
                      key={name}
                      variant={selectedTag === name ? "default" : "secondary"}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 group/tag ${
                        selectedTag === name 
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                          : "bg-secondary/40 text-secondary-foreground hover:bg-secondary/80 border-transparent"
                      }`}
                      onClick={() => handleTagClick(name)}
                    >
                      {name}
                      <span className={`ml-1.5 opacity-60 text-[10px] font-mono group-hover/tag:opacity-100 transition-opacity ${
                        selectedTag === name ? "text-primary-foreground" : ""
                      }`}>
                        ({count})
                      </span>
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">暂无标签</p>
                )}
              </div>
            </CardContent>
          </Card>

        </aside>
      </div>
    </div>
  );
}
