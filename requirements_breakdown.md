# 要件分解（Requirements Breakdown）

## 1. 概要
Trello風のプロジェクト管理アプリ。  
Project → Board → List → Task の4階層構造で管理し、ドラッグ＆ドロップでの並び替えや移動をサポートする。

---

## 2. 機能カテゴリ
以下の3カテゴリに分けて整理する：

### 🟢 2.1 完全並列可能（mock不要）
- Landing Page
- Auth Pages（signin / signup）
- middleware（認証リダイレクト処理）
- CSV Utility（read / write / update）
- Project CRUD（create / list / update）

---

### 🟡 2.2 mock があれば並列可能（データ依存のみ）
- Board CRUD（project_id が必要）
- Board ページ（/project/:id/boards）
- List CRUD（board_id が必要）
- List ページ（/board/:id）
- Task CRUD（list_id が必要）
- Project / Board / List / Task Delete（CSV レイヤーを直接操作するため mock があれば可能）

---

### 🔴 2.3 mock があっても並列不可（構造依存）
- Task Move（ドラッグ＆ドロップでの List 間移動）
  - 理由：  
    - 複数の List が必要  
    - order の再計算が必要  
    - Task.update / List.update / CSV複数更新を横断的に使うため  

---

## 3. Page（UI）構造と依存
/home 🟢（独立）
└── Project一覧 🟢（独立）
└── /project/:id/boards 🟡（project_id 依存、mockあれば可）
└── /board/:id 🟡（board_id 依存、mockあれば可）

---

## 4. Logic（ドメインロジック）と依存
Project CRUD 🟢（最上位、依存なし）
└─ Board CRUD 🟡（project に依存）
└─ List CRUD 🟡（board に依存）
└─ Task CRUD 🟡（list に依存）
└─ Task Move 🔴（強依存・mock不可）

---

## 5. 各機能の詳細

### 5.1 Landing Page（🟢 独立）
- アプリの最初のページ
- Auth 状態に応じて /home or /signin に遷移

---

### 5.2 middleware（認証制御／🟢 独立）
- 未認証ユーザー → /signin に強制リダイレクト
- 認証済みユーザー → /home
- ページ遷移ごとに updated_at を更新

---

### 5.3 Auth Pages（🟢 独立）
- /signin
- /signup

---

### 5.4 Project CRUD（🟢 最上位）
- `createProject(name)`
- `listProjects()`
- `updateProject(id, name)`
- Delete は mock があれば可能（関連 Board を CSV で直接削除）

---

### 5.5 Board CRUD（🟡 project 依存）
- `createBoard(project_id)`
- `listBoards(project_id)`
- `updateBoard(id)`
- Delete（List/Task の一括削除を含む）

---

### 5.6 List CRUD（🟡 board 依存）
- `createList(board_id)`
- `updateList(id, title)`
- `reorderLists(board_id, new_order)`
- Delete（Taskの一括削除）

---

### 5.7 Task CRUD（🟡 list 依存）
- `createTask(list_id)`
- `updateTask(id, title, description)`
- `deleteTask(id)`
- `reorderTasks(list_id, new_order)`

---

### 5.8 Task Move（ドラッグ＆ドロップ／🔴 複数階層依存）
- List A → List B への移動
- order の再計算が必要
- 単一 List の reorder とは別ロジック
- mock があっても並列不可（最終フェーズ）

---

### 5.9 CSV Utility（🟢 独立）
- `readCsv(file)`
- `writeCsv(file, data)`
- `updateRow`, `deleteRows`, `filterRows`
- 全ロジックがこのレイヤーで完結

---

## 6. 依存関係マトリクス

| 機能 | 依存 | mock必要 | 並列可能 |
|------|------|----------|----------|
| Landing | なし | 不要 | 🟢 |
| Auth Pages | なし | 不要 | 🟢 |
| middleware | なし | 不要 | 🟢 |
| Project CRUD | なし | 不要 | 🟢 |
| Board CRUD | Project | 必要 | 🟡 |
| List CRUD | Board | 必要 | 🟡 |
| Task CRUD | List | 必要 | 🟡 |
| Delete（全階層） | 上位階層 | 必要 | 🟡 |
| Task Move | List & Task & order | 必要 | 🔴 |

---

## 7. 実装順序（AI駆動向け推奨）
1. CSV Utility（独立）
2. middleware
3. Auth Pages
4. Project CRUD
5. Board CRUD（mock）
6. List CRUD（mock）
7. Task CRUD（mock）
8. Delete系（mock）
9. Task Move（最終フェーズ）

---

## 8. テスト（tests/fixtures）
以下を tests/ に配置し、mockデータとして全レイヤー並列を可能にする：

tests/fixtures/projects.csv
tests/fixtures/boards.csv
tests/fixtures/lists.csv
tests/fixtures/tasks.csv

---

## 9. 注意事項（AI用）
- Delete系は下位レイヤーのロジックを呼ぶのではなく **CSVレイヤーで直接削除する**  
- Task Move は CRUD 完了後に実装する  
- 全てのページで updated_at を更新（middlewareで実装）  
- D&D は UI + Logic の複合処理として扱う  
