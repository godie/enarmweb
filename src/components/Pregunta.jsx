import PropTypes from "prop-types";

const Pregunta = ({
  pregunta, // Full question object, contains text (description) and answers
  question_id, // ID of the question, used for naming radio buttons
  onAnswerSelected, // Callback: (questionId, answerId, isCorrect)
  selectedAnswer, // ID or array of IDs of the selected answer(s) for this question
  showFeedback = false, // To show correct/incorrect feedback (used in Caso.js)
  isExamMode = false, // If true, is_correct might not be available on answers initially
}) => {
  // Ensure answers are available and is an array
  const currentAnswers = pregunta.answers_attributes || pregunta.answers || [];

  // Multiple choice is determined by having more than one correct answer
  const isMultiple = currentAnswers.filter(a => a.is_correct).length > 1;

  const answerItems = currentAnswers.map((answer) => {
    let itemClass = "collection-item";
    let feedbackIcon = null;
    let feedbackText = null;

    let isChecked = false;
    if (isMultiple) {
      isChecked = Array.isArray(selectedAnswer)
        ? selectedAnswer.includes(answer.id)
        : selectedAnswer === answer.id;
    } else {
      isChecked = selectedAnswer === answer.id;
    }

    if (showFeedback) {
      if (isChecked) {
        if (answer.is_correct) {
          itemClass += " green lighten-4"; // Correctly selected
          feedbackIcon = <i className="material-icons secondary-content green-text">check_circle</i>;
        } else {
          itemClass += " red lighten-4"; // Incorrectly selected
          feedbackIcon = <i className="material-icons secondary-content red-text">highlight_off</i>;
        }
      } else if (answer.is_correct) {
        // Show the correct answer if not selected
        itemClass += " green lighten-5";
      }

      // Show explanation if it's the selected answer or the correct one
      if ((isChecked || answer.is_correct) && answer.description) {
        feedbackText = (
          <p className="feedback-description" style={{ marginTop: "5px", color: "#2e7d32" }}>
            {answer.description}
          </p>
        );
      }
    }

    return (
      <li className={itemClass} key={answer.id}>
        <label htmlFor={`q${question_id}-ans${answer.id}`} style={{ color: 'black', width: '100%', display: 'flex', alignItems: 'center' }}>
          <input
            type={isMultiple ? "checkbox" : "radio"}
            name={`question-${question_id}`}
            id={`q${question_id}-ans${answer.id}`}
            value={answer.id}
            checked={isChecked}
            onChange={() => onAnswerSelected(question_id, answer.id, answer.is_correct)}
            className={isMultiple ? "filled-in" : "with-gap"}
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    text: PropTypes.string,
    answers_attributes: PropTypes.arrayOf(PropTypes.object),
    answers: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  question_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  selectedAnswer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ]),
  showFeedback: PropTypes.bool,
  isExamMode: PropTypes.bool,
};

export default Pregunta;
