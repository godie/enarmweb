import '@testing-library/jest-dom';
import { Tooltip } from 'materialize-css';

// Mock CSS
jest.mock('./index.css', () => ({}));
jest.mock('./App.css', () => ({}));


const M = {
     FormSelect: {
        init: jest.fn(),
     },
     Tooltip: {
        init: jest.fn()
     },
     Sidenav: {
      init: jest.fn()
     },
     validate_field: jest.fn()
};

Object.defineProperty(window, 'M', {
  writable: true,
  value: M,
});