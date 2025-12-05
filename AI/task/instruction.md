# Implementation Instruction

> **This document is the ONLY specification for the feature.**  
> The AI must implement **strictly** according to this instruction and repository-wide rules  
>
> **Forbidden actions**
> - Adding new features not described here  
> - Guessing or assuming unspecified behavior  
> - Refactoring unrelated code  
> - Changing data structures unless explicitly stated  
> - UI redesign  
> - Modifying any logic or files outside the defined scope 

---

## 1. Overview
Implement backend authentication capabilities (sign up, sign in, sign out) backed by a CSV datastore at `db/user.csv`. Provide logic and API routes that handle account creation, authentication, and session termination without adding any frontend UI. Persist user records with UUID identifiers, name, email, plain-text password, and timestamps while following the repository Result/CSV patterns. This is a new feature and does not extend existing authentication functionality.

---

## 2. Scope

## 2.1 In Scope (MUST implement)

- [ ] Define user and auth-related types/interfaces to represent persisted users and auth payloads, following naming conventions and TypeScript strictness.
- [ ] Establish CSV persistence for users in `db/user.csv`, including header management and read/write helpers under `src/utils/csv/` as required by repository rules.
- [ ] Implement signup logic to validate inputs, prevent duplicate users by email, create UUIDv4 IDs, set `created_at`/`updated_at`, and write to CSV using the Result pattern.
- [ ] Implement login logic that validates credentials, loads users from CSV, verifies email/password match (password stored as plain text per seed), and returns a Result with the authenticated user detail.
- [ ] Implement signout logic that returns a success Result (no persistent session state is maintained per seed).
- [ ] Expose API routes under `src/app/api/auth/*/route.ts` for signup, login, and logout that delegate to logic functions, returning appropriate HTTP responses consistent with Result outcomes.
- [ ] Add any necessary tests after flows are defined to validate logic (CSV IO, validation, success/error paths) in line with testing guidelines.

## 2.2 Out of Scope (MUST NOT implement)

- No frontend UI creation or modification.
- No refactoring unrelated modules or restructuring existing components.
- No changes to translation assets beyond what is required for API behavior (none expected).
- No new endpoints or data models outside signup/login/signout.
- No performance optimizations unrelated to the described flows.
- No modifications to files outside the Affected Files list in Section 3.

---

# 3. Affected Files & Locations

> The AI may only create or modify files listed here.  
> All other files are strictly off-limits.

## 3.1 New Files
- `db/user.csv`: CSV datastore for user records with the defined header row.
- `logic/auth/types.ts`: Defines user model and auth-related request/response types using repository naming rules.
- `logic/auth/repository.ts`: CSV access layer for users (read/write/update/delete) via `src/utils/csv/`.
- `logic/auth/service.ts`: Business logic for signup, login, and signout returning Result types.
- `src/utils/csv/index.ts` (and supporting helpers within `src/utils/csv/` as needed): Shared CSV read/write utilities per repository rules.
- `src/app/api/auth/signup/route.ts`: API handler for signup delegating to logic.
- `src/app/api/auth/login/route.ts`: API handler for login delegating to logic.
- `src/app/api/auth/logout/route.ts`: API handler for signout delegating to logic.
- `tests/logic/auth/...` (e.g., `service.test.ts`, repository tests, fixtures) to cover logic and CSV IO as required once behavior is clarified.

## 3.2 Modified Files
- `AI/task/instruction.md`: This instruction file.
- `tsconfig.json` and/or path aliases only if required to support new absolute imports (avoid unless necessary).
- Existing test setup/config files only if needed to register new tests.

## 3.3 Reference Only (MUST NOT modify)
- `AGENTS.md`
- `AI/templates/instruction_template.md`
- Existing UI components and translation files

---

# 4. Data Structures & Models

## 4.1 TypeScript Interfaces / Types

```ts
export interface User {
  id: string; // UUIDv4
  name: string; // Non-empty string
  email: string; // Valid email format, unique
  password: string; // Plain-text password per seed
  created_at: string; // ISO-8601 timestamp
  updated_at: string; // ISO-8601 timestamp
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
```

All functions must return `Result<T>` per repository rules; avoid throwing in logic/utils.

## 4.2 CSV / Database Schema

- **Target file:** `db/user.csv`
- **Column order (MUST NOT change):**
  1. `id`
  2. `name`
  3. `email`
  4. `password`
  5. `created_at`
  6. `updated_at`

**Constraints:**

- `id` is unique UUIDv4.
- `email` must be unique and valid.
- `name` must be non-empty.
- `password` is stored as plain text per seed; must be non-empty.
- `created_at`/`updated_at` must be ISO-8601 strings; `updated_at` reflects last mutation.
- CSV operations must preserve header and column order via a single atomic read-modify-write.

---

# 5. Logic Specification

## 5.1 Inputs

- `SignupInput`: user name, email, and password (plain text).
- `LoginInput`: email and password (plain text).
- Signout: no persisted session context; input limited to request context as needed for API response.
- Existing user rows loaded from `db/user.csv` via CSV utilities.
- HTTP request bodies for API routes wrapping the above inputs.

## 5.2 Processing Flow (Strict Order)

1. Validate input payloads (required fields, email format, non-empty password).
2. Load existing users from `db/user.csv` through CSV utilities.
3. For signup: check duplicate email; construct new `User` with UUID, timestamps; append to collection.
4. For login: locate user by email; verify password equality; prepare authenticated response data.
5. For signout: return success Result (no persistent session state to clear).
6. Write updates back to CSV when data changes (signup or any update paths) using atomic write.
7. Map success/failure to `Result<T>` and HTTP responses in API handlers.

## 5.3 Outputs

- `Result<User>` for successful signup.
- `Result<User>` for successful login (email/password match).
- `Result<null>` for successful signout or for IO/validation failures.
- Updated `db/user.csv` contents reflecting new users and timestamp updates.

## 5.4 Error Handling

- Use `Result` to represent validation errors (missing fields, invalid email, credential mismatch).
- Duplicate detection returns a failure `Result` with a concise technical message.
- Not found or authentication failure returns failure `Result` without leaking sensitive details.
- IO errors (read/write) return failure `Result<null>` and log with `console.error`.
- No throwing in `logic/` or `src/utils/`; errors handled at boundaries (API routes).

---

# 6. UI Specification (If applicable)

- No UI changes are required. No components, pages, or translations are added or modified.

---

# 7. Edge Cases & Constraints

- Missing CSV file should be handled by creating it with the correct header before writes.
- Duplicate email attempts must be rejected.
- Whitespace-only or empty names/emails are invalid.
- CSV corruption or IO failure should return an error Result without partial writes.
- Timestamp handling must consistently use ISO-8601; `updated_at` changes on every mutation.
- Avoid O(N²) operations when reading/writing large CSVs; use in-memory arrays after single read.
- Authentication credential storage follows seed (plain text); ensure password comparisons are exact.

---

# 8. Acceptance Criteria (Definition of Done)

- All in-scope items in Section 2.1 are fully implemented without adding scope.
- Only files listed in Section 3 are created or modified.
- `db/user.csv` uses the exact column order and constraints specified.
- Logic follows the processing flow in Section 5 and returns `Result<T>` consistently.
- No UI changes are introduced.
- Error paths for validation, duplicates, authentication failure, and IO errors are covered.
- Code adheres to AGENTS.md guidelines, TypeScript strict mode, and CSV IO conventions.
- Tests (if added) cover normal and error flows for CSV and auth logic.
- No lint errors or unused code remain.

---

# 9. Questions / Ambiguities

- None; requirements are fully specified by the seed and repository guidelines.
