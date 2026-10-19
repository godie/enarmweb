import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import V2Contribuir from './V2Contribuir';
import * as AlertService from '../../services/AlertService';

vi.mock('../../services/AlertService', () => ({
  alertSuccess: vi.fn(),
  alertError: vi.fn()
}));

describe('V2Contribuir Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title, section headers and form inputs', () => {
    render(<V2Contribuir />);

    expect(screen.getByRole('heading', { level: 1, name: /Contribuir Caso Clínico/i })).toBeTruthy();
    expect(screen.getByLabelText(/Descripción detallada/i)).toBeTruthy();
    expect(screen.getByLabelText(/Pregunta diagnóstica\/terapéutica/i)).toBeTruthy();
    expect(screen.getByPlaceholderText('Opción A')).toBeTruthy();
    expect(screen.getByPlaceholderText('Opción B')).toBeTruthy();
    expect(screen.getByPlaceholderText('Opción C')).toBeTruthy();
    expect(screen.getByPlaceholderText('Opción D')).toBeTruthy();
    expect(screen.getByLabelText(/Justificación académica/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Enviar para Revisión/i })).toBeTruthy();
  });

  it('allows user to select radio options and type into inputs', () => {
    render(<V2Contribuir />);

    const radioB = screen.getByLabelText(/Marcar Opción B como correcta/i);
    expect(radioB.checked).toBe(false);
    fireEvent.click(radioB);
    expect(radioB.checked).toBe(true);

    const casoInput = screen.getByLabelText(/Descripción detallada/i);
    fireEvent.change(casoInput, { target: { value: 'Paciente femenino de 30 años...' } });
    expect(casoInput.value).toBe('Paciente femenino de 30 años...');

    const opcionAInput = screen.getByPlaceholderText('Opción A');
    fireEvent.change(opcionAInput, { target: { value: 'Apendicitis' } });
    expect(opcionAInput.value).toBe('Apendicitis');
  });

  it('handles submission with loading feedback and calls alertSuccess', async () => {
    render(<V2Contribuir />);

    fireEvent.change(screen.getByLabelText(/Descripción detallada/i), { target: { value: 'Caso de prueba' } });
    fireEvent.change(screen.getByLabelText(/Pregunta diagnóstica\/terapéutica/i), { target: { value: '¿Diagnóstico?' } });
    fireEvent.change(screen.getByPlaceholderText('Opción A'), { target: { value: 'Opción 1' } });
    fireEvent.change(screen.getByPlaceholderText('Opción B'), { target: { value: 'Opción 2' } });
    fireEvent.change(screen.getByPlaceholderText('Opción C'), { target: { value: 'Opción 3' } });
    fireEvent.change(screen.getByPlaceholderText('Opción D'), { target: { value: 'Opción 4' } });
    fireEvent.change(screen.getByLabelText(/Justificación académica/i), { target: { value: 'Explicación médica' } });

    const submitBtn = screen.getByRole('button', { name: /Enviar para Revisión/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Enviando.../i)).toBeTruthy();

    await waitFor(() => {
      expect(AlertService.alertSuccess).toHaveBeenCalledWith(
        '¡Aporte enviado!',
        'Tu caso clínico fue enviado a revisión con éxito.'
      );
    }, { timeout: 2000 });
  });
});
