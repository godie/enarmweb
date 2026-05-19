# Project Instructions

## Package Manager
- **Use npm exclusively** for dependency management and scripts (`npm start`, `npm test`, `npm lint`, `npm run build`).
- Do NOT use pnpm or yarn.
- Always use `--legacy-peer-deps` when running `npm install` or `npm ci` if needed, as per current project standards.

## GitHub Actions
- The CI/CD pipeline is configured to use `npm`.
- Ensure `package-lock.json` is always updated and committed when changing dependencies.

## Testing Standards

### Console Warning Interceptor
All tests run through a global interceptor in `src/test/setupTests.js` that fails tests on specific console.error/console.warn patterns. This catches test-quality issues before they reach CI.

**Blocked patterns (console.error):**
| Pattern | Issue | Common Cause |
|---|---|---|
| `not wrapped in act` | Async state update after test ends | API mock resolves after `await waitFor(() => {})`; loading state mock never resolves |
| `changing an uncontrolled` | Input rendered without `onChange` handler | Mock form with initial undefined `value`; component renders without controlled prop |
| `does not recognize the.*prop` | Invalid prop passed to DOM element | Passing `noMargin` or other custom props directly to `<div>`/`<select>` |
| `checked.*onChange` / `value.*onChange` | Missing onChange on controlled input | Render with `checked` or `value` but no `onChange` |
| `Received \`.+?\` for a non-boolean attribute` | Boolean-like prop leaked to DOM | Passing `noMargin` or similar to DOM elements |
| `Invalid DOM property` | Wrong prop casing on DOM element | Using camelCase prop that should be kebab-case |
| `validateDOMNesting` | Invalid DOM nesting | `<a>` inside `<a>`, `<form>` inside `<form>`, etc. |
| `Each child in a list should have a unique.*key` | Missing key in list render | Map over items without `key` prop |
| `value prop on %s should not be null` | Null value on input | Passing `null` to `value` prop |

**Blocked patterns (console.warn):** Same set (act, uncontrolled, prop leaks, keys).

### Avoiding act() Warnings
For "renders loading state initially" tests: make the primary API mock return a never-resolving promise so state never updates after render:

```jsx
ExamService.getCaso.mockReturnValue(new Promise(() => {})); // never resolves
render(<SomeComponent />);
// test assertions here — no async state updates will occur
```

For tests that trigger state updates (clicks, form submissions): end with `await waitFor(() => {})` to flush pending async effects:

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

fireEvent.click(screen.getByText('Submit'));
expect(screen.getByText('Saved')).toBeInTheDocument();
await waitFor(() => {}); // flushes act() from state update
```

### Using `__SKIP_CONSOLE_CHECKS__`
When a test **intentionally** triggers one of the blocked patterns (e.g., testing React's controlled/uncontrolled warning), set the flag before the action that triggers the warning:

```jsx
// Inside your test:
globalThis.__SKIP_CONSOLE_CHECKS__ = true;
// ... perform action that triggers expected warning ...
globalThis.__SKIP_CONSOLE_CHECKS__ = false; // automatically reset in afterEach, but explicit reset is fine
```

This is rarely needed. Prefer fixing the underlying issue over skipping the check.

### CI Enforcement
The GitHub Actions workflow (`.github/workflows/node.js.yml`) runs a post-test grep check that fails CI if any blocked patterns appear in test output. The pre-commit hook (`hooks/pre-commit`) runs the full test suite locally before every commit.

### Expected Console Output
Tests that exercise error paths (e.g., API failures that display error alerts) may log to `console.error` as part of normal behavior. These are **allowed** and do not fail tests — only the specific warning patterns above are blocked.

## Pre-commit Hook
A pre-commit hook runs `npx vitest run` before every commit. To set up on a fresh clone:
```bash
cp hooks/pre-commit .git/hooks/ && chmod +x .git/hooks/pre-commit
```
To bypass temporarily: `git commit --no-verify`
