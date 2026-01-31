
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import AnswerForm from './AnswerForm';

describe('AnswerForm Component', () => {
    const mockProps = {
        answer: {
            text: 'Answer Text',
            is_correct: false,
            description: ''
        },
        questionIndex: 0,
        answerIndex: 1,
        onChangeAnswer: vi.fn(),
        deleteAnswer: vi.fn()
    };

    test('renders answer input fields', () => {
        render(<AnswerForm {...mockProps} />);
        expect(screen.getByLabelText('Respuesta 2')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Answer Text')).toBeInTheDocument();
        expect(screen.getByLabelText('¿Correcta?')).toBeInTheDocument();
    });

    test('calls onChangeAnswer with text change', () => {
        render(<AnswerForm {...mockProps} />);
        const input = screen.getByLabelText('Respuesta 2');
        fireEvent.change(input, { target: { value: 'New Answer' } });
        expect(mockProps.onChangeAnswer).toHaveBeenCalledWith(0, 1, 'text', expect.anything());
    });

    test('calls onChangeAnswer with is_correct change', () => {
        render(<AnswerForm {...mockProps} />);
        const checkbox = screen.getByLabelText('¿Correcta?');
        fireEvent.click(checkbox);
        expect(mockProps.onChangeAnswer).toHaveBeenCalledWith(0, 1, 'is_correct', expect.anything());
    });

    test('calls deleteAnswer when delete button confirmed', () => {
        render(<AnswerForm {...mockProps} />);
        const deleteBtn = screen.getByLabelText('Borrar respuesta');
        fireEvent.click(deleteBtn);
        expect(mockProps.deleteAnswer).toHaveBeenCalledWith(0, 1, expect.anything());
    });

    test('shows justification textarea only when correct', () => {
        // Initially false
        const { rerender } = render(<AnswerForm {...mockProps} />);
        expect(screen.queryByLabelText('Justificación de la respuesta correcta')).not.toBeInTheDocument();

        // Update to true
        rerender(<AnswerForm {...mockProps} answer={{ ...mockProps.answer, is_correct: true }} />);
        expect(screen.getByLabelText('Justificación de la respuesta correcta')).toBeInTheDocument();
    });
});
