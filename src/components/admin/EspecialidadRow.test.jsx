
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import EspecialidadRow from './EspecialidadRow';

describe('EspecialidadRow Component', () => {
    const mockSpecialty = {
        id: 10,
        name: 'Cardiolgy',
        description: 'Heart stuff'
    };

    const renderComponent = () => render(
        <BrowserRouter>
            <table>
                <tbody>
                    <EspecialidadRow especialidad={mockSpecialty} />
                </tbody>
            </table>
        </BrowserRouter>
    );

    test('renders specialty data', () => {
        renderComponent();
        expect(screen.getByText('Cardiolgy')).toBeInTheDocument();
        expect(screen.getByText('Heart stuff')).toBeInTheDocument();
    });

    test('renders edit link with correct path', () => {
        renderComponent();
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/dashboard/edit/especialidad/10');
    });
});
