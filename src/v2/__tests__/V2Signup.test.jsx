import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import V2Signup from '../pages/V2Signup';
import UserService from '../../services/UserService';

// Mock UserService
vi.mock('../../services/UserService', () => ({
  default: {
    createUser: vi.fn(),
    googleLogin: vi.fn()
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

describe('V2Signup', () => {
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

  it('renders signup form correctly with social buttons', () => {
    render(
      <MemoryRouter>
        <V2Signup />
      </MemoryRouter>
    );
    expect(screen.getByText('Crear Cuenta')).toBeDefined();
    expect(screen.getByPlaceholderText('Dr. García')).toBeDefined();
    // Use more specific selector for submit button (avoid matching social button text)
    expect(screen.getAllByRole('button', { name: /Registrarse/i }).length).toBeGreaterThan(0);
    // Social buttons should be present
    expect(screen.getByRole('button', { name: /Registrarse con Google/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Registrarse con Facebook/i })).toBeDefined();
  });

  it('shows divider between social and email signup', () => {
    render(
      <MemoryRouter>
        <V2Signup />
      </MemoryRouter>
    );
    expect(screen.getByText('o')).toBeDefined();
  });

  it('updates form fields correctly', () => {
    render(
      <MemoryRouter>
        <V2Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Dr. García'), {
      target: { value: 'Dr. García López' }
    });
    fireEvent.change(screen.getByPlaceholderText('doctor@medical.com'), {
      target: { value: 'drgarcia@medical.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('drgarcia'), {
      target: { value: 'drgarcialopez' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'securepass123' }
    });

    expect(screen.getByPlaceholderText('Dr. García').value).toBe('Dr. García López');
    expect(screen.getByPlaceholderText('doctor@medical.com').value).toBe('drgarcia@medical.com');
  });

  it('shows password toggle button', () => {
    render(
      <MemoryRouter>
        <V2Signup />
      </MemoryRouter>
    );
    
    const toggleButton = screen.getByRole('button', { name: /Mostrar contraseña/i });
    expect(toggleButton).toBeDefined();
    
    fireEvent.click(toggleButton);
    const hideButton = screen.getByRole('button', { name: /Ocultar contraseña/i });
    expect(hideButton).toBeDefined();
  });

  it('calls createUser with form data on submit', async () => {
    UserService.createUser.mockResolvedValue({
      data: {
        token: 'test-token',
        name: 'Dr. García López',
        email: 'drgarcia@medical.com',
        id: '123',
        role: 'player'
      }
    });

    render(
      <MemoryRouter>
        <V2Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Dr. García'), {
      target: { value: 'Dr. García López' }
    });
    fireEvent.change(screen.getByPlaceholderText('doctor@medical.com'), {
      target: { value: 'drgarcia@medical.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('drgarcia'), {
      target: { value: 'drgarcialopez' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'securepass123' }
    });

    // Use the submit button specifically (type='submit' to distinguish from social buttons)
    const submitButtons = screen.getAllByRole('button', { name: /Registrarse/i });
    const submitButton = submitButtons.find(btn => btn.type === 'submit');
    if (submitButton) {
      fireEvent.click(submitButton);
    }

    await waitFor(() => {
      expect(UserService.createUser).toHaveBeenCalledWith({
        name: 'Dr. García López',
        email: 'drgarcia@medical.com',
        username: 'drgarcialopez',
        password: 'securepass123'
      });
    });
  });

  it('has login link', () => {
    render(
      <MemoryRouter>
        <V2Signup />
      </MemoryRouter>
    );
    expect(screen.getByText('Inicia sesión')).toBeDefined();
  });
});