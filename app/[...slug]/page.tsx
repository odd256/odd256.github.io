import { getNoteSummaries, getNoteBySlug } from "@/lib/notes";
import { slugify } from "@/lib/notes/paths";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar } from "@/components/animate-ui/icons/hugeicons/calendar";
import { Clock01 as Clock } from "@/components/animate-ui/icons/hugeicons/clock-01";
import { formatDate } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MarkdownEnhancer } from "@/components/markdown/MarkdownEnhancer";
import { NoteTableOfContents } from "@/components/markdown/NoteTableOfContents";
import { getNoteTocItems } from "@/lib/note-toc";

export async function generateStaticParams() {
  const notes = getNoteSummaries();
  return notes.map((note) => ({
    slug: note.slug.map(slugify),
  }));
}

export default async function NotePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none">
      {/* 中间：笔记内容 */}
      <article className="lg:col-span-6 min-w-0">
        {/* 这里去掉了返回首页按钮 */}

        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {note.metadata.title}
          </h1>

          <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mt-4">
            {note.metadata.created && (
              <div className="flex items-center gap-1.5">
                <Calendar aria-hidden className="w-4 h-4" />
                <span>发布于 {formatDate(note.metadata.created)}</span>
              </div>
            )}
            {note.metadata.updated && note.metadata.updated !== note.metadata.created && (
              <div className="flex items-center gap-1.5">
                <Clock aria-hidden className="w-4 h-4" />
                <span>更新于 {formatDate(note.metadata.updated)}</span>
              </div>
            )}
          </div>

          {note.metadata.tags && (
            <div className="flex flex-wrap gap-2 mt-6">
              {note.metadata.tags.map((tag: string) => (
                <Link key={tag} href={`/archive?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="outline" className="font-medium cursor-pointer hover:bg-primary/10 transition-colors">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </header>

        <MarkdownEnhancer>
          <div
            id="note-content"
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </MarkdownEnhancer>

        <footer className="mt-20">
          <Separator className="mb-10" />
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground whitespace-nowrap font-medium">
                最后编辑：{formatDate(note.metadata.updated || "") || "未知"}
              </p>
            </div>
            <div className="flex gap-4">
              <Button asChild variant="link" className="p-0">
                <Link href="/">Index</Link>
              </Button>
            </div>
          </div>
        </footer>
      </article>

      {/* 右侧：目录 */}
      <aside className="hidden lg:col-span-3 lg:block">
        <NoteTableOfContents key={slug.join("/")} items={getNoteTocItems(note.toc)} contentId="note-content" />
      </aside>
    </div>
  );
}
