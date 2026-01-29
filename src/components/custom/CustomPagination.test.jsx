
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import CustomPagination from './CustomPagination';

describe('CustomPagination Accessibility', () => {
  test('renders with proper ARIA attributes', () => {
    const onSelect = vi.fn();
    render(
      <CustomPagination
        items={5}
        activePage={1}
        onSelect={onSelect}
      />
    );

    // Check for navigation role and label
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Paginación');

    // Check for active page aria-current
    const activePageLink = screen.getByText('1');
    expect(activePageLink).toHaveAttribute('aria-current', 'page');

    // Check for aria-label on prev/next buttons
    const prevButton = screen.getByLabelText('Anterior');
    const nextButton = screen.getByLabelText('Siguiente');
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    // Check if previous button is disabled (activePage is 1)
    const prevLi = prevButton.closest('li');
    expect(prevLi).toHaveClass('disabled');
    expect(prevLi).toHaveAttribute('aria-disabled', 'true');
  });

  test('renders ellipses as spans with aria-hidden', () => {
    render(
      <CustomPagination
        items={20}
        activePage={10}
        maxButtons={3}
      />
    );

    // Should have ellipses for items=20, activePage=10, maxButtons=3
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
    ellipses.forEach(ellipsis => {
      expect(ellipsis.tagName).toBe('SPAN');
      expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
