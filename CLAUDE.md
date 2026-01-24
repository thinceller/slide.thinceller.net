# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a presentation hosting platform using Slidev to create slides from Markdown files and deploy them to Cloudflare Workers. The project uses a pnpm workspace monorepo structure.

## Development Environment

- **Prerequisites**: Nix (with flakes enabled), direnv (recommended)
- **Setup**: `direnv allow` or `nix develop`
- **Provided tools**: Node.js v22, pnpm

## Project Structure

```
slide.thinceller.net/
├── package.json              # ルート設定
├── pnpm-workspace.yaml       # ワークスペース定義
├── wrangler.jsonc            # Cloudflare Workers設定
├── packages/
│   └── theme/                # カスタムテーマ (@slide/theme)
│       ├── styles/index.css
│       └── layouts/
├── slides/
│   └── {slug}/               # 各スライド (@slide/{slug})
│       ├── package.json
│       ├── slides.md
│       └── public/           # スライド固有の画像
├── scripts/
│   └── generate-index.js     # index.html生成
└── dist/                     # ビルド出力 (gitignore)
```

## Key Commands

### Development
- `pnpm dev` - 開発サーバーを起動（デフォルトは use-state スライド）
- `pnpm build` - 全スライドをビルドし、index.htmlを生成
- `pnpm deploy` - Cloudflare Workersにデプロイ

### Build Process
`pnpm build` は以下の順序で実行されます：
1. `clean` - `dist/`ディレクトリを削除
2. `build:slides` - 全スライドパッケージをビルド（`pnpm --filter "./slides/*" build`）
3. `build:index` - スライド一覧ページ (`dist/index.html`) を生成

### PDF Export
- `pnpm build:pdf` - 全スライドのPDFを`pdf/`に出力

### Code Quality
- `pnpm lint` - Run Biome linter with auto-fix
- `pnpm format` - Format code using Biome

## Architecture

The project follows a monorepo pattern with pnpm workspaces:

1. **Custom theme** (`packages/theme/`) provides consistent styling across all slides
2. **Each slide** (`slides/{slug}/`) is an independent Slidev project
3. **Index generator** creates a slide listing page from frontmatter metadata
4. **Cloudflare Workers** serves the built files from the `dist/` directory
5. Slides are accessible at URLs like `https://slide.thinceller.workers.dev/{slug}/`

## Generated Output

ビルドで生成されるディレクトリ（`.gitignore`対象、直接編集不可）：
- `dist/` - HTMLファイル（SPAとindex.html）
- `pdf/` - PDFファイル

## Frontmatter Schema (Slidev)

スライドのフロントマターで使用できるフィールド：

```yaml
---
title: スライドタイトル          # 一覧ページに表示（省略時はディレクトリ名）
info: |                          # 一覧ページのdescriptionとして使用
  スライドの説明
author: 作成者
theme: ../../packages/theme      # カスタムテーマへの相対パス
highlighter: shiki               # コードハイライト
drawings:
  persist: false
---
```

## Adding New Slides

1. `slides/{slug}/` ディレクトリを作成
2. `package.json` を作成:
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
3. `slides.md` を作成（theme: ../../packages/theme）
4. 画像は `public/` に配置し、絶対パス（`/image.png`）で参照
5. `pnpm install` でワークスペースを認識
6. `pnpm build` で全スライドビルド

## Slidev Markdown Syntax

- `---` creates new slides
- `layout: center` - センター配置のスライド
- `class: bg-blue-600 text-white` - UnoCSS classでスタイリング
- `<img src="/image.png" class="h-60 mx-auto" />` - 画像の挿入
- コードブロック: シンタックスハイライト付き

## Configuration Notes

- **Biome** is used for linting/formatting (not ESLint/Prettier)
- **Cloudflare Workers** configuration is in `wrangler.jsonc`
- **Custom theme** is in `packages/theme/`
- **UnoCSS** is available for utility classes

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
