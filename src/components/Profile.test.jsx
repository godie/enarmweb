import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import Auth from '../modules/Auth';
import ExamService from '../services/ExamService';

// Mock modules
vi.mock('../modules/Auth', () => ({
  default: {
    getUserInfo: vi.fn(),
  }
}));

vi.mock('../services/ExamService', () => ({
  default: {
    loadCategories: vi.fn(),
  }
}));

// Mock modules that might be used by children
vi.mock('../services/UserService', () => ({
  default: {
    updateUser: vi.fn(),
  }
}));

describe('Profile Component', () => {
  const mockUser = {
    id: 'user123',
    name: 'Test Doctor',
    email: 'test@example.com',
    role: 'player',
    nickname: 'test_doc'
  };

  const mockCategories = [
    { id: 1, name: 'Cardiología' },
    { id: 2, name: 'Pediatría' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockReturnValue(new Promise(() => { }));

    render(<Profile />);
    expect(screen.getByRole('progressbar') || screen.getByTestId('preloader')).toBeInTheDocument();
  });

  test('displays user information correctly', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });

    render(<Profile />);

    await waitFor(() => {
      // Check for nickname and name
      expect(screen.getByText(/@test_doc/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Doctor/i)).toBeInTheDocument();

      // Check for stats
      expect(screen.getByText(/Casos Resueltos/i)).toBeInTheDocument();
      expect(screen.getByText(/Precisión/i)).toBeInTheDocument();
    });
  });

  test('renders specialty progress bars', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Cardiología')).toBeInTheDocument();
      expect(screen.getByText('Pediatría')).toBeInTheDocument();
    });
  });

  test('renders form fields', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nickname/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    });
  });

  test('renders subscription section', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/Suscripción/i)).toBeInTheDocument();
      expect(screen.getByText(/Suscribirse ahora/i)).toBeInTheDocument();
    });
  });
});
