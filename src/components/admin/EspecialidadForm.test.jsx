
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import EspecialidadForm from './EspecialidadForm';
import ExamService from '../../services/ExamService';
import { alertSuccess, alertError } from '../../services/AlertService';

// Mock services
vi.mock('../../services/ExamService');
vi.mock('../../services/AlertService');

const mockHistoryGoBack = vi.fn();

// Mock react-router-dom hooks that are not handled by wrapper
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useHistory: () => ({
            goBack: mockHistoryGoBack,
        }),
    };
});


describe('EspecialidadForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        ExamService.saveCategory.mockResolvedValue({});
        ExamService.getCategory.mockResolvedValue({
            data: { id: 1, name: 'Cardiologia', description: 'Study of hearts' }
        });
    });

    const renderComponent = (initialPath = '/dashboard/especialidades/new') => {
        return render(
            <MemoryRouter initialEntries={[initialPath]}>
                <Route path="/dashboard/especialidades/:identificador?">
                    <EspecialidadForm />
                </Route>
            </MemoryRouter>
        );
    };

    test('renders form for new specialty', () => {
        renderComponent();
        expect(screen.getByText('Nueva Especialidad')).toBeInTheDocument();
        expect(screen.getByLabelText('Especialidad')).toHaveValue('');
        expect(screen.getByLabelText('Descripción')).toHaveValue('');
    });

    test('loads data for editing an existing specialty', async () => {
        renderComponent('/dashboard/especialidades/1');

        await waitFor(() => {
            expect(ExamService.getCategory).toHaveBeenCalledWith('1');
            expect(screen.getByDisplayValue('Cardiologia')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Study of hearts')).toBeInTheDocument();
            expect(screen.getByText('Editar Especialidad')).toBeInTheDocument();
        });
    });

    test('updates form data on input change', () => {
        renderComponent();
        const nameInput = screen.getByLabelText('Especialidad');
        fireEvent.change(nameInput, { target: { value: 'Neurologia' } });
        expect(nameInput).toHaveValue('Neurologia');
    });

    test('submits form successfully', async () => {
        renderComponent();
        const nameInput = screen.getByLabelText('Especialidad');
        fireEvent.change(nameInput, { target: { value: 'Neurologia' } });

        const submitButton = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(ExamService.saveCategory).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Neurologia'
            }));
            expect(alertSuccess).toHaveBeenCalled();
            expect(mockHistoryGoBack).toHaveBeenCalled();
        });
    });

    /*
    test('handles submit error', async () => {
        ExamService.saveCategory.mockRejectedValue(new Error('Failed'));
        renderComponent();

        const submitButton = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(alertError).toHaveBeenCalled();
        });
    });
    */

    test('cancels and goes back', () => {
        renderComponent();
        const cancelButton = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelButton);
        expect(mockHistoryGoBack).toHaveBeenCalled();
    });
});
