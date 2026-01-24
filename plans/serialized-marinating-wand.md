# Marp → Slidev マイグレーション計画

## 概要

MarpベースのスライドプロジェクトをSlidevに移行する。pnpm workspaceによるmonorepo構成で、themeとslidesを別々のワークスペースとして管理する。thinceller.netのカラースキームを参考にしたカスタムテーマを作成する。

---

## 新しいディレクトリ構成

```
slide.thinceller.net/
├── package.json              # ルート設定
├── pnpm-workspace.yaml       # ワークスペース定義
├── wrangler.jsonc            # Cloudflare Workers設定
├── biome.json
├── .gitignore
├── CLAUDE.md
├── packages/
│   └── theme/                # カスタムテーマ
│       ├── package.json
│       ├── styles/
│       │   └── index.css
│       └── layouts/
│           ├── default.vue
│           └── center.vue
├── slides/
│   └── use-state/            # スライド（各スライドごとにワークスペース）
│       ├── package.json
│       ├── slides.md
│       └── public/
│           ├── use-state-1.png
│           ├── use-state-2.png
│           └── use-state-3.png
├── scripts/
│   └── generate-index.js     # index.html生成
└── dist/                     # ビルド出力 (gitignore)
    ├── index.html
    └── use-state/
        └── index.html, assets/
```

---

## 実装ステップ

### Phase 1: ルートpackage.jsonとワークスペース設定

**`pnpm-workspace.yaml` (新規作成)**
```yaml
packages:
  - "packages/*"
  - "slides/*"
```

**`package.json` (ルート)**
```json
{
  "name": "slide-thinceller-net",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "pnpm --filter @slide/use-state dev",
    "build": "run-s clean build:slides build:index",
    "build:slides": "pnpm --filter \"./slides/*\" build",
    "build:index": "node scripts/generate-index.js",
    "build:pdf": "run-s clean:pdf pdf:all",
    "clean:pdf": "rm -rf pdf",
    "pdf:all": "pnpm --filter \"./slides/*\" export-pdf",
    "clean": "rm -rf dist",
    "deploy": "wrangler deploy",
    "lint": "biome check --write .",
    "format": "biome format --write ."
  },
  "devDependencies": {
    "@biomejs/biome": "1.9.4",
    "@slidev/cli": "^0.52.0",
    "gray-matter": "4.0.3",
    "npm-run-all2": "8.0.4",
    "playwright-chromium": "^1.49.0",
    "wrangler": "4.60.0"
  }
}
```

**ポイント:** pnpmの`--filter`オプションでワイルドカード指定により、全スライドパッケージに対してコマンドを実行できる。

---

### Phase 2: カスタムテーマ作成

**`packages/theme/package.json`**
```json
{
  "name": "@slide/theme",
  "version": "0.0.1",
  "private": true,
  "slidev": {
    "colorSchema": "both"
  }
}
```

**`packages/theme/styles/index.css`**

thinceller.netのカラースキーム:
- 背景: `#ffffff` (light), `#111827` (dark)
- テキスト: `#111827` (light), `#f3f4f6` (dark)
- アクセント: `#2563eb` (blue-600)
- ボーダー: `#e5e7eb` (gray-200)

```css
:root {
  --slidev-theme-primary: #2563eb;
  --slidev-theme-background: #ffffff;
  --slidev-theme-text: #111827;
}

.dark {
  --slidev-theme-background: #111827;
  --slidev-theme-text: #f3f4f6;
}

.slidev-layout {
  @apply p-10;
}

.slidev-layout h1 {
  @apply text-4xl font-bold text-gray-900 dark:text-gray-100;
}

.slidev-layout h2 {
  @apply text-2xl font-semibold text-gray-800 dark:text-gray-200;
}
```

**`packages/theme/layouts/center.vue`**
```vue
<template>
  <div class="slidev-layout flex flex-col items-center justify-center h-full text-center">
    <slot />
  </div>
</template>
```

---

### Phase 3: スライドワークスペース作成

**`slides/use-state/package.json`**
```json
{
  "name": "@slide/use-state",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "slidev --open",
    "build": "slidev build --base /use-state/ --out ../../dist/use-state",
    "export-pdf": "mkdir -p ../../pdf && slidev export --output ../../pdf/use-state.pdf"
  }
}
```

**`slides/use-state/slides.md`**

Marpからの変換ルール:
| Marp | Slidev |
|------|--------|
| `<!-- _class: lead -->` | `layout: center` |
| `<!-- theme: gaia -->` | ヘッドマターで `theme: ../../packages/theme` |
| `![w:600 center](./images/...)` | `<img src="/use-state-1.png" class="h-60 mx-auto" />` |

```markdown
---
title: React useState Tips集
theme: ../../packages/theme
info: |
  React の useState に関する Tips をまとめたスライド
author: thinceller
highlighter: shiki
drawings:
  persist: false
---

# React useState Tips集

スマートキャンプ株式会社
thinceller / Kohei Kawakami

---
layout: center
---

# useState、使っていますか？

---

```tsx
// コードブロックはそのまま
```

---
layout: center
---

<img src="/use-state-1.png" class="h-80 mx-auto" />
```

**`slides/use-state/public/` に画像を配置**
- use-state-1.png
- use-state-2.png
- use-state-3.png

---

### Phase 4: index.html生成スクリプト

**`scripts/generate-index.js` (更新)**

pnpmの`--filter`で全スライドのビルドは完結するため、`build-all.js`と`export-pdf.js`は不要。
index.html生成のみスクリプトとして残す。

主な変更点:
- `SLIDES_DIR` を `slides/` に変更
- 各スライドパッケージの `slides.md` からフロントマターを読み取る
- 出力先を `dist/index.html` に変更
- リンクを `/{slug}/` 形式に変更（SPA対応）

```javascript
// 変更箇所のみ抜粋
const SLIDES_DIR = path.join(import.meta.dirname, "../slides");
const OUTPUT_DIR = path.join(import.meta.dirname, "../dist");

function getSlideData(dirName) {
  const slidesPath = path.join(SLIDES_DIR, dirName, "slides.md");
  const content = fs.readFileSync(slidesPath, "utf-8");
  const { data } = matter(content);
  return {
    slug: dirName,
    title: data.title || dirName,
    description: data.description || data.info || "",
  };
}

function main() {
  const slideDirs = fs.readdirSync(SLIDES_DIR)
    .filter(name => {
      const slidesPath = path.join(SLIDES_DIR, name, "slides.md");
      return fs.existsSync(slidesPath);
    });
  // ...
}
```

リンク形式の変更（renderSlideItem内）:
```javascript
// href="/${slide.slug}" → href="/${slide.slug}/"
<a href="/${slide.slug}/" class="card-link">
```

---

### Phase 5: 設定ファイルの更新

**`wrangler.jsonc`**
```jsonc
{
  "name": "slide",
  "compatibility_date": "2025-05-22",
  "assets": {
    "directory": "./dist"
  }
}
```

**`.gitignore` に追加**
```
dist
pdf
```

---

## 変更対象ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `package.json` | ルート設定に変更、依存関係更新 |
| `pnpm-workspace.yaml` | 新規作成 |
| `packages/theme/` | 新規作成（カスタムテーマ） |
| `slides/use-state/` | 新規作成（スライド移行） |
| `scripts/generate-index.js` | パス・出力先更新 |
| `wrangler.jsonc` | assetsディレクトリ変更 |
| `.gitignore` | dist追加 |
| `CLAUDE.md` | ドキュメント更新 |

**削除対象:**
- `slides/*.md` ファイル（移行後）
- `slides/images/` ディレクトリ（移行後）

---

## 新規スライド追加手順

1. `slides/{slug}/` ディレクトリを作成
2. `package.json` を作成（@slide/{slug}）
3. `slides.md` を作成（theme: ../../packages/theme）
4. 画像は `public/` に配置
5. `pnpm install` でワークスペースを認識
6. `pnpm build` で全スライドビルド

---

## 検証方法

1. **依存関係インストール**
   ```bash
   pnpm install
   ```

2. **開発サーバー確認**
   ```bash
   pnpm dev
   ```
   - スライドが正しく表示されるか
   - カスタムテーマが適用されているか
   - 画像が読み込まれるか

3. **ビルド確認**
   ```bash
   pnpm build
   ```
   - `dist/index.html` が生成されるか
   - `dist/use-state/` にSPAが生成されるか

4. **PDF確認**
   ```bash
   pnpm build:pdf
   ```
   - `pdf/use-state.pdf` が生成されるか

5. **ローカルプレビュー**
   ```bash
   pnpm wrangler dev
   ```
   - index.htmlが表示されるか
   - `/use-state/` でスライドが表示されるか

6. **code-simplifier実行**
   - 実装完了後、code-simplifierでコード品質を確認

---

## 注意事項

- Slidevはスライドごとに独立したViteプロジェクトとして動作
- 画像はpublicディレクトリに配置し、絶対パス（`/image.png`）で参照
- カスタムテーマは相対パス（`../../packages/theme`）で参照
- PDF生成にはplaywrightが必要（初回実行時にブラウザダウンロード）
- UnoCSS classでスタイリング（`h-60`, `mx-auto`等）
