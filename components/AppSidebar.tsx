import { getNoteTree, getAllNotes } from "@/lib/notes";
import { FileExplorer } from "@/components/FileExplorer";
import { SearchBox } from "@/components/SearchBox";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar() {
  const noteTree = getNoteTree();
  const allNotes = getAllNotes();
  const searchNotes = allNotes.map(({ slug, metadata, content }) => ({
    slug,
    metadata,
    content: content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
  }));

  return (
    <aside className="lg:col-span-3">
      <section className="lg:sticky lg:top-8 lg:h-[calc(100vh-6rem)] flex flex-col lg:gap-8">
        <SearchBox notes={searchNotes} />

        {/* 资源管理器 */}
        <ScrollArea className="hidden lg:block flex-1 min-h-0 rounded-md">
          <nav className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">快速访问</h3>
              <div className="px-1">
                <FileExplorer tree={noteTree} />
              </div>
            </div>
          </nav>
        </ScrollArea>
      </section>
    </aside>
  );
}
