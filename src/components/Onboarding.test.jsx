import { vi, describe, beforeEach, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Onboarding from './Onboarding';
import Auth from '../modules/Auth';
import ExamService from '../services/ExamService';

// Mock modules
vi.mock('../modules/Auth', () => ({ default: { getUserInfo: vi.fn(), savePlayerInfo: vi.fn() } }));
vi.mock('../services/ExamService', () => ({ default: { loadCategories: vi.fn() } }));
vi.mock('../services/UserService', () => ({ default: { updateUser: vi.fn() } }));
vi.mock('react-router-dom', () => ({ useHistory: () => ({ push: vi.fn() }) }));

describe('Onboarding Component', () => {
  const mockCategories = [{ id: 1, name: 'Cardiología' }];
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Auth.getUserInfo).mockReturnValue({ name: 'Test' });
    vi.mocked(ExamService.loadCategories).mockResolvedValue({ data: mockCategories });
  });

  test('should select and deselect all specialties', async () => {
    render(<Onboarding />);
    const selectAllBtn = await screen.findByText((c, e) => e.tagName.toLowerCase() === 'button' && c.includes('Seleccionar todas'));
    const deselectAllBtn = screen.getByText((c, e) => e.tagName.toLowerCase() === 'button' && c.includes('Deseleccionar todas'));

    fireEvent.click(selectAllBtn);
    expect(await screen.findByLabelText(/Deseleccionar especialidad Cardiología/i)).toBeInTheDocument();

    fireEvent.click(deselectAllBtn);
    expect(await screen.findByLabelText(/Seleccionar especialidad Cardiología/i)).toBeInTheDocument();
  });
});
