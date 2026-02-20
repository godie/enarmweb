
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import QuestionForm from './QuestionForm';
import CasoContext from '../../context/CasoContext';

describe('QuestionForm Component', () => {
    const mockProps = {
        question: {
            text: 'Question Text',
            answers: [
                { text: 'Answer 1', is_correct: false },
                { text: 'Answer 2', is_correct: true }
            ]
        },
        questionIndex: 0
    };

    const contextValue = {
        onChangeQuestion: vi.fn(),
        deleteQuestion: vi.fn(),
        onChangeAnswer: vi.fn(),
        addAnswer: vi.fn(),
        deleteAnswer: vi.fn()
    };

    const renderWithContext = (ui) => {
        return render(
            <CasoContext.Provider value={contextValue}>
                {ui}
            </CasoContext.Provider>
        );
    };

    test('renders question text input', () => {
        renderWithContext(<QuestionForm {...mockProps} />);
        expect(screen.getByLabelText(/Texto de la pregunta/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Question Text')).toBeInTheDocument();
    });

    test('renders correct number of answers', () => {
        renderWithContext(<QuestionForm {...mockProps} />);
        expect(screen.getAllByLabelText(/Respuesta \d/i)).toHaveLength(2);
    });

    test('calls onChangeQuestion when text changes', () => {
        renderWithContext(<QuestionForm {...mockProps} />);
        const input = screen.getByLabelText(/Texto de la pregunta/i);
        fireEvent.change(input, { target: { value: 'New Question' } });
        expect(contextValue.onChangeQuestion).toHaveBeenCalledWith(0, expect.anything());
    });

    test('calls deleteQuestion when delete button is clicked', () => {
        renderWithContext(<QuestionForm {...mockProps} />);
        const deleteBtn = screen.getByLabelText('Borrar pregunta');
        fireEvent.click(deleteBtn);
        expect(contextValue.deleteQuestion).toHaveBeenCalledWith(0, expect.anything());
    });

    test('calls addAnswer when add button is clicked', () => {
        renderWithContext(<QuestionForm {...mockProps} />);
        const addBtn = screen.getByLabelText('Agregar una respuesta');
        fireEvent.click(addBtn);
        expect(contextValue.addAnswer).toHaveBeenCalledWith(0, expect.anything());
    });
});
