import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2Profile from './V2Profile';
import Auth from '../../modules/Auth';
import Util from '../../commons/Util';

vi.mock('../../modules/Auth');
vi.mock('../../commons/Util');

describe('V2Profile', () => {
  const mockUser = {
    name: 'Test Doctor',
    email: 'test@doctor.com',
    id: 123
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Auth.getUserInfo.mockReturnValue(mockUser);

    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('renders profile information correctly', () => {
    render(
      <MemoryRouter>
        <V2Profile />
      </MemoryRouter>
    );

    expect(screen.getByText('Dr. Test Doctor')).toBeTruthy();
    expect(screen.getAllByText('test@doctor.com').length).toBeGreaterThan(0);
  });

  it('handles copy email to clipboard', async () => {
    render(
      <MemoryRouter>
        <V2Profile />
      </MemoryRouter>
    );

    const copyButtons = screen.getAllByLabelText('Copiar correo');
    expect(copyButtons.length).toBe(2);

    fireEvent.click(copyButtons[0]);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test@doctor.com');
    expect(Util.showToast).toHaveBeenCalledWith('Correo copiado al portapapeles');
  });

  it('does not show copy buttons if email is missing', () => {
    Auth.getUserInfo.mockReturnValue({ name: 'No Email Doctor', email: '' });

    render(
      <MemoryRouter>
        <V2Profile />
      </MemoryRouter>
    );

    expect(screen.queryByLabelText('Copiar correo')).toBeNull();
    expect(screen.getByText('Correo no asignado')).toBeTruthy();
    expect(screen.getByText('Asignar Correo')).toBeTruthy();
  });
});
