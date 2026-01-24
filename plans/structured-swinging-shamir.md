# CLAUDE.md 改善計画

## 現状分析

既存のCLAUDE.mdは基本的な情報をカバーしていますが、最近のリファクタリング（並列ビルド、index.html自動生成）やセットアップ情報が反映されていません。

## 追加すべき情報

### 1. ビルドスクリプトの詳細化
現在のCLAUDE.mdには`pnpm build`としか書かれていませんが、実際には以下のサブタスクが並列実行されています：
- `build:html` - Marp CLIでMarkdown→HTML変換
- `build:images` - 画像をpublic/にコピー
- `build:index` - スライド一覧ページを自動生成
- `build:pdf` - PDF版を生成

### 2. フロントマターのメタデータ構造
スライドのフロントマターに使用できるフィールドの説明：
```yaml
---
title: スライドタイトル          # index.htmlに表示される
description: スライドの説明      # index.htmlに表示される
author: 作成者
keywords: キーワード1,キーワード2
url: 公開URL
---
```

### 3. 開発環境のセットアップ
- Nix Flakeの使用（`nix develop`で環境構築）
- direnv連携（`.envrc`で自動的に環境がロード）
- VS Code推奨拡張機能の説明

### 4. スライド一覧ページの自動生成
`scripts/generate-index.js`による`public/index.html`の自動生成機能の説明。

### 5. 出力ディレクトリ構造
- `public/` - 生成されたHTMLファイル（git ignored）
- `pdf/` - 生成されたPDFファイル（git ignored）

## 修正対象ファイル

- `/Users/thinceller/src/github.com/thinceller/slide.thinceller.net/CLAUDE.md`

## 実装手順

1. CLAUDE.mdを読み込む
2. 以下のセクションを追加・更新：
   - Key Commandsセクションにビルドサブタスクの説明を追加
   - 新規「Development Environment」セクションを追加（Nix Flake、direnv）
   - 新規「Frontmatter Schema」セクションを追加
   - 「Adding New Slides」セクションにフロントマターの詳細を追加
   - 新規「Index Page Generation」セクションを追加
   - 新規「Generated Output」セクションを追加
3. code-simplifier:code-simplifierで改善確認
4. 動作確認（CLAUDE.mdの内容が正確かを確認）

## 検証方法

- CLAUDE.mdの内容がプロジェクトの実態と一致しているか確認
- 新規開発者がCLAUDE.mdを読んで環境構築できるか確認
