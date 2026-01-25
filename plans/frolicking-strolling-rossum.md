# 新規スライド作成コマンドの実装計画

## 概要

コマンド一つで新しいスライドワークスペースを作成できる `pnpm create-slide <slug>` を実装する。

## 使用例

```bash
# 基本使用
pnpm create-slide react-hooks

# オプション指定
pnpm create-slide react-hooks --title "React Hooks入門" --info "Hooksの基本を学ぶ"
```

## 実装内容

### 1. `scripts/create-slide.js` の作成

- **言語**: JavaScript ESM（既存スクリプトと統一）
- **依存**: Node.js標準モジュールのみ

**主要機能**:
- 引数解析: slug（必須）、--title、--info（オプション）
- バリデーション: slug形式チェック、重複チェック
- ファイル生成: package.json, slides.md, vite.config.ts, public/
- pnpm install の自動実行

**デフォルト値**:
- title: slugをそのまま使用
- info: 空文字

**slug形式**: 小文字英数字とハイフンのみ（例: `react-hooks`, `my-slide-2024`）

### 2. ルート `package.json` の更新

```json
{
  "scripts": {
    "create-slide": "node scripts/create-slide.js"
  }
}
```

## 生成ファイルテンプレート

### slides/{slug}/package.json
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

### slides/{slug}/slides.md
```markdown
---
title: {title}
info: |
  {info}
author: thinceller
theme: ../../packages/theme
highlighter: shiki
drawings:
  persist: false
---

# {title}

スライド内容をここに追加
```

### slides/{slug}/vite.config.ts
```typescript
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		emptyOutDir: true,
	},
});
```

## 修正対象ファイル

| ファイル | 操作 |
|---------|------|
| `scripts/create-slide.js` | 新規作成 |
| `package.json` | スクリプト追加 |

## 実装手順

1. `scripts/create-slide.js` を作成
2. ルート `package.json` に `create-slide` スクリプトを追加
3. code-simplifier でコード改善
4. 動作確認

## 動作確認

1. **正常系テスト**
   ```bash
   pnpm create-slide test-slide
   ```
   - slides/test-slide/ が作成されること
   - package.json, slides.md, vite.config.ts, public/ が存在すること
   - pnpm install が成功すること

2. **ビルドテスト**
   ```bash
   pnpm build
   ```
   - 新規スライドがビルドされること
   - index.html に新規スライドが表示されること

3. **エラーテスト**
   ```bash
   pnpm create-slide test-slide  # 重複エラー
   pnpm create-slide Invalid_Name  # 形式エラー
   ```

4. **クリーンアップ**
   - テストで作成した slides/test-slide/ を削除

5. **Lint確認**
   ```bash
   pnpm lint
   ```
