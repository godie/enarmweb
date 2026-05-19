import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MyContributions from './MyContributions';
import ExamService from '../../services/ExamService';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../services/ExamService');
vi.mock('../../modules/Auth', () => ({
    default: {
        getToken: () => 'fake-token',
        getUserInfo: () => ({ id: 1, name: 'Test User' }),
        isPlayerAuthenticated: () => true
    }
}));

describe('MyContributions Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        ExamService.loadCategories.mockReturnValue(new Promise(() => {}));
        ExamService.getUserContributions.mockReturnValue(new Promise(() => {}));
        render(
            <MemoryRouter>
                <MyContributions />
            </MemoryRouter>
        );
        expect(screen.getByRole('progressbar')).toBeDefined();
    });

    it('renders empty state when no contributions found', async () => {
        ExamService.loadCategories.mockResolvedValue({ data: [] });
        ExamService.getUserContributions.mockResolvedValue({ data: { clinical_cases: [], questions: [] } });

        render(
            <MemoryRouter>
                <MyContributions />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/¿Aún no has contribuido\?/i)).toBeDefined();
            expect(screen.getByText(/Tus aportaciones ayudan a miles de médicos/i)).toBeDefined();
            expect(screen.getByText(/Nueva Contribución/i)).toBeDefined();
        });
    });

    it('renders contributions table when data is fetched', async () => {
        ExamService.loadCategories.mockResolvedValue({ data: [{ id: 1, name: 'Cardiología' }] });
        ExamService.getUserContributions.mockResolvedValue({
            data: {
                clinical_cases: [{ id: 1, name: 'Caso Test', category_id: 1, status: 'pending' }],
                questions: [{ id: 2, text: 'Pregunta Test', category_id: 1, status: 'published' }]
            }
        });

        render(
            <MemoryRouter>
                <MyContributions />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Caso Test')).toBeDefined();
            expect(screen.getByText('Pregunta Test')).toBeDefined();
            expect(screen.getAllByText('Cardiología').length).toBeGreaterThan(0);
            expect(screen.getByText('Pendiente')).toBeDefined();
            expect(screen.getByText('Publicado')).toBeDefined();
        });
    });

    it('shows error message when fetching contributions fails', async () => {
        ExamService.loadCategories.mockResolvedValue({ data: [] });
        ExamService.getUserContributions.mockRejectedValue(new Error('Failed to fetch'));

        render(
            <MemoryRouter>
                <MyContributions />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/No se pudieron cargar tus contribuciones/i)).toBeDefined();
        });
    });
});
