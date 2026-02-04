
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, beforeEach, test, expect } from 'vitest';

import Caso from './Caso';
import ExamService from '../services/ExamService';
import Auth from '../modules/Auth';
import { alertError } from '../services/AlertService';

// Mock dependencies explicitly
vi.mock('../services/ExamService', () => ({
  default: {
    getQuestions: vi.fn(),
    sendAnswers: vi.fn(),
  }
}));

vi.mock('../modules/Auth', () => ({
  default: {
    getUserInfo: vi.fn(),
  }
}));

vi.mock('../services/AlertService', () => ({
  alertError: vi.fn(),
}));

vi.mock('../commons/Util', () => ({
  default: {
    showToast: vi.fn(),
  }
}));

const mockPush = vi.fn();

vi.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
    replace: vi.fn(),
    goBack: vi.fn(),
    location: { pathname: '/' }
  })
}));

const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com'
};

const mockQuestions = [
  {
    id: 1,
    text: 'Question 1 Text',
    answers: [
      { id: 101, text: 'Answer 1.1', is_correct: true, question_id: 1, description: 'Correct one' },
      { id: 102, text: 'Answer 1.2', is_correct: false, question_id: 1, description: null },
    ],
  },
  {
    id: 2,
    text: 'Question 2 Text',
    answers: [
      { id: 201, text: 'Answer 2.1', is_correct: false, question_id: 2, description: null },
      { id: 202, text: 'Answer 2.2', is_correct: true, question_id: 2, description: 'Correct choice here' },
    ],
  },
];
const mockClinicalCase = { description: 'Mock Case Description 1', questions: mockQuestions };

describe('Caso Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Auth.getUserInfo.mockReturnValue(mockUser);
    ExamService.getQuestions.mockResolvedValue({ data: mockClinicalCase });
    ExamService.sendAnswers.mockResolvedValue({ data: {} });
  });

  test('renders without crashing and displays static text', async () => {
    render(<Caso clinicCaseId={1} />);
    // Check for preloader initially
    expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Caso Clinico:')).toBeInTheDocument());
    expect(ExamService.getQuestions).toHaveBeenCalledWith(1);
    expect(screen.getByText(mockClinicalCase.description)).toBeInTheDocument();

    // Preloader should be gone
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  test('clicking "Siguiente" when all questions answered calls sendAnswers', async () => {
    render(<Caso clinicCaseId={1} />);
    await waitFor(() => expect(screen.getByText(mockQuestions[0].text)).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText(mockQuestions[0].answers[0].text));
    fireEvent.click(screen.getByLabelText(mockQuestions[1].answers[1].text));

    const siguienteButton = screen.getByRole('button', { name: /calificar/i });
    fireEvent.click(siguienteButton);

    await waitFor(() => {
      expect(ExamService.sendAnswers).toHaveBeenCalledTimes(1);
      const expectedPayload = {
        user_answers: [
          { question_id: mockQuestions[0].id, answer_id: mockQuestions[0].answers[0].id },
          { question_id: mockQuestions[1].id, answer_id: mockQuestions[1].answers[1].id },
        ],
      };
      expect(ExamService.sendAnswers).toHaveBeenCalledWith(expectedPayload);
    });
  });

  test('shows alert if trying to send without being logged in', async () => {
    Auth.getUserInfo.mockReturnValue(null);
    render(<Caso clinicCaseId={1} />);
    await waitFor(() => expect(screen.getByText(mockQuestions[0].text)).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText(mockQuestions[0].answers[0].text));
    fireEvent.click(screen.getByLabelText(mockQuestions[1].answers[1].text));

    const siguienteButton = screen.getByRole('button', { name: /calificar/i });
    fireEvent.click(siguienteButton);

    expect(alertError).toHaveBeenCalledWith('Simulador', 'Debes iniciar sesión para guardar tus respuestas');
    expect(ExamService.sendAnswers).not.toHaveBeenCalled();
  });
});
