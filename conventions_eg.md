# Conventions (Final, AI-Driven)

## 1. Core Principles
- Prioritize simplicity, readability, and ease of change; emphasize stability and maintainability
- Favor bullet-friendly logic, thin abstractions, and structures that keep AI from getting lost
- One file, one responsibility; split files when roles grow
- Enforce DRY / KISS / YAGNI  
  - KISS: Avoid heavy abstractions, deep inheritance, and pattern overload; prefer readability and changeability; ban structures that confuse AI  
  - YAGNI: No speculative features or future optimizations; implement only current requirements  
  - DRY: No duplicated knowledge/logic/validation/text; keep a Single Source of Truth; factor shared logic into functions, shared types under `types/`, translations under `assets/translations`

## 2. Directory Layout and Imports
- Separate by responsibility (`ui/`, `logic/`, `db/`, `src/`, etc.)
- Do not mix page and domain logic in the same function
- Use root-based absolute imports; avoid relative imports
- Do not hardcode text in code; always import from `assets/translations/*.json`
- Place UI components by domain; do not use atomic design
- Split `logic/` by domain and re-export from `index.ts`

## 3. File Naming
- Components: PascalCase
- Logic: camelCase aligned to main behavior
- DB helpers: camelCase
- Types: PascalCase
- Utils: camelCase
- API routes: `route.ts`
- CSS: kebab-case

## 4. File Structure and Coding Rules
- Every function requires JSDoc (summary, params, returns, errors unless Result-based). No file-level header comments. Comments in English only; emphasize “why”
- Excluding comments, backend/lib/utils/CRUD functions: max 40 lines per function and 80 chars per line (UI components exempt)
- Logic functions must have clear inputs/outputs; keep side effects local
- Limit in-function nesting (if/switch) to 3 levels; split functions if more complex

## 5. Implementation Policies
- Never place business logic on the frontend
- Decide the component skeletons before development
- UI copy policy: no hardcoded strings in components. All UI text comes from `assets/translations/<lang>.json`, with keys grouped by domain. Key structure defaults to `<domain>.<feature>.<element>`
- Page components contain no business logic. Domain logic lives in `logic/`; domain UI in `src/components/<domain>`; hooks manage local form/state; keep components single-responsibility
- When UI updates server state, call `logic/` via `app/api/**/route.ts`; API route filename is fixed to `route.ts`

## 6. Error Handling
- Throwing is allowed inside API routes (Next.js catches)
- Logic returns `Result`; throwing inside logic/utils is forbidden. CSV failures return an error `Result<null>`. UI handles failures at boundaries

## 7. Testing
- `logic/` requires unit tests
- UI tests are snapshot-optional
- CRUD/CSV/time-series work must start with mock data before implementation

## 8. AI Review Policies
- Review types
  1. Implementation Review: Only comments (no code). Check spec alignment, separation of concerns, potential TS strict errors, error handling fitness, CSV/IO consistency, security risks, unintended side effects/races, line-count/line-length rules, and UI→logic boundaries
  2. Test Review: Only comments. Confirm happy/path coverage, edge/boundary tests, reproducible CSV/IO writes, Result error branches, and mock-first adherence. Flag missing tests without providing code
  3. Meta Review: Evaluate alignment with Conventions.md / AGENTS.md / AI/function.md, design direction/fitness, separation of concerns, component boundaries, naming consistency, proper abstraction depth, DRY/KISS/YAGNI compliance, hidden tech debt, communicative structure, and long-term maintainability  
     - Timing: run as needed (ideally periodic)  
     - Output: bullet-only findings with rationale; no code generation  
     - Bans: no micro-tuning (renames/small logic tweaks), no reviews on vague requests, no baseless comments, keep improvement suggestions minimal
- Constraints: AI must not directly modify PR code (suggestions allowed). Comments must be concise bullets

## 9. Branch Strategy
- Branch naming: feature `feature/<domain>/<name>`, bugfix `fix/<issue-or-domain>`, refactor `refactor/<domain>`, chores/settings `chore/<name>` (e.g., `feature/board/create-board`, `fix/task/move-order`)
- Model: no direct pushes to `main`. Integrate into `dev`; merge to `main` with CI once stable. Keep `main` always buildable
- Feature rules: one feature per branch; aim for ≤200-line PRs (not strict)
- AI-driven notes: do not let AI change outside branch scope; avoid “optimize everything” asks; for dependencies, favor mock-first to enable parallel work
