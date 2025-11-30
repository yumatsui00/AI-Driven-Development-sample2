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
> The root landing page needs a design refresh inspired by the referenced Notion templates page. The page must present the project overview with a hero layout while keeping login and signup buttons visible on the top-right. The work is purely presentational: provide translated copy, layout structure, and CTA/overview text without adding auth functionality. Changes extend the existing home route and landing component only.

---

## 2. Scope

## 2.1 In Scope (MUST implement)

> A complete list of implementation tasks derived from the seed requirements.  
> This becomes the **only** set of tasks the AI is allowed to implement.

- [ ] Redesign the landing page layout to mirror the aesthetic of the Notion template listing (clean hero, centered content, ample whitespace) while fitting the existing styling approach.
- [ ] Add a top navigation bar that positions non-functional `login` and `signup` buttons on the right side.
- [ ] Surface a concise project overview/description within the hero content so visitors understand the project purpose.
- [ ] Update the `HomePage` component to render the new layout sections (header nav with buttons, hero content with overview and CTA).
- [ ] Extend translation entries to cover all displayed text (nav buttons, headings, overview text, CTA) and wire them through the page component via the translator.

## 2.2 Out of Scope (MUST NOT implement)

> Clearly lists everything that should NOT be included to prevent scope creep.

- No login or signup functionality, routing, or API calls; buttons are visual only.
- No data persistence, CSV/DB access, or backend changes.
- No modifications outside the landing page, its component, and translation entries.
- No refactoring or renaming unrelated components, utilities, or styles.
- No design changes beyond the defined landing layout updates and referenced inspiration.
- No new dependencies or global style overhauls.

---

# 3. Affected Files & Locations

> The AI may only create or modify files listed here.  
> All other files are strictly off-limits.

## 3.1 New Files
- None.

## 3.2 Modified Files
- `src/app/page.tsx`: Wire updated translation keys/props into the landing component.
- `src/components/home/HomePage.tsx`: Implement the refreshed layout (nav with login/signup buttons, hero content with overview and CTA).
- `assets/translations/en.ts`: Add translation entries for all new UI text used on the landing page.

## 3.3 Reference Only (MUST NOT modify)
- `AGENTS.md`
- `src/app/layout.tsx`, `src/app/globals.css` (style context only)

---

# 4. Data Structures & Models

> All relevant data definitions must be explicitly stated here.  
> The AI must **not** add, remove, or alter fields unless stated in this section.

## 4.1 TypeScript Interfaces / Types

```ts
export interface HomePageProps {
  title: string;
  subtitle: string;
  overviewTitle: string;
  overviewBody: string;
  ctaLabel: string;
  loginLabel: string;
  signupLabel: string;
}
```

## 4.2 CSV / Database Schema

- Not applicable; this feature does not interact with CSV/DB.

---

# 5. Logic Specification

## 5.1 Inputs

- Translated strings from `createTranslator()` for all landing page text: `home.hero.title`, `home.hero.subtitle`, `home.hero.overviewTitle`, `home.hero.overviewBody`, `home.hero.cta`, `home.nav.login`, `home.nav.signup`.
- No user inputs or external data.

## 5.2 Processing Flow (Strict Order)

1. Instantiate the translator on the home route.
2. Resolve all required translation keys listed in **Inputs**.
3. Pass the resolved strings as props to `HomePage`.
4. Render the landing layout with header navigation (login/signup buttons) and hero content (title, subtitle, overview, CTA).

## 5.3 Outputs

- Rendered landing page with updated layout and translated copy.
- No side effects, state mutations, or data writes.

## 5.4 Error Handling

- Not applicable; no logic/IO beyond translation lookup. Avoid introducing throws; rely on existing translator behavior.

---

# 6. UI Specification (If applicable)

## 6.1 Component Structure

- Component: `HomePage` in `src/components/home/HomePage.tsx`.
- Props: as defined in **4.1**; all strings are required.
- Internal state: none; purely presentational.
- Interaction: Buttons are static; no click handlers or navigation.

## 6.2 Layout & Behavior

- Header: top area aligned to the right containing `login` and `signup` buttons styled distinctly (e.g., signup emphasized). Maintain alignment consistent with the Notion template inspiration (clean, minimal).
- Hero: centered content section with prominent title and subtitle; include a concise overview block beneath or alongside subtitle to explain the project purpose; include a CTA button in the hero.
- Spacing: generous padding/spacing similar to the referenced Notion page; ensure responsiveness for mobile (stacked, centered) and desktop (spacious layout).
- Styling: continue using Tailwind utilities and the existing visual language; avoid custom CSS files; keep background consistent with current theme.
- Behavior: Buttons are non-functional; no navigation or state changes; focus on layout and visual presentation.

## 6.3 Translations

All UI text must use translation keys; no hard-coded strings.

Required keys:
- `home.hero.title`
- `home.hero.subtitle`
- `home.hero.overviewTitle`
- `home.hero.overviewBody`
- `home.hero.cta`
- `home.nav.login`
- `home.nav.signup`

---

# 7. Edge Cases & Constraints

- UI must remain legible on small screens; stack elements vertically when necessary.
- Do not introduce interactive behavior; buttons are static.
- Keep within repository Tailwind/translation patterns; avoid inline hard-coded text.
- Ensure all props are provided to `HomePage` to satisfy TypeScript strict mode (no `any`).

---

# 8. Acceptance Criteria (Definition of Done)

- Landing page visually updated per inspiration: top-right login/signup buttons and a clear hero with overview text and CTA.
- Only files in **3.2 Modified Files** are changed; no new files added.
- All text sourced from the translation system using keys listed in **6.3**.
- `HomePage` props match the structure in **4.1** and are fully supplied by `page.tsx`.
- No authentication or navigation behavior added to buttons.
- Code complies with AGENTS.md rules, TypeScript strict mode, and project conventions; no lint errors or unused variables.

---

# 9. Questions / Ambiguities

- [ ] None identified; proceed per specification.
