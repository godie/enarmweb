
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import AnswerForm from './AnswerForm';
import CasoContext from '../../context/CasoContext';

describe('AnswerForm Component', () => {
    const mockProps = {
        answer: {
            text: 'Answer Text',
            is_correct: false,
            description: ''
        },
        questionIndex: 0,
        answerIndex: 1
    };

    const contextValue = {
        onChangeAnswer: vi.fn(),
        deleteAnswer: vi.fn()
    };

    const renderWithContext = (ui) => {
        return render(
            <CasoContext.Provider value={contextValue}>
                {ui}
            </CasoContext.Provider>
        );
    };

    test('renders answer input fields', () => {
        renderWithContext(<AnswerForm {...mockProps} />);
        expect(screen.getByLabelText('Respuesta 2')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Answer Text')).toBeInTheDocument();
        expect(screen.getByLabelText('¿Correcta?')).toBeInTheDocument();
    });

    test('calls onChangeAnswer with text change', () => {
        renderWithContext(<AnswerForm {...mockProps} />);
        const input = screen.getByLabelText('Respuesta 2');
        fireEvent.change(input, { target: { value: 'New Answer' } });
        expect(contextValue.onChangeAnswer).toHaveBeenCalledWith(0, 1, 'text', expect.anything());
    });

    test('calls onChangeAnswer with is_correct change', () => {
        renderWithContext(<AnswerForm {...mockProps} />);
        const checkbox = screen.getByLabelText('¿Correcta?');
        fireEvent.click(checkbox);
        expect(contextValue.onChangeAnswer).toHaveBeenCalledWith(0, 1, 'is_correct', expect.anything());
    });

    test('calls deleteAnswer when delete button confirmed', () => {
        renderWithContext(<AnswerForm {...mockProps} />);
        const deleteBtn = screen.getByLabelText('Borrar respuesta');
        fireEvent.click(deleteBtn);
        expect(contextValue.deleteAnswer).toHaveBeenCalledWith(0, 1, expect.anything());
    });

    test('shows justification textarea only when correct', () => {
        // Initially false
        const { rerender } = renderWithContext(<AnswerForm {...mockProps} />);
        expect(screen.queryByLabelText('Justificación de la respuesta correcta')).not.toBeInTheDocument();

        // Update to true
        // rerender with wrapper is tricky if using helper.
        // We can use the rerender function returned by render, but we need to re-wrap.
        rerender(
            <CasoContext.Provider value={contextValue}>
                <AnswerForm {...mockProps} answer={{ ...mockProps.answer, is_correct: true }} />
            </CasoContext.Provider>
        );
        expect(screen.getByLabelText('Justificación de la respuesta correcta')).toBeInTheDocument();
    });
});
