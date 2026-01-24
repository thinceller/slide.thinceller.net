---
title: TechTrainメンター講義 React初級編 useState
author: thinceller
marp: true
theme: gaia
paginate: true
size: 4:3
---

# React初級編 useState

**TechTrainメンター講義**
プログラミング初学者のための useState 入門

thinceller

---
<!-- _class: lead gaia -->

## 今日のゴール

- 🎯 **useState**の基本的な使い方を理解する
- 💡 **state**とは何かを理解する
- ⚡ 実際のコードを書けるようになる
- 🚫 よくあるミスを避けられるようになる

---
<!-- _class: lead gaia -->

## Reactにおけるstateとは？

---

### stateとは？

- **state** とは、Reactで「時間とともに変化するデータ」のこと
- 例: 入力フォームの値、カウンターの数値、チェックボックスのON/OFF など
- ユーザーの操作（クリック・入力など）によってstateが変化
- Reactアプリは「パラパラ漫画」：stateが変わると新しいページ（UI）が描かれる

---

### パラパラ漫画

1. **各ページ** = 画面の状態（stateの値で決まる）
2. **ページをめくる** = stateを更新する
3. **動いて見える** = Reactが自動で再描画（レンダー）

---
<!-- _class: lead gaia -->

## useStateの基本的な使い方

---

### まずは簡単な例から始めよう！

```jsx
// STEP 1: useStateをインポート
import { useState } from "react";

// STEP 2: コンポーネントを作成
function MyFirstComponent() {
  // STEP 3: useStateでstateを作成
  const [message, setMessage] = useState("こんにちは！");
  
  // STEP 4: 画面に表示
  return (
    <div>
      <h1>{message}</h1>
      <button onClick={() => setMessage("ありがとう！")}>
        メッセージを変更
      </button>
    </div>
  );
}
```

---

### useStateの使い方と例

```jsx
import { useState } from "react";

function Counter() {
  // useStateを使ってstateを作成
  // count: 現在の値（最初は0）
  // setCount: 値を更新するための関数
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>増やす</button>
    </div>
  );
}
```

---
<!-- _class: lead gaia -->

## useStateのポイント

---

### set関数は「state更新の予約」

- set関数を呼ぶと「次のレンダーで値が変わる」
- すぐに変わるわけではない
- 例：
  ```js
  function handleClick() {
    setCount(count + 1);  // 「次は count を 1 にしてね」と予約
    console.log(count);   // ここではまだ 0 が表示される（古い値）
    // 次のレンダーでcountが更新される
  }
  ```

💡 **ポイント**: set関数は「今すぐ変える」のではなく「次回変える」命令

---

### 配列やオブジェクトもstateにできる

- 配列やオブジェクトもstateとして保持可能
- ただし、**直接変更せず**新しいオブジェクトを作って更新する
- 例：
  ```jsx
  // オブジェクトの場合
  const [user, setUser] = useState({ name: "Taro", age: 20 });
  // ❌ NG: 直接変更してはいけない
  user.age = 21;
  // ✅ OK: 新しいオブジェクトを作る（スプレッド構文を使用）
  setUser({ ...user, age: user.age + 1 });
  // 配列の場合も同様
  const [items, setItems] = useState(["りんご", "みかん"]);
  // ✅ OK: 新しい配列を作る
  setItems([...items, "ぶどう"]);
  ```

---

### stateの分け方・まとめ方

どのようにstateを分けるか、まとめるかを考えてみましょう

---

### 1. 関連するデータはまとめる

```js
// ❌ 分けすぎ：x座標とy座標が常に一緒に変わる
const [x, setX] = useState(0);
const [y, setY] = useState(0);

// ✅ まとめる：関連データは1つのオブジェクトに
const [position, setPosition] = useState({ x: 0, y: 0 });
```

**ポイント**: 一緒に変更されるデータは1つにまとめよう

---

### 2. 無関係なデータは分ける

```js
// ❌ まとめすぎ：ユーザー情報と投稿内容は無関係
const [data, setData] = useState({ 
  userName: "Taro", age: 20, postText: "", isPosting: false 
});

// ✅ 分ける：それぞれ独立して変更される
const [user, setUser] = useState({ name: "Taro", age: 20 });
const [post, setPost] = useState({ text: "", isPosting: false });
```

💡 **判断基準**: 「一緒に変わるか？」を考えよう！

---
<!-- _class: lead gaia -->

## よくあるミス・アンチパターン

---

### 直接state変数を変更してしまう

```js
// ❌ NG: 直接変更しても画面が更新されない
const [count, setCount] = useState(0);
count = count + 1;  // これでは画面が変わらない！
// ✅ OK: set関数を使う
setCount(count + 1);  // これで画面が更新される

// オブジェクトの場合も同じ
const [user, setUser] = useState({ name: "Taro", age: 20 });
// ❌ NG
user.age = 21;  // 画面が更新されない
// ✅ OK
setUser({ ...user, age: 21 });  // 新しいオブジェクトを作って更新
```

💡 **理由**: Reactは「参照が変わった」ことで更新を検知するため

---

### 初期stateが何度も再計算されてしまう

```js
// ❌ NG: 毎回heavyCalc()が実行される
const [value, setValue] = useState(heavyCalc());

// ✅ OK: 初回のみ実行される
const [value, setValue] = useState(() => heavyCalc());
```

初期値の計算が重い場合は、必ず関数で渡しましょう

---

### 1つのstateから計算可能な値をstateにしてしまう

```js
// ❌ NG: 不要なstate
const [firstName, setFirstName] = useState("太郎");
const [lastName, setLastName] = useState("山田");
const [fullName, setFullName] = useState("山田太郎"); // 冗長！

// ✅ OK: 計算で求める
const [firstName, setFirstName] = useState("太郎");
const [lastName, setLastName] = useState("山田");
const fullName = `${lastName}${firstName}`; // その都度計算
```

---
<!-- _class: lead gaia -->

## 実務での使用例

---

### フォーム入力の管理

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={isLoading}>
        {isLoading ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}
```

---

### 実務でのフォーム管理

```jsx
// React Hook Form の例
import { useForm } from "react-hook-form";

function LoginForm() {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: "",      // useState("") と同じような初期値設定
      password: ""    // useState("") と同じような初期値設定
    }
  });
  
  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      <input {...register("password")} type="password" />
      <button disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}

// 実務ではフォームライブラリを使うことが多いが、基本的な考え方は同じ
```

---

### タブ切り替えUI

```jsx
function TabContent() {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <div>
      <div className="tabs">
        <button 
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          プロフィール
        </button>
        <button 
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          設定
        </button>
      </div>
      
      <div className="content">
        {activeTab === "profile" && <ProfileContent />}
        {activeTab === "settings" && <SettingsContent />}
      </div>
    </div>
  );
}
```

---

### タブ切り替えUI（発展型）

```jsx
function TabContentAdvanced() {
  // タブのIDと見出しをオブジェクトで管理
  const [activeTab, setActiveTab] = useState({
    id: "profile",
    title: "プロフィール"
  });
  
  const tabs = [
    { id: "profile", title: "プロフィール" },
    { id: "settings", title: "設定" },
    { id: "notifications", title: "通知" }
  ];
  
  return (
    <div>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab.id === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      
      <div className="content">
        <h2>{activeTab.title}の内容</h2>
        {activeTab.id === "profile" && <ProfileContent />}
        {activeTab.id === "settings" && <SettingsContent />}
        {activeTab.id === "notifications" && <NotificationContent />}
      </div>
    </div>
  );
}
```

💡 **ポイント**: 関連する情報（IDと見出し）を1つのオブジェクトにまとめて管理

---
<!-- _class: lead gaia -->

## まとめ

---

### useStateのポイント復習

1. **state** = 時間とともに変化するデータ
2. **基本構文** = `const [値, 更新関数] = useState(初期値);`
3. **set関数** = 更新の予約（すぐには変わらない）
4. **オブジェクト・配列** = 新しく作って更新
5. **設計** = シンプルに（関連データはまとめる）

---

### 公式ドキュメントを読もう！

**React公式ドキュメント（日本語）は最高の学習リソース**

📚 **必読ページ**
- [state: コンポーネントのメモリ](https://ja.react.dev/learn/state-a-components-memory)
- [state変数の追加](https://ja.react.dev/learn/adding-interactivity#adding-state-to-a-component)
- [state構造の選択](https://ja.react.dev/learn/choosing-the-state-structure)

💡 **今日の講義は入門編。公式ドキュメントで理解を深めよう！**

---
<!-- _class: lead -->

# ご清聴<br>ありがとうございました！
