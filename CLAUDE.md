# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a presentation hosting platform using Marp (Markdown Presentation Ecosystem) to create slides from Markdown files and deploy them to Cloudflare Workers.

## Development Environment

- **Prerequisites**: Nix (with flakes enabled), direnv (recommended)
- **Setup**: `direnv allow` or `nix develop`
- **Provided tools**: Node.js v22, pnpm

## Key Commands

### Development
- `pnpm dev` - marpのwatchモードとwrangler開発サーバーを並列実行
- `pnpm build` - すべてのビルドタスクを並列実行
- `pnpm deploy` - Cloudflare Workersにデプロイ

### Build Subtasks
`pnpm build` は以下のサブタスクを並列実行します：
- `build:html` - Marp CLIでMarkdown→HTML変換 (`public/`)
- `build:images` - 画像を`public/images/`にコピー
- `build:index` - スライド一覧ページ (`public/index.html`) を自動生成
- `build:pdf` - PDF版を生成 (`pdf/`)

### Code Quality
- `pnpm lint` - Run Biome linter with auto-fix
- `pnpm format` - Format code using Biome

## Architecture

The project follows a simple static site generation pattern:

1. **Source slides** are written in Markdown format in the `slides/` directory
2. **Marp CLI** converts these to HTML presentations during build
3. **Index generator** creates a slide listing page from frontmatter metadata
4. **Cloudflare Workers** serves the built HTML files from the `public/` directory
5. Slides are accessible at URLs like `https://slide.thinceller.workers.dev/[slide-name]`

## Generated Output

ビルドで生成されるディレクトリ（`.gitignore`対象、直接編集不可）：
- `public/` - HTMLファイル、画像、index.html
- `pdf/` - PDFファイル

## Frontmatter Schema

スライドのフロントマターで使用できるフィールド：

```yaml
---
# Index page用メタデータ
title: スライドタイトル          # 一覧ページに表示（省略時はファイル名）
description: スライドの説明      # 一覧ページに表示（省略可）

# OGP/SEO用メタデータ
author: 作成者
keywords: キーワード1,キーワード2
url: https://slide.thinceller.workers.dev/[slug]
image: OGP画像URL

# Marp設定（<!-- -->コメントでも可）
marp: true
theme: gaia
paginate: true
---
```

## Adding New Slides

1. Create a new `.md` file in the `slides/` directory
2. Add frontmatter (see Frontmatter Schema above)
3. Place any images in `slides/images/`
4. Build with `pnpm build`, deploy with `pnpm deploy`

**Note**: `scripts/generate-index.js` が各スライドのフロントマターから `title` と `description` を抽出し、一覧ページを自動生成します（`title` 未設定時はファイル名を使用）。

## Marp-specific Markdown Extensions

- `---` creates new slides
- `<!-- _class: lead -->` applies special styling to a slide
- `![bg](image.jpg)` sets background image
- `![bg left](image.jpg)` splits slide with image on left
- `<!-- fit -->` auto-fits text to slide
- `$$` for LaTeX math expressions
- `<!-- paginate: true -->` enables page numbers

## Configuration Notes

- **Biome** is used for linting/formatting (not ESLint/Prettier)
- **Cloudflare Workers** configuration is in `wrangler.jsonc`
- **Available Marp themes**: default, gaia, uncover

## Slide Creation Guidelines

スライド作成時の注意点：

**コンテンツ**
- 1スライド1メッセージ：1つの主要な概念に焦点を絞る
- 簡潔な表現：文字数は少なめに、明確に
- 聴衆を意識：背景知識に合わせた説明レベルを選択

**構成**
- 論理的な流れ：スライド間の繋がりを自然に
- 視覚的階層：見出し、箇条書き、図解を効果的に使用
- 適切な余白：読みやすいレイアウトを心がける

**強調**
- 重要ポイントは大きめのフォントや強調表示で目立たせる
- 複雑な概念は図や画像で視覚的に説明
