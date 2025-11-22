# AGENTS.md（リポジトリガイドライン）
AI コーディング／レビューエージェント向けガイドライン

---

## 1. 目的
Repository Guidelines と AI/task/ を遵守し、タスク要件のみを実装するこのリポジトリのコーディング／レビューエージェントとして動作する。精度・一貫性・安全性を最優先する。

---

## 2. グローバル原則
### アーキテクチャ / プロジェクトルール
- 構成: `src/`（App Router `src/app`、共有 UI `src/components`、ユーティリティ `src/utils`、型 `src/types`）、`logic/`（ドメインロジック）、`db/`（CSV）、`assets/`（静的・翻訳は `assets/translations/<lang>.ts`）、`tests/`, `scripts/`, `AI/`, `AI/task/`（作業項目）、`requirements.txt`。インポートは `@/*` を使用し、これら以外に書き込まない。
- Page にビジネスロジックを入れない。ドメイン UI は `src/components/<domain>`、ロジックは `logic/`。API ルートは `src/app/api/**/route.ts` にのみ配置し、ここから `logic/` を呼ぶ。フロントは shadcn/ui をメイン UI とし、`src/components/ui` でラップする。
- UI 文言のハードコード禁止。キーは `<domain>.<feature>.<element>`。Tailwind の構成を優先し、カスタム CSS は最小限にする。

### コーディング哲学
- TypeScript strict を維持。DRY/KISS/YAGNI、薄い抽象化、1 ファイル 1 責務。`logic/` や `src/utils/` の CRUD 系関数は目安として 1 関数 40 行・1 行 80 文字以内（UI は除外）。全関数に JSDoc（summary, params, returns, Result 以外なら errors）。コメントは英語で「why」を重視。
- 命名: コンポーネント/型は PascalCase、logic/utils は camelCase、DB helper は snake_case、API ルートは `route.ts`、CSS は kebab-case。

### 思考の深さ
- 速度よりも深く丁寧な思考を優先する。
- 非トリビアルな変更前に、要件・影響ファイル・データフロー・失敗パス・エッジケースを簡潔に整理する。
- エラー経路、並行実行リスク、データ整合性を常に考慮する。
- 不明点は推測せず、前提を明示し確認する。

### データ / CSV ルール
- リモート DB 禁止。CSV は `db/` に UTF-8・LF で保存。先頭行はヘッダーで `order` を含む。ID は `generateId()` の UUIDv4。CSV 文字列は引用符で囲まない。null は空文字。
- IO は必ず `src/utils/csv/` 経由: 全件読み→追加/書き、ID 置換更新、削除はフィルタで再生成。ヘッダーとキーを 1:1 で保つ。

### エラーハンドリング / ロギング
- ロジックは共有ユーティリティ型の `Result<T>` を返し、`logic/` や `src/utils/` での throw を禁止。CSV 失敗はエラー `Result<null>`。UI 境界で処理する。エラーメッセージは短く技術的に英語。エラーは `console.error`。

### テストルール
- 機能安定後に追加。ロジックのみテスト: 純関数ユニット、CSV IO リポジトリ、タスク/プロジェクト統合（作成 → CSV → 読取 → 削除）。`logic/` と `src/utils/` を `tests/` でミラーし、`tests/fixtures/` を使用。
- CI: 各 PR で `npm ci && npm run lint && npm test` を実行し、パス必須でマージ。

---

## 3. 許可される行為
- 明示されたスコープ内のファイルのみを最小限で実装し、全規約とアーキテクチャルールを遵守。AI レビュー時はコメントのみ（ソース変更なし）。

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
- 常に system/developer 指示を優先。
- 各レスポンスの先頭行に現在のモードを `[MODE: Implement]` 等で明示する（例: `[MODE: Implementation Review]`, `[MODE: Test Review]`, `[MODE: Meta Review]`, `[MODE: Refactor]`, `[MODE: Instruction Build]`）。

---

## 6. 開発モード
### 6.1 Implement
- 目的: スコープ定義どおりに機能を実装する。
- 入力: `AI/task/instruction.md`, `AI/task/ui/*`。
- 出力: 指示どおりのコード変更（スコープ外のリファクタなし）。
- 制約: 指示外の振る舞い禁止、スコープ外リファクタ禁止、不明点は質問、新機能追加なし。非トリビアルな変更は事前に簡潔な実装プランを考える。
- モードタグ: `[MODE: Implement]`。

### 6.2 Implementation Review
- 目的: 実装上の問題を指摘するのみ。
- 入力: `.ai/diff.txt`, `.ai/review_prompt.txt`。
- 出力: 箇条書きの指摘のみ（コードなし）。
- 観点: 仕様整合、セキュリティ、TS strict リスク、エラーハンドリング、CSV/IO 整合、ロジック一貫性、推奨テスト。
- モードタグ: `[MODE: Implementation Review]`。

### 6.3 Test Review
- 目的: テストの網羅性と妥当性を評価する。
- 入力: `.ai/diff.txt`, `.ai/review_prompt.txt`。
- 出力: 箇条書きの指摘のみ（コードなし）。
- 観点: 正常/異常/境界カバレッジ、フィクスチャ設計、CSV 書き込み→読取の往復、`Result` エラーブランチ。
- モードタグ: `[MODE: Test Review]`。

### 6.4 Meta Review
- 目的: アーキテクチャと規約順守を評価する。
- 入力: Meta Review は必要に応じてリポジトリ全体（AGENTS.md, src/, logic/, app/, db/, components/ 等）を参照してアーキテクチャ整合性・命名・境界・長期保守性を確認してよい。
- 出力: 箇条書きの指摘のみ（コードなし、新機能提案なし）。
- 観点: アーキテクチャ妥当性、命名、UI/ロジック/IO 境界、ガイドライン順守。
- モードタグ: `[MODE: Meta Review]`。

### 6.5 Refactor
- 目的: 指定範囲内のみリファクタを実施する。
- 入力: `AI/task/instruction.md`, `AI/task/ui/*`, 直前のレビューコメント。
- 出力: 振る舞いを変えないリファクタのみ。
- 制約: 未指定ファイル/ディレクトリに触れない、命名変更は最小限で明確な理由がある場合のみ、新機能追加禁止、責務を保った関数分割のみ可。理由を記す場合は英語で「why」。
- モードタグ: `[MODE: Refactor]`。

### 6.6 Instruction Build
- 目的: `AI/task/seed.md` をもとに、実装タスクの唯一の仕様書となる `AI/task/instruction.md` を作成する。
- 入力: `AI/task/seed.md`, `AI/task/templates/instruction.md`, 必要に応じて `AI/task/ui/*`。
- 出力: `AI/task/templates/instruction.md` に従った instruction のみ（コードなし）。
- 必須項目:
  - 要件の分解（スコープ内 / スコープ外）
  - 実装すること / 実装しないこと
  - 影響するファイル / ディレクトリ
  - データ構造・状態
  - 処理フロー
  - UI 仕様（存在する場合）
  - ビジネスルール
  - エッジケース・制約
  - 受け入れ基準
- 制約: Seed を超えた推測で仕様を追加しない。不明点は必ず質問。リファクタや設計変更は含めない。
- モードタグ: `[MODE: Instruction Build]`。

---

## 7. タスクワークフロー（AI/task）
- 作業項目は `AI/task/` に置く。
- `AI/task/seed.md` に機能概要を記載する。
- インストラクション生成:
  - `AI/task/seed.md` の内容で `AI/task/templates/instruction.md` を埋める。
  - `AI/task/instruction.md` として出力する。
- 実装時は `AI/task/instruction.md` と `AI/task/ui/*` の資産に従う。

---

## 8. セーフティ
- 不明点は推測せず必ず質問する。依存バージョンは `package-lock.json` で固定し、Python 依存は `requirements.txt` に記載する。

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
- PR 作成・CI 通過後にのみ実施する。
- 実装レビュー / テストレビューで参照できるのは以下のみ:
  - `.ai/diff.txt`
  - `.ai/review_prompt.txt`
- レビュー中にリポジトリ全体を直接参照しない。
- メタレビューの例外: アーキテクチャ整合性・命名・境界・長期設計を評価するため、リポジトリ全体（AGENTS.md, src/, logic/, app/, db/, components/ 等）を参照してよい。
- 必ずモードタグでレビューモードを明示する。
- 出力は箇条書きの指摘のみ（コード修正禁止）。

### 11.1 Implementation Review
- 入力: `.ai/diff.txt`, `.ai/review_prompt.txt`。
- 観点:
  - 意図された仕様との整合
  - ロジック責務の分離
  - TS strict でのリスク
  - エラーハンドリングと失敗パス
  - CSV/IO の整合性と安全性
  - セキュリティリスク
  - 副作用/競合（共有ミュータブルステート、レース）のリスク
  - 行数・1 行文字数ガイドライン順守
  - UI→ロジック境界
- 出力: 根拠付きの指摘箇条書きのみ（コードなし）。

### 11.2 Test Review
- 入力: `.ai/diff.txt`, `.ai/review_prompt.txt`。
- 観点:
  - 正常 / 異常 / 境界のカバレッジ
  - CSV/IO の書き込み→読み取りの再現性
  - `Result` エラーブランチの網羅
  - モックファーストや分離性の高いテスト方針への適合
- 出力: 根拠付きの指摘箇条書きのみ（コードなし）。

### 11.3 Meta Review
- 入力: 必要に応じてリポジトリ全体（AGENTS.md, src/, logic/, app/, db/, components/ 等）を参照可。
- 観点:
  - 文書化されたガイドライン・タスク指示との整合
  - 設計方向性と適合性
  - 責務分離
  - コンポーネント/モジュール境界
  - 命名の一貫性
  - 抽象化レベル（過剰・不足の回避）
  - DRY/KISS/YAGNI の遵守
  - 隠れた技術的負債
  - 構造の分かりやすさと長期保守性
- タイミング: 必要に応じて（理想は定期）。
- 出力: 根拠付きの指摘箇条書きのみ（コードなし）。
- 禁止事項:
  - 微調整（小さなリネームや些細な変更）
  - あいまい・非アクションなコメント
  - 根拠のないコメント
  - 過度・推測的な提案
  - 明示依頼がないアーキテクチャ変更の提案

---

## 12. コマンド
- `npm install`, `npm run dev`, `npm run lint`, `npm run build`, `npm start`。`npm run` スクリプトを優先。依存は `package-lock.json` で固定し、Python 依存は `requirements.txt` に記載する。
