# 開発慣習（確定版・AI駆動ベース）

## 1. 基本方針
- シンプル・読みやすい・修正しやすいを最優先し、安定性と保守性を重視する
- 箇条書きで見やすいロジック、薄い抽象化、AI が迷わない構造を採用する
- 1 ファイル 1 責務が原則。役割が増える場合はファイルを分割する
- DRY / KISS / YAGNI を徹底する  
  - KISS: 複雑な抽象化・深い継承・パターン過多を避け、読みやすさ・変更しやすさを優先。AI が誤解する複雑構造は禁止  
  - YAGNI: 未来のための先回り実装や不要な最適化を禁止。現時点の要件に限定する  
  - DRY: 知識・ロジック・バリデーション・テキストの重複禁止。Single Source of Truth を維持し、共通処理は関数化、共通型は `types/`、翻訳は `assets/translations` に集約

## 2. ディレクトリ構造と Import ルール
- `ui/`, `logic/`, `db/`, `src/` など責務ごとに明確に分ける
- ページとロジックを同一関数に混在させない
- インポートはプロジェクトルートからの絶対パスを使い、相対パスを避ける
- コードに文章をベタ書きしない。必ず `assets/translations/*.json` から import する
- UI コンポーネントはドメイン単位に配置し、atomic design は採用しない
- `logic/` はドメイン単位でフォルダ分割し、`index.ts` からまとめて export する

## 3. ファイルの命名規則
- Components: PascalCase
- Logic: 主機能に合わせた camelCase
- DB helpers: camelCase
- Types: PascalCase
- Utils: camelCase
- API routes: `route.ts`
- CSS: kebab-case

## 4. ファイル構成・コーディング規約
- すべての関数に JSDoc を付与（概要・params・returns・Result 以外なら errors）。ファイル先頭のヘッダーコメントは禁止。コメントは英語のみで「why」を優先
- コメントを除き、backend / lib / utils / CRUD の関数は 1 関数 40 行以内、1 行 80 文字以内（UI コンポーネントは除外）
- ロジック関数は入出力を明確にし、副作用は局所化する
- 関数内ネスト（if/switch）は 3 段以内。複雑になる場合は関数分割する

## 5. 実装方針
- フロント側にビジネスロジックを置かない
- 開発前に使用コンポーネントの大枠を決める
- UI コピー方針: コンポーネントにハードコード文字列を置かない。全 UI テキストは `assets/translations/<lang>.json` から取得し、キーはドメイン単位で管理。キー構造は `<domain>.<feature>.<element>` が原則
- Page コンポーネントはビジネスロジックを持たない。ドメインロジックは `logic/`、ドメイン UI は `src/components/<domain>`、hooks でローカル state/form を扱う。コンポーネントは単一責務に徹する
- UI がサーバー状態を更新する場合は `app/api/**/route.ts` の API 経由で `logic/` を呼ぶ。API ルート名は `route.ts` 固定

## 6. エラーハンドリング方針
- API route 内では例外 throw を許容（Next.js が catch）
- Logic は `Result` で返す。logic/utils 内での throw は禁止。CSV 失敗は `Result<null>` のエラーで返す。UI は境界で失敗を扱う

## 7. テスト方針
- `logic/` は unit test 必須
- UI は snapshot test を任意とする
- CRUD / CSV / 時系列系は mock data を先に用意してから実装する

## 8. AI レビュー方針
- レビュー種類
  1. Implementation Review（実装レビュー）  
     仕様整合性、ロジック責務分離、TS strict でのエラー可能性、エラーハンドリング妥当性、CSV/IO 整合性、セキュリティリスク、副作用/競合リスク、関数行数・1 行文字数ルール遵守、UI→logic 境界順守を指摘のみで行う（修正コードは生成しない）
  2. Test Review（テストレビュー）  
     正常/異常の網羅、境界値、CSV/IO 書き込み再現性、Result 型のエラー分岐、Mock-first 原則遵守を確認。不足は指摘のみ（修正コードは生成しない）
  3. Meta Review（全体レビュー）  
     Conventions.md / AGENTS.md / AI/function.md との整合、設計方向性・妥当性、責務分離、コンポーネント境界、命名一貫性、適切な抽象化、DRY/KISS/YAGNI 遵守、隠れ負債、目的が伝わる構造、長期保守性を評価する
     - 実行タイミング: 必要に応じて随時（理想は定期）
     - 出力形式: 指摘事項のみを箇条書き。根拠を必ず記載。修正コードは生成しない
     - 禁止事項: 微調整（命名修正・小規模ロジック調整）や曖昧な要望でのレビュー、根拠なしコメント、過剰な改善提案は禁止
- レビュー制約: AI は PR コードを直接修正しない（修正案提示は可）。コメントは必ず箇条書きで簡潔に

## 9. ブランチ戦略方針
- Branch naming rules:  
  機能追加 `feature/<domain>/<name>`、バグ修正 `fix/<issue-or-domain>`、リファクタ `refactor/<domain>`、雑務/設定 `chore/<name>`（例: `feature/board/create-board`, `fix/task/move-order`）
- Branching model:  
  `main` に直接 push しない。`dev` に統合し、安定時に CI を通して `main` へ merge。`main` は常にビルド成功を維持
- Feature development rules:  
  1 ブランチ 1 機能。PR は 200 行以内を意識（絶対ではない）
- AI 駆動作業の注意:  
  AI にブランチ範囲外の変更をさせない。「まとめて最適化」を依頼しない。依存関係がある場合は mock-first で並列化できるよう調整する
