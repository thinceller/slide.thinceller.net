# Index.html デザイン修正計画

## 概要

現在の青ベースのデザインを、Gaiaテーマの lead スライドのデフォルト配色（クリーム色背景）に変更し、ヘッダーをシンプルにする。

## 現状

- **背景**: 青のグラデーション（`#0277bd` → `#0288d1` → `#039be5`）
- **ヘッダー**: eyebrow テキスト、count バッジなどの装飾あり
- **問題**: 派手すぎる

## 変更後のデザイン

### 配色（Gaia lead スライドのデフォルト）

- **背景色**: `#fff8e1`（クリーム色）
- **前景色**: `#455a64`（濃いグレー）
- **アクセント**: `#0288d1`（青）- リンクやホバー時に使用

### ヘッダー簡素化

- eyebrow テキスト（"Presentation Gallery"）を削除
- count バッジを削除
- タイトル「Slides」とサブタイトルのみに

## 変更対象ファイル

- `scripts/generate-index.js` - `generateIndexHTML()` 関数内のHTML/CSSを更新

## 実装手順

1. CSS変数の配色を変更
   - `--primary`: `#455a64`（前景色）
   - `--secondary`: `#fff8e1`（背景色）
   - `--accent`: `#0288d1`（青）
2. body背景をクリーム色のソリッドまたは微細なグラデーションに
3. ヘッダーHTML簡素化（eyebrow、count削除）
4. カードのスタイル調整（背景色に合わせて）
5. `code-simplifier` でコード改善
6. `pnpm build` で動作確認

## 検証方法

1. `pnpm build:index` を実行
2. `public/index.html` をブラウザで確認
3. `pnpm dev` でローカル動作確認
