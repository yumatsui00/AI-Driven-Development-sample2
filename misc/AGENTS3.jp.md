# AGENTS.md（リポジトリガイドライン）
AI コーディング／レビューエージェント向けガイドライン

---

## 1. 目的
このリポジトリのコーディング／レビューエージェントとして、Repository Guidelines・AI/task/ を遵守し、タスク要件のみを実装する。精度・一貫性・安全性を最優先する。

---

## 2. グローバル原則
### アーキテクチャ / プロジェクトルール
- 構成: `src/`（App Router `src/app`、共有 UI `src/components`、ユーティリティ `src/utils`、型 `src/types`）、`logic/`（ドメインルール）、`db/`（CSV データ）、`assets/`（静的・翻訳は `assets/translations/<lang>.ts`）、`tests/`, `scripts/`, `AI/`, `AI/task/`（作業項目）、`requirements.txt`。インポートは `@/*` を使い、これら以外に書き込まない。
- Page にビジネスロジックを入れない。ドメイン UI は `src/components/<domain>`、ロジックは `logic/`。API ルートは `src/app/api/**/route.ts` にのみ配置し、ここから `logic/` を呼ぶ。フロントは shadcn/ui をメイン UI とし、`src/components/ui` でラップする。
- UI 文言のハードコード禁止。キーは `<domain>.<feature>.<element>`。Tailwind を基本にカスタム CSS は最小限。

### コーディング哲学
- TypeScript strict を維持。DRY/KISS/YAGNI、薄い抽象化、1 ファイル 1 責務。`logic/` や `src/utils/` の CRUD 系関数は目安として 1 関数 40 行・1 行 80 文字以内（UI は除外）。全関数に JSDoc（summary, params, returns, Result 以外なら errors）。コメントは英語で「why」を重視。
- 命名: コンポーネント/型は PascalCase、logic/utils は camelCase、DB helper は snake_case、API ルートは `route.ts`、CSS は kebab-case。

### データ / CSV ルール
- リモート DB なし。CSV は `db/` に UTF-8・LF で保存。先頭行はヘッダーで `order` を含む。ID は `generateId()` の UUIDv4。CSV 文字列は引用符で囲まない。null は空文字。
- IO は `src/utils/csv/` のみ経由: 全件読み→追加/書き、ID 置換更新、削除はフィルタで再生成。ヘッダーとキーを 1:1 で保つ。

### エラーハンドリング / ロギング
- ロジックは共有ユーティリティ型の `Result<T>` を返し、`logic/` や `src/utils/` での throw を禁止。CSV 失敗はエラー `Result<null>`。境界で UI が処理。エラーメッセージは短く技術的に英語。エラーは `console.error`。

### テストルール
- 機能安定後に追加。ロジックのみテスト: 純関数ユニット、CSV IO リポジトリ、タスク/プロジェクト統合（作成 → CSV → 読取 → 削除）。`logic/` と `src/utils/` を `tests/` でミラーし、`tests/fixtures/` を使用。
- CI: 各 PR で `npm ci && npm run lint && npm test` を実行し、パス必須でマージ。

---

## 3. 許可される行為
- 明示されたスコープ内のファイルのみ最小限で実装し、全規約とアーキテクチャルールを遵守。AI レビュー時はコメントのみ（ソース変更なし）。

---

## 4. 厳禁事項
- スコープ外の変更、依頼なしのリファクタ/改名/最適化。
- UI 文言のハードコード、UI とビジネスロジックの混在、許可外ディレクトリへの書き込み。
- CSV 構造/ヘッダー変更、未依頼機能、求められていない出力形式。

---

## 5. 出力ルール
- 実装タスク:
  - CLI やスクリプトで「サマリのみ」と明示された場合はサマリのみ返す。
  - それ以外では指示に従いコードを含む出力を行う（ファイル全体や差分など）。
- レビュータスク: 指摘の箇条書きのみ（コード・diff なし）。
- 常に Conventions と system/developer 指示を優先。
- 各レスポンスの先頭行に現在のモードを `[MODE: Implement]` 等で明示する（例: `[MODE: Implementation Review]`, `[MODE: Test Review]`, `[MODE: Meta Review]`, `[MODE: Refactor]`）。

---

## 6. 開発モード
### 6.1 Implement
- 要件どおりに実装し、スコープ外のリファクタを行わない。

### 6.2 Implementation Review
- 指摘のみ: 仕様整合、セキュリティ、TS strict、エラーハンドリング、CSV/IO、ロジック整合、推奨テスト。

### 6.3 Test Review
- 指摘のみ: 正常/異常/境界のカバレッジ、フィクスチャ、CSV 往復、Result エラーブランチ。

### 6.4 Meta Review
- 指摘のみ: アーキテクチャ、命名、境界、規約遵守。機能提案はしない。

### 6.5 Refactor
- 指定範囲内のみリファクタ可。振る舞いや外部仕様を変えない。未指定ファイル/ディレクトリは触らない。命名変更は必要最小限。新機能追加禁止。責務を保った関数分割のみ可。理由を書く場合は英語で「why」を記す。

---

## 7. タスクワークフロー（AI/task）
- `AI/task/` に作業項目を置く。`task/seed.md` に機能概要。インストラクションが必要なら `task/templates/instruction.md` を埋めて `task/instruction.md` を `seed.md` から生成。実装時は必ず `task/instruction.md` と `task/ui/`（画像など）を参照。

---

## 8. セーフティ
- 不明点は必ず確認し推測しない。依存バージョンは `package-lock.json` で固定し、Python 依存は `requirements.txt` に記載。

---

## 9. ブランチ戦略（開発者向け）
- ブランチ命名: `feature/*`, `fix/*`, `refactor/*`, `chore/*`
- `main` へ直接 push 禁止。`dev` で作業し、安定後に `main` へ。
- 1 ブランチ 1 機能（または 1 リファクタ）。AI は関与しない。

---

## 10. PR ガイドライン（開発者向け）
- PR はスコープを絞る（目安 200 行以内）。概要・理由・主要変更・テスト結果・関連 issue・UI スクショ（必要に応じ）を含める。
- AI は PR を作成せず、内容判断は開発者のみ。

---

## 11. AI レビューのルール（AI）
- PR 作成・CI 通過後にのみ実施。`.ai/diff.txt` と AGENTS.md / Conventions.md / AI/function.md のみを根拠にする。レビューモードを明示し、箇条書きの指摘のみ（修正コード禁止）。
- Implementation Review（実装レビュー）: 仕様整合、ロジック責務分離、TS strict でのエラー可能性、エラーハンドリング妥当性、CSV/IO 整合性、セキュリティリスク、副作用/競合リスク、関数行数・1 行文字数ルール遵守、UI→logic 境界をチェック。指摘のみ。
- Test Review（テストレビュー）: 正常/異常/境界値の網羅、CSV/IO 書き込み再現性、Result 型エラーブランチ、Mock-first 原則を確認。指摘のみ。
- Meta Review（全体レビュー）: Conventions/AGENTS/AI/function との整合、設計方向性・妥当性、責務分離、コンポーネント境界、命名一貫性、適切な抽象化、DRY/KISS/YAGNI 遵守、隠れ負債、目的が伝わる構造、長期保守性を評価。必要に応じ随時（理想は定期）。根拠付き指摘のみでコード禁止。微調整（命名/小規模ロジック）、曖昧レビュー、根拠なしコメント、過剰提案は禁止。

---

## 12. コマンド
- `npm install`, `npm run dev`, `npm run lint`, `npm run build`, `npm start`。`npm run` スクリプトを優先。依存は `package-lock.json` で固定し、Python 依存は `requirements.txt` に記載。
