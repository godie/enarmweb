# Palette's Journal

## 2024-05-23 - [Theme Toggle Accessibility and Delight]
**Learning:** Transitioning from non-semantic `<a>` tags to `<button>` elements in navigation bars improves accessibility (ARIA compliance) without breaking layouts when using Materialize CSS `btn-flat` classes and careful inline height/padding adjustments. Adding a CSS transition to the `body` selector provides a global "delight" factor during theme switching.
**Action:** Always prefer `<button>` for action-triggering elements even in navigation bars, and consider global transitions for state changes that affect the entire UI.

## 2025-05-15 - [Accessible Interactive Cards and Semantic Feedback]
**Learning:** In applications using Materialize CSS, interactive cards are often implemented as `<div>` elements with `onClick`. To make them accessible, they must have `role="button"`, `tabIndex={0}`, and handle keyboard events (Enter/Space) via `onKeyDown`. Additionally, feedback icons (like correct/incorrect markers) should not be wrapped in `<a>` tags with `href="#!"` but rather in semantic elements with clear `aria-label` descriptions to ensure screen readers convey the outcome.
**Action:** Always audits non-button interactive elements for keyboard support and ensure status-indicating icons are descriptive for assistive technologies.
