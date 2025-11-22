# Implementation Instruction

> This document is the **sole specification** for the feature.  
> The AI must implement strictly according to this instruction.  
> No refactors, no assumptions beyond this content.

---

## 1. Overview
A concise description of the feature, expanded from the seed summary.  
Include the purpose, problem being solved, and high-level behavior.

---

## 2. Scope

### In Scope
List everything that **must** be implemented.  
(Features, UI elements, logic, APIs, data changes, behaviors, etc.)

### Out of Scope
List anything **not included** in this feature.  
(Prevents AI from adding unrequested logic or UI.)

---

## 3. Affected Files & Locations
List all files to be newly created, modified, or referenced.

- New files
- Modified files
- Unchanged but relevant reference files
- Directory paths (`src/...`, `logic/...`, `db/...`)

**The AI must not modify files outside this list.**

---

## 4. Data Structures & Models
Define all relevant data:

- Types / Interfaces
- CSV columns and expected values
- IDs and relationships
- Required fields and constraints

If modifying existing structures, specify exact diffs.

---

## 5. Logic Specification
Describe the logic in complete detail:

### 5.1 Inputs
What data enters this logic, from where (UI/API/CSV).

### 5.2 Processing Flow
Step-by-step description of what must happen.

(Use bullets or numbered steps. AI must follow exactly.)

### 5.3 Outputs
Define return values, updated CSVs, generated IDs, UI state updates, etc.

### 5.4 Error Handling
Specify all expected error states and how they should be represented (`Result<T>`, error codes, messages, fallback flows).

---

## 6. UI Specification (if applicable)
Describe all UI elements:

- Component structure
- Props / states
- Display rules
- Interaction patterns (click / hover / navigation)
- Layout notes
- Text keys (never hardcoded, always using translations)

If images exist in `AI/task/ui/*`, reference them clearly.

---

## 7. Edge Cases & Constraints
Enumerate all non-happy-path behaviors:

- Empty data
- Invalid inputs
- Duplicate names / ID conflicts
- IO failures
- Concurrency issues
- CSV update collisions
- Navigation failures

AI must treat these as required handling, not optional.

---

## 8. Acceptance Criteria
Define "Done" precisely:

- Behavior is correct based on this document
- All edge cases handled
- Code stays within scoped files
- Follows AGENTS.md conventions (naming, CSV rules, Result, etc.)
- Passes linting and TypeScript strict
- No refactors / no additional features

These criteria control when the AI should stop implementing.

---

## 9. Questions (if the seed was incomplete)
If any part of the seed was ambiguous, list requested clarifications here.  
AI must not assume unspecified behavior.

