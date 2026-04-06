import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2Navi from './V2Navi';

describe('V2Navi', () => {
  it('renders all navigation items', () => {
    render(
      <MemoryRouter>
        <V2Navi />
      </MemoryRouter>
    );

    const navItems = [
      "Inicio", "Práctica", "Simulacro", "Ranking", "Imágenes",
      "Repaso", "Biblioteca", "Errores", "Contribuir", "Mis Casos",
      "Mensajes", "Suscripción", "Cupones", "Admin", "Perfil"
    ];

    navItems.forEach(item => {
      expect(screen.getByText(item)).toBeDefined();
    });
  });

  it('contains refactored CSS classes', () => {
    const { container } = render(
      <MemoryRouter>
        <V2Navi />
      </MemoryRouter>
    );

    expect(container.querySelector('.v2-nav-rail')).toBeDefined();
    expect(container.querySelector('.v2-nav-logo')).toBeDefined();
    expect(container.querySelector('.v2-nav-items-container')).toBeDefined();
    expect(container.querySelector('.v2-nav-footer')).toBeDefined();
  });

  it('toggles theme on button click', () => {
    const setAttributeSpy = vi.spyOn(document.documentElement, 'setAttribute');
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('light');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    render(
      <MemoryRouter>
        <V2Navi />
      </MemoryRouter>
    );

    const themeButton = screen.getByLabelText('Cambiar a modo oscuro');
    fireEvent.click(themeButton);

    expect(setAttributeSpy).toHaveBeenCalledWith('theme', 'dark');
    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');

    // Icon and label should update
    expect(screen.getByLabelText('Cambiar a modo claro')).toBeDefined();
    expect(screen.getByText('light_mode')).toBeDefined();

    setAttributeSpy.mockRestore();
    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });

  it('renders logo as a link to dashboard', () => {
    render(
      <MemoryRouter>
        <V2Navi />
      </MemoryRouter>
    );

    const logoLink = screen.getByLabelText('Ir al inicio');
    expect(logoLink.getAttribute('href')).toBe('/v2/dashboard');
  });
});
