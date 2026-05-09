# Yifei's Digital Garden

A personal knowledge base / digital garden powered by **Next.js 16** and **Tailwind CSS 4**. Write notes in Markdown, organized by folders, and publish them as a static site.

## Features

- **Markdown Notes** — Write notes in `content/` with YAML frontmatter (title, date, tags)
- **Full-text Search** — Powered by Fuse.js, with snippet previews and keyboard navigation
- **Directory Tree** — Browse notes by folder with a collapsible sidebar
- **Tag System** — Filter notes by tag, displayed as archive with search and sort
- **KaTeX Math** — LaTeX math rendering via `@mdit/plugin-katex`
- **Syntax Highlighting** — Code blocks highlighted with highlight.js
- **Wiki Links** — `[[Note Name]]` and `[[Note Name|Alias]]` syntax
- **Obsidian Callouts** — `> [!note]` / `> [!faq]` collapsible callout blocks
- **Table of Contents** — Auto-generated TOC for each note
- **Dark Mode** — System-aware theme toggle
- **Static Export** — Fully static HTML output, deployable anywhere (GitHub Pages, Vercel, etc.)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to browse your notes.

## Project Structure

```
content/          # Your markdown notes (organized by folder)
  index.md        # Homepage content
  aaa/
    bbb.md
  ...

config/
  site.ts         # Site title, URL, social links, analytics

components/       # React components (sidebar, search, markdown enhancer, etc.)
lib/
  notes.ts        # Note loading and parsing
  markdown.ts     # Markdown-it setup with plugins
app/              # Next.js app router pages
```

## Adding Content

Create `.md` files under `content/`. Each file needs a frontmatter section:

```yaml
---
title: My Note
created: 2024-06-13
updated: 2024-06-17
tags: [tag1, tag2]
---
```

The folder path becomes the URL — `content/ARM/STM32入门.md` → `/ARM/STM32入门`.

Set `publish: false` in frontmatter to hide a note.

## Configuration

Edit `config/site.ts`:

| Field | Description |
|-------|-------------|
| `title` | Site title |
| `description` | Site description (SEO) |
| `url` | Production URL (used for `metadataBase`) |
| `links.github` | Your GitHub profile |
| `links.email` | Your email |
| `analytics.umami` | Umami analytics (set `websiteId` to enable) |

## Build & Deploy

```bash
npm run build    # Static export to out/
npm run preview  # Build + serve locally
```

### GitHub Pages

The project ships with a `.github/workflows/deploy.yml` workflow. To deploy:

1. Create a GitHub repo
2. Update `url` in `config/site.ts` to your GitHub Pages URL
3. Push to `main` — the workflow builds and deploys automatically

### Vercel / Netlify

Since the project uses `output: 'export'`, just point the platform to the `out/` directory, or remove `output: 'export'` from `next.config.ts` to use their native Next.js hosting.

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework
- [Tailwind CSS 4](https://tailwindcss.com/) — Styling
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Framer Motion](https://motion.dev/) — Animations
- [Fuse.js](https://fusejs.io/) — Search
- [KaTeX](https://katex.org/) — Math rendering
- [highlight.js](https://highlightjs.org/) — Code syntax highlighting
- [gray-matter](https://github.com/jonschlinkert/gray-matter) — Frontmatter parsing
- [markdown-it](https://github.com/markdown-it/markdown-it) — Markdown rendering
