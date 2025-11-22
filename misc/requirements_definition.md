# Requirements Definition Document (v2)
Trello-like Project Management Application  
AI-Driven Development Template Project

---

## 1. Purpose（目的）

本プロジェクトは、Trello 風プロジェクト管理アプリを  
**AI駆動開発の雛形（テンプレート）** として構築することを目的とする。

アプリ自体の機能よりも、  
- AI が理解しやすい構造  
- 要件 → 実装 の自動化に適した分解  
- レビューしやすいレイヤー構造  
- ブランチ戦略の明確化  

など、**AI-first な開発フローを成立させること** を最重要目標とする。

---

## 2. User Types（想定ユーザー）

- 個人開発者  
- 小〜中規模チーム  
- AI駆動開発を学びたい開発者  

---

## 3. Overall Application Structure（アプリ全体構造）

アプリは次の 3 セクションで構成される：

1. **Landing Page（非ログインユーザー専用）**  
2. **Auth Pages（Signup / Login）**  
3. **App Pages（ログインユーザー専用）**  
   - `/home`（Project 一覧）  
   - `/project/:id/boards`（Board 一覧）  
   - `/board/:id`（Board 詳細：List & Task）  

※ AppPages 部を今回詳細化。

---

## 4. Landing Page Requirements

### 4.1 概要
- アプリ説明  
- AI駆動開発テンプレートである旨  
- Signup / Login への誘導（右上）

### 4.2 リダイレクト制御（修正版）
- **middleware にて未ログインを一括判定し、Landing へリダイレクト**

### 4.3 文言管理
- 文言は `assets/translations/jp.ts` に集約  
- JSX へのベタ書きは禁止

---

## 5. Authentication Requirements（認証）

### 5.1 認証方式
- Email + Password  
- テンプレート用途のため、**パスワードはハッシュ化しない（CSV 保管）**

### 5.2 users.csv schema
| id (UUID) | email | password | created_at | updated_at |

### 5.3 状態遷移
- 未ログイン → middleware → Landing  
- ログイン成功 → `/home`

---

## 6. App Pages（ログイン後）

---

### 6.1 共通仕様
- ページ遷移が発生するたびに **対象データ updated_at を必ず更新**  
- CSV 保存  
- UI は Trello を参考に 3 層構造（Project → Board → Board Detail）

---

## 6.2 Home（Project 一覧ページ）

- Project の一覧表示  
- Project 作成  
- Project 削除  
- 表示順は order カラムを使用  
- Project カードをクリック → `/project/:id/boards`  
- 遷移時に updated_at 更新

---

## 6.3 Boards 一覧ページ（/project/:id/boards）

- Board の一覧表示  
- Board 作成  
- Board 削除  
- 表示順は order  
- Board カードをクリック → `/board/:id`

---

## 6.4 Board 詳細ページ（/board/:id）  
（今回最も詳細化したセクション）

### 6.4.1 表示構造
