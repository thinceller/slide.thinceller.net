# 見出しの日本語改行を自然にする

## Context

カスタムテーマ（`@slide/theme`）の見出しで、日本語の単語・文節の途中で不自然に改行されてしまう問題がある。

原因は、現在の `packages/theme/styles/index.css` に日本語向けの改行制御が一切なく、ブラウザのデフォルト挙動（`word-break: normal` 相当で、任意の文字間で改行可能）に委ねられているため。日本語は単語間にスペースがないので、文節を無視して幅いっぱいで折り返される。

解決策として、CSS の `word-break: auto-phrase` を見出しに適用する。これはブラウザが日本語の文章を文節単位で解析し、自然な切れ目で改行してくれるプロパティ（Chrome 119+ で対応）。Slidev はブラウザでレンダリングされるため有効。非対応ブラウザでは従来挙動にフォールバックするだけで害はない。

適用範囲はユーザー選択により **見出し（h1 / h2 / h3）のみ** とする。

## 変更内容

### `packages/theme/styles/index.css`

見出しのスタイル定義（`.slidev-layout h1` / `h2` / `h3`）に `word-break: auto-phrase;` を追加する。

3箇所とも既存のルールブロック内に1行追加するだけ。たとえば `h1`:

```css
.slidev-layout h1 {
	font-family: var(--font-display);
	font-size: 3rem;
	font-weight: 700;
	line-height: 1.1;
	letter-spacing: -0.03em;
	color: var(--theme-text);
	margin-bottom: 1rem;
	word-break: auto-phrase; /* 日本語を文節単位で自然に改行 */
}
```

同様に `.slidev-layout h2`（`index.css` 内）と `.slidev-layout h3` にも追加する。

## 検証

1. 既存スライドで開発サーバーを起動して見た目を確認:
   ```bash
   pnpm --filter @slide/nix-intro dev
   ```
   - 日本語の長い見出しを含むスライドで、文節の途中ではなく自然な切れ目で改行されることを確認する（`playwright-cli` でブラウザを開き、見出しを含むページを `snapshot` で確認）。
2. `pnpm lint`（Biome）でCSSのフォーマット・lintが通ることを確認。
3. `pnpm build` で全スライドのビルドが成功することを確認。
