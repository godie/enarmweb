import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Onboarding from './Onboarding';
import ExamService from '../services/ExamService';
import Auth from '../modules/Auth';

vi.mock('../services/ExamService', () => ({
    default: {
        loadCategories: vi.fn(),
    },
}));

vi.mock('../services/UserService', () => ({
    default: {
        updateUser: vi.fn(),
    },
}));

vi.mock('../modules/Auth', () => ({
    default: {
        getUserInfo: vi.fn(),
        savePlayerInfo: vi.fn(),
    },
}));

const mockHistoryPush = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useHistory: () => ({
            push: mockHistoryPush,
        }),
    };
});

describe('Onboarding Component', () => {
    const mockUser = {
        id: 1,
        name: 'Test Doctor',
        preferences: {
            specialties: [],
        },
    };

    const mockCategories = {
        data: [
            { id: 1, name: 'Cardiología' },
            { id: 2, name: 'Pediatría' },
            { id: 3, name: 'Neurología' },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        Auth.getUserInfo.mockReturnValue(mockUser);
        ExamService.loadCategories.mockResolvedValue(mockCategories);
    });

    const renderOnboarding = () => {
        return render(
            <MemoryRouter>
                <Onboarding />
            </MemoryRouter>
        );
    };

    it('should render welcome message and categories', async () => {
        renderOnboarding();

        expect(await screen.findByText(/Test Doctor/i)).toBeInTheDocument();
        expect(await screen.findByText('Cardiología')).toBeInTheDocument();
        expect(await screen.findByText('Pediatría')).toBeInTheDocument();
    });

    it('should render selection buttons', async () => {
        renderOnboarding();
        await screen.findByText(/Test Doctor/i);

        expect(screen.getAllByRole('button', { name: /Seleccionar todas/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('button', { name: /Deseleccionar todas/i }).length).toBeGreaterThan(0);
    });

    it("should select all categories when 'Seleccionar todas' is clicked", async () => {
        renderOnboarding();
        await screen.findByText(/Test Doctor/i);

        const [selectAllBtn] = screen.getAllByRole('button', { name: /Seleccionar todas/i });
        fireEvent.click(selectAllBtn);

        const cards = await screen.findAllByLabelText(/Deseleccionar especialidad/i);
        expect(cards).toHaveLength(3);
    });

    it("should deselect all categories when 'Deseleccionar todas' is clicked", async () => {
        renderOnboarding();
        await screen.findByText(/Test Doctor/i);

        const [selectAllBtn] = screen.getAllByRole('button', { name: /Seleccionar todas/i });
        fireEvent.click(selectAllBtn);

        expect(await screen.findAllByLabelText(/Deseleccionar especialidad/i)).toHaveLength(3);

        const [deselectAllBtn] = screen.getAllByRole('button', { name: /Deseleccionar todas/i });
        fireEvent.click(deselectAllBtn);

        const unselectedCards = await screen.findAllByLabelText(/Seleccionar especialidad/i);
        expect(unselectedCards).toHaveLength(3);
    });

    it('should toggle individual specialties correctly', async () => {
        renderOnboarding();

        const cardioCard = await screen.findByLabelText(/Seleccionar especialidad Cardiología/i);
        fireEvent.click(cardioCard);

        expect(await screen.findByLabelText(/Deseleccionar especialidad Cardiología/i)).toBeInTheDocument();

        fireEvent.click(await screen.findByLabelText(/Deseleccionar especialidad Cardiología/i));
        expect(await screen.findByLabelText(/Seleccionar especialidad Cardiología/i)).toBeInTheDocument();
    });
});
