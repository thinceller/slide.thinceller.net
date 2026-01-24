# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a presentation hosting platform using Marp (Markdown Presentation Ecosystem) to create slides from Markdown files and deploy them to Cloudflare Workers.

## Key Commands

### Development
- `pnpm marp:serve` - Preview slides locally with hot reload at http://localhost:8080
- `pnpm marp:build` - Build HTML slides from Markdown files in `slides/` to `public/`
- `pnpm marp:build:pdf` - Generate PDF versions of slides
- `pnpm dev` - Run Cloudflare Workers development server locally
- `pnpm deploy` - Deploy to Cloudflare Workers

### Code Quality
- `pnpm lint` - Run Biome linter with auto-fix
- `pnpm format` - Format code using Biome

## Architecture

The project follows a simple static site generation pattern:

1. **Source slides** are written in Markdown format in the `slides/` directory
2. **Marp CLI** converts these to HTML presentations during build
3. **Cloudflare Workers** serves the built HTML files from the `public/` directory
4. Slides are accessible at URLs like `https://slide.thinceller.workers.dev/[slide-name]`

## Adding New Slides

1. Create a new `.md` file in the `slides/` directory
2. Use Marp's Markdown syntax with frontmatter for configuration:
   ```markdown
   ---
   marp: true
   theme: gaia
   paginate: true
   ---
   ```
3. Place any images in `slides/images/`
4. Build with `pnpm marp:build`
5. Deploy with `pnpm deploy`

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
- **Node.js v22** and **pnpm** are required (managed by Nix flake)
- The `public/` directory is generated - don't edit files there directly
- Cloudflare Workers configuration is in `wrangler.jsonc`
- Available Marp themes: default, gaia, uncover

## Slide Creation Guidelines

スライド作成時の注意点と情報整理のポイント:
- スライドの粒度は1枚のスライドで1つの主要な概念や考えに焦点を当てる
- 情報の複雑さを考慮し、各スライドは理解しやすい量の情報に抑える
- 視覚的な階層を意識し、見出し、箇条書き、図解などを効果的に使用
- 文字数は少なめに保ち、簡潔で明確な表現を心がける
- 重要なポイントは大きめのフォントや強調表示で目立たせる
- コンテキストを考慮し、聴衆の背景知識に合わせた説明レベルを選択
- 論理的な流れを意識し、スライド間の繋がりを自然にする
- 必要に応じて、図や画像を使って複雑な概念を分かりやすく説明
- 余白や空白を適切に使い、読みやすいレイアウトを心がける
- 1枚のスライドで伝えたいメッセージを明確にし、焦点を絞る