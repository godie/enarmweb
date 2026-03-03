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

beforeEach(() => {
  ensureMaterializeGlobal();
  globalThis.M.toast.mockClear();
  globalThis.M.updateTextFields.mockClear();
  globalThis.M.validate_field.mockClear();
  globalThis.M.Modal.init.mockClear();
  globalThis.M.FormSelect.init.mockClear();
});
