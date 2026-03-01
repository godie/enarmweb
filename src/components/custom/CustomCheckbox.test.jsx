import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import CustomCheckbox from './CustomCheckbox';

describe('CustomCheckbox', () => {
  test('renders correctly with label', () => {
    render(<CustomCheckbox id="test-check" label="Test Label" />);
    expect(screen.getByLabelText(/Test Label/)).toBeInTheDocument();
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

  test('renders required indicator and aria-required', () => {
    render(<CustomCheckbox id="req-check" label="Required Label" required />);

    const input = screen.getByLabelText(/Required Label/);
    expect(input).toHaveAttribute('aria-required', 'true');

    const asterisk = screen.getByTitle('Obligatorio');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('red-text');
    expect(asterisk.textContent).toBe('*');
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
});
