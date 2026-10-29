import { load } from "cheerio";

export interface NoteTocItem {
  id: string;
  labelHtml: string;
  depth: number;
}

/** Reuse the Markdown renderer's anchors and inline title markup. */
export function getNoteTocItems(tocHtml: string): NoteTocItem[] {
  const $ = load(tocHtml, {}, false);
  const items: NoteTocItem[] = [];

  $("a[href^='#']").each((_, link) => {
    const anchor = $(link);
    const href = anchor.attr("href")!;
    if (href.length < 2) return;

    items.push({
      // legacySlugify stores percent-encoded text in the actual heading ID.
      // Decoding it here would make Chinese headings impossible to resolve.
      id: href.slice(1),
      labelHtml: anchor.html() ?? "",
      depth: Math.max(0, anchor.parents("ul").length - 1),
    });
  });

  return items;
}
