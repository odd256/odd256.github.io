import { getAllNotes, getIndexContent } from "@/lib/notes";
import { NoteList } from "@/components/NoteList";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MarkdownEnhancer } from "@/components/MarkdownEnhancer";

export default function Home() {
  const indexData = getIndexContent();
  const allNotes = getAllNotes();
  // 仅在首页展示前 5 篇笔记
  const latestNotes = allNotes.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-12">
      {/* 中间：主要内容 */}
      <div className="lg:col-span-6">
        {indexData?.content && (
          <MarkdownEnhancer>
            <article 
              className="prose prose-lg dark:prose-invert max-w-none opacity-90"
              dangerouslySetInnerHTML={{ __html: indexData.content }}
            />
          </MarkdownEnhancer>
        )}
      </div>

      {/* 右侧：最新笔记侧边栏 */}
      <aside className="lg:col-span-3">
        <section className="sticky top-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">最新笔记</h2>
            <Badge variant="secondary" className="rounded-full px-2 py-0.5">
              {allNotes.length}
            </Badge>
          </div>
          <Separator className="mb-6" />
          
          <NoteList notes={latestNotes} variant="compact" />
          
          {allNotes.length > 5 && (
            <div className="mt-4 flex justify-end">
              <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground group px-2">
                <Link href="/archive" className="flex items-center">
                  查看更多
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}
