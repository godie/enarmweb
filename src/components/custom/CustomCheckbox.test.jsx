import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomCheckbox from './CustomCheckbox';

describe('CustomCheckbox', () => {
  test('renders label correctly', () => {
    render(<CustomCheckbox id="test-checkbox" label="Check me" onChange={() => {}} />);
    expect(screen.getByLabelText(/Check me/i)).toBeInTheDocument();
  });

  test('calls onChange when clicked', () => {
    const handleChange = vi.fn();
    render(<CustomCheckbox id="test-checkbox" label="Check me" onChange={handleChange} />);
    const checkbox = screen.getByLabelText(/Check me/i);
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  test('is disabled when the prop is true', () => {
    render(<CustomCheckbox id="test-checkbox" label="Check me" disabled onChange={() => {}} />);
    const checkbox = screen.getByLabelText(/Check me/i);
    expect(checkbox).toBeDisabled();
  });

  test('renders required asterisk when required prop is true', () => {
    render(<CustomCheckbox id="test-checkbox" label="Check me" required onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('red-text');
    expect(screen.getByLabelText(/Check me/i)).toHaveAttribute('aria-required', 'true');
  });

  test('applies grid classes to the wrapper div', () => {
    const { container } = render(
      <CustomCheckbox id="test-checkbox" label="Check me" s={12} m={6} offset="s0 m3" onChange={() => {}} />
    );
    const wrapper = container.firstChild;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper).toHaveClass('col');
    expect(wrapper).toHaveClass('s12');
    expect(wrapper).toHaveClass('m6');
    expect(wrapper).toHaveClass('offset-s0');
    expect(wrapper).toHaveClass('offset-m3');
  });

  test('applies wrapperClassName to the wrapper div', () => {
    const { container } = render(
      <CustomCheckbox id="test-checkbox" label="Check me" wrapperClassName="extra-class" s={12} onChange={() => {}} />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('extra-class');
    expect(wrapper).toHaveClass('col');
    expect(wrapper).toHaveClass('s12');
  });
});
