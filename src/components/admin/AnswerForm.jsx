import PropTypes from 'prop-types';
import {
    CustomRow,
    CustomCol,
    CustomCheckbox,
    CustomTextInput,
    CustomButton,
    CustomTextarea
} from '../custom';
import { useCaso } from '../../context/CasoContext';

const AnswerForm = ({
    answer,
    questionIndex,
    answerIndex
}) => {
    const { onChangeAnswer, deleteAnswer } = useCaso();

    const keyId = `${questionIndex}-${answerIndex}`;
    const description = answer.description || "";

    const answerTextName = `questions[${questionIndex}][answers][${answerIndex}][text]`;
    const answerIsCorrectName = `questions[${questionIndex}][answers][${answerIndex}][is_correct]`;
    const answerDescriptionName = `questions[${questionIndex}][answers][${answerIndex}][description]`;

    return (
        <CustomRow className="answer-wrapper" style={{ marginBottom: '15px', alignItems: 'center' }}>
            <CustomCheckbox
                s={3}
                m={2}
                style={{ marginTop: '20px' }}
                id={`answer-iscorrect-${keyId}`}
                label="¿Correcta?"
                checked={answer.is_correct}
                onChange={(event) => {
                    onChangeAnswer(
                        questionIndex,
                        answerIndex,
                        "is_correct",
                        event
                    );
                }}
                name={answerIsCorrectName}
                value="true"
            />
            <CustomCol s={8} m={9}>
                <CustomTextInput
                    id={`answer-text-${keyId}`}
                    value={answer.text}
                    label={`Respuesta ${answerIndex + 1}`}
                    onChange={(event) =>
                        onChangeAnswer(questionIndex, answerIndex, "text", event)
                    }
                    name={answerTextName}
                    required
                    data-length={255}
                />
            </CustomCol>
            <CustomCol s={1} className="right-align" style={{ marginTop: '10px' }}>
                <CustomButton
                    type="button"
                    floating
                    small
                    className="red"
                    waves="light"
                    onClick={(event) =>
                        deleteAnswer(questionIndex, answerIndex, event)
                    }
                    icon="close"
                    aria-label="Borrar respuesta"
                    tooltip="Borrar respuesta"
                />
            </CustomCol>

            {answer.is_correct && (
                <CustomCol s={8} offset="s3">
                    <CustomTextarea
                        id={`answer-description-${keyId}`}
                        label="Justificación de la respuesta correcta"
                        value={description}
                        onChange={(event) =>
                            onChangeAnswer(questionIndex, answerIndex, "description", event)
                        }
                        name={answerDescriptionName}
                        textareaClassName="z-depth-1"
                        data-length={1000}
                    />
                </CustomCol>
            )}
        </CustomRow>
    );
};

AnswerForm.propTypes = {
    answer: PropTypes.shape({
        text: PropTypes.string,
        is_correct: PropTypes.bool,
        description: PropTypes.string,
    }).isRequired,
    questionIndex: PropTypes.number.isRequired,
    answerIndex: PropTypes.number.isRequired
};

export default AnswerForm;
