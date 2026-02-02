
import PropTypes from "prop-types";

const Pregunta = ({
  answers: answerList = [], // Default to empty array for answers if not provided initially
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
          answerFeedbackDescription = <p className="feedback-description">{answer.description}</p>;
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

    return (
      <li className={`collection-item ${extraClass}`} key={ansIndex}>
        <label htmlFor={`${questionDescription}-${answer.id}`} className="black-text">
          <input
            type={isMultiple ? "checkbox" : "radio"}
            value={answer.id} // Corrected: use answer.id for value
            name={questionDescription} // Group radio buttons by question description
            id={`${questionDescription}-${answer.id}`} // Make ID more unique combining question and answer
            className={isMultiple ? "filled-in" : "with-gap"}
            checked={isSelected}
            onChange={(event) =>
              handleSelectOption(questionIndex, ansIndex, event)
            }
          />
          <span>{answer.text}</span>
          {answerIcon}
          {answerFeedbackDescription}
        </label>
      </li>
    );
  });

  return (
    <div className="col s12 m12 l12">
      <ul className="collection with-header">
        <li className="collection-header">
          <h5>{questionDescription}</h5>
        </li>
        {answerItems}
      </ul>
    </div>
  );
};

// Default props defined via default parameters in function signature.
Pregunta.defaultProps = {
  showCorrectAnswer: false, // This is now handled by default param
  answers: [], // Added for safety, though also handled by default param
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
