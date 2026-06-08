---
title: Nixでコンテナイメージを作成する
info: |
  Dockerfileの課題をNixのdockerToolsで解決する。宣言的で再現可能なコンテナイメージビルドを解説するスライド
author: thinceller
theme: ../../packages/theme
highlighter: shiki
htmlAttrs:
  lang: ja
drawings:
  persist: false
---

# Nixでコンテナイメージを作成する

## 宣言的で再現可能なイメージビルド

thinceller

---

## Dockerfile は命令的で不透明

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]
```

- **命令的**: 「上から順に実行する手順書」
- **何が入っているか**: ベースイメージの中身を完全には把握できない
- **いつ作ったか**: `npm ci` / `apt-get` は実行タイミングで取得物が変わる

→ 同じ記述でも、同じイメージになるとは限らない

---

## scratch にすれば中身は透明 — でも動く？

```dockerfile
FROM golang:1.23 AS build
RUN CGO_ENABLED=0 go build -o /app   # 静的リンク
FROM scratch
COPY --from=build /app /app
```

得体の知れないものはゼロ。でも HTTPS を叩くと——

```
panic: x509: certificate signed by unknown authority
```

`scratch` に CA 証明書が無いのが原因。動かすには `ca-certificates` を自分で入れる必要がある

→ 中身は透明になったが、**動く構成を手で揃える**必要がある

---

## Dockerfile で残る 2 つの課題

- **推移依存を手で揃える**
  - 直接依存（cacert / tzdata / node）だけでなく、その先の共有ライブラリも必要
  - 取りこぼすとクラッシュ。アプリが複雑なほど増えていく
- **再現性は未解決**
  - ビルド中に取得する依存（`apt-get install` 等）は実行タイミングで変わりうる
  - scratch で最終層をクリーンにしても、ビルドの取得物は固定されない

→ scratch で中身は透明になるが、これらは手作業で揃えることになる

---

## ではNixでコンテナイメージを作ろう

Nix の `dockerTools` は、依存グラフから**必要なものを自動で集める**：

```nix
dockerTools.buildLayeredImage {
  name = "go-api";
  contents = [ cacert tzdata ];        # 直接依存だけ宣言
  config.Cmd = [ "${goApi}/bin/go-api" ];
}
```

- 宣言的・**Docker デーモン不要**
- `buildImage` / `buildLayeredImage` / `streamLayeredImage` を使い分け

---

## 実践例: Next.js (streamLayeredImage)

```nix
dockerTools.streamLayeredImage {
  name = "nextjs-app";
  contents = [ nodejs_22 ];            # これ一行
  config.Cmd = [ "${nodejs_22}/bin/node" "${nextApp}/server.js" ];
}
```

- Node は**静的リンクできない** → 多数の共有ライブラリと動的ローダに依存
- scratch なら `ldd node` を辿って推移依存を 1 つずつ COPY する世界
- Nix は `nodejs_22` 一行で、その**推移閉包ごと**入りパスも配線

```bash
nix run .#nextjs-image | docker load   # tarball を store に残さずストリーム
```

---

## さっきの 2 つの課題が消える

- **推移依存 → 自動で閉包に**
  - 宣言したパッケージの依存を Nix が解決（`ldd` 追跡は不要）
  - ↑ Next.js の `nodejs_22` 一行がまさにそれ
- **再現性 → ビルド入力まで固定**
  - コンパイラ・全依存を content hash で pin → **グラフ全体が再現可能**

→ 残る手作業は「**直接依存の宣言**」だけ

<div class="text-xs opacity-50 mt-6">

※ pin の機構は 2 層: `nodejs_22` 等のネイティブ依存は nixpkgs（`flake.lock`）、アプリの npm 依存は `package-lock.json` + `npmDepsHash` で固定。

</div>

---

## まとめ

- **宣言的にイメージを作成できる**
  - 手順書ではなく「何が必要か」を `contents` に書く
- **再現性が高く、依存をハンドリングしやすい**
  - ビルド入力まで content hash で固定／推移依存は自動で閉包に
- 一方で——
  - Nix のメリットを最大限活かすには scratch ベースで組むことになる
  - 自動閉包で楽になるとはいえ、**直接依存の列挙は実務だと大変**になりそう

→ 宣言的・再現可能なイメージが欲しいなら、Nix は有力な選択肢

サンプルは [thinceller/nix-container-image-sample](https://github.com/thinceller/nix-container-image-sample)

---

## 参考リソース

- [nixpkgs manual - dockerTools](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-dockerTools)
- サンプルリポジトリ: `nix-container-image-sample`
  - `hello-scratch` / `go-api` / `nextjs-image` の 3 例
- [Zero to Nix](https://zero-to-nix.com/)

---
layout: end
---

# Thanks!

@thinceller
