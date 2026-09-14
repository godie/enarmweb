import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import V2MisContribuciones from './V2MisContribuciones';

describe('V2MisContribuciones Component', () => {
    it('renders header, new contribution button and contribution list', () => {
        render(
            <MemoryRouter>
                <V2MisContribuciones />
            </MemoryRouter>
        );

        expect(screen.getByText('Mis Contribuciones')).toBeDefined();
        expect(screen.getByLabelText('Crear nueva contribución de caso clínico')).toBeDefined();
        expect(screen.getByText('Infarto Agudo al Miocardio')).toBeDefined();
        expect(screen.getByText('Cetoacidosis Diabética')).toBeDefined();
        expect(screen.getByText('Apendicitis Aguda')).toBeDefined();
    });

    it('navigates to /contribuir when "Nueva Contribución" button is clicked', () => {
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <V2MisContribuciones />
            </Router>
        );

        const newBtn = screen.getByLabelText('Crear nueva contribución de caso clínico');
        fireEvent.click(newBtn);

        expect(history.location.pathname).toBe('/contribuir');
    });

    it('navigates to case contribution details on card click or Enter keypress', () => {
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <V2MisContribuciones />
            </Router>
        );

        const card = screen.getByLabelText(/Ver detalles de contribución: Infarto Agudo al Miocardio/i);
        expect(card).toBeDefined();

        fireEvent.click(card);
        expect(history.location.pathname + history.location.search).toBe('/contribuir?id=1');

        fireEvent.keyDown(card, { key: 'Enter' });
        expect(history.location.pathname + history.location.search).toBe('/contribuir?id=1');
    });
});
