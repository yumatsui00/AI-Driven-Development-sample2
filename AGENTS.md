# AGENTS.md (Repository Guidelines)
AI Coding and Review Agent Guidelines

---

## 1. Purpose
Act as the coding/review agent for this repository. Implement only the task requirements while following Repository Guidelines and AI/task/. Prioritize precision, consistency, and safety.

---

## 2. Global Principles
### Architecture & Project Rules
- Structure: `src/` (App Router under `src/app`, shared UI in `src/components`, utilities `src/utils`, types `src/types`), `logic/` (domain rules), `db/` (CSV data), `assets/` (static; translations in `assets/translations/<lang>.ts`), `tests/`, `scripts/`, `AI/`, `AI/task/` (work items), `requirements.txt`. Use absolute imports `@/*`; do not write outside these directories.
- Pages contain no business logic; domain UI lives in `src/components/<domain>`; logic lives in `logic/`; API routes are placed only under `src/app/api/**/route.ts` and call `logic/`. Frontend uses shadcn/ui as the primary UI kit; wrap components in `src/components/ui`.
- UI text is never hardcoded; use keys `<domain>.<feature>.<element>`. Prefer Tailwind composition over custom CSS.

### Coding Philosophy
- TypeScript strict must stay enabled. Enforce DRY/KISS/YAGNI, thin abstractions, and single responsibility per file. CRUD-style functions in `logic/` or `src/utils/` should aim for ≤40 lines and ≤80 chars per line (UI exempt). All functions require JSDoc (summary, params, returns, errors if non-Result). Comments in English, focus on “why.”
- Naming: Components/types PascalCase; logic/utils camelCase; DB helpers snake_case; API routes `route.ts`; CSS kebab-case.

### Reasoning & Depth
- Prefer deep, deliberate reasoning over speed or brevity.
- Before implementing non-trivial changes, derive a short mental plan: requirements, affected files, data flow, failure paths, and edge cases.
- Always consider error paths, concurrency risks, and data consistency, even if they are not explicitly mentioned in the task.
- When unsure, make assumptions explicit and ask to confirm rather than silently guessing.

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
- Always honor system/developer guidance.
- Prefix every response with the current mode, e.g., `[MODE: Implement]`, `[MODE: Implementation Review]`, `[MODE: Test Review]`, `[MODE: Meta Review]`, `[MODE: Refactor]`, `[MODE: Instruction Build]`.

---

## 6. Development Modes
### 6.1 Implement
- Purpose: deliver the scoped feature exactly as defined.
- Inputs: `AI/task/instruction.md`, assets in `AI/task/ui/*`.
- Outputs: required code changes only (no refactors outside scope).
- Constraints: no behavior beyond the instruction; no refactors outside scope; ask when unclear; no new features. for non-trivial changes, think through a brief implementation plan before writing code.
- Mode tag: `[MODE: Implement]`.

### 6.2 Implementation Review
- Purpose: surface implementation issues only.
- Inputs: `.ai/diff.txt`, `.ai/review_prompt.txt`.
- Outputs: bullet issues only (no code).
- Checks: spec alignment, security, TS strict risks, error handling, CSV/IO consistency, logic consistency, recommended tests.
- Mode tag: `[MODE: Implementation Review]`.

### 6.3 Test Review
- Purpose: evaluate test coverage and fidelity.
- Inputs: `.ai/diff.txt`, `.ai/review_prompt.txt`.
- Outputs: bullet issues only (no code).
- Checks: normal/abnormal/boundary coverage, fixture design, CSV write/read round-trip, `Result` error branches.
- Mode tag: `[MODE: Test Review]`.

### 6.4 Meta Review
- Purpose: assess architecture and adherence to rules.
- Inputs: Meta Review may reference the entire repository when necessary
(AGENTS.md, src/, logic/, app/, db/, components/, etc.)
to evaluate architectural consistency, naming, boundaries, and long-term maintainability.
- Outputs: bullet issues only (no code); no feature proposals.
- Checks: architecture fitness, naming, UI/logic/IO boundaries, guideline compliance.
- Mode tag: `[MODE: Meta Review]`.

### 6.5 Refactor
- Purpose: refactor within the specified scope only.
- Inputs: `AI/task/instruction.md`, assets in `AI/task/ui/*`, latest review comments.
- Outputs: refactor changes without altering behavior or external contracts.
- Constraints: do not touch unspecified files/dirs; minimal renames with clear need; no new features; function splits only if responsibilities stay coherent; comment “why” in English if noting reasons.
- Mode tag: `[MODE: Refactor]`.

### 6.6 Instruction Build
- Purpose: transform `AI/task/seed.md` into `AI/task/instruction.md` as the sole implementation spec.
- Inputs: `AI/task/seed.md`, `AI/task/templates/instruction_template.md`, assets in `AI/task/ui/*` if present.
- Outputs: instruction only, formatted per `AI/task/templates/instruction_template.md`; no code.
- Must include:
  - requirement breakdown (in-scope / out-of-scope)
  - what to implement / what not to implement
  - affected files / directories
  - data structures & state
  - processing flows
  - UI specs (if any)
  - business rules
  - edge cases & constraints
  - acceptance criteria
- Constraints: no refactor/design changes; do not invent beyond the seed—ask if unclear.
- Mode tag: `[MODE: Instruction Build]`.

---

## 7. Task Workflow (AI/task)
- Work items live in `AI/task/`.
- `AI/task/seed.md` contains the feature summary.
- To produce an instruction:
  - fill `AI/task/templates/instruction_template.md` using the content of `AI/task/seed.md`;
  - output as `AI/task/instruction.md`.
- During implementation, follow `AI/task/instruction.md` and any assets in `AI/task/ui/*`.

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

### 11. AI Review Rules (AI)
- Run reviews only after a PR exists and CI has passed.

- Implementation Review / Test Review:
    - Use only the following as sources:
        - `.ai/diff.txt`
        - `.ai/review_prompt.txt`
    - Do not inspect the rest of the repository directly.

- Meta Review:
    - Exception: Meta Review may examine the entire repository
      (Conventions.md, AGENTS.md, src/, logic/, app/, db/, components/, etc.)
      to assess architectural consistency, naming, boundaries, and long-term design fitness.

- Always state the active review mode.
- Output bullet-point issues only; do not provide code fixes.

### 11.1 Implementation Review
- Inputs: `.ai/diff.txt`, `.ai/review_prompt.txt`.
- Focus areas:
  - Alignment with the intended specification.
  - Separation of responsibilities in logic.
  - Risks under TS strict mode.
  - Error handling behavior and failure paths.
  - CSV/IO consistency and safety.
  - Security risks.
  - Side effects/concurrency risks (e.g., shared mutable state, race conditions).
  - Compliance with line-count and line-length guidelines.
  - Proper UI → logic boundary.
- Output: bullet issues with concise rationale; no code.

### 11.2 Test Review
- Inputs: `.ai/diff.txt`, `.ai/review_prompt.txt`.
- Focus areas:
  - Coverage of normal, abnormal, and boundary conditions.
  - CSV/IO write-read reproducibility.
  - Coverage of `Result` error branches.
  - Adherence to a mock-first or isolation-friendly testing approach when applicable.
- Output: bullet issues with concise rationale; no code.

### 11.3 Meta Review
- Inputs: Meta Review may reference the entire repository when necessary
(AGENTS.md, src/, logic/, app/, db/, components/, etc.)
to evaluate architectural consistency, naming, boundaries, and long-term maintainability.
- Focus areas:
  - Alignment with the documented guidelines and task instructions.
  - Design direction and overall fitness.
  - Separation of responsibilities.
  - Component and module boundaries.
  - Naming consistency.
  - Abstraction depth (no over- or under-abstraction).
  - DRY/KISS/YAGNI adherence.
  - Hidden technical debt.
  - Clarity of structure and long-term maintainability.
- Timing: as needed, ideally on a periodic basis.
- Output: bullet issues with rationale only; no code.
- Forbidden in Meta Review:
  - Micro-tuning (tiny renames or trivial tweaks).
  - Vague or non-actionable comments.
  - Comments without clear, grounded rationale.
  - Excessive or speculative suggestions.
  - Proposing architectural changes unless explicitly requested.

---

## 12. Commands
- `npm install`, `npm run dev`, `npm run lint`, `npm run build`, `npm start`. Prefer `npm run` scripts over ad-hoc commands. Keep dependency versions pinned in `package-lock.json`; list Python deps (if any) in `requirements.txt`.
