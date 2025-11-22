# AGENTS.md (Repository Guidelines)
AI Coding and Review Agent Guidelines

---

## 1. Purpose
Act as the coding/review agent for this repository. Implement only the task requirements while following Repository Guidelines, and AI/task/. Prioritize precision, consistency, and safety.

---

## 2. Global Principles
### Architecture & Project Rules
- Structure: `src/` (App Router under `src/app`, shared UI in `src/components`, utilities `src/utils`, types `src/types`), `logic/` (domain rules), `db/` (CSV data), `assets/` (static; translations in `assets/translations/<lang>.ts`), `tests/`, `scripts/`, `AI/`, `AI/task/` (work items), `requirements.txt`. Use absolute imports `@/*`; do not write outside these directories.
- Pages contain no business logic; domain UI lives in `src/components/<domain>`; logic lives in `logic/`; API routes are placed only under `src/app/api/**/route.ts` and call `logic/`. Frontend uses shadcn/ui as the primary UI kit; wrap components in `src/components/ui`.
- UI text is never hardcoded; use keys `<domain>.<feature>.<element>`. Prefer Tailwind composition over custom CSS.

### Coding Philosophy
- TypeScript strict must stay enabled. Enforce DRY/KISS/YAGNI, thin abstractions, and single responsibility per file. CRUD-style functions in `logic/` or `src/utils/` should aim for ≤40 lines and ≤80 chars per line (UI exempt). All functions require JSDoc (summary, params, returns, errors if non-Result). Comments in English, focus on “why.”
- Naming: Components/types PascalCase; logic/utils camelCase; DB helpers snake_case; API routes `route.ts`; CSS kebab-case.

### Data & CSV Rules
- No remote DB; persist CSVs in `db/` (UTF-8, LF). First row is headers and includes `order`. IDs are UUIDv4 via `generateId()`. Do not quote CSV strings; nulls are empty strings.
- All file IO goes through `src/utils/csv/`: read all → append/write all; update by ID replacement; delete by filtering; keep header-to-key 1:1.

### Error Handling & Logging
- Logic returns `Result<T>` (shared utility type); throwing inside `logic/` or `src/utils/` is forbidden. CSV failures return error `Result<null>`. UI handles failures at boundaries. Error messages are short, technical, English. Use `console.error` for errors.

### Testing Rules
- Add tests after features stabilize. Test logic only: unit for pure functions, repository for CSV IO, integration for task/project flows (create → CSV → read → delete). Mirror `logic/` and `src/utils/` under `tests/`; use fixtures in `tests/fixtures/`.
- CI on every PR: `npm ci && npm run lint && npm test`; must pass before merging.

---

## 3. Allowed Behaviors
- Modify only files explicitly in scope. Implement described features exactly with minimal code. Follow all conventions and architecture rules. During AI reviews, output comments only (no source edits).

---

## 4. Disallowed Behaviors
- Touching files or logic outside scope; refactors/renames/optimizations without request.
- Hardcoded UI strings; mixing UI and business logic; writing outside allowed directories.
- Changing CSV structure/headers; adding features not specified; returning outputs in unrequested formats.

---

## 5. Output Rules
- Implementation tasks:
  - If CLI/scripts explicitly say “summary only,” return only the summary.
  - Otherwise, include code in outputs as directed (full file, diff, etc.).
- Review tasks: bullet issues only (no code or diffs).
- Always honor Conventions and system/developer guidance.
- Prefix every response with the current mode, e.g., `[MODE: Implement]`, `[MODE: Implementation Review]`, `[MODE: Test Review]`, `[MODE: Meta Review]`, `[MODE: Refactor]`.

---

## 6. Development Modes
### 6.1 Implement
- Follow requirements exactly; no refactors beyond scope.

### 6.2 Implementation Review
- Output issues only: spec alignment, security, TS strict, error handling, CSV/IO, logic consistency, recommended tests.

### 6.3 Test Review
- Output issues only: coverage of normal/edge/error paths, fixtures, CSV round-trip, Result error branches.

### 6.4 Meta Review
- Output issues only: architecture, naming, boundaries, convention adherence; no feature proposals.

### 6.5 Refactor
- Refactor only within the specified scope. Do not change behavior or external contracts. Do not touch unspecified files/dirs. Rename minimally only when clearly necessary. No new features. Function splitting is allowed if responsibilities stay coherent. If adding a brief reason, comment in English explaining “why.”

---

## 7. Task Workflow (AI/task)
- Work items live in `AI/task/`: `task/seed.md` holds the feature summary. If instructions are requested, fill `task/templates/instruction.md` to produce `task/instruction.md` from `seed.md`. During implementation, always consult `task/instruction.md` and assets in `task/ui/` (images, etc.).

---

## 8. Safety
- Ask when uncertain; do not guess. Keep dependency versions pinned in `package-lock.json`; list Python deps (if any) in `requirements.txt`.

---

## 9. Branch Strategy (Developers)
- Branch naming: `feature/*`, `fix/*`, `refactor/*`, `chore/*`.
- No direct pushes to `main`; work on `dev`, merge to `main` when stable.
- One branch per feature/refactor. AI does not participate here.

---

## 10. PR Guidelines (Developers)
- Keep PR scope tight (aim ≤200 lines). Include summary, rationale, key changes, tests run, linked issues, UI screenshots when applicable.
- AI does not create PRs; developers own PR content and decisions.

---

## 11. AI Review Rules (AI)
- Run only after a PR exists and CI passes. Use `.ai/diff.txt` plus AGENTS.md, Conventions.md, AI/function.md as sole sources. Always state the review mode. Output bullet comments only; no code fixes.
- Implementation Review: spec alignment, logic responsibility separation, TS strict risks, error handling, CSV/IO consistency, security risks, side effects/competition risks, line-count/line-length rules, UI→logic boundary. Comments only.
- Test Review: coverage of normal/abnormal/boundary, CSV/IO write reproducibility, Result error branches, Mock-first adherence. Comments only.
- Meta Review: alignment with Conventions/AGENTS/AI/function, design direction/fitness, responsibility separation, component boundaries, naming consistency, abstraction depth, DRY/KISS/YAGNI adherence, hidden debt, communicative structure, long-term maintainability. Timing as needed (ideally periodic). Output bullet issues with rationale only; no code. Forbidden: micro-tuning (renames/small tweaks), vague requests, baseless comments, excessive suggestions.

---

## 12. Commands
- `npm install`, `npm run dev`, `npm run lint`, `npm run build`, `npm start`. Prefer `npm run` scripts over ad-hoc commands. Keep dependency versions pinned in `package-lock.json`; list Python deps (if any) in `requirements.txt`.
