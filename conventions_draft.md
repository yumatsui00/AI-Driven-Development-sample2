慣習のドラフト（AI駆動ベース）

1. 基本方針
    ・シンプル、読みやすい、修正しやすいを最優先とする
    ・安定性、保守性を優先
    ・箇条書きで見やすいロジック
    ・抽象化は薄く
    ・AIが迷わない構造を必ず採用する
    ・1ファイル1責務を原則とし、役割が増える場合はファイル分割する
    ・DRY/KISS/YAGNI 原則にしたがって記述する
    - **KISS（Keep It Simple, Stupid）**
    ・実装は常にシンプルであることを最優先とする  
    ・複雑な抽象化、深い継承、パターン過多を避ける  
    ・読みやすさ、理解しやすさ、変更しやすさを重視  
    ・AI が誤解するような複雑な構造は禁止
    - **YAGNI（You Aren’t Gonna Need It）**
        ・「必要になるかもしれない」機能の先回り実装を禁止  
        ・仕様で求められていない要素、未来想定の最適化は行わない  
        ・実装は常に現時点の要件に限定し、拡張は要求が出てから
    - **DRY（Don’t Repeat Yourself）**
        ・同じ知識・ロジック・バリデーション・テキストを複数箇所に書かない  
        ・単一の情報源（Single Source of Truth）を必ず維持  
        ・共通処理は関数化、共通型は types/ に集約  
        ・翻訳テキストは assets/translations に一元化する

2. ディレクトリ構造とImportルール
    ・ui/, logic/, db/, src/のように、ディレクトリは責務ごとに明確に分ける
    ・ページとロジックを一つの関数に混ぜない
    ・インポートする際はプロジェクトルートからのimportで、相対パスを避ける
    ・コードに文章のベタ書きはせず、assets/transaltions/---.jsonからimportする形式を取る
    ・UI/components は domain-based に配置し、atomic design を採用しない
    ・logic/ は domain 単位でフォルダを分け、index.ts からまとめて export する

3. ファイルの命名規則
    - Components: PascalCase files; logic: camelCase file name aligned with the main behavior; DB helpers: camelCase; types: PascalCase; utils: camelCase; API routes use `route.ts`; CSS uses kebab-case.

4. ファイル構成、コーディング規約
    ・All functions require JSDoc (summary, params, returns, errors if not Result-based). No file-level header comments. Comments in English only; prefer “why” over “what.”
    ・コメントは除き、backend / lib / utils / CRUDの関数は1関数当たり40行以内、１行80文字以内とする。UIコンポーネントにこのルールは適用しない
    ・ロジック関数は入出力が明確で、副作用は局所化する
    ・関数内のネスト（if/switch）は原則3段以内とする。複雑になる場合は関数分割する。
    ・

5. 実装方針
    ・フロント側でビジネスロジックを絶対に書かない（禁止）
    ・開発前に使用するコンポーネントの大枠を決める
    ・- UI copy policy: no hardcoded strings in components. All UI text must be sourced from translation files under `assets/translations/<lang>.json`, with keys grouped by domain. Components may import translation helpers/objects but must not inline literals.・翻訳キーは `<domain>.<feature>.<element>` の3段構成を原則とする。
    ・- Page components contain no business logic. Place domain logic in `logic/`; domain UI goes under `src/components/<domain>`; hooks manage local form/state; keep components single-responsibility.
    - UI がサーバー状態を更新する場合は `app/api/**/route.ts` の API 経由で `logic/` を呼び出す。API ルート名は `route.ts` 固定。

6. エラーハンドリング方針
    ・API route 内では例外を throw してよい（Next.js が catch するため）
    - Logic returns `Result` types; throwing in logic/utils is forbidden. CSV failures return an error `Result<null>`. UI handles failures at the boundary.

7. テスト方針
    ・logic/ は unit test を必須とする
    ・UI は snapshot test のみ任意
    ・CRUD/CSV/時系列系は mock data を先に作ってから実装

8. AIレビュー方針
    - レビューの種類：
        (1) Implementation Review（実装レビュー）
            - 以下の観点でコメント（指摘）のみを行う。修正コードは生成しない。
                ・仕様との整合性
                ・ロジックの責務分離
                ・TypeScript の strict エラーの可能性
                ・エラーハンドリングの妥当性
                ・CSV/IO の整合性
                ・セキュリティリスク
                ・予期せぬ副作用や競合リスク
                ・関数行数／1行文字数ルール遵守
                ・UI → logic の境界が守られているか

        (2) Test Review（テストレビュー）
            - テストケースが以下の観点を満たしているかを確認する：
                ・正常系／異常系の網羅
                ・境界値テスト
                ・CSV/IO の書き込みの再現性
                ・Result 型のエラー分岐の確認
                ・Mock-first 原則の遵守
            - 必要なテストが不足している場合はコメントのみで指摘し、修正コードは生成しない。
        (3) Meta Review (全体レビュー)
            - Meta Review の目的：
                ・AI が生成したコードが、プロジェクト全体の設計思想と整合しているかを確認する
                ・Conventions.md / AGENTS.md / AI/function.md との整合性を保証する
                ・実装の「品質」ではなく、実装の「方向性」や「設計としての妥当性」を評価する
                ・長期的な保守を妨げる設計的アンチパターンを検出する

            - Meta Review のタイミング：
                ・必要なタイミングで適宜実行（理想は定期実行)

            - Meta Review の観点：
                ・仕様のブレや曖昧さがないか
                ・責務分離が守られているか
                ・コンポーネント境界が適切か（UI にロジックが入り込んでいないか）
                ・命名規則が一貫しているか
                ・抽象化レベルが適切か（抽象化しすぎ／浅すぎを避ける）
                ・DRY/KISS/YAGNI 原則が破られていないか
                ・AI が生成した“隠れ技術的負債”がないか
                ・コードの目的が読み手に伝わる構造になっているか
                ・長期的保守・拡張に耐えられる設計になっているか

            - Meta Review の出力形式：
                ・「指摘事項のみ」を箇条書きでまとめる
                ・修正コードは生成しない（方向性のみを述べる）
                ・コメントは必ず根拠付きで行う
                ・AGENTS.md、AI/function.md、Conventions.md から逸脱している箇所を明示する

            - Meta Review の禁止事項：
                ・実装の微調整（命名修正や小規模ロジック調整）はしない
                ・要望が曖昧な状態でのレビューは行わない
                ・「なんとなく」のコメントは禁止（基準を必ず提示）
                ・改善提案を行う場合も、実装変更提案は最小限に留める

    - レビューの制約：
    - AI は PR のコードを直接修正してはならない（修正案の提示は可）。
    - コメントは必ず箇条書きで、簡潔かつ明確にする。

9. ブランチ戦略方針
    - Branch naming rules:
        ・機能追加：`feature/<domain>/<name>`
        ・バグ修正：`fix/<issue-or-domain>`
        ・リファクタリング：`refactor/<domain>`
        ・雑務／設定：`chore/<name>`
        ・例：`feature/board/create-board`, `fix/task/move-order`

    - Branching model:
        ・`main` には直接 push しない
        ・`dev` に統合し、安定時に `main` へ merge（CI 必須）
        ・`main` は常にビルド成功状態を維持する（破壊禁止）

    - Feature development rules:
        ・1 ブランチは 1 機能のみ（複数混ぜない）
        ・PR は 200 行以内（AI のレビュー効率向上のため）を意識する（絶対ではない）

    - AI 駆動作業時の注意：
        ・AI にブランチの範囲外の変更をさせない
        ・AI に「まとめて最適化」は依頼しない
        ・依存関係がある場合は mock-first で並列化できるよう調整する

