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

## 2025-05-28 - [Accessible Password Visibility and Decorative Icon Defaults]
**Learning:** Removing `tabIndex={-1}` from custom password toggle buttons ensures they are reachable by keyboard users, while adding a circular `borderRadius` and adequate `padding` provides clear focus feedback. Furthermore, defaulting `CustomIcon` to `aria-hidden="true"` promotes a cleaner experience for screen readers by treating all icons as decorative unless explicitly marked otherwise, preventing redundant announcements.
**Action:** Always ensure interactive toggles are keyboard-accessible and default decorative icons to be hidden from the accessibility tree.

## 2025-05-29 - [Standardized Loading and Password Toggle Consistency]
**Learning:** Standardizing loading states using centralized component props (like `isPending` in `CustomButton`) improves code maintainability and visual consistency. However, when using custom colors for spinners (like `pendingColor`), they must match existing CSS classes (e.g., `spinner-yellow-only`) to ensure visibility. Additionally, providing a `passwordToggleClassName` prop in `CustomTextInput` allows for proper contrast of the visibility toggle icon across different background colors (e.g., `white-text` for dark backgrounds).
**Action:** Always verify that custom component colors are supported by the underlying CSS framework and ensure high contrast for all interactive elements.

## 2025-06-03 - [Theme-Aware Containers and Hover Tooltips]
**Learning:** Hardcoded Materialize color classes like `white` or `white-text` on main layout containers (e.g., `card-panel`, `card`) block theme-aware CSS variables from functioning in dark mode. Removing these classes allows the CSS variables in `theme.css` to properly apply themed backgrounds and text colors. Additionally, providing a native `title` attribute to icon-only buttons (like password toggles) offers a simple, accessible tooltip for mouse users without adding extra library dependencies.
**Action:** Audit layout containers for hardcoded color classes and always provide native tooltips for interactive icons.

## 2025-06-04 - [Spanish Localization Consistency and Interactive Card Accessibility]
**Learning:** Maintaining consistent language throughout the interface (e.g., using 'Inicio' instead of 'Home' in a Spanish UI) improves the professional feel and predictability of the application. Furthermore, adding dynamic ARIA labels to interactive elements that don't have explicit text (like selection cards) to reflect their current state ('Seleccionar' vs 'Deseleccionar') is crucial for screen reader users to understand the effect of their actions.
**Action:** Always audit navigation links for language consistency and provide state-aware ARIA labels for non-semantic interactive cards.

## 2025-06-05 - [Exam Orientation and Progress Feedback]
**Learning:** For multi-step assessments or exams, providing clear orientation through question numbering (e.g., "1. ¿Cuál es el diagnóstico?") and visual progress feedback (using a determinate progress bar) significantly improves user confidence and reduces cognitive load. Using Materialize's `progress` and `determinate` classes with CSS transitions ensures the feedback feels smooth and professional.
**Action:** Always include sequential numbering for ordered lists of interactive items and provide a visual indicator of overall completion for multi-step processes.

## 2025-06-06 - [Standardized Required Indicators and Spanish UI Quality]
**Learning:** Centralizing the visual and semantic treatment of required fields (e.g., a red asterisk `*` and `aria-required="true"`) in base components like `CustomTextInput` ensures a consistent and accessible experience across all forms without duplicating logic. Additionally, meticulous attention to Spanish orthography (e.g., 'Clínico' vs 'Clinico', 'Ocurrió' vs 'Ocurrio') significantly elevates the professional feel of the application for native speakers.
**Action:** Always provide standardized visual cues for mandatory fields in base components and maintain strict linguistic standards for localized interfaces.

## 2025-06-12 - [Maximizing Clickable Areas and Robust Input Grouping]
**Learning:** In collection-based form inputs (like exam questions), moving padding from the `<li>` to a full-width block `label` maximizes the interactive hit area, significantly improving the user experience on both desktop and touch devices. Furthermore, using indices (e.g., `questionIndex`) instead of text for input `name` and `id` attributes ensures robust grouping and accessibility even when multiple questions share identical text.
**Action:** Always wrap collection-item inputs in full-width block labels and use stable, unique indices for input grouping.

## 2025-06-13 - [Required Indicators and Character Counters for Improved Form Guidance]
**Learning:** Adding standardized required indicators (red asterisk and `aria-required`) and character counters (via `data-length`) to contribution forms provides essential guidance for users, reducing uncertainty and improving data quality. When these visual cues are added, automated tests using `getByLabelText` must be updated to use regex matching to accommodate the newly added asterisk in the label text.
**Action:** Always provide visual and semantic cues for required fields and character limits in user-facing forms, and ensure test locators are robust to these UI decorations.
