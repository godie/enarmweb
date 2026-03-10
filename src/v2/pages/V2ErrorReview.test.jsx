import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import V2ErrorReview from './V2ErrorReview';

describe('V2ErrorReview', () => {
  it('renders correctly with error statistics', () => {
    render(<V2ErrorReview />);

    expect(screen.getByText('Revisión de Errores')).toBeTruthy();
    expect(screen.getAllByText('Ginecología').length).toBeGreaterThan(0);
    expect(screen.getByText('15 errores')).toBeTruthy();
  });

  it('displays the list of failed questions with answers and explanations', () => {
    render(<V2ErrorReview />);

    expect(screen.getByText('Preguntas Falladas Recientemente')).toBeTruthy();
    expect(screen.getByText(/Paciente masculino de 45 años/)).toBeTruthy();
    expect(screen.getByText(/Infarto Agudo al Miocardio/)).toBeTruthy();
    expect(screen.getByText(/Angina Inestable/)).toBeTruthy();
    expect(screen.getAllByText(/EXPLICACIÓN/).length).toBeGreaterThan(0);
  });

  it('shows the correct total error count', () => {
    render(<V2ErrorReview />);

    // Total: 15 + 10 + 8 = 33
    expect(screen.getByText('33')).toBeTruthy();
  });
});
