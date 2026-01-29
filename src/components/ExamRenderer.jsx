import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Pregunta from './Pregunta';
import { CustomButton, CustomRow, CustomCol, CustomIcon } from './custom';
import { alertSuccess, alertInfo } from '../services/AlertService';

const ExamRenderer = ({ examData }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores { questionId: { answerId: id | [ids], isCorrect: bool } }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (examData && examData.exam_questions) {
      const formattedQuestions = examData.exam_questions
        .sort((a, b) => a.position - b.position)
        .map(eq => ({
          ...eq.question,
          points: eq.points,
          exam_question_id: eq.id
        }));
      setQuestions(formattedQuestions);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setSubmitted(false);
      setScore(null);
    }
  }, [examData]);

  const handleAnswerSelection = (questionId, answerId, isCorrect) => {
    const question = questions.find(q => q.id === questionId);
    const answers_list = question.answers_attributes || question.answers || [];
    const isMultiple = answers_list.filter(a => a.is_correct).length > 1;

    setAnswers(prevAnswers => {
        if (isMultiple) {
            let currentSelection = Array.isArray(prevAnswers[questionId]?.answerId) ? prevAnswers[questionId].answerId : [];
            if (currentSelection.includes(answerId)) {
                currentSelection = currentSelection.filter(id => id !== answerId);
            } else {
                currentSelection = [...currentSelection, answerId];
            }
            return {
                ...prevAnswers,
                [questionId]: { answerId: currentSelection }
            };
        } else {
            return {
                ...prevAnswers,
                [questionId]: { answerId, isCorrect }
            };
        }
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alertInfo("Información", "Por favor, responde todas las preguntas antes de finalizar el examen.");
      return;
    }

    setLoadingSubmit(true);

    // Simulation of backend processing
    setTimeout(() => {
      let correctCount = 0;
      let totalPointsEarned = 0;
      let totalPossiblePoints = 0;

      questions.forEach(q => {
        const questionPoints = q.points || 1;
        totalPossiblePoints += questionPoints;
        const selection = answers[q.id];
        if (!selection) return;

        const answers_list = q.answers_attributes || q.answers || [];
        const correctAnswers = answers_list.filter(a => a.is_correct);
        const isMultiple = correctAnswers.length > 1;

        if (isMultiple) {
            const selectedIds = selection.answerId;
            if (Array.isArray(selectedIds)) {
                const correctIds = correctAnswers.map(a => a.id);
                const isAllCorrect = selectedIds.length === correctIds.length &&
                                   selectedIds.every(id => correctIds.includes(id));
                if (isAllCorrect) {
                    correctCount++;
                    totalPointsEarned += questionPoints;
                }
            }
        } else {
            if (selection.isCorrect) {
                correctCount++;
                totalPointsEarned += questionPoints;
            }
        }
      });

      const scorePercentage = totalPossiblePoints > 0 ? (totalPointsEarned / totalPossiblePoints) * 100 : 0;

      const result = {
        score: scorePercentage,
        correct_answers: correctCount,
        total_questions: questions.length,
        points_earned: totalPointsEarned,
        total_possible_points: totalPossiblePoints,
      };

      setScore(result);
      setSubmitted(true);
      setLoadingSubmit(false);
      alertSuccess("Examen Finalizado", `Tu puntaje final es: ${scorePercentage.toFixed(2)}%`);
    }, 1000);
  };

  if (!examData || questions.length === 0) {
    return <p className="center-align grey-text" style={{marginTop: "20px"}}>No hay preguntas en este examen.</p>;
  }

  if (submitted && score !== null) {
    return (
      <div className="container center-align" style={{padding: "20px 0"}}>
        <div className="card-panel white z-depth-2">
            <h4 className="green-text text-darken-2">¡Examen Finalizado!</h4>
            <h5>{examData.name}</h5>
            <div className="divider" style={{margin: '20px 0'}}></div>
            <p className="flow-text">Puntaje: <strong>{score.score.toFixed(2)}%</strong></p>
            <p>Respuestas correctas: {score.correct_answers} de {score.total_questions}</p>
            <p>Puntos obtenidos: {score.points_earned} de {score.total_possible_points}</p>
            <div style={{marginTop: '30px'}}>
                <CustomButton onClick={() => window.location.reload()} className="blue">
                    <CustomIcon left>refresh</CustomIcon>
                    Reiniciar Examen
                </CustomButton>
            </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="exam-renderer">
      <CustomRow>
        <CustomCol s={12}>
            <h4 className="center-align grey-text text-darken-3">{examData.name}</h4>
            {examData.description && <p className="center-align grey-text">{examData.description}</p>}
            <div className="progress grey lighten-3" style={{height: '10px', borderRadius: '5px', marginTop: '20px'}}>
                <div className="determinate blue" style={{width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}></div>
            </div>
        </CustomCol>
      </CustomRow>

      {currentQuestion && (
        <Pregunta
          key={currentQuestion.id}
          pregunta={currentQuestion}
          question_id={currentQuestion.id}
          selectedAnswer={answers[currentQuestion.id] ? answers[currentQuestion.id].answerId : null}
          onAnswerSelected={(qId, aId, isCorr) => handleAnswerSelection(qId, aId, isCorr)}
          showFeedback={false}
          isExamMode={true}
        />
      )}

      <CustomRow style={{ marginTop: '30px' }}>
        <CustomCol s={4} className="left-align">
            <CustomButton
                onClick={goToPreviousQuestion}
                className="blue-grey lighten-4 black-text"
                disabled={currentQuestionIndex === 0}
            >
              <CustomIcon left>chevron_left</CustomIcon>
              Anterior
            </CustomButton>
        </CustomCol>
        <CustomCol s={4} className="center-align" style={{lineHeight: '36px'}}>
          <strong>{currentQuestionIndex + 1}</strong> de <strong>{questions.length}</strong>
        </CustomCol>
        <CustomCol s={4} className="right-align">
          {currentQuestionIndex < questions.length - 1 ? (
            <CustomButton onClick={goToNextQuestion} className="blue">
              Siguiente
              <CustomIcon right>chevron_right</CustomIcon>
            </CustomButton>
          ) : (
            <CustomButton onClick={handleSubmit} className="green" disabled={loadingSubmit}>
              {loadingSubmit ? 'Enviando...' : 'Finalizar'}
              <CustomIcon right>send</CustomIcon>
            </CustomButton>
          )}
        </CustomCol>
      </CustomRow>
    </div>
  );
};

ExamRenderer.propTypes = {
  examData: PropTypes.object.isRequired
};

export default ExamRenderer;
