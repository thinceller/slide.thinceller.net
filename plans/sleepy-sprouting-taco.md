# pnpm buildの画像コピーバグ修正とclean処理追加

## 問題

1. **画像コピーバグ**: `public/images`に配置されるべき画像が`public/images/images`に配置される
2. **クリーン処理の欠如**: ビルド前にpublicディレクトリをクリーンしないため、古いファイルが残る

## 原因

- `cp -r ./slides/images public/images`は、宛先ディレクトリが既に存在する場合に`public/images/images/`を作成してしまう
- **クリーン処理がない**ため、以前のビルドで作成された`public/images`が残った状態で再ビルドすると問題が発生
- 注: Marpは画像をコピーしない（HTMLへの変換のみ）

## 修正方針

ビルドを2フェーズに分割し、順次 + 並列のハイブリッド構成にする：

1. **準備フェーズ** (順次): クリーン → 画像コピー
2. **生成フェーズ** (並列): HTML/index/PDF生成

## 実装

### 修正するファイル

- `package.json` - scriptsセクション

### 変更後のscripts

```json
{
  "scripts": {
    "predev": "mkdir -p public/images && cp -r ./slides/images/* public/images/",
    "dev": "run-p dev:*",
    "dev:marp": "marp -I ./slides -o public --watch",
    "dev:wrangler": "wrangler dev",
    "clean": "rm -rf public pdf",
    "build": "run-s clean build:prep build:main",
    "build:prep": "mkdir -p public/images && cp -r ./slides/images/* public/images/",
    "build:main": "run-p build:html build:index build:pdf",
    "build:html": "marp -I ./slides -o public",
    "build:index": "node scripts/generate-index.js",
    "build:pdf": "marp -I ./slides -o pdf --pdf --allow-local-files",
    "deploy": "wrangler deploy",
    "lint": "biome check --write .",
    "format": "biome format --write ."
  }
}
```

### 変更内容

| 変更 | 説明 |
|------|------|
| `clean` 追加 | `public/`と`pdf/`を削除 |
| `build` 変更 | `run-s clean build:prep build:main`で順次実行 |
| `build:prep` 追加 | `mkdir -p`で宛先を先に作成、`/*`形式で中身だけをコピー |
| `build:main` 追加 | HTML/index/PDFを並列生成 |
| `build:images` 削除 | `build:prep`に統合 |
| `predev` 追加 | 開発時にも画像を準備 |

### ポイント

- `cp -r ./slides/images/*`形式で**ファイルの中身**をコピー（ディレクトリ自体ではなく）
- `mkdir -p`で宛先を先に作成することで、`cp`の挙動を安定させる

## 動作確認

1. `pnpm build`を実行
2. 以下を確認：
   - `public/images/`直下に画像ファイルが配置されている（`public/images/images/`ではない）
   - `public/index.html`が生成されている
   - `pdf/`ディレクトリにPDFが生成されている
3. `pnpm dev`で開発サーバーが正常に起動することを確認
