# ルートの dev コマンド削除計画

## 概要
プロジェクトルートの `pnpm dev` コマンドを削除し、各スライドで直接 `pnpm --filter @slide/{slug} dev` を使用する形式に変更する。

## 理由
- 現在の `dev` コマンドは `use-state` にハードコードされており、他のスライド開発時に不便
- スライドが増えるたびにルートの設定を変更する必要がない方が保守性が高い

## 変更対象ファイル

### 1. `/package.json`
- `scripts.dev` を削除

### 2. `/CLAUDE.md`
- Development セクションの `pnpm dev` の説明を削除
- 代わりに各スライドでの開発方法を明記

## 変更後の開発方法
```bash
# 特定のスライドを開発
pnpm --filter @slide/use-state dev
pnpm --filter @slide/nix-intro dev

# または slides/{slug}/ ディレクトリに移動して
cd slides/nix-intro && pnpm dev
```

## 動作確認
1. `pnpm --filter @slide/use-state dev` でスライドが起動することを確認
2. `pnpm build` が正常に動作することを確認
