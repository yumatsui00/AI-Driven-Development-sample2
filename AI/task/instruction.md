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
Enable a gated login flow for the landing page so only authenticated users can navigate beyond `src/app/page.tsx`. When a user logs in via the existing landing page login control (and any signup flow), persist a login flag, redirect them to a new protected home page, and provide sign-out. Middleware must enforce redirects for unauthenticated access to any non-landing routes. This extends the current landing experience with basic auth gating and navigation without altering the existing authentication data model.

---

## 2. Scope

## 2.1 In Scope (MUST implement)

- [ ] Wire the landing page login button to perform the login flow; on success, persist the login state (client storage + middleware-readable cookie) and navigate to `/home`.
- [ ] Ensure signup success follows the same post-auth handling (set login state + redirect to `/home`); add minimal client handling if the signup entry point exists in the UI.
- [ ] Add middleware that checks the persisted login indicator for all navigations except allowed public routes and redirects unauthenticated users to `/`.
- [ ] Create a protected home page at `src/app/home/page.tsx` with translation-driven content and a sign-out button that clears login state and returns to `/`.
- [ ] Add or update shared auth-state helper(s) to keep login flag management (localStorage + cookie) in one place for reuse across pages/components.
- [ ] Add translation keys for all new UI copy (home page text, sign-out CTA, any auth status messaging) using the repository key naming rules.

## 2.2 Out of Scope (MUST NOT implement)

- No changes to authentication data models or CSV schemas.
- No redesign of the existing landing page beyond hooking the login button behavior.
- No new pages or navigation flows beyond `/home` and the middleware gating described.
- No refactors of unrelated components, utilities, or styling systems.
- No new endpoints or backend data persistence beyond what is required to support the login state cookie.
- No hard-coded UI text; all new copy must use translation keys.

---

# 3. Affected Files & Locations

> The AI may only create or modify files listed here.  
> All other files are strictly off-limits.

## 3.1 New Files
- `src/app/home/page.tsx`: Protected home page with translated content and a sign-out button.
- `src/middleware.ts`: Middleware enforcing redirects for unauthenticated requests to protected routes.
- `src/utils/auth/state.ts` (or similarly named under `src/utils/auth/`): Shared helpers to set/clear/read login indicators across localStorage and cookies for client components.

## 3.2 Modified Files
- `AI/task/instruction.md`: This instruction document.
- `src/app/page.tsx`: Update login button behavior to trigger the auth flow, persist login state, and route to `/home`.
- `src/app/api/auth/login/route.ts`: (Only if needed) adjust response handling to align with the login state cookie contract.
- `src/app/api/auth/signup/route.ts`: (Only if needed) adjust response handling to align with the login state cookie contract.
- `src/app/api/auth/logout/route.ts`: (Only if needed) clear the login cookie on logout.
- `assets/translations/en.ts`: Add translation keys for the new home page and auth messaging.

## 3.3 Reference Only (MUST NOT modify)
- `AGENTS.md`
- `AI/task/templates/instruction_template.md`
- Existing components, translations, and logic not listed above

---

# 4. Data Structures & Models

## 4.1 TypeScript Interfaces / Types

No new data models are required; reuse existing auth types. The auth-state helper should expose typed functions such as:

```ts
export const setLoginState = (): void => { /* sets localStorage + cookie */ };
export const clearLoginState = (): void => { /* clears localStorage + cookie */ };
export const isLoggedInClient = (): boolean => { /* reads from cookie/localStorage */ };
```

## 4.2 CSV / Database Schema

- No CSV or database schema changes are introduced for this feature.

**Login State Persistence**
- Local storage key: `login` with string value `"true"` when authenticated.
- Cookie key: `login` with value `"true"` to be read by middleware; absence or any other value means unauthenticated.

---

# 5. Logic Specification

## 5.1 Inputs

- User interaction with the landing page login button.
- User completion of the signup flow (if present in the UI) after existing validation.
- Navigation requests to routes other than `/`.
- Sign-out button interaction on the protected home page.
- Existing auth API responses for login and signup success/failure.

## 5.2 Processing Flow (Strict Order)

**Login flow**
1. Trigger login via existing auth API/logic when the landing login control is used.
2. On successful response, set the `login` flag in localStorage and set the `login` cookie.
3. Navigate the user to `/home`.
4. If login fails, do not set login state; surface an error per existing patterns and remain on the current page.

**Signup flow**
1. On successful signup, set the `login` flag in localStorage and set the `login` cookie.
2. Navigate the user to `/home`.
3. On failure, do not set login state; keep the user on the current page and show/record the error per existing patterns.

**Middleware**
1. Intercept all requests except explicitly allowed paths (`/`, `/favicon.ico`, `/robots.txt`, assets under `/_next/`, and API routes unless authentication should guard them).
2. Read the `login` cookie.
3. If the cookie is not `"true"`, redirect to `/`.
4. Allow navigation when the cookie is `"true"`.

**Sign-out**
1. When the sign-out button is used on `/home`, clear the `login` flag from localStorage and the cookie.
2. Redirect back to `/`.

## 5.3 Outputs

- Redirect to `/home` after successful login or signup.
- Redirect to `/` from middleware when unauthenticated users attempt to access protected pages.
- Redirect to `/` after sign-out.
- Login state persisted in both localStorage and cookie when authenticated; cleared when signed out.

## 5.4 Error Handling

- Authentication or signup failures must not set login state or redirect; handle errors via existing UI/console patterns.
- Middleware treats any missing or malformed login cookie as unauthenticated.
- API failures should be logged with `console.error` at the boundary per repository rules.

---

# 6. UI Specification (If applicable)

## 6.1 Component Structure

- `HomePage` (`src/app/home/page.tsx`): Client component using translations, showing protected content and a sign-out button bound to the auth-state helper.

## 6.2 Layout & Behavior

- Landing page (`src/app/page.tsx`) keeps its current design; only the login button behavior changes to initiate login and redirect to `/home` on success.
- Home page uses Tailwind utility classes (no custom CSS) for a simple layout displaying a title/description and a sign-out button.
- Sign-out button clears login state and redirects to `/`; disable or show loading only if needed for API calls.
- No hard-coded text; use translation keys for all new labels/body copy (e.g., `home.protected.title`, `home.protected.description`, `home.protected.signOut`).

## 6.3 Translations

- Add new translation entries (at minimum):
  - `home.protected.title`
  - `home.protected.description`
  - `home.protected.signOut`
  - Any error/status copy introduced for login/signup handling
- Follow the existing translation typing and key structure.

---

# 7. Edge Cases & Constraints

- Direct navigation to `/home` or any non-root page without a `login` cookie redirects to `/`.
- Missing or cleared localStorage entry while cookie is present should still pass middleware (server-side cookie is the source of truth); client UI should reconcile state on load.
- Clearing cookies or localStorage should log the user out and trigger redirect on next navigation.
- Middleware must not block static assets or API routes needed for the app to function.
- TypeScript strict mode must be preserved; avoid `any`.
- UI text must use translation keys; no literals.

---

# 8. Acceptance Criteria (Definition of Done)

- Landing login button and signup completion set both localStorage and cookie login flags on success and redirect to `/home`.
- Middleware redirects unauthenticated users from all protected routes to `/` and allows authenticated navigation.
- `/home` page exists, renders translated content, and provides a working sign-out that clears login state and returns to `/`.
- Only files listed in Section 3 are created or modified; no other code paths are touched.
- All new text uses translation keys added to `assets/translations/en.ts`.
- No changes to CSV schemas or auth data models; existing logic contracts remain intact.
- Code follows AGENTS.md rules (architecture boundaries, Result usage, translation requirements).
- No lint or TypeScript strict errors introduced.

---

# 9. Questions / Ambiguities

- [ ] Middleware cannot read localStorage; confirm that using a non-HTTP-only `login` cookie (mirroring localStorage) is acceptable to satisfy the middleware check.
- [ ] Should `/` redirect to `/home` automatically when a valid `login` cookie is present, or should landing remain accessible to authenticated users?
- [ ] Where should the signup UI live (if any)? No signup entry point exists on `src/app/page.tsx`; confirm whether to add a signup control or integrate with an existing UI. 
