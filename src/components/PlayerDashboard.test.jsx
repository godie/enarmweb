
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlayerDashboard from './PlayerDashboard';
import Auth from '../modules/Auth';
import ExamService from '../services/ExamService';
import UserService from '../services/UserService';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../modules/Auth');
vi.mock('../services/ExamService');
vi.mock('../services/UserService');

const mockHistoryPush = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useHistory: () => ({
            push: mockHistoryPush,
        }),
    };
});

describe('PlayerDashboard', () => {
    const mockUser = {
        id: 1,
        name: 'Test Doctor',
        preferences: {
            specialties: [1, 2]
        }
    };

    const mockCategories = [
        { id: 1, name: 'Cardiología' },
        { id: 2, name: 'Pediatría' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        Auth.getUserInfo.mockReturnValue(mockUser);
        ExamService.loadCategories.mockResolvedValue({ data: mockCategories });
        UserService.getAchievements.mockResolvedValue({ data: [] });
    });

    it('renders specialty items with accessibility attributes', async () => {
        render(
            <MemoryRouter>
                <PlayerDashboard />
            </MemoryRouter>
        );

        const categoryItem = await screen.findByLabelText(/Estudiar especialidad: Cardiología/i);
        expect(categoryItem).toBeInTheDocument();
        expect(categoryItem).toHaveAttribute('role', 'button');
        expect(categoryItem).toHaveAttribute('tabIndex', '0');
    });

    it('navigates when Enter key is pressed on a specialty item', async () => {
        render(
            <MemoryRouter>
                <PlayerDashboard />
            </MemoryRouter>
        );

        const categoryItem = await screen.findByLabelText(/Estudiar especialidad: Cardiología/i);
        fireEvent.keyDown(categoryItem, { key: 'Enter' });
        expect(mockHistoryPush).toHaveBeenCalledWith('/especialidad/1');
    });

    it('navigates when Space key is pressed on a specialty item', async () => {
        render(
            <MemoryRouter>
                <PlayerDashboard />
            </MemoryRouter>
        );

        const categoryItem = await screen.findByLabelText(/Estudiar especialidad: Pediatría/i);
        fireEvent.keyDown(categoryItem, { key: ' ' });
        expect(mockHistoryPush).toHaveBeenCalledWith('/especialidad/2');
    });

    it('updates background color on focus', async () => {
        render(
            <MemoryRouter>
                <PlayerDashboard />
            </MemoryRouter>
        );

        const categoryItem = await screen.findByLabelText(/Estudiar especialidad: Cardiología/i);

        fireEvent.focus(categoryItem);
        // Computed style check might be tricky with inline styles in JSDOM,
        // but we can check the style prop or just trust the state update if we had access.
        // For now, let's just ensure it doesn't crash and the attributes are there.
        expect(categoryItem.style.backgroundColor).toBe('#f9fdfa');

        fireEvent.blur(categoryItem);
        expect(categoryItem.style.backgroundColor).toBe('white');
    });
});
