import React from "react";
import PropTypes from "prop-types";

const Pregunta = ({
  answers: answerList = [], // Default to empty array for answers if not provided initially
  index: questionIndex,
  description: questionDescription = "Pregunta", // Default for description
  handleSelectOption,
  pregunta, // Full question object, contains text (description) and answers
  question_id, // ID of the question, used for naming radio buttons
  onAnswerSelected, // Callback: (questionId, answerId, isCorrect)
  selectedAnswer: selectedAnswerId, // ID of the selected answer for this question
  showFeedback = false, // To show correct/incorrect feedback (used in Caso.js)
  isExamMode = false, // If true, is_correct might not be available on answers initially
}) => {

  // Ensure answers are available and is an array
  const currentAnswers = pregunta.answers_attributes || pregunta.answers || [];

  const answerItems = currentAnswers.map((answer) => {
    let itemClass = "collection-item";
    let feedbackIcon = null;
    let feedbackText = null;

    // In exam mode, selectedAnswerId is just the ID.
    // In feedback mode (Caso.js), selectedAnswer is an object {id: X, is_correct: Y}
    const isChecked = selectedAnswerId === answer.id;

    if (showFeedback && isChecked) { // Feedback mode after submission (like in Caso.js)
      if (answer.is_correct) {
        itemClass += " green lighten-4"; // Correctly selected
        feedbackIcon = <i className="material-icons secondary-content green-text">check_circle</i>;
        if(answer.description){
            feedbackText = <p className="feedback-description" style={{marginTop:"5px", color:"#2e7d32"}}>{answer.description}</p>;
        }
      } else {
        itemClass += " red lighten-4"; // Incorrectly selected
        feedbackIcon = <i className="material-icons secondary-content red-text">highlight_off</i>;
      }
    } else if (showFeedback && answer.is_correct) { // Show the correct answer if not selected
        itemClass += " green lighten-5"; // Slightly different green to differentiate from selected correct
         if(answer.description){
            feedbackText = <p className="feedback-description" style={{marginTop:"5px", color:"#2e7d32"}}>{answer.description}</p>;
        }
    }


    return (
      <li className={itemClass} key={answer.id}>
        <label htmlFor={`q${question_id}-ans${answer.id}`} style={{ color: 'black', width: '100%', display: 'flex', alignItems: 'center' }}>
          <input
            type="radio"
            name={`question-${question_id}`}
            id={`q${question_id}-ans${answer.id}`}
            value={answer.id}
            checked={isChecked}
            onChange={() => onAnswerSelected(question_id, answer.id, answer.is_correct)}
            className="with-gap"
            disabled={showFeedback && isExamMode} // Disable further changes if feedback is shown in exam results
          />
          <span style={{ flexGrow: 1 }}>{answer.text}</span>
          {feedbackIcon}
        </label>
        {feedbackText}
      </li>
    );
  });

  return (
    <div className="col s12 m12 l12">
      <ul className="collection with-header">
        <li className="collection-header">
          <h5>{pregunta.text || "Pregunta"}</h5>
        </li>
        {currentAnswers.length > 0 ? answerItems : <li className="collection-item">No hay respuestas disponibles.</li>}
      </ul>
    </div>
  );
};

Pregunta.propTypes = {
  pregunta: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // id is from clinic_case.questions
    text: PropTypes.string,
    answers_attributes: PropTypes.arrayOf(PropTypes.object), // from clinical_case form/load
    answers: PropTypes.arrayOf(PropTypes.object) // from exam_renderer
  }).isRequired,
  question_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // actual question_id for radio group
  onAnswerSelected: PropTypes.func.isRequired,
  selectedAnswer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Stores the ID of the selected answer
  showFeedback: PropTypes.bool,
  isExamMode: PropTypes.bool,
};

export default Pregunta;
