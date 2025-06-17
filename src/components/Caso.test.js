import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import Caso from './Caso';
import ExamService from '../services/ExamService';
import Auth from '../modules/Auth';
import { alertError } from '../services/AlertService';

// Mock dependencies
jest.mock('../services/ExamService');
jest.mock('../modules/Auth');
jest.mock('../services/AlertService');

jest.mock('sweetalert2-react', () => {
  // Mocking SweetAlert to make it easier to test its presence
  return (props) => {
    if (!props.show) {
      return null;
    }
    return (
      <div data-testid="sweet-alert">
        <h1>{props.title}</h1>
        <p>{props.text}</p>
        <button onClick={props.onConfirm}>Confirm</button>
      </div>
    );
  };
});

const mockHistory = {
  push: jest.fn(),
};

const mockFbUser = {
  facebook_id: '123456789',
  name: 'Test User',
};

const mockQuestions = [
  {
    id: 1,
    text: 'Question 1 Text',
    clinical_case: { description: 'Mock Case Description 1' },
    answers: [
      { id: 101, text: 'Answer 1.1', is_correct: true, question_id: 1, description: 'Correct one' },
      { id: 102, text: 'Answer 1.2', is_correct: false, question_id: 1, description: null },
    ],
  },
  {
    id: 2,
    text: 'Question 2 Text',
    clinical_case: { description: 'Mock Case Description 1' }, // usually same case for questions
    answers: [
      { id: 201, text: 'Answer 2.1', is_correct: false, question_id: 2, description: null },
      { id: 202, text: 'Answer 2.2', is_correct: true, question_id: 2, description: 'Correct choice here' },
    ],
  },
];

// Helper function to render the component with common props
const renderCaso = (clinicCaseId = 1, props = {}) => {
  return render(
    <Caso clinicCaseId={clinicCaseId} history={mockHistory} {...props} />
  );
};

describe('Caso Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Default mock implementations
    Auth.getFacebookUser.mockReturnValue(JSON.stringify(mockFbUser));
    ExamService.getQuestions.mockResolvedValue({ data: mockQuestions });
    ExamService.sendAnswers.mockResolvedValue({ data: {} }); // Default success response
    alertError.mockImplementation(() => {}); // Mock implementation for alertError
  });

  test('renders without crashing and displays static text', async () => {
    renderCaso();
    // Wait for questions to load and component to re-render
    await waitFor(() => expect(screen.getByText('Caso Clinico:')).toBeInTheDocument());
    expect(ExamService.getQuestions).toHaveBeenCalledWith(1);
    // Check for first question's case description (taken from the first question's clinical_case)
    await waitFor(() => expect(screen.getByText(mockQuestions[0].clinical_case.description)).toBeInTheDocument());
  });

  test('displays questions and answers', async () => {
    renderCaso();
    await waitFor(() => {
      expect(screen.getByText(mockQuestions[0].text)).toBeInTheDocument();
      expect(screen.getByText(mockQuestions[0].answers[0].text)).toBeInTheDocument();
      expect(screen.getByText(mockQuestions[0].answers[1].text)).toBeInTheDocument();
      expect(screen.getByText(mockQuestions[1].text)).toBeInTheDocument();
    });
  });

  test('handles no questions found', async () => {
    ExamService.getQuestions.mockResolvedValue({ data: [] });
    renderCaso();
    await waitFor(() => {
      expect(alertError).toHaveBeenCalledWith('Opps', 'No Se encontraron mas preguntas!');
    });
  });

  test('answer selection updates UI when showing correct answers', async () => {
    renderCaso();
    // Wait for questions to load
    await waitFor(() => expect(screen.getByText(mockQuestions[0].text)).toBeInTheDocument());

    // Select an answer for the first question (e.g., the first answer)
    const answer1Radio = screen.getByLabelText(mockQuestions[0].answers[0].text);
    fireEvent.click(answer1Radio);

    // To verify selection, we need to see its effect.
    // Let's simulate clicking "Siguiente" once to trigger "showAnswers" mode
    const siguienteButton = screen.getByRole('button', { name: /siguiente/i });

    // Select answers for all questions before clicking "Siguiente"
    const answer2Radio = screen.getByLabelText(mockQuestions[1].answers[1].text); // Correct answer for Q2
    fireEvent.click(answer2Radio);

    fireEvent.click(siguienteButton); // First click: shows answers

    await waitFor(() => {
      // Question 1, Answer 1 (Correct, Selected)
      const selectedCorrectAnswerItem = answer1Radio.closest('li');
      expect(selectedCorrectAnswerItem).toHaveClass('green lighten-4');
      expect(selectedCorrectAnswerItem.querySelector('.material-icons').textContent).toBe('check_circle');
      expect(screen.getByText(mockQuestions[0].answers[0].description)).toBeInTheDocument(); // Feedback description

      // Question 2, Answer 2 (Correct, Selected) - check its feedback description
       expect(screen.getByText(mockQuestions[1].answers[1].description)).toBeInTheDocument();
    });

    // Check a selected incorrect answer
    // Re-render or find a new component instance if state changes are complex to track
    // For this test, we'll focus on the path where correct answers are selected and shown
  });


  test('clicking "Siguiente" when not all questions are answered shows an alert', async () => {
    renderCaso();
    await waitFor(() => expect(screen.getByText(mockQuestions[0].text)).toBeInTheDocument());

    // Only select answer for the first question
    fireEvent.click(screen.getByLabelText(mockQuestions[0].answers[0].text));

    const siguienteButton = screen.getByRole('button', { name: /siguiente/i });
    fireEvent.click(siguienteButton);

    await waitFor(() => {
      expect(screen.getByTestId('sweet-alert')).toBeInTheDocument();
      expect(screen.getByText('Espera..')).toBeInTheDocument(); // Title of the alert
    });
    expect(ExamService.sendAnswers).not.toHaveBeenCalled();
    expect(mockHistory.push).not.toHaveBeenCalled();
  });

  test('clicking "Siguiente" when all questions answered calls sendAnswers, then navigates on second click', async () => {
    renderCaso();
    await waitFor(() => expect(screen.getByText(mockQuestions[0].text)).toBeInTheDocument());

    // Select answers for all questions
    fireEvent.click(screen.getByLabelText(mockQuestions[0].answers[0].text)); // Q1 Answer
    fireEvent.click(screen.getByLabelText(mockQuestions[1].answers[1].text)); // Q2 Answer (correct)

    const siguienteButton = screen.getByRole('button', { name: /siguiente/i });

    // First click
    fireEvent.click(siguienteButton);

    await waitFor(() => {
      expect(ExamService.sendAnswers).toHaveBeenCalledTimes(1);
      const expectedAnswersPayload = {
        facebook_id: mockFbUser.facebook_id,
        player_answers: [
          { question_id: mockQuestions[0].id, answer_id: mockQuestions[0].answers[0].id },
          { question_id: mockQuestions[1].id, answer_id: mockQuestions[1].answers[1].id },
        ],
      };
      expect(ExamService.sendAnswers).toHaveBeenCalledWith(expectedAnswersPayload);
    });

    // At this point, showAnswers should be true. The button is still "Siguiente"
    // Verify correct answer feedback is visible for Q2 (as it was selected and is correct)
    const answer2Radio = screen.getByLabelText(mockQuestions[1].answers[1].text);
    const selectedCorrectAnswerItem = answer2Radio.closest('li');
    expect(selectedCorrectAnswerItem).toHaveClass('green lighten-4');
    expect(selectedCorrectAnswerItem.querySelector('.material-icons').textContent).toBe('check_circle');

    expect(mockHistory.push).not.toHaveBeenCalled(); // Not yet navigated

    // Second click
    fireEvent.click(siguienteButton);

    await waitFor(() => {
      // Assuming next case ID is currentClinicCaseId + 1. Initial clinicCaseId is 1.
      expect(mockHistory.push).toHaveBeenCalledWith('/caso/2');
    });
  });

  test('shows feedback for incorrectly selected answer when answers are revealed', async () => {
    renderCaso();
    await waitFor(() => expect(screen.getByText(mockQuestions[0].text)).toBeInTheDocument());

    // Select an INCORRECT answer for the first question
    const incorrectAnswerRadioQ1 = screen.getByLabelText(mockQuestions[0].answers[1].text); // Incorrect
    fireEvent.click(incorrectAnswerRadioQ1);

    // Select any answer for the second question to allow proceeding
    const answerRadioQ2 = screen.getByLabelText(mockQuestions[1].answers[0].text);
    fireEvent.click(answerRadioQ2);

    const siguienteButton = screen.getByRole('button', { name: /siguiente/i });
    fireEvent.click(siguienteButton); // First click: shows answers

    await waitFor(() => {
      // Question 1, Answer 2 (Incorrect, Selected)
      const selectedIncorrectAnswerItem = incorrectAnswerRadioQ1.closest('li');
      expect(selectedIncorrectAnswerItem).toHaveClass('red lighten-4'); // Check for red class
      expect(selectedIncorrectAnswerItem.querySelector('.material-icons').textContent).toBe('highlight_off'); // Check for 'X' icon

      // Also, the correct answer for Q1 should be highlighted green, but not selected
      const correctAnswerQ1 = screen.getByLabelText(mockQuestions[0].answers[0].text);
      const correctAnswerItemQ1 = correctAnswerQ1.closest('li');
      expect(correctAnswerItemQ1).toHaveClass('green lighten-4');
      // It should not have the "check_circle" from selection, but it will show its own feedback if it's correct.
      // The icon logic in Pregunta.js only adds check_circle or highlight_off to the *selected* answer.
      // Correct non-selected answers just get the green background and their description.
      expect(screen.getByText(mockQuestions[0].answers[0].description)).toBeInTheDocument();
    });
  });

});
