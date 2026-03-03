import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, test, expect } from 'vitest';
import ThemeToggle from './ThemeToggle';

vi.mock('../modules/Auth', () => ({
    default: {
        getUserInfo: vi.fn(),
        savePlayerInfo: vi.fn(),
        isUserAuthenticated: vi.fn(),
        isPlayerAuthenticated: vi.fn()
    }
}));

vi.mock('../services/UserService', () => ({
    default: {
        updateUser: vi.fn()
    }
}));

describe('ThemeToggle Component', () => {
    test('renders as a button with correct aria-label', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label');
        expect(button.getAttribute('aria-label')).toMatch(/Cambiar a modo (oscuro|claro)/);
    });

    test('toggles theme on click', () => {
        const setAttributeSpy = vi.spyOn(document.documentElement, 'setAttribute');
        render(<ThemeToggle />);
        const button = screen.getByRole('button');

        fireEvent.click(button);

        expect(setAttributeSpy).toHaveBeenCalledWith('theme', expect.stringMatching(/dark|light/));
        setAttributeSpy.mockRestore();
    });
});
