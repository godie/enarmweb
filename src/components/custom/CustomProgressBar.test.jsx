import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CustomProgressBar from './CustomProgressBar';

describe('CustomProgressBar', () => {
  it('renders correctly with progress and ARIA attributes', () => {
    render(<CustomProgressBar progress={45} aria-label="Test Progress" />);

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-label', 'Test Progress');
    expect(progressbar).toHaveAttribute('aria-valuenow', '45');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');

    const determinatePart = progressbar.querySelector('.determinate');
    expect(determinatePart).toBeInTheDocument();
    expect(determinatePart).toHaveStyle({ width: '45%' });
  });

  it('renders indeterminate state when progress is null', () => {
    render(<CustomProgressBar progress={null} />);

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).not.toHaveAttribute('aria-valuenow');

    const indeterminatePart = progressbar.querySelector('.indeterminate');
    expect(indeterminatePart).toBeInTheDocument();
  });

  it('rounds progress for aria-valuenow', () => {
    render(<CustomProgressBar progress={67.8} />);

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '68');
  });
});
