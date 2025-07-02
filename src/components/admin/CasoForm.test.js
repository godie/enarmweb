import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CasoForm from './CasoForm';

// Mock Materialize global M object
global.M = {
  textareaAutoResize: jest.fn(),
  updateTextFields: jest.fn(),
  Tooltip: {
    init: jest.fn(),
  },
  validate_field: jest.fn(), // Added this line
  // Add other M functions if needed by other components used within CasoForm
};

// Helper to provide default props and allow overriding
const getDefaultProps = () => ({
  saveCasoAction: jest.fn(),
  onChange: jest.fn(),
  onChangeAnswer: jest.fn(),
  onChangeQuestion: jest.fn(),
  addQuestion: jest.fn(),
  deleteQuestion: jest.fn(),
  addAnswer: jest.fn(),
  deleteAnswer: jest.fn(),
  onCancel: jest.fn(),
  caso: {
    description: 'Initial Case Description',
    questions: [],
  },
});

describe('CasoForm Component', () => {
  test('renders initial description and basic form elements', () => {
    const props = getDefaultProps();
    render(<CasoForm {...props} />);

    expect(screen.getByLabelText('Caso clinico')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial Case Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agregar pregunta/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  test('calls onChange when description is changed', () => {
    const props = getDefaultProps();
    render(<CasoForm {...props} />);
    const descriptionTextarea = screen.getByLabelText('Caso clinico');
    fireEvent.change(descriptionTextarea, { target: { name: 'description', value: 'New description' } });
    expect(props.onChange).toHaveBeenCalledTimes(1);
    // More specific check if needed:
    // expect(props.onChange).toHaveBeenCalledWith(expect.objectContaining({ target: { name: 'description', value: 'New description' } }));
  });

  test('calls saveCasoAction when form is submitted', () => {
    const props = getDefaultProps();
    render(<CasoForm {...props} />);
    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton); // Or fireEvent.submit(formElement)
    expect(props.saveCasoAction).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when cancel button is clicked', () => {
    const props = getDefaultProps();
    render(<CasoForm {...props} />);
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  test('calls addQuestion when "Agregar Pregunta" button is clicked', () => {
    const props = getDefaultProps();
    render(<CasoForm {...props} />);
    const addQuestionButton = screen.getByRole('button', { name: /agregar pregunta/i });
    fireEvent.click(addQuestionButton);
    expect(props.addQuestion).toHaveBeenCalledTimes(1);
  });

  describe('With Questions and Answers', () => {
    const propsWithQuestions = {
      ...getDefaultProps(),
      caso: {
        description: 'Case with questions',
        questions: [
          {
            text: 'Question 1',
            answers: [
              { text: 'Answer 1.1', is_correct: true, description: 'Reason 1.1' },
              { text: 'Answer 1.2', is_correct: false, description: '' },
            ],
          },
          {
            text: 'Question 2',
            answers: [{ text: 'Answer 2.1', is_correct: false, description: '' }],
          },
        ],
      },
    };

    test('renders questions and their texts', () => {
      render(<CasoForm {...propsWithQuestions} />);
      expect(screen.getByDisplayValue('Question 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Question 2')).toBeInTheDocument();
    });

    test('renders answers and their texts', () => {
      render(<CasoForm {...propsWithQuestions} />);
      expect(screen.getByDisplayValue('Answer 1.1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Answer 1.2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Answer 2.1')).toBeInTheDocument();
    });

    test('renders answer description textarea for correct answer if description is present', () => {
      render(<CasoForm {...propsWithQuestions} />);
      // For Answer 1.1 (correct, with description)
      const answerDesc11 = screen.getByDisplayValue('Reason 1.1');
      expect(answerDesc11).toBeInTheDocument();
      // Check if its parent div is shown (has class 'show')
      // This requires a more specific selector or inspecting classList
      expect(answerDesc11.closest('div.input-field')?.classList.contains('show')).toBe(true);
    });

    test('answer description textarea is hidden for incorrect answer', () => {
      render(<CasoForm {...propsWithQuestions} />);
      const answerText12 = screen.getByDisplayValue('Answer 1.2');
      const answerDesc12Textarea = document.getElementById('answer-description-0-1'); // for Q0, A1
      expect(answerDesc12Textarea).toBeInTheDocument();
      const parentCol = answerDesc12Textarea.closest('div.col.s8');
      expect(parentCol).toBeInTheDocument();
      expect(parentCol).toHaveClass('hide');
    });

    test('answer description textarea is visible for correct answer if description is empty/null', () => {
      const props = {
        ...getDefaultProps(),
        caso: {
          description: 'Test',
          questions: [
            {
              text: 'Q1',
              answers: [{ text: 'A1', is_correct: true, description: '' }],
            },
          ],
        },
      };
      render(<CasoForm {...props} />);
      const answerDescTextarea = document.getElementById('answer-description-0-0');
      expect(answerDescTextarea?.closest('div.input-field')?.classList.contains('show')).toBe(true);
    });


    test('calls onChangeQuestion when a question text is changed', () => {
      render(<CasoForm {...propsWithQuestions} />);
      const question1Textarea = screen.getByDisplayValue('Question 1');
      fireEvent.change(question1Textarea, { target: { value: 'New Question 1 Text' } });
      expect(propsWithQuestions.onChangeQuestion).toHaveBeenCalledTimes(1);
      expect(propsWithQuestions.onChangeQuestion).toHaveBeenCalledWith(0, expect.anything()); // 0 for first question
    });

    test('calls onChangeAnswer for answer text change', () => {
      render(<CasoForm {...propsWithQuestions} />);
      const answer11Text = screen.getByDisplayValue('Answer 1.1');
      fireEvent.change(answer11Text, { target: { value: 'New Answer 1.1 Text' } });
      expect(propsWithQuestions.onChangeAnswer).toHaveBeenCalledTimes(1);
      expect(propsWithQuestions.onChangeAnswer).toHaveBeenCalledWith(0, 0, 'text', expect.anything()); // Q0, A0
    });

    test('calls onChangeAnswer for "is_correct" checkbox change', () => {
      render(<CasoForm {...propsWithQuestions} />);
      const checkboxes = screen.getAllByRole('checkbox');

      propsWithQuestions.onChangeAnswer.mockClear(); // Clear mock before event
      fireEvent.click(checkboxes[0]); // Click the first checkbox (Answer 1.1)

      expect(propsWithQuestions.onChangeAnswer).toHaveBeenCalledTimes(1);
      expect(propsWithQuestions.onChangeAnswer).toHaveBeenCalledWith(0, 0, 'is_correct', expect.anything());
    });

    test('calls onChangeAnswer for answer description change', () => {
      render(<CasoForm {...propsWithQuestions} />);
      const answerDescTextarea = screen.getByDisplayValue('Reason 1.1'); // For Q0, A0

      propsWithQuestions.onChangeAnswer.mockClear(); // Clear mock before event
      fireEvent.change(answerDescTextarea, { target: { value: 'New Reason 1.1' } });

      expect(propsWithQuestions.onChangeAnswer).toHaveBeenCalledTimes(1);
      expect(propsWithQuestions.onChangeAnswer).toHaveBeenCalledWith(0, 0, 'description', expect.anything());
    });

    test('calls deleteQuestion when a question delete button is clicked', () => {
      render(<CasoForm {...propsWithQuestions} />);
      // Find delete buttons for questions (icon "delete", inside a button)
      // They are associated with each question.
      const deleteQuestionButtons = screen.getAllByRole('button', { name: /borrar pregunta/i });
      fireEvent.click(deleteQuestionButtons[0]); // Click delete for Question 1
      expect(propsWithQuestions.deleteQuestion).toHaveBeenCalledTimes(1);
      expect(propsWithQuestions.deleteQuestion).toHaveBeenCalledWith(0, expect.anything()); // 0 for first question
    });

    test('calls addAnswer when "add answer" button for a question is clicked', () => {
      render(<CasoForm {...propsWithQuestions} />);
      // Find "add answer" buttons (icon "playlist_add")
      const addAnswerButtons = screen.getAllByRole('button', { name: /agregar una respuesta/i });
      fireEvent.click(addAnswerButtons[0]); // Click for Question 1
      expect(propsWithQuestions.addAnswer).toHaveBeenCalledTimes(1);
      expect(propsWithQuestions.addAnswer).toHaveBeenCalledWith(0, expect.anything()); // 0 for first question
    });

    test('calls deleteAnswer when an answer delete button is clicked', () => {
      render(<CasoForm {...propsWithQuestions} />);
      // Find "delete answer" buttons (icon "delete" but for answers)
      const deleteAnswerButtons = screen.getAllByRole('button', { name: /borrar respuesta/i });
      fireEvent.click(deleteAnswerButtons[0]); // Click for Answer 1.1
      expect(propsWithQuestions.deleteAnswer).toHaveBeenCalledTimes(1);
      expect(propsWithQuestions.deleteAnswer).toHaveBeenCalledWith(0, 0, expect.anything()); // Q0, A0
    });
  });
});
