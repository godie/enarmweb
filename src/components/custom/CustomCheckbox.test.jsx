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

  test('is disabled when the prop is true', () => {
    render(<CustomCheckbox id="test-check" label="Accept Terms" disabled onChange={() => {}} />);
    const checkbox = screen.getByLabelText(/Accept Terms/i);
    expect(checkbox).toBeDisabled();
  });

  test('applies grid classes and style to wrapper div', () => {
    const { container } = render(
      <CustomCheckbox
        id="grid-check"
        label="Grid Label"
        s={12}
        m={6}
        offset="s1"
        style={{ marginBottom: '1rem' }}
        data-testid="outer-wrapper"
      />
    );

    const wrapper = container.firstChild;
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper).toHaveClass('col');
    expect(wrapper).toHaveClass('s12');
    expect(wrapper).toHaveClass('m6');
    expect(wrapper).toHaveClass('offset-s1');
    expect(wrapper).toHaveStyle('margin-bottom: 16px');
    expect(wrapper).toHaveAttribute('data-testid', 'outer-wrapper');
  });

  test('applies style and custom props to label if not wrapped in div', () => {
    const { container } = render(
      <CustomCheckbox
        id="no-wrap-check"
        label="No Wrap"
        style={{ color: 'red' }}
        data-custom="test"
      />
    );
    const label = container.firstChild;
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveStyle('color: red');
    expect(label).toHaveAttribute('data-custom', 'test');
  });

  test('renders helper text and links with aria-describedby', () => {
    render(<CustomCheckbox id="help-check" label="Help Label" helperText="Be careful" />);

    const helper = screen.getByText('Be careful');
    expect(helper).toBeInTheDocument();
    expect(helper).toHaveClass('helper-text');
    expect(helper).toHaveAttribute('id', 'help-check-helper');

    const input = screen.getByLabelText(/Help Label/);
    expect(input).toHaveAttribute('aria-describedby', 'help-check-helper');
  });

  test('does not wrap in div if no grid or wrapperClassName provided', () => {
    const { container } = render(<CustomCheckbox id="no-wrap" label="No Wrap" />);
    expect(container.firstChild.tagName).toBe('LABEL');
  });

  test('wraps in div if wrapperClassName is provided', () => {
    const { container } = render(
      <CustomCheckbox id="wrap-class" label="Wrap Class" wrapperClassName="custom-wrap" />
    );
    expect(container.firstChild.tagName).toBe('DIV');
    expect(container.firstChild).toHaveClass('custom-wrap');
  });

  test('applies wrapperClassName to the wrapper div', () => {
    const { container } = render(
      <CustomCheckbox id="wrap-class-2" label="Wrap Class" wrapperClassName="extra-class" s={12} />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('extra-class');
    expect(wrapper).toHaveClass('col');
    expect(wrapper).toHaveClass('s12');
  });
});
