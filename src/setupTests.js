import '@testing-library/jest-dom';
import 'setimmediate';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock CSS
jest.mock('./index.css', () => ({}));
jest.mock('./App.css', () => ({}));


const M = {
     updateTextFields: jest.fn(),
     FormSelect: {
        init: jest.fn(),
     },
     Modal: {
      init: jest.fn()
     },
     Tooltip: {
        init: jest.fn()
     },
     Sidenav: {
      init: jest.fn()
     },
     toast: jest.fn(),
     validate_field: jest.fn()
};

Object.defineProperty(window, 'M', {
  writable: true,
  value: M,
});