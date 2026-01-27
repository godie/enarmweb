# Palette's Journal

## 2024-05-23 - [Theme Toggle Accessibility and Delight]
**Learning:** Transitioning from non-semantic `<a>` tags to `<button>` elements in navigation bars improves accessibility (ARIA compliance) without breaking layouts when using Materialize CSS `btn-flat` classes and careful inline height/padding adjustments. Adding a CSS transition to the `body` selector provides a global "delight" factor during theme switching.
**Action:** Always prefer `<button>` for action-triggering elements even in navigation bars, and consider global transitions for state changes that affect the entire UI.
