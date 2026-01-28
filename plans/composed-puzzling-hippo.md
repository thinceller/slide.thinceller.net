# テーブル背景の視認性改善

## 課題

スライドの背景にあるグリッドパターン（幾何学的な線の模様）がテーブルと重なり、視認性が低下している。

## 対象ファイル

`packages/theme/styles/index.css`

## 実装内容

テーブル要素に背景色を追加して、背景のグリッドパターンを隠す。

### 変更箇所（253行目付近のテーブルスタイル）

```css
/* --- Tables --- */
.slidev-layout table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.95rem;
	margin: 1rem 0;
	background: var(--theme-bg);  /* 追加: 背景色 */
}
```

`table` 要素に `background: var(--theme-bg)` を追加する。これにより：
- ライトモード: `#ffffff`（白）
- ダークモード: `#111827`（濃いグレー）

が自動的に適用される。

## 検証方法

`slides/nix-intro/slides.md` にテーブルが存在するため、このスライドで検証する。

1. 開発サーバーを起動
   ```bash
   pnpm --filter @slide/nix-intro dev
   ```
2. テーブルを含むスライドに移動
3. テーブルの背景がグリッドパターンを隠しているか確認
4. ダークモードでも適切に表示されるか確認

## code-simplifier 実行

変更が1行のみのため、スキップ可能。
