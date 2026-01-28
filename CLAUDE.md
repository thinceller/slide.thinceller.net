# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A presentation hosting platform using Slidev to create slides from Markdown files and deploy them to Cloudflare Workers. The project uses a pnpm workspace monorepo structure.

## Development Environment

- **Prerequisites**: Nix (with flakes enabled), direnv (recommended)
- **Setup**: `direnv allow` or `nix develop`
- **Provided tools**: Node.js v22, pnpm

## Project Structure

```
slide.thinceller.net/
├── package.json              # Root configuration
├── pnpm-workspace.yaml       # Workspace definition
├── wrangler.jsonc            # Cloudflare Workers config
├── packages/
│   └── theme/                # Custom theme (@slide/theme)
│       ├── styles/index.css
│       └── layouts/          # Vue layout components
├── slides/
│   └── {slug}/               # Each slide deck (@slide/{slug})
│       ├── package.json
│       ├── slides.md
│       └── public/           # Slide-specific images
├── scripts/
│   └── generate-index.js     # Index page generator
└── dist/                     # Build output (gitignored)
```

## Key Commands

### Development
```bash
# 特定のスライドを開発
pnpm --filter @slide/{slug} dev

# 例
pnpm --filter @slide/use-state dev
pnpm --filter @slide/nix-intro dev

# または slides/{slug}/ ディレクトリに移動して
cd slides/nix-intro && pnpm dev
```

### Build & Deploy
- `pnpm build` - Build all slides and generate index.html
- `pnpm deploy` - Deploy to Cloudflare Workers

### Build Process
`pnpm build` runs these steps sequentially:
1. `clean` - Remove `dist/` directory
2. `build:slides` - Build all slide packages (`pnpm --filter "./slides/*" build`)
3. `build:index` - Generate slide listing page (`dist/index.html`)

### PDF Export
- `pnpm build:pdf` - Export all slides as PDF to `pdf/`

### Code Quality
- `pnpm lint` - Run Biome linter with auto-fix
- `pnpm format` - Format code using Biome

## Architecture

The project follows a monorepo pattern with pnpm workspaces:

1. **Custom theme** (`packages/theme/`) provides consistent styling across all slides
2. **Each slide deck** (`slides/{slug}/`) is an independent Slidev project
3. **Index generator** creates a slide listing page from frontmatter metadata
4. **Cloudflare Workers** serves the built files from the `dist/` directory
5. Slides are accessible at URLs like `https://slide.thinceller.workers.dev/{slug}/`

## Generated Output

These directories are gitignored and should not be edited directly:
- `dist/` - Built HTML files (SPA and index.html)
- `pdf/` - Exported PDF files

## Adding New Slides

1. Create `slides/{slug}/` directory
2. Create `package.json`:
   ```json
   {
     "name": "@slide/{slug}",
     "version": "0.0.1",
     "private": true,
     "scripts": {
       "dev": "slidev --open",
       "build": "slidev build --base /{slug}/ --out ../../dist/{slug}",
       "export-pdf": "mkdir -p ../../pdf && slidev export --output ../../pdf/{slug}.pdf"
     }
   }
   ```
3. Create `slides.md` with frontmatter:
   ```yaml
   ---
   title: Slide Title
   info: |
     Description for the index page
   author: author-name
   theme: ../../packages/theme
   highlighter: shiki
   drawings:
     persist: false
   ---
   ```
4. Place images in `public/` and reference with absolute paths (`/image.png`)
5. Run `pnpm install` to register the workspace
6. Run `pnpm build` to build all slides

## Important Notes

### Base Path Requirement
Each slide's build command must include `--base /{slug}/` to ensure assets load correctly when deployed. The output directory must be `../../dist/{slug}` to match the expected URL structure.

### Theme Reference
Always reference the custom theme with the relative path `../../packages/theme` in frontmatter.

### Configuration
- **Biome** is used for linting/formatting (tab indentation, double quotes)
- **UnoCSS** utility classes are available in slides
- Refer to [Slidev documentation](https://sli.dev) for markdown syntax

### Layout-Specific Frontmatter
Each slide can specify a `layout` in frontmatter. Some layouts accept additional properties:

- **section**: Use `number` (not `sectionNumber`) to display section number
  ```yaml
  ---
  layout: section
  number: 1
  ---
  ```

## Slide Content Guidelines

- **One message per slide**: Focus on a single key concept
- **Concise text**: Keep text minimal and clear
- **Logical flow**: Ensure natural transitions between slides
- **Visual hierarchy**: Use headings, bullet points, and diagrams effectively
- **Emphasis**: Highlight key points with larger fonts or styling
