
import PropTypes from "prop-types";

const EMPTY_ANSWERS = [];

const Pregunta = ({
  answers: answerList = EMPTY_ANSWERS, // Default to empty array for answers if not provided initially
  index: questionIndex,
  description: questionDescription = "Pregunta", // Default for description
  handleSelectOption,
  selectedAnswer,
  showCorrectAnswer = false, // Default for showCorrectAnswer
}) => {
  const isMultiple = answerList.filter(a => a.is_correct).length > 1;

  const answerItems = answerList.map((answer, ansIndex) => {
    let extraClass = "";
    let isSelected = false;

    if (isMultiple) {
      isSelected = Array.isArray(selectedAnswer) && selectedAnswer.some(a => a.id === answer.id);
    } else {
      isSelected = !!(selectedAnswer && selectedAnswer.id === answer.id);
    }

    let answerIcon = "";
    let answerFeedbackDescription = ""; // Renamed to avoid conflict with questionDescription

    if (showCorrectAnswer) {
      if (answer.is_correct) {
        extraClass = "green lighten-4"; // Lighter green for better text visibility
        if (answer.description !== null && answer.description !== "") {
          answerFeedbackDescription = <p className="feedback-description" style={{ marginTop: '8px', fontStyle: 'italic' }}>{answer.description}</p>;
        }
      }

      if (isSelected && !answer.is_correct) {
        extraClass = "red lighten-4"; // Lighter red
        answerIcon = (
          <span className="secondary-content black-text" role="img" aria-label="Respuesta incorrecta">
            <i className="material-icons" aria-hidden="true">highlight_off</i>
          </span>
        );
      }
      if (isSelected && answer.is_correct) {
        // If checked and correct, extraClass would already be green
        // Ensure green class takes precedence or combine if needed
        extraClass = "green lighten-4";
        answerIcon = (
          <span className="secondary-content black-text" role="img" aria-label="Respuesta correcta">
            <i className="material-icons" aria-hidden="true">check_circle</i>
          </span>
        );
      }
    } else if (isSelected) {
      extraClass = "blue lighten-5"; // Highlight selected option during exam
    }

    // Generate unique ID for accessibility and grouping
    const inputId = `q-${questionIndex}-ans-${answer.id || ansIndex}`;

    return (
      <li
        className={`collection-item hoverable ${extraClass}`}
        key={answer.id || ansIndex}
        style={{
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          padding: 0 // Remove li padding to allow label to fill entire area
        }}
      >
        <label
          htmlFor={inputId}
          className="black-text"
          style={{
            display: 'block',
            padding: '12px 20px',
            cursor: 'pointer',
            width: '100%',
            transition: 'background-color 0.2s ease'
          }}
        >
          <input
            type={isMultiple ? "checkbox" : "radio"}
            value={answer.id}
            name={`pregunta-${questionIndex}`} // Unique grouping by question index
            id={inputId}
            className={isMultiple ? "filled-in" : "with-gap"}
            checked={isSelected}
            onChange={(event) =>
              handleSelectOption(questionIndex, ansIndex, event)
            }
          />
          <span style={{ fontSize: '1.1rem' }}>{answer.text}</span>
          {answerIcon}
          {answerFeedbackDescription}
        </label>
      </li>
    );
  });

  return (
    <div className="col s12 m12 l12" id={`question-wrapper-${questionIndex}`}>
      <ul className="collection with-header">
        <li className="collection-header">
          <h5 style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span className="green-text text-darken-2" style={{ marginRight: '10px', fontWeight: 'bold' }}>
              {questionIndex + 1}.
            </span>
            <span>{questionDescription}</span>
          </h5>
        </li>
        {answerItems}
      </ul>
    </div>
  );
};

// Default props defined via default parameters in function signature.
Pregunta.defaultProps = {
  showCorrectAnswer: false, // This is now handled by default param
  answers: EMPTY_ANSWERS, // Added for safety, though also handled by default param
  description: "Pregunta" // Added for safety, also handled by default param
};

Pregunta.propTypes = {
  answers: PropTypes.array,
  index: PropTypes.number.isRequired, // Make index required as it's crucial for callbacks
  description: PropTypes.string,
  handleSelectOption: PropTypes.func.isRequired, // Make handler required
  selectedAnswer: PropTypes.object, // Can be null or undefined if no answer selected yet
  showCorrectAnswer: PropTypes.bool,
};

export default Pregunta;
