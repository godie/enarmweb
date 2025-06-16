import React from "react";
import PropTypes from "prop-types";

const Pregunta = ({
  answers: answerList = [], // Default to empty array for answers if not provided initially
  index: questionIndex,
  description: questionDescription = "Pregunta", // Default for description
  handleSelectOption,
  selectedAnswer,
  showCorrectAnswer = false, // Default for showCorrectAnswer
}) => {
  const answerItems = answerList.map((answer, ansIndex) => {
    let extraClass = "";
    let checked = selectedAnswer && selectedAnswer.id === answer.id; // Ensure selectedAnswer exists
    let answerIcon = "";
    let answerFeedbackDescription = ""; // Renamed to avoid conflict with questionDescription

    if (showCorrectAnswer) {
      if (answer.is_correct) {
        extraClass = "green lighten-4"; // Lighter green for better text visibility
        if (answer.description !== null && answer.description !== "") {
          answerFeedbackDescription = <p className="feedback-description">{answer.description}</p>;
        }
      }
      if (checked) {
        if (!answer.is_correct) {
          extraClass = "red lighten-4"; // Lighter red
          answerIcon = (
            <a href="#!" className="secondary-content black-text">
              <i className="material-icons">highlight_off</i>
            </a>
          );
        } else {
          // If checked and correct, extraClass would already be green
          // Ensure green class takes precedence or combine if needed
          extraClass = "green lighten-4";
          answerIcon = (
            <a href="#!" className="secondary-content black-text">
              <i className="material-icons">check_circle</i>
            </a>
          );
        }
      }
    }

    return (
      <li className={`collection-item ${extraClass}`} key={ansIndex}>
        <label htmlFor={`${questionDescription}-${answer.id}`} className="black-text">
          <input
            type="radio"
            value={answer.id} // Corrected: use answer.id for value
            name={questionDescription} // Group radio buttons by question description
            id={`${questionDescription}-${answer.id}`} // Make ID more unique combining question and answer
            className="with-gap"
            checked={checked}
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
// Pregunta.defaultProps = {
//   showCorrectAnswer: false, // This is now handled by default param
//   answers: [], // Added for safety, though also handled by default param
//   description: "Pregunta" // Added for safety, also handled by default param
// };

Pregunta.propTypes = {
  answers: PropTypes.array,
  index: PropTypes.number.isRequired, // Make index required as it's crucial for callbacks
  description: PropTypes.string,
  handleSelectOption: PropTypes.func.isRequired, // Make handler required
  selectedAnswer: PropTypes.object, // Can be null or undefined if no answer selected yet
  showCorrectAnswer: PropTypes.bool,
};

export default Pregunta;
