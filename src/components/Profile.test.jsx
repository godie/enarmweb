import { vi, describe, beforeEach, test, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import Auth from '../modules/Auth';
import ExamService from '../services/ExamService';
import UserService from '../services/UserService';
import AlertService from '../services/AlertService';

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

vi.mock('../services/UserService', () => ({
  default: {
    getUserStats: vi.fn(),
    updateUser: vi.fn(),
  }
}));

vi.mock('../services/AlertService', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('Profile Component', () => {
  const mockUser = {
    id: 'user123',
    name: 'Test Doctor',
    email: 'test@example.com',
    role: 'player',
    nickname: 'test_doc',
    preferences: {
        specialties: [1]
    }
  };

  const mockCategories = [
    { id: 1, name: 'Cardiología' },
    { id: 2, name: 'Pediatría' },
  ];

  const mockStats = {
    total_answers: 150,
    points: 450,
    accuracy: 75.5,
    streak: 5
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockReturnValue(new Promise(() => { }));
    vi.mocked(UserService.getUserStats).mockReturnValue(new Promise(() => { }));

    const { container } = render(<Profile />);
    // In our new Profile, we use CustomPreloader
    expect(container.querySelector('.enarm-loading-wrapper')).toBeInTheDocument();
  });

  test('displays user information correctly', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });
    vi.mocked(UserService.getUserStats).mockResolvedValue({ data: mockStats });

    render(<Profile />);

    await waitFor(() => {
      // Check for nickname and name
      expect(screen.getByText(/@test_doc/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Doctor/i)).toBeInTheDocument();

      // Check for stats
      expect(screen.getByText(/Respuestas Totales/i)).toBeInTheDocument();
      expect(screen.getByText(/Puntos/i)).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('450')).toBeInTheDocument();
      expect(screen.getByText('75.5%')).toBeInTheDocument();
      expect(screen.getByText('5 días')).toBeInTheDocument();
    });
  });

  test('renders specialty progress bars', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });
    vi.mocked(UserService.getUserStats).mockResolvedValue({ data: mockStats });

    render(<Profile />);

    await waitFor(() => {
      // Use getAllByText as there are multiple occurrences (progress and selection)
      expect(screen.getAllByText('Cardiología').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Pediatría').length).toBeGreaterThanOrEqual(1);
    });
  });

  test('renders specialty selection checkboxes', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });
    vi.mocked(UserService.getUserStats).mockResolvedValue({ data: mockStats });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/Selección de Especialidades/i)).toBeInTheDocument();
      const checkboxes = screen.getAllByRole('checkbox');
      // leaderboardVisible switch + 2 specialties
      expect(checkboxes.length).toBeGreaterThanOrEqual(3);
    });
  });

  test('renders form fields', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });
    vi.mocked(UserService.getUserStats).mockResolvedValue({ data: mockStats });

    render(<Profile />);

    await waitFor(() => {
      // Use label regex to match correctly
      expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nickname/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    });
  });

  test('renders subscription section', async () => {
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });
    vi.mocked(UserService.getUserStats).mockResolvedValue({ data: mockStats });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/Suscripción/i)).toBeInTheDocument();
      expect(screen.getByText(/Suscribirse ahora/i)).toBeInTheDocument();
    });
  });
});
