import '@testing-library/jest-dom';
import 'setimmediate';
import { vi } from 'vitest';

globalThis.jest = vi;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const mockM = {
   updateTextFields: vi.fn(),
   FormSelect: {
      init: vi.fn(() => ({ destroy: vi.fn() })),
   },
   Modal: {
      init: vi.fn(() => ({ destroy: vi.fn() }))
   },
   Tooltip: {
      init: vi.fn(() => ({ destroy: vi.fn() }))
   },
   Sidenav: {
      init: vi.fn(() => ({ destroy: vi.fn() }))
   },
   Dropdown: {
      init: vi.fn(() => ({ destroy: vi.fn() }))
   },
   FloatingActionButton: {
      init: vi.fn(() => ({ destroy: vi.fn() }))
   },
   toast: vi.fn(),
   validate_field: vi.fn()
};

vi.stubGlobal('M', mockM);
vi.stubGlobal('google', {
   accounts: {
      id: {
         initialize: vi.fn(),
         renderButton: vi.fn(),
         prompt: vi.fn(),
      },
   },
});
vi.stubGlobal('FB', {
   init: vi.fn(),
   login: vi.fn(),
   api: vi.fn(),
   getLoginStatus: vi.fn(),
});

vi.mock('@materializecss/materialize', () => ({
   Forms: {
      updateTextFields: vi.fn(),
   },
   FormSelect: {
      init: vi.fn(() => ({ destroy: vi.fn() })),
   },
   CharacterCounter: {
      init: vi.fn(() => ({ destroy: vi.fn() })),
   },
   Sidenav: {
      init: vi.fn(() => ({ destroy: vi.fn() })),
   },
   Modal: {
      init: vi.fn(() => ({ destroy: vi.fn() })),
   },
   Dropdown: {
      init: vi.fn(() => ({ destroy: vi.fn() })),
   },
   Tooltip: {
      init: vi.fn(() => ({ destroy: vi.fn() })),
   },
   FloatingActionButton: {
      init: vi.fn(() => ({ destroy: vi.fn() })),
   },
}));

// Mock CSS
vi.mock('./index.css', () => ({}));
vi.mock('./App.css', () => ({}));