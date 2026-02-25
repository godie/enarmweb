import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomTextInput from './CustomTextInput';

describe('CustomTextInput', () => {
  test('renders label correctly', () => {
    render(<CustomTextInput id="test-input" label="My Label" />);
    expect(screen.getByLabelText(/My Label/i)).toBeInTheDocument();
  });

  test('renders helper text when provided', () => {
    render(<CustomTextInput id="test-input" label="My Label" helperText="Helpful info" />);
    expect(screen.getByText('Helpful info')).toBeInTheDocument();
    expect(screen.getByText('Helpful info')).toHaveClass('helper-text');
  });

  test('renders prefix icon with aria-hidden', () => {
    const { container } = render(<CustomTextInput id="test-input" icon="person" />);
    const icon = container.querySelector('.material-icons.prefix');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('applies grid classes to the wrapper', () => {
    const { container } = render(<CustomTextInput id="test-input" s={12} m={6} offset="s0 m3" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('col');
    expect(wrapper).toHaveClass('s12');
    expect(wrapper).toHaveClass('m6');
    expect(wrapper).toHaveClass('offset-s0');
    expect(wrapper).toHaveClass('offset-m3');
  });
});
