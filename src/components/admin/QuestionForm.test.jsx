
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import QuestionForm from './QuestionForm';

describe('QuestionForm Component', () => {
    const mockProps = {
        question: {
            text: 'Question Text',
            answers: [
                { text: 'Answer 1', is_correct: false },
                { text: 'Answer 2', is_correct: true }
            ]
        },
        questionIndex: 0,
        onChangeQuestion: vi.fn(),
        deleteQuestion: vi.fn(),
        onChangeAnswer: vi.fn(),
        addAnswer: vi.fn(),
        deleteAnswer: vi.fn()
    };

    test('renders question text input', () => {
        render(<QuestionForm {...mockProps} />);
        expect(screen.getByLabelText('Texto de la pregunta')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Question Text')).toBeInTheDocument();
    });

    test('renders correct number of answers', () => {
        render(<QuestionForm {...mockProps} />);
        expect(screen.getAllByLabelText(/Respuesta \d/)).toHaveLength(2);
    });

    test('calls onChangeQuestion when text changes', () => {
        render(<QuestionForm {...mockProps} />);
        const input = screen.getByLabelText('Texto de la pregunta');
        fireEvent.change(input, { target: { value: 'New Question' } });
        expect(mockProps.onChangeQuestion).toHaveBeenCalledWith(0, expect.anything());
    });

    test('calls deleteQuestion when delete button is clicked', () => {
        render(<QuestionForm {...mockProps} />);
        const deleteBtn = screen.getByLabelText('Borrar pregunta');
        fireEvent.click(deleteBtn);
        expect(mockProps.deleteQuestion).toHaveBeenCalledWith(0, expect.anything());
    });

    test('calls addAnswer when add button is clicked', () => {
        render(<QuestionForm {...mockProps} />);
        const addBtn = screen.getByLabelText('Agregar una respuesta');
        fireEvent.click(addBtn);
        expect(mockProps.addAnswer).toHaveBeenCalledWith(0, expect.anything());
    });
});
