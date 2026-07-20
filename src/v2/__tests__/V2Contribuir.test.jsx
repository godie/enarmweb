import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2Contribuir from '../pages/V2Contribuir';
import { alertSuccess, alertError } from '../../services/AlertService';

vi.mock('../../services/AlertService', () => ({
  alertSuccess: vi.fn(),
  alertError: vi.fn(),
}));

describe('V2Contribuir', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with all headers and inputs', () => {
    render(
      <MemoryRouter>
        <V2Contribuir />
      </MemoryRouter>
    );

    // Headers
    expect(screen.getByText('Contribuir Caso Clínico')).toBeTruthy();
    expect(screen.getByText('Escenario Clínico')).toBeTruthy();
    expect(screen.getByText('La Pregunta')).toBeTruthy();
    expect(screen.getByText('Opciones de Respuesta')).toBeTruthy();
    expect(screen.getByText('Perla Médica')).toBeTruthy();

    // Inputs/Textareas with labels
    expect(screen.getByLabelText('Descripción detallada')).toBeTruthy();
    expect(screen.getByLabelText('Pregunta diagnóstica/terapéutica')).toBeTruthy();
    expect(screen.getByLabelText('Justificación académica')).toBeTruthy();

    // Option labels A, B, C, D
    expect(screen.getByLabelText('Opción A')).toBeTruthy();
    expect(screen.getByLabelText('Opción B')).toBeTruthy();
    expect(screen.getByLabelText('Opción C')).toBeTruthy();
    expect(screen.getByLabelText('Opción D')).toBeTruthy();

    // Radio buttons with aria-labels
    expect(screen.getByLabelText('Marcar opción A como correcta')).toBeTruthy();
    expect(screen.getByLabelText('Marcar opción B como correcta')).toBeTruthy();
    expect(screen.getByLabelText('Marcar opción C como correcta')).toBeTruthy();
    expect(screen.getByLabelText('Marcar opción D como correcta')).toBeTruthy();

    // Submit button
    expect(screen.getByRole('button', { name: /Enviar para Revisión/i })).toBeTruthy();
  });

  it('allows user input across all fields and interactive correct answer selection', () => {
    render(
      <MemoryRouter>
        <V2Contribuir />
      </MemoryRouter>
    );

    const casoInput = screen.getByLabelText('Descripción detallada');
    const preguntaInput = screen.getByLabelText('Pregunta diagnóstica/terapéutica');
    const perlaInput = screen.getByLabelText('Justificación académica');

    fireEvent.change(casoInput, { target: { value: 'Paciente de 30 años con tos.' } });
    fireEvent.change(preguntaInput, { target: { value: '¿Cuál es el agente?' } });
    fireEvent.change(perlaInput, { target: { value: 'Es neumococo debido a...' } });

    expect(casoInput.value).toBe('Paciente de 30 años con tos.');
    expect(preguntaInput.value).toBe('¿Cuál es el agente?');
    expect(perlaInput.value).toBe('Es neumococo debido a...');

    const opcionA = screen.getByLabelText('Opción A');
    fireEvent.change(opcionA, { target: { value: 'S. pneumoniae' } });
    expect(opcionA.value).toBe('S. pneumoniae');

    // Click radio button for Option C
    const radioC = screen.getByLabelText('Marcar opción C como correcta');
    expect(radioC.checked).toBe(false);
    fireEvent.click(radioC);
    expect(radioC.checked).toBe(true);
  });

  it('shows error alert on empty form submission', () => {
    render(
      <MemoryRouter>
        <V2Contribuir />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /Enviar para Revisión/i });
    fireEvent.click(submitBtn);

    expect(alertError).toHaveBeenCalledWith(
      'Campos vacíos',
      'Por favor, completa todos los campos antes de enviar.'
    );
  });

  it('successfully submits contribution when all fields are completed', async () => {
    render(
      <MemoryRouter>
        <V2Contribuir />
      </MemoryRouter>
    );

    // Fill all inputs
    fireEvent.change(screen.getByLabelText('Descripción detallada'), { target: { value: 'Caso de prueba' } });
    fireEvent.change(screen.getByLabelText('Pregunta diagnóstica/terapéutica'), { target: { value: 'Pregunta de prueba' } });
    fireEvent.change(screen.getByLabelText('Justificación académica'), { target: { value: 'Perla de prueba' } });

    fireEvent.change(screen.getByLabelText('Opción A'), { target: { value: 'Opcion A text' } });
    fireEvent.change(screen.getByLabelText('Opción B'), { target: { value: 'Opcion B text' } });
    fireEvent.change(screen.getByLabelText('Opción C'), { target: { value: 'Opcion C text' } });
    fireEvent.change(screen.getByLabelText('Opción D'), { target: { value: 'Opcion D text' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Enviar para Revisión/i });
    fireEvent.click(submitBtn);

    // Should enter loading state
    expect(screen.getByText('Enviando...')).toBeTruthy();

    // Wait for submission simulation
    await waitFor(() => {
      expect(alertSuccess).toHaveBeenCalledWith(
        '¡Gracias por tu aporte!',
        'Tu caso clínico ha sido enviado y será revisado por nuestro equipo médico.'
      );
    }, { timeout: 2000 });

    // Form should be reset
    expect(screen.getByLabelText('Descripción detallada').value).toBe('');
    expect(screen.getByLabelText('Pregunta diagnóstica/terapéutica').value).toBe('');
    expect(screen.getByLabelText('Justificación académica').value).toBe('');
    expect(screen.getByLabelText('Opción A').value).toBe('');
  });
});
