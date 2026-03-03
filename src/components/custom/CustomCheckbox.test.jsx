import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomCheckbox from './CustomCheckbox';

describe('CustomCheckbox', () => {
  test('renders basic checkbox with label', () => {
    render(<CustomCheckbox id="test-check" label="Accept Terms" onChange={() => {}} />);
    const checkbox = screen.getByLabelText(/Accept Terms/i);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  test('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<CustomCheckbox id="test-check" label="Accept Terms" onChange={handleChange} />);
    const checkbox = screen.getByLabelText(/Accept Terms/i);
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders as checked when prop is true', () => {
    render(<CustomCheckbox id="test-check" label="Accept Terms" checked={true} onChange={() => {}} />);
    const checkbox = screen.getByLabelText(/Accept Terms/i);
    expect(checkbox).toBeChecked();
  });

  test('renders required asterisk and aria-required', () => {
    render(<CustomCheckbox id="test-check" label="Accept Terms" required onChange={() => {}} />);
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('red-text');

    const checkbox = screen.getByLabelText(/Accept Terms/i);
    expect(checkbox).toHaveAttribute('aria-required', 'true');
  });
});
