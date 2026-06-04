---
title: Nix入門 - 再現可能な開発環境を手に入れよう
info: |
  Nixの基礎から実践的な開発環境構築まで解説するスライド
author: thinceller
theme: ../../packages/theme
highlighter: shiki
htmlAttrs:
  lang: ja
drawings:
  persist: false
mdc: true
---

# Nix入門

## 再現可能な開発環境を手に入れよう

thinceller

---
layout: center
---

# こんな経験ありませんか？

---

## 開発環境でよくある困りごと

<v-clicks>

- 「自分の環境では動くんだけど...」
- 「Node.js のバージョンいくつ？」「えーと、22...だったかな？」
- 新メンバーの環境構築に半日溶ける
- README の手順通りにやっても動かない
- 久しぶりにプロジェクト触ったらビルドが通らない

</v-clicks>

---

## パッケージ管理の闘い

<v-clicks>

- `brew upgrade` したら別プロジェクトが動かなくなった
- Python 2 と Python 3 のバージョン地獄
- グローバルインストールしたツールが競合
- 「とりあえず sudo つけとけ」
- アンインストールしたはずなのに残骸が...

</v-clicks>

---
layout: center
---

# それ、Nixで解決できます

---
layout: section
number: 1
---

# Nix とは

---

## Nix とは

- **純粋関数型パッケージマネージャー**
- 2003年に Eelco Dolstra が博士論文で発表
  - [*"The Purely Functional Software Deployment Model"*](https://github.com/edolstra/edolstra.github.io/blob/2eed3fdbff656d01fe5372e9bf322799de0eaba7/pubs/phd-thesis.pdf)
- Linux / macOS で動作
- 単なるパッケージマネージャーを超えた「ビルドシステム」

<div class="mt-8 flex justify-center">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" class="w-24 h-24"><path fill="#7EBAE4" d="M50.732 43.771L20.525 96.428l-7.052-12.033 8.14-14.103-16.167-.042L2 64.237l3.519-6.15 23.013.073 8.27-14.352 13.93-.037zm2.318 42.094l60.409.003-6.827 12.164-16.205-.045 8.047 14.115-3.45 6.01-7.05.008-11.445-20.097-16.483-.034-6.996-12.124zm35.16-23.074l-30.202-52.66L71.888 10l8.063 14.148 8.12-14.072 6.897.002 3.532 6.143-11.57 20.024 8.213 14.386-6.933 12.16z" clip-rule="evenodd" fill-rule="evenodd"/><path fill="#5277C3" d="M39.831 65.463l30.202 52.66-13.88.131-8.063-14.148-8.12 14.072-6.897-.002-3.532-6.143 11.57-20.024-8.213-14.386 6.933-12.16zm35.08-23.207l-60.409-.003L21.33 30.09l16.204.045-8.047-14.115 3.45-6.01 7.051-.01 11.444 20.097 16.484.034 6.996 12.124zm2.357 42.216l30.207-52.658 7.052 12.034-8.141 14.102 16.168.043L126 64.006l-3.519 6.15-23.013-.073-8.27 14.352-13.93.037z" clip-rule="evenodd" fill-rule="evenodd"/></svg>
</div>

---

## nixpkgs - 世界最大のパッケージリポジトリ

- **Nixpkgs** は Nix のパッケージコレクション
- **110,000以上** のパッケージを収録
- [Repology](https://repology.org/) の集計で世界最大のリポジトリ

---
layout: image
---

<img src="/repology-nixpkgs.png" class="shadow" alt="Repology - nixpkgsが最大のリポジトリであることを示すグラフ" />

出典: [Repology](https://repology.org/)

---

## 「純粋関数型」ってどういうこと？

- 数学の関数のように：
  - **同じ入力** → **常に同じ出力**
  - 副作用がない
  - 外部の状態に依存しない

```text
f(x) = x + 1

f(2) は常に 3
```

<v-click>

- Nix でのビルドも同じ：

```text
ソースコード + 依存関係 + ビルド手順 → 常に同じバイナリ
```

</v-click>

---
layout: center
---

# Nixの3つの特徴

<div class="text-4xl font-bold mt-8 flex gap-8 justify-center">
  <span>再現性</span>
  <span>分離性</span>
  <span>共存性</span>
</div>

---

## 再現性 (Reproducibility)

- ビルド結果が環境に依存しない
- 「私の環境では動く」が発生しない
- CI と開発マシンで同じ結果が得られる

```bash
# 同じ flake.nix からは常に同じ環境が作られる
$ nix develop

# 1年後に別のマシンで実行しても同じ
$ nix develop
```

---

## 分離性 (Isolation)

- パッケージ同士が干渉しない
- グローバル環境を汚染しない
- プロジェクトごとに完全に独立した環境

```bash
# プロジェクトAの環境
$ cd project-a && nix develop
$ node --version  # v18.20.0

# プロジェクトBの環境（別ターミナル）
$ cd project-b && nix develop
$ node --version  # v22.0.0
```

---

## 共存性 (Coexistence) - /nix/store

すべてのパッケージは `/nix/store` にハッシュ付きで格納される：

```text
/nix/store/
├── 4nlgxhb09sdr51nc9hdm8az5b08vzkgx-nodejs-18.20.0/
├── r8qsxm3gzfkddq5bpi1yb0n6qwlgk9va-nodejs-22.0.0/
├── w6m2a1xz0hp3vj9qc5k4ntd8gyf3s2lb-python-3.11.0/
└── ...
```

- ハッシュ値でユニークに識別
- 同じパッケージの複数バージョンが共存可能
- 実際の利用時はシンボリックリンクで配置
- 使われなくなったら `nix-collect-garbage` / `nix store gc` で削除

---
layout: section
number: 2
---

# 他のツールとの比較

---

## Nix vs Homebrew

| | Homebrew | Nix |
|---|---|---|
| 複数バージョン共存 | 難しい | 標準対応 |
| 再現性 | なし | 完全 |
| ロールバック | 不可 | 可能 |
| 宣言的な設定 | 限定的 | あり |
| Linux対応 | 限定的 | フル対応 |

---

## Homebrew の課題

- `brew upgrade` で意図せずバージョンアップ
- 依存関係の変更で既存プロジェクトが壊れる
- バージョン固定が困難
- 「動いていた環境」を再現できない

<v-click>

→ Nix なら **宣言的に** バージョンを固定し、いつでも再現可能

→ プロジェクトごとに独立した環境、壊れても **ロールバック** で安心

</v-click>

---

## Nix vs Docker

| | Docker | Nix |
|---|---|---|
| 目的 | アプリケーションのコンテナ化 | 開発環境・ビルド |
| オーバーヘッド | コンテナランタイム必要 | ネイティブ実行 |
| ファイルシステム | 分離 | ホストと共有 |
| IDE連携 | 設定が複雑 | シームレス |
| キャッシュ効率 | レイヤー単位 | パッケージ単位 |

---

## Docker / Dockerfile の課題

- **再現性が不完全**: `apt-get` はバージョン固定されず、時間経過で結果が変わる
- **キャッシュが非効率**: レイヤー単位で連鎖的に無効化される
- **命令的な記述**: 実行順序に依存、「あるべき状態」を宣言できない

<v-click>

→ Nix は**宣言的**な記述と**パッケージ単位**のキャッシュで解決

</v-click>

---

## 開発環境にNixを選ぶ理由

<v-clicks>

- **完全な再現性**: `brew upgrade` で壊れない、宣言的にバージョン固定
- **自然な共存**: 複数バージョンが競合せず並行利用可能
- **ネイティブ実行**: Dockerのオーバーヘッドなしで軽量
- **シームレスな連携**: ファイル共有・IDE連携に設定不要
- **安心のロールバック**: 壊れたらいつでも前の状態に戻せる

</v-clicks>

---
layout: section
number: 3
---

# Nixを使った開発環境

---

## Nix Flakes

- Nix の新しいプロジェクト管理方式
- `flake.nix` に依存関係とビルド方法を宣言
- `flake.lock` で依存関係を完全に固定
- Git との統合が前提

```text
project/
├── flake.nix    # 設定ファイル
├── flake.lock   # ロックファイル（自動生成）
└── ...
```

---

## 最小の flake.nix

```nix
{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "aarch64-darwin";  # M1/M2 Mac
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.${system}.default = pkgs.mkShell {
        packages = [
          pkgs.nodejs_22
          pkgs.pnpm
        ];
      };
    };
}
```

---

## 使い方

```bash
# 開発シェルに入る
$ nix develop

# シェル内ではパッケージが使える
$ node --version
v22.x.x

$ pnpm --version
9.x.x

# シェルから抜ける
$ exit
```

---

## nix-direnv で自動化

`.envrc` ファイルを作成：

```bash
use flake
```

ディレクトリに入ると自動で環境が有効に：

```bash
$ cd my-project
direnv: loading .envrc
direnv: using flake

$ node --version  # 自動で使える！
v22.x.x
```

---

## 余談: nix-darwin + Home Manager

Mac の設定自体も Nix で管理できる：

- **nix-darwin**: macOS のシステム設定
- **Home Manager**: ユーザー環境（dotfiles等）

```nix
# macOSのシステム設定も Nix で
system.defaults.trackpad.Clicking = true;

# 宣言的に Homebrew Cask もインストール
homebrew.casks = [ "google-chrome" "slack" "1password" ];

# シェルやClaude Code設定も Nix で
programs.fish.enable = true;
programs.starship.enable = true;
programs.claude-code.enable = true;
programs.claude-code.settings.model = "opus";
```

---
layout: section
number: 4
---

# devenv

---

## devenv とは

- **Nixベースの開発環境構築ツール** - より手軽にNixを始められる
- `flake.nix` を直接書かなくてよい
- 高レベルAPIで簡単に設定できる
- Nix の再現性を維持しつつ、学習コストを大幅に削減

```bash
# インストール
$ nix profile install github:cachix/devenv/latest

# プロジェクト初期化
$ devenv init
```

---

## devenv.nix の例

```nix
# devenv.nix
{ pkgs, ... }: {
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    pnpm.enable = true;
  };
}
```

<v-click>

→ flake.nix と比較して：
- **言語サポートが組み込み**: `languages.javascript.enable = true` だけ
- **設定が直感的**: Nix言語の深い知識が不要
- **ボイラープレート不要**: `inputs` / `outputs` の記述が不要

</v-click>

---

## devenv の便利な機能

<v-clicks>

- **言語サポート**: Node.js, Python, Go, Rust など主要言語を簡単に設定
- **サービス管理**: PostgreSQL, Redis, MySQL などをワンライナーで起動
- **pre-commit フック**: コード品質チェックを自動化
- **テスト**: `devenv test` で環境のテストを実行
- **コンテナ生成**: `devenv container` で OCI コンテナイメージを生成

</v-clicks>

---
layout: section
number: 5
---

# まとめ

---

## Nixを始めよう

**インストール（公式インストーラー）**

```bash
$ curl -L https://nixos.org/nix/install | sh
```

**Flakes を有効化**

```bash
# /etc/nix/nix.conf or ~/.config/nix/nix.conf
experimental-features = nix-command flakes
```

**おすすめリソース**
- [Nix公式サイト](https://nixos.org/)
- [Zero to Nix](https://zero-to-nix.com/)
- [nix.dev](https://nix.dev/)
- [devenv](https://devenv.sh/)

---
layout: end
---

# Thanks!

@thinceller
