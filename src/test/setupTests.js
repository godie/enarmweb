import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';

vi.mock('@materializecss/materialize', async () => {
  const actual = await vi.importActual('@materializecss/materialize');
  const createInstance = () => ({ destroy: vi.fn(), open: vi.fn(), close: vi.fn() });

  return {
    ...actual,
    FormSelect: {
      ...(actual.FormSelect || {}),
      init: vi.fn(() => createInstance()),
    },
    Tooltip: {
      ...(actual.Tooltip || {}),
      init: vi.fn(() => createInstance()),
    },
    CharacterCounter: {
      ...(actual.CharacterCounter || {}),
      init: vi.fn(() => createInstance()),
    },
    Modal: {
      ...(actual.Modal || {}),
      init: vi.fn(() => createInstance()),
    },
    Forms: {
      ...(actual.Forms || {}),
      textareaAutoResize: vi.fn(),
    },
  };
});

const ensureMaterializeGlobal = () => {
  if (!globalThis.M) globalThis.M = {};

  if (!vi.isMockFunction(globalThis.M.toast)) globalThis.M.toast = vi.fn();
  if (!vi.isMockFunction(globalThis.M.updateTextFields)) globalThis.M.updateTextFields = vi.fn();
  if (!vi.isMockFunction(globalThis.M.validate_field)) globalThis.M.validate_field = vi.fn();

  if (!globalThis.M.Modal) globalThis.M.Modal = {};
  if (!vi.isMockFunction(globalThis.M.Modal.init)) {
    globalThis.M.Modal.init = vi.fn(() => ({ open: vi.fn(), close: vi.fn(), destroy: vi.fn() }));
  }

  if (!globalThis.M.FormSelect) globalThis.M.FormSelect = {};
  if (!vi.isMockFunction(globalThis.M.FormSelect.init)) {
    globalThis.M.FormSelect.init = vi.fn(() => ({ destroy: vi.fn() }));
  }
};

ensureMaterializeGlobal();

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
let _capturedConsoleError;
let _capturedConsoleWarn;

// Patterns that indicate test-quality issues (act warnings, prop leaks, controlled inputs)
const CONSOLE_ERROR_PATTERNS = [
  /not wrapped in act/i,
  /changing an uncontrolled/i,
  /does not recognize the.*prop/i,
  /checked.*onChange/i,
  /value.*onChange/i,
  /validateDOMNesting/i,
];
const CONSOLE_WARN_PATTERNS = [
  /not wrapped in act/i,
  /changing an uncontrolled/i,
  /does not recognize the.*prop/i,
];

function hasBadConsoleCall(calls, patterns) {
  return calls.some(args =>
    args.some(arg =>
      typeof arg === 'string' && patterns.some(p => p.test(arg))
    )
  );
}

function formatCalls(calls) {
  return calls.map(c => c.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')).join('\n');
}

beforeEach(() => {
  ensureMaterializeGlobal();
  globalThis.M.toast.mockClear();
  globalThis.M.updateTextFields.mockClear();
  globalThis.M.validate_field.mockClear();
  globalThis.M.Modal.init.mockClear();
  globalThis.M.FormSelect.init.mockClear();
  _capturedConsoleError = console.error = vi.fn();
  _capturedConsoleWarn = console.warn = vi.fn();
});

afterEach(() => {
  const skipChecks = globalThis.__SKIP_CONSOLE_CHECKS__;
  globalThis.__SKIP_CONSOLE_CHECKS__ = false;
  const errors = _capturedConsoleError.mock.calls;
  const warns = _capturedConsoleWarn.mock.calls;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;

  if (!skipChecks && hasBadConsoleCall(errors, CONSOLE_ERROR_PATTERNS)) {
    const bad = errors.filter(args =>
      args.some(arg => typeof arg === 'string' && CONSOLE_ERROR_PATTERNS.some(p => p.test(arg)))
    );
    throw new Error(
      `Unexpected console.error warning(s) during test:\n${formatCalls(bad)}`
    );
  }
  if (!skipChecks && hasBadConsoleCall(warns, CONSOLE_WARN_PATTERNS)) {
    const bad = warns.filter(args =>
      args.some(arg => typeof arg === 'string' && CONSOLE_WARN_PATTERNS.some(p => p.test(arg)))
    );
    throw new Error(
      `Unexpected console.warn warning(s) during test:\n${formatCalls(bad)}`
    );
  }
});
