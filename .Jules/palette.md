# Palette's Journal

## 2024-05-23 - [Theme Toggle Accessibility and Delight]
**Learning:** Transitioning from non-semantic `<a>` tags to `<button>` elements in navigation bars improves accessibility (ARIA compliance) without breaking layouts when using Materialize CSS `btn-flat` classes and careful inline height/padding adjustments. Adding a CSS transition to the `body` selector provides a global "delight" factor during theme switching.
**Action:** Always prefer `<button>` for action-triggering elements even in navigation bars, and consider global transitions for state changes that affect the entire UI.

## 2025-05-15 - [Accessible Interactive Cards and Semantic Feedback]
**Learning:** In applications using Materialize CSS, interactive cards are often implemented as `<div>` elements with `onClick`. To make them accessible, they must have `role="button"`, `tabIndex={0}`, and handle keyboard events (Enter/Space) via `onKeyDown`. Additionally, feedback icons (like correct/incorrect markers) should not be wrapped in `<a>` tags with `href="#!"` but rather in semantic elements with clear `aria-label` descriptions to ensure screen readers convey the outcome.
**Action:** Always audits non-button interactive elements for keyboard support and ensure status-indicating icons are descriptive for assistive technologies.

## 2025-01-28 - [Accessible Pagination and Semantic Navigation]
**Learning:** For pagination components, adding `role="navigation"` and `aria-label` to the container, using `aria-current="page"` for the active link, and providing descriptive `aria-label` for icon-only navigation buttons significantly improves the experience for screen reader users. Decorative elements like ellipses should be spans with `aria-hidden="true"` rather than non-functional links.
**Action:** Implement semantic navigation roles and ARIA states in all reusable navigational components.

## 2025-05-20 - [Context-Aware Button Feedback and Dark Mode Compatibility]
**Learning:** In exam-taking interfaces, using context-aware button labels (e.g., "Calificar" vs "Siguiente") improves clarity of the current state. Additionally, hardcoded background classes like Materialize's `white` must be removed from main containers to allow theme-aware CSS variables to function correctly in dark mode.
**Action:** Always prefer dynamic labels for multi-state buttons and ensure layout containers don't use hardcoded color classes that override theme variables.

## 2025-05-24 - [Semantic Navbar and Localized Auth Labels]
**Learning:** In navigation menus (`<ul>`), ensuring all top-level children are wrapped in `<li>` tags maintains HTML validity. Additionally, for actions that don't navigate (like toggling form states), using `<button type="button">` with `btn-flat` is more accessible than `<a>` with `href="#!"`. Localizing core labels like "Contraseña" improves consistency in non-English interfaces.
**Action:** Always audit Navbar structure for `<li>` wrapping and prefer buttons for non-navigational actions.

## 2025-05-25 - [Consistent Loading Feedback and Accessible Errors]
**Learning:** Standardizing visual loading feedback by using `CustomPreloader` instead of plain text ("Cargando...") improves the professional feel of the app. In forms, adding `role="alert"` and `aria-live="assertive"` to error messages ensures they are announced to screen readers, while icons like `highlight_off` provide visual cues. Removing redundant `aria-label` from correctly labeled inputs prevents screen reader noise.
**Action:** Use `CustomPreloader` for all loading states and ensure error messages are both visually and semantically descriptive.

## 2025-05-26 - [Visual Context in Forms and Consistent Loading]
**Learning:** Adding Material Icons as prefixes to form inputs provides immediate visual context and improves scanability, especially in authentication forms. For dark-themed or colored containers, ensuring these icons have the correct contrast (e.g., `white-text`) is crucial. Standardizing loading feedback using `CustomPreloader` across different parts of the app (like Onboarding and Auth) creates a more cohesive and professional user experience.
**Action:** Always include relevant prefix icons in high-visibility forms and use `CustomPreloader` for all async button states to maintain UI consistency.

## 2025-05-26 - [Visual Selection Feedback and Linter Hygiene]
**Learning:** Adding a subtle background highlight (e.g., `blue lighten-5`) to selected options in lists or collections improves clarity for users during interactive tasks like taking an exam. Furthermore, maintaining strict linter hygiene (like removing unused imports) is essential for CI/CD success, even if the change itself is small.
**Action:** Always provide clear visual states for selection and ensure touched files are lint-clean.

## 2025-05-27 - [Unified Loading States and Derived ARIA Labels]
**Learning:** Centralizing loading logic within the `CustomButton` component (using `isPending` and `isPendingText` props) ensures consistent visual feedback and simplifies form components. Furthermore, automatically deriving `aria-label` from `tooltip` for icon-only buttons provides a robust accessibility fallback without requiring repetitive developer effort.
**Action:** Prefer integrated loading states in core button components and use tooltips to automatically populate ARIA labels for icon-only interactive elements.
## 2025-02-03 - [Unified Loading Feedback in Buttons and Components]
**Learning:** Moving loading logic (spinners, text, disabled state) into base components like `CustomButton` reduces boilerplate and ensures consistent UX across the app. In Spanish interfaces, using semantic icons like `check_circle` within a `valign-wrapper` in toasts provides clear, professional feedback for critical actions like saving.
**Action:** Abstract loading states into reusable UI components and always include visual markers (icons) for status updates.

## 2025-05-27 - [Accessible Specialty Cards and Project Portability]
**Learning:** Enhancing static `div` elements with `role="button"`, `tabIndex={0}`, and proper keyboard event listeners (Enter/Space) significantly improves accessibility for interactive grids. Additionally, removing hardcoded absolute paths for SSL in `vite.config.js` and preferring `https: false` in generic dev environments ensures the project remains portable and buildable for all contributors.
**Action:** Always audit interactive non-button elements for keyboard support and ensure build configuration is environment-agnostic.
