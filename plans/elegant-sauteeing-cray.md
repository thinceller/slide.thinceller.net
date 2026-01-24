# npm scripts整理計画

## 目標

npm scriptsをシンプルで直感的な構成に整理する。

## 整理後のscripts構成

```json
"scripts": {
  "dev": "run-p dev:*",
  "dev:marp": "marp -I ./slides -o public --watch",
  "dev:wrangler": "wrangler dev",
  "build": "marp -I ./slides -o public && cp -r ./slides/images public/images && node scripts/generate-index.js && marp -I ./slides -o pdf --pdf --allow-local-files",
  "deploy": "wrangler deploy",
  "lint": "biome check --write .",
  "format": "biome format --write ."
}
```

## 変更内容

### 1. 追加するパッケージ
- `npm-run-all2` - 並列実行用

### 2. 削除するスクリプト
- `start` (devと重複)
- `marp:serve`
- `marp:build`
- `marp:build:pdf`

### 3. 新規/変更スクリプト

| スクリプト | 説明 |
|-----------|------|
| `dev` | marp watchとwrangler devを並列実行 |
| `dev:marp` | marpのwatch/ビルドモード（内部用） |
| `dev:wrangler` | wrangler開発サーバー（内部用） |
| `build` | HTML生成 + images複製 + index.html生成 + PDF生成 |
| `deploy` | 変更なし |

## 修正ファイル

1. **package.json** - scriptsセクションの変更、devDependenciesにnpm-run-all2追加

## 実装手順

1. npm-run-all2をインストール
2. package.jsonのscriptsを更新
3. 動作確認
   - `pnpm dev` でmarpとwranglerが並列起動するか
   - `pnpm build` でHTML/PDF/index.htmlが生成されるか
   - `pnpm deploy` でデプロイできるか

## 注意事項

- devモードではindex.htmlは自動更新されない（新規スライド追加時は`pnpm build`を実行）
- devモード起動前に`pnpm build`を一度実行しておくと、imagesディレクトリやindex.htmlが揃った状態で開発できる

## 動作確認

1. `pnpm install` でnpm-run-all2がインストールされることを確認
2. `pnpm build` でHTML/PDF/index.htmlが生成されることを確認
3. `pnpm dev` でmarpとwranglerが並列起動することを確認
4. `pnpm deploy` でデプロイできることを確認
