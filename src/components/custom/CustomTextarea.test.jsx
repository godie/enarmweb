import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomTextarea from './CustomTextarea';

// Mock Materialize
vi.mock('@materializecss/materialize', () => ({
  Forms: {
    textareaAutoResize: vi.fn(),
    updateTextFields: vi.fn(),
  },
  CharacterCounter: {
    init: vi.fn(() => ({ destroy: vi.fn() })),
  },
}));

describe('CustomTextarea', () => {
  test('renders label correctly', () => {
    render(<CustomTextarea id="test-area" label="My Area" />);
    expect(screen.getByLabelText(/My Area/i)).toBeInTheDocument();
  });

  test('renders helper text when provided', () => {
    render(<CustomTextarea id="test-area" label="My Area" helperText="Helpful info" />);
    expect(screen.getByText('Helpful info')).toHaveClass('helper-text');
  });

  test('applies offset class to the wrapper', () => {
    const { container } = render(<CustomTextarea id="test-area" offset="s2 m1" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('offset-s2');
    expect(wrapper).toHaveClass('offset-m1');
  });

  test('renders prefix icon with aria-hidden', () => {
    const { container } = render(<CustomTextarea id="test-area" icon="edit" />);
    const icon = container.querySelector('.material-icons.prefix');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
