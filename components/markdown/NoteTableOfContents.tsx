"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Highlight, HighlightItem } from "@animate-ui/react/primitives/effects/highlight";
import { ScrollFade } from "@animate-ui/react/primitives/effects/scroll-fade";
import { spring, useShouldReduceMotion } from "@animate-ui/react/utils/motion";
import type { NoteTocItem } from "@/lib/note-toc";
import { cn } from "@/lib/utils";

const HEADING_OFFSET = 96;

export function NoteTableOfContents({ items, contentId }: {
  items: NoteTocItem[];
  contentId: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const navigationTargetRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useShouldReduceMotion();

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content || !items.length) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const headings = items.flatMap(({ id }) => {
      const element = document.getElementById(id);
      return element && content.contains(element) ? [{ id, element }] : [];
    });
    if (!headings.length) return;
    let frame = 0;
    let alignAfterLayout = false;

    const update = () => {
      frame = 0;
      if (!desktop.matches) return;
      const target = navigationTargetRef.current;
      if (alignAfterLayout && target) {
        const top = Math.max(0, Math.min(
          window.scrollY + target.getBoundingClientRect().top - HEADING_OFFSET,
          document.documentElement.scrollHeight - window.innerHeight,
        ));
        if (Math.abs(window.scrollY - top) > 1) {
          window.scrollTo({ top, behavior: reduceMotion ? "instant" : "smooth" });
        }
      }
      alignAfterLayout = false;
      let current = headings[0].id;
      for (const { id, element } of headings) {
        if (element.getBoundingClientRect().top <= HEADING_OFFSET + 1) current = id;
        else break;
      }
      const pageHeight = document.documentElement.scrollHeight;
      if (pageHeight > window.innerHeight && window.scrollY + window.innerHeight >= pageHeight - 2) {
        current = headings[headings.length - 1].id;
      }
      setActiveId(current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const scheduleLayoutUpdate = () => {
      alignAfterLayout = true;
      scheduleUpdate();
    };
    const cancelNavigation = () => { navigationTargetRef.current = null; };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        cancelNavigation();
      }
    };
    const syncHash = () => {
      if (!desktop.matches) return;
      const rawId = window.location.hash.slice(1);
      let decodedId = rawId;
      try { decodedId = decodeURIComponent(rawId); } catch { /* Keep literal percent signs. */ }
      // Existing Markdown links use the ID verbatim; new links escape it as a URL fragment.
      const target = headings.find((heading) => heading.id === rawId)
        ?? headings.find((heading) => heading.id === decodedId);
      navigationTargetRef.current = target?.element ?? null;
      if (target) {
        window.scrollTo({ top: window.scrollY + target.element.getBoundingClientRect().top - HEADING_OFFSET, behavior: "instant" });
      }
      scheduleUpdate();
    };

    const observer = new ResizeObserver(scheduleLayoutUpdate);
    observer.observe(content);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleLayoutUpdate);
    window.addEventListener("scrollend", scheduleLayoutUpdate);
    window.addEventListener("wheel", cancelNavigation, { passive: true });
    window.addEventListener("touchstart", cancelNavigation, { passive: true });
    window.addEventListener("pointerdown", cancelNavigation, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    // Images and formulas can move headings after the initial render.
    content.addEventListener("load", scheduleLayoutUpdate, true);
    desktop.addEventListener("change", scheduleUpdate);
    syncHash();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleLayoutUpdate);
      window.removeEventListener("scrollend", scheduleLayoutUpdate);
      window.removeEventListener("wheel", cancelNavigation);
      window.removeEventListener("touchstart", cancelNavigation);
      window.removeEventListener("pointerdown", cancelNavigation);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
      content.removeEventListener("load", scheduleLayoutUpdate, true);
      desktop.removeEventListener("change", scheduleUpdate);
    };
  }, [items, contentId, reduceMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const keepActiveVisible = () => {
      const active = viewport.querySelector<HTMLElement>('a[aria-current="location"]');
      if (!active || !viewport.clientHeight) return;
      const bounds = viewport.getBoundingClientRect();
      const itemBounds = active.getBoundingClientRect();
      const padding = 24;
      let delta = 0;
      if (itemBounds.top < bounds.top + padding) delta = itemBounds.top - bounds.top - padding;
      else if (itemBounds.bottom > bounds.bottom - padding) delta = itemBounds.bottom - bounds.bottom + padding;
      if (delta) viewport.scrollTo({ top: viewport.scrollTop + delta, behavior: reduceMotion ? "instant" : "smooth" });
    };
    keepActiveVisible();
    const observer = new ResizeObserver(keepActiveVisible);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [activeId, reduceMotion]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    navigationTargetRef.current = target;
    const hash = `#${encodeURIComponent(id)}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    window.scrollTo({
      top: window.scrollY + target.getBoundingClientRect().top - HEADING_OFFSET,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <nav aria-label="文章目录" className="sticky top-8 flex max-h-[calc(100dvh-4rem)] flex-col gap-4">
      <h2 className="text-sm font-semibold text-foreground">目录</h2>
      <ScrollFade ref={viewportRef} size={24} className="note-toc min-h-0 overscroll-contain py-2 pr-2">
        <div className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-px w-px bg-border" />
          <Highlight
            controlledItems
            value={activeId}
            hover={false}
            click={false}
            className="pointer-events-none left-0 top-2 h-5 w-[3px] rounded-full bg-primary"
            transition={reduceMotion ? { duration: 0 } : spring.selection}
          >
            {items.map((item) => (
              <HighlightItem key={item.id} value={item.id}>
                <a
                  href={`#${encodeURIComponent(item.id)}`}
                  aria-current={activeId === item.id ? "location" : undefined}
                  onClick={(event) => navigate(event, item.id)}
                  className={cn(
                    "block rounded-sm py-2 pr-1 text-sm leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring hover:text-primary",
                    activeId === item.id ? "font-medium text-primary" : "text-muted-foreground",
                  )}
                  style={{ paddingInlineStart: 20 + item.depth * 16 }}
                >
                  <span dangerouslySetInnerHTML={{ __html: item.labelHtml }} />
                </a>
              </HighlightItem>
            ))}
          </Highlight>
        </div>
      </ScrollFade>
    </nav>
  );
}
