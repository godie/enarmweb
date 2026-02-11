import { vi, describe, beforeEach, expect, test } from "vitest";

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import CasoContainer from './CasoContainer';
import ExamService from '../../services/ExamService';

import * as AlertService from '../../services/AlertService';

// NUEVO: Importar y mockear AlertService
//import {alertSuccess, alertError} from '../services/AlertService'; 

// Mock react-router-dom
const mockGoBack = vi.fn();
const mockPush = vi.fn();
let mockParams = {}; // To be set by tests

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => mockParams,
    useHistory: () => ({
      goBack: mockGoBack,
      push: mockPush,
    }),
  };
});

// Mock services
vi.mock('../../services/ExamService');

vi.mock('../../services/AlertService', () => ({
  alertSuccess: vi.fn(),
  alertError: vi.fn(),
}));


// Mock child component CasoForm
let passedCasoProp; // To capture the 'caso' prop passed to CasoForm

vi.mock('./CasoForm', async () => {
  const { useCaso } = await import('../../context/CasoContext');
  return {
    default: function MockCasoForm() {
      const props = useCaso();
      passedCasoProp = props.caso; // Capture the caso prop
      // Simulate form interaction by calling the passed functions
      return (
        <form data-testid="mock-caso-form" action={props.saveCasoAction}>
          <textarea
            data-testid="caso-description-input"
            name="description"
            value={props.caso.description}
            onChange={props.onChange}
          />
          <button type="button" data-testid="add-question" onClick={props.addQuestion}>
            Agregar Pregunta
          </button>
          {props.caso.questions.map((q, qIdx) => (
            <div key={`q-${qIdx}`}>
              <input id={`question-text-${qIdx}`} name={`questions[${qIdx}][text]`} data-testid={`question-text-input-${qIdx}`} value={q.text} onChange={(e) => props.onChangeQuestion(qIdx, e)} />
              <button type="button" data-testid={`delete-question-${qIdx}`} onClick={() => props.deleteQuestion(qIdx)}>Eliminar Pregunta</button>
              <button type="button" data-testid={`add-answer-q${qIdx}`} onClick={() => props.addAnswer(qIdx)}>
                Agregar Respuesta
              </button>
              {q.answers.map((ans, ansIdx) => (
                <div key={`q-${qIdx}-a-${ansIdx}`}>
                  <input id={`answer-text-${qIdx}-${ansIdx}`} data-testid={`answer-text-input-${qIdx}-${ansIdx}`} value={ans.text} onChange={(e) => props.onChangeAnswer(qIdx, ansIdx, 'text', e)} name={`questions[${qIdx}][answers][${ansIdx}][text]`} />
                  <button type="button" data-testid={`delete-answer-${qIdx}-${ansIdx}`} onClick={() => props.deleteAnswer(qIdx, ansIdx)}>Eliminar Respuesta</button>
                </div>
              ))}
            </div>
          ))}
          <button type="submit" data-testid="submit-button">Guardar</button>
          <button type="button" data-testid="cancel-button" onClick={props.onCancel}>Cancelar</button>
        </form>
      );
    }
  }
}
);



// Mock Materialize.updateTextFields
vi.mock('materialize-css', () => ({
  updateTextFields: vi.fn(),
}));


// Mock document.getElementById().focus()
const mockFocus = vi.fn();
global.document.getElementById = vi.fn();

const mockCasoData = {
  id: '1',
  description: 'Loaded Case Description',
  questions: [
    { id: 10, text: 'Loaded Question 1', answers: [{ id: 100, text: 'Loaded Answer 1.1', is_correct: false, description: '' }] },
  ],
};

const { alertError, alertSuccess } = AlertService;

describe('CasoContainer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    AlertService.alertSuccess.mockImplementation(() => Promise.resolve({ isConfirmed: true }));
    AlertService.alertError.mockImplementation(() => Promise.resolve({ isConfirmed: true }));
    global.document.getElementById.mockImplementation((id) => {
      if (id && (id.startsWith('question-text-') || id.startsWith('answer-text-'))) {
        return { focus: mockFocus }
      }
      return null;
    });
    mockFocus.mockClear(); // Clear focus mock too

    mockParams = {};
    passedCasoProp = null;

    ExamService.getCaso.mockResolvedValue({ data: mockCasoData });
    ExamService.saveCaso.mockImplementation((casoToSave) => {
      if (casoToSave.id) {
        return Promise.resolve({ data: { id: casoToSave.id, ...casoToSave } });
      } else {
        return Promise.resolve({ data: { id: 'newId', ...casoToSave } });
      }
    });
  });

  const renderContainer = () => render(<CasoContainer />);

  test('renders CasoForm for a new case', () => {
    renderContainer();
    expect(screen.getByTestId('mock-caso-form')).toBeInTheDocument();
    expect(ExamService.getCaso).not.toHaveBeenCalled();
    //expect(passedCasoProp).toEqual(initialCasoState);
  });

  test('loads data for an existing case and calls Materialize.updateTextFields', async () => {
    mockParams = { identificador: '1' };
    renderContainer();

    await waitFor(() => expect(ExamService.getCaso).toHaveBeenCalledWith(1));
    await waitFor(() => expect(passedCasoProp).toEqual(mockCasoData));
    //await waitFor(() => expect(Materialize.updateTextFields).toHaveBeenCalledTimes(1));
  });

  test('handles description change', async () => {
    renderContainer();
    const descriptionInput = screen.getByTestId('caso-description-input');
    fireEvent.change(descriptionInput, { target: { name: 'description', value: 'New Description' } });

    await waitFor(() => {
      expect(passedCasoProp.description).toBe('New Description');
    })
  });

  test('adds a new question and focuses it', async () => {
    renderContainer();
    const initialQuestionsCount = passedCasoProp.questions.length;
    fireEvent.click(screen.getByTestId('add-question'));
    await waitFor(() => expect(passedCasoProp.questions.length).toBe(initialQuestionsCount + 1));
    expect(passedCasoProp.questions[initialQuestionsCount]).toEqual({ id: 0, text: "Pregunta", answers: [{ description: "", id: 0, is_correct: false, text: "Respuesta" }, { description: "", id: 0, is_correct: false, text: "Respuesta" }, { description: "", id: 0, is_correct: false, text: "Respuesta" }, { description: "", id: 0, is_correct: false, text: "Respuesta" }] });
    expect(global.document.getElementById).toHaveBeenCalledWith(`question-text-${initialQuestionsCount}`);
    expect(mockFocus).toHaveBeenCalled();
  });

  test('adds a new answer to a question and focuses it', async () => {
    ExamService.getCaso.mockResolvedValue({
      data: {
        ...mockCasoData,
        questions: [{ id: 10, text: 'Question with no answers yet', answers: [] }]
      }
    });
    mockParams = { identificador: '1' };
    renderContainer();

    await waitFor(() => expect(passedCasoProp.questions.length).toBe(1));
    const questionIndex = 0;
    const initialAnswersCount = passedCasoProp.questions[questionIndex].answers.length;

    fireEvent.click(screen.getByTestId(`add-answer-q${questionIndex}`));

    await waitFor(() => expect(passedCasoProp.questions[questionIndex].answers.length).toBe(initialAnswersCount + 1));
    expect(passedCasoProp.questions[questionIndex].answers[initialAnswersCount]).toEqual({
      id: 0, text: "Respuesta", is_correct: false, description: "",
    });
    expect(global.document.getElementById).toHaveBeenCalledWith(`answer-text-${questionIndex}-${initialAnswersCount}`);
    expect(mockFocus).toHaveBeenCalled();
  });

  test('deletes a question', async () => {
    ExamService.getCaso.mockResolvedValue({ data: JSON.parse(JSON.stringify(mockCasoData)) });
    mockParams = { identificador: '1' };
    renderContainer();

    await waitFor(() => expect(passedCasoProp.questions.length).toBe(1));
    fireEvent.click(screen.getByTestId('delete-question-0'));
    await waitFor(() => expect(passedCasoProp.questions.length).toBe(0));
  });

  test('deletes an answer', async () => {
    ExamService.getCaso.mockResolvedValue({ data: JSON.parse(JSON.stringify(mockCasoData)) });
    mockParams = { identificador: '1' };
    renderContainer();

    await waitFor(() => expect(passedCasoProp.questions[0].answers.length).toBe(1));
    fireEvent.click(screen.getByTestId('delete-answer-0-0'));
    await waitFor(() => expect(passedCasoProp.questions[0].answers.length).toBe(0));
  });


  test('form submission success shows success alert', async () => {
    renderContainer();
    fireEvent.change(screen.getByTestId('caso-description-input'), { target: { name: 'description', value: 'Test Submit' } });
    const formData = new FormData();
    formData.append('description', 'Test Submit');
    formData.append('casoData', JSON.stringify(passedCasoProp));

    fireEvent.click(screen.getByTestId('submit-button'));

    // await act(async () => {
    //   await casoFormSaveAction(null, formData);
    // });

    await waitFor(() => expect(ExamService.saveCaso).toHaveBeenCalledTimes(1));
    expect(ExamService.saveCaso).toHaveBeenCalledWith(expect.objectContaining({
      description: 'Test Submit',
      // Ensure questions and answers are also correctly structured
      questions_attributes: expect.any(Array)
    }));

    // NUEVO: Aserciones para AlertService.alertSuccess
    await waitFor(() => expect(alertSuccess).toHaveBeenCalledTimes(1));
    expect(alertSuccess).toHaveBeenCalledWith('Caso Clinico', 'Se ha guardado correctamente');
    await waitFor(() => expect(mockGoBack).toHaveBeenCalledTimes(1)); // Assuming it calls goBack after success alert
  });

  test('form submission error shows error alert', async () => {
    ExamService.saveCaso.mockRejectedValue(new Error('Save failed'));
    renderContainer();
    fireEvent.change(screen.getByTestId('caso-description-input'), { target: { name: 'description', value: 'Test Error Submit' } });

    const formData = new FormData();
    formData.append('description', 'Test Error Submit');

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => expect(ExamService.saveCaso).toHaveBeenCalledTimes(1));
    expect(ExamService.saveCaso).toHaveBeenCalledWith(expect.objectContaining({
      description: 'Test Error Submit'
    }));

    // NUEVO: Aserciones para AlertService.alertError
    await waitFor(() => expect(alertError).toHaveBeenCalledTimes(1));
    expect(alertError).toHaveBeenCalledWith('Caso Clinico', 'Ha ocurrido un error, no se pudo guardar');
  });

  test('cancel button calls history.goBack', () => {
    renderContainer();
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});