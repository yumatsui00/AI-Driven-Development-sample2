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
Next.js development must be bootstrapped with an App Router, TypeScript, and Tailwind-based styling so the project can start. Provide the initial home page that renders simple introductory content using translation keys instead of hardcoded strings. Establish minimal translation utilities and configuration to support the page while keeping the structure aligned with the repository rules. This is a fresh setup, not an extension of an existing app.

---

## 2. Scope

## 2.1 In Scope (MUST implement)

> A complete list of implementation tasks derived from the seed requirements.  
> This becomes the **only** set of tasks the AI is allowed to implement.

- [ ] Initialize a Next.js App Router project with TypeScript, aligning folders under `src/` and enabling absolute imports via `@/*`.
- [ ] Configure tooling for the new project: package scripts (`dev`, `build`, `start`, `lint`), ESLint setup compatible with Next.js/TypeScript, Tailwind/PostCSS config, and Next.js runtime config.
- [ ] Add global styles using Tailwind (include base directives in `globals.css`) to support the initial page layout.
- [ ] Implement a minimal translation setup: define translation types, a helper to fetch translations with a safe fallback, and an English translation file containing the home page copy keyed as `home.landing.*`.
- [ ] Build the initial home page route using a domain component under `src/components/home/` that renders a heading and supporting text from translations; ensure the page file only wires the component and passes translation-derived props.
- [ ] Provide app-wide layout metadata and icon asset needed by Next.js (e.g., default title/description reflecting project start).

## 2.2 Out of Scope (MUST NOT implement)

> Clearly lists everything that should NOT be included to prevent scope creep.

- No additional pages, routes, or API endpoints beyond the home page.
- No business logic, CSV/DB interactions, or persistence layers.
- No integration with external services or authentication.
- No redesign beyond the simple initial layout required; avoid advanced UI kits beyond base Tailwind unless required by scope.
- No refactors or modifications to files/directories not listed in Section 3.
- No performance tuning or build pipeline changes unrelated to the initial setup.

---

# 3. Affected Files & Locations

> The AI may only create or modify files listed here.  
> All other files are strictly off-limits.

## 3.1 New Files
- `package.json`: Project metadata, Next.js/React/TypeScript dependencies, and npm scripts.
- `package-lock.json`: Locked dependency versions matching `package.json`.
- `next.config.mjs`: Base Next.js configuration (App Router defaults, React strict mode).
- `tsconfig.json`: TypeScript configuration enabling strict mode and `@/*` path aliasing into `src`.
- `.eslintrc.json`: ESLint configuration compatible with Next.js and TypeScript.
- `postcss.config.mjs`: PostCSS pipeline with Tailwind and autoprefixer.
- `tailwind.config.ts`: Tailwind configuration pointing to `src/app`, `src/components`, and `src/utils`.
- `src/app/layout.tsx`: Root layout wiring metadata, applying global styles, and rendering the app shell.
- `src/app/page.tsx`: Home route that imports translations and renders the home component.
- `src/app/globals.css`: Tailwind base/styles and minimal global styling tokens.
- `src/app/icon.svg`: App icon asset referenced by Next.js metadata.
- `src/components/home/HomePage.tsx`: Domain UI component for the home view that consumes translation-provided strings.
- `src/types/translation.ts`: Type definitions for supported locales and translation maps.
- `src/utils/translation.ts`: Helper to retrieve translation strings safely and select the active locale (default to English).
- `assets/translations/en.ts`: English translation map with `home.landing` keys used by the UI.

## 3.2 Modified Files
- No pre-existing files require modification beyond what is listed above.

## 3.3 Reference Only (MUST NOT modify)
- `AGENTS.md`
- `AI/templates/*`
- `AI/ui/*`

---

# 4. Data Structures & Models

> All relevant data definitions must be explicitly stated here.  
> The AI must **not** add, remove, or alter fields unless stated in this section.

## 4.1 TypeScript Interfaces / Types

```ts
export type Locale = "en";

export type TranslationMap = Record<string, string>;

export interface Translations {
  locale: Locale;
  entries: TranslationMap; // keys like "home.landing.title"
}
```

## 4.2 CSV / Database Schema

This feature does not interact with CSV or any database.

---

# 5. Logic Specification

## 5.1 Inputs

- Active locale (default `en`; no user input).
- Translation entries from `assets/translations/en.ts`.

## 5.2 Processing Flow (Strict Order)

1. Select the default locale (`en`) and load the corresponding translation entries.
2. Use the translation helper to resolve required keys (`home.landing.title`, `home.landing.subtitle`, `home.landing.cta` as needed) with fallback text when missing.
3. Pass the resolved strings as props to the home component.
4. Render the home component within the root layout using the global styles.

## 5.3 Outputs

- Rendered home page HTML with translated heading and supporting text.
- Metadata values (title/description) for the app, derived from translations.

## 5.4 Error Handling

- If a translation key is missing, return a safe fallback string (e.g., the key itself or a short missing-text marker) without throwing.
- No other runtime errors are expected; logic remains synchronous and local.

---

# 6. UI Specification (If applicable)

## 6.1 Component Structure

- `HomePage` (React server component) props:
  - `title: string`
  - `subtitle: string`
  - `ctaLabel?: string` (optional)
- Internal state: none.
- Layout-only responsibilities; no data fetching or side effects.

## 6.2 Layout & Behavior

- Display a primary heading and supporting paragraph using translated strings.
- Optionally render a single call-to-action button/link styled with Tailwind if `ctaLabel` is provided.
- Layout should be responsive with sensible spacing and centered content; rely on Tailwind utility classes.
- No navigation, modals, or forms; static content only.

## 6.3 Translations

- All visible text must be sourced from translation keys:
  - `home.landing.title`
  - `home.landing.subtitle`
  - `home.landing.cta` (if a CTA is shown)
- Translation strings live in `assets/translations/en.ts`; UI reads via the translation helper.

---

# 7. Edge Cases & Constraints

- Missing translation keys must not crash the page; provide a readable fallback.
- Unsupported locales should fall back to the default (`en`) without error.
- Avoid client-side only features; keep components compatible with Next.js server components.
- Keep functions small and straightforward per repository rules.
- Do not introduce hardcoded UI strings; all copy comes from translations.

---

# 8. Acceptance Criteria (Definition of Done)

- All items in **Section 2.1 (In Scope)** are fully implemented.
- Only files listed in **Section 3** are created or modified.
- Translation types and helper match **Section 4**; locale defaults to `en`.
- Home page rendering follows the flow in **Section 5** with safe fallbacks.
- UI matches **Section 6**: heading + supporting text (and optional CTA) using translations and Tailwind layout.
- No CSV/DB interactions exist.
- Code adheres to `AGENTS.md`, TypeScript strict mode, and Next.js conventions; no `any` usage.
- No lint errors; npm scripts run successfully (`npm run lint`, `npm run build` should pass after setup).
- No unused code or TODOs; no hardcoded UI text outside translation files.

---

# 9. Questions / Ambiguities

- [ ] Confirm that English (`en`) is the only required locale for now; if additional locales are needed, specify them.
- [ ] Specify preferred CTA presence/text on the home page (or confirm it can be omitted), to avoid guessing content length.
