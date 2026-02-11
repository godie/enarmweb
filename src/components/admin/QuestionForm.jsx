import PropTypes from 'prop-types';
import {
    CustomRow,
    CustomCol,
    CustomButton,
    CustomTextarea
} from '../custom';
import AnswerForm from './AnswerForm';
import { useCaso } from '../../context/CasoContext';

const QuestionForm = ({
    question,
    questionIndex
}) => {
    const {
        onChangeQuestion,
        deleteQuestion,
        addAnswer
    } = useCaso();

    const questionTextName = `questions[${questionIndex}][text]`;

    return (
        <CustomCol s={12} className="question-container">
            <CustomRow style={{ paddingBottom: '10px' }}>
                <CustomCol s={10}>
                    <span
                        className="badge green white-text left"
                        style={{ borderRadius: '4px', float: 'none', marginLeft: '0' }}
                    >
                        Pregunta {questionIndex + 1}
                    </span>
                </CustomCol>
                <CustomCol s={2} className="right-align">
                    <CustomButton
                        type="button"
                        onClick={(event) => deleteQuestion(questionIndex, event)}
                        className="red-text btn-flat"
                        icon="close"
                        tooltip="Borrar pregunta"
                        aria-label="Borrar pregunta"
                    />
                </CustomCol>
            </CustomRow>

            <CustomRow>
                <CustomCol s={12}>
                    <CustomTextarea
                        id={`question-text-${questionIndex}`}
                        label="Texto de la pregunta"
                        name={questionTextName}
                        value={question.text}
                        onChange={(event) => onChangeQuestion(questionIndex, event)}
                        textareaClassName="z-depth-1"
                    />
                </CustomCol>
            </CustomRow>

            <div className="col s12" style={{ paddingLeft: '15px' }}>
                <h6 style={{ fontWeight: 'bold', color: '#666', marginBottom: '15px' }}>
                    Opciones de respuesta:
                </h6>

                {question.answers.map((answer, answerIndex) => (
                    <AnswerForm
                        key={`${questionIndex}-${answerIndex}`}
                        answer={answer}
                        questionIndex={questionIndex}
                        answerIndex={answerIndex}
                    />
                ))}

                <div className="center-align" style={{ marginTop: '20px' }}>
                    <CustomButton
                        type="button"
                        onClick={(event) => addAnswer(questionIndex, event)}
                        className="green lighten-4 green-text text-darken-3"
                        icon="add"
                        iconPosition="left"
                        small
                        flat
                        aria-label="Agregar una respuesta"
                    >
                        Agregar Opción
                    </CustomButton>
                </div>
            </div>
        </CustomCol>
    );
};

QuestionForm.propTypes = {
    question: PropTypes.shape({
        text: PropTypes.string,
        answers: PropTypes.array,
    }).isRequired,
    questionIndex: PropTypes.number.isRequired
};

export default QuestionForm;
