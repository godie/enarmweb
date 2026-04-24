import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2Login from '../pages/V2Login';
import UserService from '../../services/UserService';

// Mock UserService
vi.mock('../../services/UserService', () => ({
  default: {
    login: vi.fn(),
    googleLogin: vi.fn(),
    createUser: vi.fn()
  }
}));

// Mock Auth
vi.mock('../../modules/Auth', () => ({
  default: {
    authenticateUser: vi.fn(),
    saveUserInfo: vi.fn()
  }
}));

// Mock AlertService
vi.mock('../../services/AlertService', () => ({
  alertError: vi.fn()
}));

describe('V2Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.google with proper API
    global.window.google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          prompt: vi.fn()
        }
      }
    };
    global.window.FB = {
      login: vi.fn((callback) => callback({ status: 'connected' })),
      api: vi.fn((path, options, callback) => callback({ id: '123', name: 'Test User', email: 'test@example.com' }))
    };
  });

  afterEach(() => {
    delete global.window.google;
    delete global.window.FB;
  });

  it('renders login form correctly with social buttons', () => {
    render(
      <MemoryRouter>
        <V2Login />
      </MemoryRouter>
    );
    expect(screen.getByText('ENARM V2')).toBeDefined();
    expect(screen.getByPlaceholderText('doctor@medical.com')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeDefined();
    // Social buttons should be present - use aria-label
    expect(screen.getByRole('button', { name: /Iniciar sesión con Google/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Iniciar sesión con Facebook/i })).toBeDefined();
  });

  it('shows divider between social and email login', () => {
    render(
      <MemoryRouter>
        <V2Login />
      </MemoryRouter>
    );
    expect(screen.getByText('o')).toBeDefined();
  });

  it('calls login with correct credentials', async () => {
    UserService.login.mockResolvedValue({
      data: {
        token: 'test-token',
        name: 'Test User',
        email: 'test@example.com',
        id: '123',
        role: 'player'
      }
    });

    render(
      <MemoryRouter>
        <V2Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('doctor@medical.com'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(UserService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('shows password toggle button', () => {
    render(
      <MemoryRouter>
        <V2Login />
      </MemoryRouter>
    );
    
    const toggleButton = screen.getByRole('button', { name: /Mostrar contraseña/i });
    expect(toggleButton).toBeDefined();
    
    fireEvent.click(toggleButton);
    const hideButton = screen.getByRole('button', { name: /Ocultar contraseña/i });
    expect(hideButton).toBeDefined();
  });

  it('has forgot password link', () => {
    render(
      <MemoryRouter>
        <V2Login />
      </MemoryRouter>
    );
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeDefined();
  });

  it('has signup link', () => {
    render(
      <MemoryRouter>
        <V2Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Regístrate aquí')).toBeDefined();
  });
});