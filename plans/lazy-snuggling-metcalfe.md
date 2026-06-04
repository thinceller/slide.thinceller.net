# 新規スライド「Nixでコンテナイメージを作成する」のベース作成

## Context

「Nixでコンテナイメージを作成する」というタイトルの新規スライドを追加したい。
内容の大部分はユーザー本人が書くため、ここでは**既存プロジェクトの規約に沿った雛形（ベース）だけ**を用意するのがゴール。

調査の結果、本プロジェクトには新規スライド作成の正規ルートとして
`scripts/create-slide.js`（`pnpm create-slide`）が既に存在し、以下を自動生成する:

- `slides/{slug}/package.json`（build時の `--base /{slug}/` と出力先 `../../dist/{slug}` を正しく設定）
- `slides/{slug}/slides.md`（theme・highlighter 等の frontmatter 入り雛形）
- `slides/{slug}/vite.config.ts`
- `slides/{slug}/public/` ディレクトリ
- 最後に `pnpm install`（ワークスペース登録）まで実行

よって新規ファイルを手書きせず、このスクリプトを使うのが最も規約に忠実。

## 決定事項（ユーザー確認済み）

- **slug**: `nix-container-image` → 公開URL `https://slide.thinceller.workers.dev/nix-container-image/`
- **mdc**: 含めない（create-slide デフォルト雛形のまま。必要になれば後で frontmatter に追記）

## 実装手順

### 1. スライド雛形を生成

```bash
pnpm create-slide nix-container-image \
  --title "Nixでコンテナイメージを作成する" \
  --info "NixでDockerコンテナイメージをビルドする方法を解説するスライド"
```

- `--title` がそのまま `slides.md` の frontmatter `title` と最初の `# 見出し` になる
- `--info` が index ページ（`scripts/generate-index.js`）に表示される説明文になる
- info 文言は仮置き。ユーザーが本文執筆時に調整する想定
- このコマンドが `pnpm install` まで実行し、ワークスペースに `@slide/nix-container-image` を登録する

生成される `slides.md` は以下のような最小構成（mdc なし）:

```yaml
---
title: Nixでコンテナイメージを作成する
info: |
  NixでDockerコンテナイメージをビルドする方法を解説するスライド
author: thinceller
theme: ../../packages/theme
highlighter: shiki
drawings:
  persist: false
---

# Nixでコンテナイメージを作成する

スライド内容をここに追加
```

→ 本文以降はユーザーが執筆。利用可能なレイアウト（`packages/theme/layouts/`）:
`center` / `cover` / `default` / `end` / `image` / `quote` / `section` / `two-cols`

### 2. 動作確認

```bash
# 開発サーバーで雛形が表示されることを確認
pnpm --filter @slide/nix-container-image dev
```

または全体ビルドが通ることを確認:

```bash
pnpm build
```

- `build` は `clean → build:slides → build:index` を実行
- `dist/nix-container-image/` が生成され、index ページに新スライドが載ることを確認

## 触らないファイル

- `scripts/create-slide.js` / `scripts/generate-index.js` は既存のまま利用（変更不要）
- `dist/` は gitignore 対象、直接編集しない

## 補足

- 雛形作成後、本文執筆はユーザーが担当
- 画像は `slides/nix-container-image/public/` に置き、`/image.png` の絶対パスで参照
