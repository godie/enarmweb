import { vi, describe, beforeEach, test, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import Auth from '../modules/Auth';
import ExamService from '../services/ExamService';
import UserService from '../services/UserService';

// Mock modules
vi.mock('../modules/Auth', () => ({
  default: {
    getUserInfo: vi.fn(),
    savePlayerInfo: vi.fn(),
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
    vi.mocked(Auth.getUserInfo).mockReturnValue(mockUser);
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });
    vi.mocked(UserService.getUserStats).mockResolvedValue({ data: mockStats });
  });

  test('renders loading state initially', () => {
    vi.mocked(ExamService.loadCategories).mockReturnValue(new Promise(() => { }));
    const { container } = render(<Profile />);
    expect(container.querySelector('.enarm-loading-wrapper')).toBeInTheDocument();
  });

  test('displays user information correctly', async () => {
    render(<Profile />);

    // Use findByText with a function to match text that might be split across nodes or have extra whitespace
    const nameElement = await screen.findByText((content, element) => {
      return element.tagName.toLowerCase() === 'h5' && content.includes('Test Doctor');
    });
    expect(nameElement).toBeInTheDocument();

    const nicknameElement = await screen.findByText((content, element) => {
      return element.tagName.toLowerCase() === 'h4' && content.includes('@test_doc');
    });
    expect(nicknameElement).toBeInTheDocument();

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument();
    expect(screen.getByText('75.5%')).toBeInTheDocument();
  });

  test('renders specialty progress bars', async () => {
    render(<Profile />);
    const cardio = await screen.findAllByText('Cardiología');
    expect(cardio.length).toBeGreaterThanOrEqual(1);
  });

  test('renders specialty selection checkboxes', async () => {
    render(<Profile />);
    await screen.findByText(/Selección de Especialidades/i);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThanOrEqual(3);
  });

  test('renders form fields', async () => {
    render(<Profile />);
    await screen.findByLabelText(/Nombre Completo/i);
    expect(screen.getByLabelText(/Nickname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
  });
});
