
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import UserRow from './UserRow';

describe('UserRow Component', () => {
    const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        role: 'player'
    };

    const mockProps = {
        user: mockUser,
        onRoleChange: vi.fn(),
        onDelete: vi.fn()
    };

    // Need to wrap in table because UserRow returns tr
    const renderComponent = () => render(
        <table>
            <tbody>
                <UserRow {...mockProps} />
            </tbody>
        </table>
    );

    test('renders user data correctly', () => {
        renderComponent();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('johndoe')).toBeInTheDocument();
    });

    test('renders role selector with current role', () => {
        renderComponent();
        const select = screen.getByRole('combobox');
        expect(select).toHaveValue('player');
    });

    test('calls onRoleChange when role is changed', () => {
        renderComponent();
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'admin' } });
        expect(mockProps.onRoleChange).toHaveBeenCalledWith(mockUser, 'admin');
    });

    test('calls onDelete when delete button is clicked', () => {
        renderComponent();
        const deleteButton = screen.getByText('delete'); // Icon name is used as text content if not replaced by image
        fireEvent.click(deleteButton);
        expect(mockProps.onDelete).toHaveBeenCalledWith(mockUser);
    });
});
