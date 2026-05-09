import { getNoteTree, getAllNotes } from "@/lib/notes";
import { FileExplorer } from "@/components/FileExplorer";
import { SearchBox } from "@/components/SearchBox";

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
      <section className="sticky top-8 space-y-8">
        <SearchBox notes={searchNotes} />
        
        {/* 资源管理器 */}
        <nav className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">快速访问</h3>
            <div className="px-1">
              <FileExplorer tree={noteTree} />
            </div>
          </div>
        </nav>
      </section>
    </aside>
  );
}
