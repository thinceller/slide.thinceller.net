---
title: TechTrainメンター講義 React初級編 useEffect
author: thinceller
marp: true
theme: gaia
paginate: true
size: 4:3
---

# React初級編 useEffect

**TechTrainメンター講義**
プログラミング初学者のための useEffect 入門

thinceller

---
<!-- _class: lead gaia -->

## 今日のゴール

- 🎯 **useEffect**の基本的な使い方を理解する
- 💡 **エフェクト**とは何かを理解する
- ⚡ 実際のコードを書けるようになる
- 🚫 よくあるミスを避けられるようになる

---
<!-- _class: lead gaia -->

## ReactにおけるuseEffectとは？

---

### useEffectとは？

- **useEffect** は、コンポーネントと「外の世界」をつなぐ仕組み
- 「外の世界」の例：
  - ブラウザのAPI（タイトル、イベント、タイマーなど）
  - 外部サーバー（APIとの通信）
- コンポーネントが**レンダリングされた後**に実行

💡 useEffectは「コンポーネントの外の世界とつながる窓」

---

### イベントハンドラとの違い

**イベントハンドラ**
- ユーザーの操作（クリック・入力など）に反応
- 特定のアクションがトリガー

**useEffect**
- レンダリング自体がトリガー
- コンポーネントが画面に表示されたとき

---
<!-- _class: lead gaia -->

## useEffectの基本的な使い方

---

### まずは簡単な例から始めよう！

```jsx
import { useState, useEffect } from "react";

function KeyPress() {
  const [lastKey, setLastKey] = useState("");
  
  useEffect(() => {
    // 1. イベントリスナーを登録
    const handleKeyPress = (e) => {
      setLastKey(e.key);
    };
    window.addEventListener("keydown", handleKeyPress);
    
    // 2. クリーンアップ関数を返す（重要！）
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // 空の依存配列 = 初回のみ実行
  
  return <p>押されたキー: {lastKey || "なし"}</p>;
}
```

---
<!-- _class: lead gaia -->

## useEffectのポイント

---

### 実行タイミング

useEffectは**レンダリング後**に実行される

```jsx
function MyComponent() {
  console.log("1. コンポーネントがレンダリング");
  
  useEffect(() => {
    console.log("3. useEffectが実行される");
  });
  
  console.log("2. レンダリング処理が続く");
  
  return <div>Hello</div>;
}
// 実行順序: 1 → 2 → 画面更新 → 3
```

---

### 依存配列の役割（1/2）

依存配列でuseEffectの実行タイミングを制御

```jsx
// 1. 毎回実行（依存配列なし）
useEffect(() => {
  console.log("毎回のレンダリング後に実行");
});

// 2. 特定の値が変わったときだけ実行
useEffect(() => {
  console.log("countが変わったときだけ実行");
}, [count]);
```

---

### 依存配列の役割（2/2）

```jsx
// 複数の依存値
useEffect(() => {
  console.log("userIdまたはtabが変わったときに実行");
}, [userId, tab]);

// 3. 初回のみ実行（空の依存配列）
useEffect(() => {
  console.log("初回マウント時のみ実行");
}, []);
```

💡 **ポイント**: 空の配列 `[]` は「依存するものがない」= 初回のみ実行

---

### クリーンアップ関数（1/2）

外部リソースの後片付けは必須！

```jsx
// ❌ NG: クリーンアップなし = メモリリーク
useEffect(() => {
  const timer = setInterval(() => {
    console.log("1秒ごとに実行");
  }, 1000);
  // タイマーが止まらない！
});
```

**問題**: コンポーネントが削除されてもタイマーが動き続ける

---

### クリーンアップ関数（2/3）

```jsx
// ✅ OK: クリーンアップあり
useEffect(() => {
  const timer = setInterval(() => {
    console.log("1秒ごとに実行");
  }, 1000);
  
  return () => {
    clearInterval(timer); // タイマーを停止
  };
}, []);
```

**解決**: クリーンアップ関数でタイマーを確実に停止

---

### クリーンアップ関数（3/3）

💡 **覚え方**: 「つなげたら、切る方法も用意する」

**よくあるパターン**
- addEventListener → **removeEventListener**
- setInterval → **clearInterval**
- WebSocket.connect → **disconnect**

---
<!-- _class: lead gaia -->

## よくあるミス・アンチパターン

---

### 計算で済むものをuseEffectで処理

```jsx
// ❌ NG: 不要なuseEffect
const [firstName, setFirstName] = useState("太郎");
const [lastName, setLastName] = useState("山田");
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${lastName} ${firstName}`);
}, [firstName, lastName]);

// ✅ OK: 直接計算
const [firstName, setFirstName] = useState("太郎");
const [lastName, setLastName] = useState("山田");
const fullName = `${lastName} ${firstName}`; // そのまま計算！
```

💡 **原則**: 計算できるものは計算する（useEffectは不要）

---

### propsに基づいてstateを更新

```jsx
// ❌ NG: propsの変更をuseEffectで監視してstateに反映
function ChildComponent({ selectedItem }) {
  const [item, setItem] = useState(selectedItem);
  
  useEffect(() => {
    setItem(selectedItem); // propsが変わるたびにstateを更新
  }, [selectedItem]);
  
  return <div>{item.name}</div>;
}

// ✅ OK: propsを直接使う
function ChildComponent({ selectedItem }) {
  return <div>{selectedItem.name}</div>; // シンプル！
}

// ✅ OK: 初期値として使うだけならuseStateに直接設定
const [item, setItem] = useState(selectedItem); // 初期値のみ
```

💡 **原則**: propsはそのまま使う。不要なstateは作らない

---

### イベントハンドラで処理すべきもの

```jsx
// ❌ NG: 購入ボタンのクリックをuseEffectで処理
const [isPurchased, setIsPurchased] = useState(false);

useEffect(() => {
  if (isPurchased) {
    showNotification("購入ありがとうございます！");
  }
}, [isPurchased]);

// ✅ OK: イベントハンドラで直接処理
function handlePurchase() {
  purchaseProduct();
  showNotification("購入ありがとうございます！");
}

<button onClick={handlePurchase}>購入する</button>
```

💡 **原則**: ユーザーの操作への反応はイベントハンドラで

---

### 依存配列の指定ミス

```jsx
// ❌ NG: 無限ループ！
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(count + 1); // countが変わる → また実行 → 無限ループ
}, [count]);

// ❌ NG: 依存値の抜け漏れ
const [userId, setUserId] = useState(1);

useEffect(() => {
  fetchUser(userId); // userIdを使っているのに...
}, []); // 依存配列に含めていない！

// ✅ OK: 正しい依存配列
useEffect(() => {
  fetchUser(userId);
}, [userId]); // userIdが変わったときだけ実行
```

---
<!-- _class: lead gaia -->

## 実務での使用例

---

### 外部APIとの通信

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let cancelled = false; // クリーンアップ用フラグ
    
    async function fetchUser() {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        
        if (!cancelled) { // コンポーネントがまだ存在するか確認
          setUser(data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    fetchUser();
    
    return () => {
      cancelled = true; // リクエストをキャンセル
    };
  }, [userId]);
  
  if (loading) return <p>読み込み中...</p>;
  return <div>{user?.name}</div>;
}
```

---

### 実務でのデータフェッチ

実務では専用ライブラリを使うことが多い

```jsx
// SWRの例
import useSWR from 'swr';

function UserProfile({ userId }) {
  const { data, error, isLoading } = useSWR(
    `/api/users/${userId}`,
    fetcher
  );
  
  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラーが発生しました</p>;
  return <div>{data.name}</div>;
}
```

💡 **利点**: キャッシュ、リトライ、エラーハンドリングなどを自動で処理

---

### イベントリスナーの登録

```jsx
function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // 300px以上スクロールしたらボタンを表示
      setShowButton(window.scrollY > 300);
    };
    
    // スクロールイベントを監視
    window.addEventListener("scroll", handleScroll);
    
    // クリーンアップ：イベントリスナーを削除
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // 初回のみ登録
  
  if (!showButton) return null;
  
  return (
    <button 
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="scroll-to-top"
    >
      ↑ トップへ
    </button>
  );
}
```

---

### ページ訪問時のログ送信

```jsx
function ProductPage({ productId, productName }) {
  useEffect(() => {
    // ページビューのログを送信
    sendAnalytics("page_view", {
      page_type: "product",
      product_id: productId,
      product_name: productName,
      timestamp: Date.now()
    });
    
    // 滞在時間の計測開始
    const startTime = Date.now();
    
    return () => {
      // ページ離脱時に滞在時間を送信
      const duration = Date.now() - startTime;
      sendAnalytics("page_leave", {
        page_type: "product",
        product_id: productId,
        duration_ms: duration
      });
    };
  }, [productId]); // productIdが変わったら新しいページとして記録
  
  return (
    <div>
      <h1>{productName}</h1>
      {/* 商品の詳細表示 */}
    </div>
  );
}
```

---
<!-- _class: lead gaia -->

## まとめ

---

### useEffectのポイント復習

1. **useEffect** = コンポーネントと外の世界をつなぐ
2. **基本構文** = `useEffect(() => { /* setup */ return () => { /* cleanup */ }; }, [deps]);`
3. **実行タイミング** = レンダリング後
4. **依存配列** = 実行条件を制御
5. **クリーンアップ** = リソースの後片付けは必須
6. **使い分け** = 計算やイベントはuseEffect不要

---

### 公式ドキュメントを読もう！

**React公式ドキュメント（日本語）は最高の学習リソース**

📚 **必読ページ**
- [エフェクトで同期する](https://ja.react.dev/learn/synchronizing-with-effects)
- [エフェクトは必要ないかもしれない](https://ja.react.dev/learn/you-might-not-need-an-effect)
- [useEffectリファレンス](https://ja.react.dev/reference/react/useEffect)

💡 **今日の講義は入門編。公式ドキュメントで理解を深めよう！**

---
<!-- _class: lead -->

# ご清聴<br>ありがとうございました！
