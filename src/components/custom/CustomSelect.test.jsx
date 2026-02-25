import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomSelect from './CustomSelect';

// Mock Materialize
vi.mock('@materializecss/materialize', () => ({
  FormSelect: {
    init: vi.fn(() => ({ destroy: vi.fn() })),
  },
}));

describe('CustomSelect', () => {
  test('renders label correctly', () => {
    render(
      <CustomSelect id="test-select" label="My Label">
        <option value="1">Option 1</option>
      </CustomSelect>
    );
    expect(screen.getByLabelText(/My Label/i)).toBeInTheDocument();
  });

  test('renders helper text when provided', () => {
    render(
      <CustomSelect id="test-select" label="My Label" helperText="Helpful info">
        <option value="1">Option 1</option>
      </CustomSelect>
    );
    expect(screen.getByText('Helpful info')).toHaveClass('helper-text');
  });

  test('applies grid classes to the wrapper', () => {
    const { container } = render(
      <CustomSelect id="test-select" s={12} m={6} offset="m3">
        <option value="1">Option 1</option>
      </CustomSelect>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('col');
    expect(wrapper).toHaveClass('s12');
    expect(wrapper).toHaveClass('m6');
    expect(wrapper).toHaveClass('offset-m3');
  });
});
