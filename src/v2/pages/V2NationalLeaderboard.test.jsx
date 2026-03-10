import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import V2NationalLeaderboard from './V2NationalLeaderboard';

describe('V2NationalLeaderboard', () => {
  it('renders correctly with initial data', () => {
    render(<V2NationalLeaderboard />);

    expect(screen.getByText('Ranking Nacional')).toBeTruthy();
    expect(screen.getByText('Tú (Dr. García)')).toBeTruthy();
    expect(screen.getByText('Dr. House')).toBeTruthy();
    expect(screen.getByText('Dra. Grey')).toBeTruthy();
  });

  it('changes period when buttons are clicked', () => {
    render(<V2NationalLeaderboard />);

    const monthlyButton = screen.getByText('Mensual');
    fireEvent.click(monthlyButton);

    // Check if the button has the filled class (active state)
    expect(monthlyButton.className).toContain('v2-btn-filled');

    const weeklyButton = screen.getByText('Semanal');
    expect(weeklyButton.className).toContain('v2-btn-tonal');
  });

  it('displays user rank and points correctly', () => {
    render(<V2NationalLeaderboard />);

    expect(screen.getByText('#42')).toBeTruthy();
    expect(screen.getByText('1250 XP')).toBeTruthy();
  });
});
