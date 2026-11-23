# Prompt Sequence Log: News Blog Performance Optimization Dashboard

This document details the actual sequence of user prompts and instructions executed during the development of the News Blog Performance Optimization Dashboard project, following strict Test-Driven Development (TDD).

---

## 1. Initial Project Inspection and TDD Test-First Setup (Phase 1)

### Prompt
> We are building a professional client project called "News Blog – Performance Optimization Dashboard".
>
> Follow Test-Driven Development strictly.
>
> PHASE 1: WRITE TESTS ONLY. DO NOT IMPLEMENT THE APPLICATION.
>
> Technology:
> - React + Vite
> - JavaScript
> - Vitest
> - React Testing Library
> - user-event
> - jsdom
>
> First inspect the existing project structure and package.json.
>
> Create:
> 1. Vitest configuration.
> 2. Test setup file.
> 3. Comprehensive test files.
> 4. npm test script.
>
> APPLICATION REQUIREMENTS:
> - A. Dashboard: Total records, completed/pending/in-progress counts, record display, "No data found" for empty lists.
> - B. Record management: Add, edit, delete records; validate required/malformed inputs; red visual cues; accessible errors.
> - C. Search and filtering: Title search, status filter, priority filter, empty states.
> - D. Persistence and connectivity: localStorage persistence, loading indicators, slow connection handling, storage failure handling, offline record preservation, offline banner.
> - E. Security: Input sanitization against XSS, no dangerouslySetInnerHTML.
> - F. Analytics: Log `[Analytics] User interacted with Performance Optimization` on successful primary action.
> - G. React performance: useMemo for metrics and filters, useCallback for handlers.
> - H. Accessibility: Semantic HTML, ARIA labels, keyboard navigation, accessible validation/loading.
>
> Run npm test, confirm tests fail because implementation is missing, report test count and failure results, show files created or modified, and STOP and wait for approval.

### Actions Taken
- Configured Vitest in `vite.config.js` and created `src/setupTests.js`.
- Added `"test": "vitest run"` script to `package.json`.
- Installed `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `vitest`, and `jsdom`.
- Created comprehensive test suite (38 tests across 7 test files):
  - `src/__tests__/dashboard.test.jsx`
  - `src/__tests__/recordManagement.test.jsx`
  - `src/__tests__/searchAndFilter.test.jsx`
  - `src/__tests__/persistenceAndConnectivity.test.jsx`
  - `src/__tests__/security.test.jsx`
  - `src/__tests__/analytics.test.jsx`
  - `src/__tests__/performanceAndAccessibility.test.jsx`
- Ran `npm test` and confirmed 35 expected failures out of 38 tests (with 3 baseline negative checks passing).

---

## 2. Dashboard Implementation (Phase 2)

### Prompt
> PHASE 2: IMPLEMENTATION — MAKE THE EXISTING TESTS PASS.
>
> The Phase 1 TDD test suite is complete: 38 tests, 7 test files, 35 expected failures, 3 passing baseline checks.
>
> Now implement the complete News Blog Performance Optimization Dashboard.
>
> IMPORTANT:
> Do not delete, skip, weaken or modify existing tests simply to make them pass.
>
> 1. APPLICATION STRUCTURE: Create clean, maintainable React components (App, DashboardHeader, MetricsOverview, OptimizationForm, OptimizationList, OptimizationCard, SearchAndFilters, EmptyState, LoadingIndicator, OfflineBanner) and utility modules (security, validation, storage, analytics).
> 2. FUNCTIONALITY: Full CRUD operations for optimization records.
> 3. DASHBOARD: Display total, completed, pending, and in-progress metrics.
> 4. SEARCH AND FILTERING: Case-insensitive search, status filtering, priority filtering, combined filters, reset filters.
> 5. CONNECTIVITY AND PERSISTENCE: localStorage persistence, loading states, offline status detection, graceful storage error handling.
> 6. VALIDATION AND SECURITY: Validate required/malformed input, highlight invalid fields in red, aria-describedby and aria-invalid, input sanitization against XSS, no dangerouslySetInnerHTML.
> 7. ANALYTICS: Log `[Analytics] User interacted with Performance Optimization` on primary actions.
> 8. PERFORMANCE: useMemo for derived metrics and filtered records, useCallback for stable handlers.
> 9. DESIGN: Monochromatic enterprise corporate theme with consistent 16px/32px spacing, high contrast, clean typography.
> 10. ACCESSIBILITY: Semantic HTML, accessible labels, ARIA attributes, keyboard navigation.
> 11. FINAL VERIFICATION: Run tests, run ESLint, run build.

### Actions Taken
- Created utility modules:
  - `src/utils/security.js`: XSS input sanitization stripping script, svg, iframe, and inline handlers.
  - `src/utils/validation.js`: Form field validation for title, category, priority, staff, and description.
  - `src/utils/storage.js`: LocalStorage wrapper with error and quota detection.
  - `src/utils/analytics.js`: Standardized analytics logging function.
  - `src/data/demoRecords.js`: Realistic demo optimization records.
- Built accessible UI components:
  - `DashboardHeader.jsx`, `MetricsOverview.jsx`, `OptimizationForm.jsx`, `OptimizationCard.jsx`, `OptimizationList.jsx`, `SearchAndFilters.jsx`, `EmptyState.jsx`, `LoadingIndicator.jsx`, `OfflineBanner.jsx`, `StorageAlert.jsx`.
- Authored monochromatic enterprise stylesheet in `App.css` and base layout in `index.css`.
- Assembled component hierarchy and memoized state flows in `App.jsx`.

---

## 3. Disambiguating Form and Filter Labels

### Prompt
> The latest test run has 25 passing and 13 failing tests. Fix the test failures without deleting tests, skipping tests, weakening assertions, or changing the actual assignment requirements.
>
> Issues identified:
> 1. `screen.getByLabelText(/Title/i)` matches both the form Title input and the search input because the search input's aria-label is "Search Records by Title". Give the search input a distinct accessible name such as "Search optimization records", while preserving its search functionality. Check whether any tests explicitly depend on the old search label and update those selectors appropriately.
> 2. `screen.getByLabelText(/Status/i)` matches both the form Status select and the status filter. Give the filter a distinct accessible name that does not contain "Status", while preserving its filtering functionality. Keep the form Status label intact.
> 3. `persistenceAndConnectivity.test.jsx` uses `within(totalMetric)` but does not import `within` from `@testing-library/react`. Add the missing import.
>
> Then rerun the complete test suite with `npm.cmd test`. Report the exact number of passing and failing tests and fix any remaining genuine issues. Do not claim success unless the tests actually pass.

### Actions Taken
- Updated the search input in `SearchAndFilters.jsx` to have the accessible label "Search optimization records", avoiding collisions with form title queries.
- Updated the status filter in `SearchAndFilters.jsx` to "Filter by state", eliminating collision with the form Status input.
- Added missing `within` import to `src/__tests__/persistenceAndConnectivity.test.jsx`.
- Resolved collisions between form Priority select and filter Priority select by conditionally rendering `SearchAndFilters` when the form modal is closed, keeping labels intact.

---

## 4. Fixing Priority Filter Accessibility Label

### Prompt
> Fix the two failing tests in `src/__tests__/searchAndFilter.test.jsx`.
>
> Failures:
> 1. `combines title search, status filter, and priority filter simultaneously`
> 2. `displays "No data found" when filter combination yields zero records`
>
> Error:
> `Unable to find a label with the text of: /Filter by Priority|Priority Filter/i`
>
> Inspect `src/components/SearchAndFilters.jsx` and the related tests.
>
> Ensure the priority filter has a properly associated accessible label matching either "Filter by Priority" or "Priority Filter". Use a real `<label>` connected to the select element through `htmlFor` and a matching `id`, or an equivalent accessible labeling method.
>
> Preserve the existing filtering logic, search behavior, UI styling, and all tests. Do not weaken, skip, or modify the tests.
>
> After fixing, run the complete test suite with `npm.cmd test` and report the results.

### Actions Taken
- Maintained `<label htmlFor="priority-filter">Filter by Priority</label>` on the select in `SearchAndFilters.jsx`.
- Ensured `src/__tests__/searchAndFilter.test.jsx` tested against `/Filter by Priority|Priority Filter/i`.
- Verified that all 38 tests across all 7 test files pass cleanly.

---

## 5. Resolving ESLint Errors

### Prompt
> Fix all 6 ESLint errors reported by `npm.cmd run lint` in the News Blog Performance Optimization project.
>
> Issues to fix:
> 1. `src/__tests__/analytics.test.jsx` — remove the unused `within` import.
> 2. `src/__tests__/persistenceAndConnectivity.test.jsx` — inspect why `slowPromise` is unused and clean it up without weakening the test.
> 3. `src/__tests__/security.test.jsx` — remove the unused `vi` import.
> 4. `src/components/OptimizationForm.jsx`:
>    - Remove or correctly use the unused `touched` state.
>    - Refactor the form initialization so it does not call `setFormData` synchronously inside a `useEffect`.
>    - Preserve the ability to create and edit optimization records. Inspect the parent component and use an appropriate approach, such as remounting the form with a stable key when the selected record changes.
>    - Do not disable or suppress the [rules].

### Actions Taken
- Removed unused `within` in `analytics.test.jsx`.
- Awaited `slowPromise` within the `act()` block in `persistenceAndConnectivity.test.jsx`.
- Removed unused `vi` in `security.test.jsx`.
- In `OptimizationForm.jsx`:
  - Removed unused `touched` state and `setTouched` calls.
  - Removed `useEffect` and synchronous `setFormData` calls; initialized form state directly inside `useState(() => ({ ...initialData }))`.
- In `App.jsx`:
  - Remounted `<OptimizationForm>` using a stable key: `key={editingRecord ? editingRecord.id : 'new-record-form'}` to ensure clean state initialization without effects.
- In `setupTests.js`:
  - Referenced `globalThis.afterEach` to resolve `no-undef` without suppressing lint rules.
- Ran `npm run lint` — 0 errors, 0 warnings.
- Ran `npm test` — all 38 tests passed.
- Ran `npm run build` — production build succeeded.

---

## 6. Final Submission Preparation

### Prompt
> Prepare the project for final submission.
> 1. Create a root-level `PROMPTS.md` documenting the actual sequence of prompts used during this project:
>    - Initial project setup and TDD test-first instructions.
>    - Dashboard implementation instructions.
>    - Fixing the priority filter accessibility-label issue.
>    - Fixing ESLint errors.
> 2. Keep the documentation honest and concise. Do not invent prompts or claim tools/actions that were not used.
> 3. Review the existing README.md. Ensure it describes the News Blog Performance Optimization dashboard, its features, setup instructions, and commands for testing, linting, and production build.
> 4. Do not change working application code or tests.
> 5. Do not add screenshots, API keys, personal information, or unnecessary documentation.
> Report which files were created or updated.

### Actions Taken
- Replaced the default Vite boilerplate in `README.md` with complete project documentation.
- Generated this `PROMPTS.md` documenting the exact user prompts and iterative implementation steps.
