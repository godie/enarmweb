import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlayerQuestionForm from './PlayerQuestionForm';
import ExamService from '../services/ExamService';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../services/ExamService');
vi.mock('../modules/Auth', () => ({
    default: {
        getToken: () => 'fake-token',
        getUserInfo: () => ({ id: 1, name: 'Test User' }),
        isPlayerAuthenticated: () => true
    }
}));
vi.mock('../services/AlertService', () => ({
    alertSuccess: vi.fn(() => Promise.resolve()),
    alertError: vi.fn(() => Promise.resolve())
}));

describe('PlayerQuestionForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        ExamService.loadCategories.mockResolvedValue({ data: [{ id: 1, name: 'Cardiología' }] });
    });

    it('renders the form correctly', async () => {
        render(
            <MemoryRouter>
                <PlayerQuestionForm />
            </MemoryRouter>
        );

        expect(screen.getByText('Pregunta Individual')).toBeDefined();
        await waitFor(() => {
            expect(screen.getByLabelText(/Especialidad/i)).toBeDefined();
        });
        expect(screen.getByLabelText(/Texto de la pregunta/i)).toBeDefined();
    });

    it.skip('submits the form successfully', async () => {
        ExamService.saveQuestion.mockResolvedValue({});

        render(
            <MemoryRouter>
                <PlayerQuestionForm />
            </MemoryRouter>
        );

        await waitFor(() => {
            fireEvent.change(screen.getByLabelText(/Especialidad/i), { target: { value: '1' } });
        });

        fireEvent.change(screen.getByLabelText(/Texto de la pregunta/i), { target: { value: '¿Cuál es el tratamiento?' } });

        const form = screen.getByRole('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(ExamService.saveQuestion).toHaveBeenCalled();
        }, { timeout: 2000 });
    });

    it('shows error if no category selected', async () => {
        render(
            <MemoryRouter>
                <PlayerQuestionForm />
            </MemoryRouter>
        );

        const submitBtn = screen.getByText('GUARDAR PREGUNTA');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(ExamService.saveQuestion).not.toHaveBeenCalled();
        });
    });
});
