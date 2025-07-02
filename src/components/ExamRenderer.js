import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Pregunta from './Pregunta'; // Re-use the existing Pregunta component
import ExamService from '../services/ExamService'; // For sendAnswers
import { CustomButton, CustomPreloader } from './custom';
import { alertSuccess, alertError, alertInfo } from '../services/AlertService';
import EnarmUtil from '../modules/EnarmUtil'; // For saving current exam progress (optional)

const ExamRenderer = ({ examData }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores { questionId: answerId }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (examData && examData.exam_questions) {
      // The backend response nests questions under exam_questions -> question
      const formattedQuestions = examData.exam_questions
        .sort((a, b) => a.position - b.position) // Ensure questions are in order
        .map(eq => ({
          ...eq.question, // Spread the actual question object (id, text, answers_attributes)
          points: eq.points, // Add points from exam_question
          exam_question_id: eq.id // ID of the exam_question itself, if needed
        }));
      setQuestions(formattedQuestions);
      setAnswers({}); // Reset answers when new exam data comes in
      setCurrentQuestionIndex(0);
      setSubmitted(false);
      setScore(null);
      // TODO: Optionally load saved progress from localStorage if desired using EnarmUtil and examData.id
    }
  }, [examData]);

  const handleAnswerSelection = (questionId, answerId, isCorrect) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: { answerId, isCorrect }
    }));
    // TODO: Optionally save progress to localStorage
    // EnarmUtil.saveExamProgress(examData.id, { ...answers, [questionId]: { answerId, isCorrect } });
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
      alertInfo("Información", "Por favor, responde todas las preguntas antes de enviar el examen.");
      return;
    }

    setLoadingSubmit(true);
    const playerAnswersPayload = {
      exam_id: examData.id, // Associate answers with this specific exam
      answers_attributes: Object.entries(answers).map(([questionId, answerData]) => ({
        question_id: parseInt(questionId),
        answer_id: answerData.answerId,
        // is_correct: answerData.isCorrect // Backend will likely determine correctness
      })),
    };

    try {
      // Assuming ExamService.sendAnswers can be adapted or a new service method is created for exams
      // The current `sendAnswers` in ExamService.js is for clinical_cases and sends `playerAnswers`
      // which includes `clinic_case_id` and `question_id` directly.
      // This payload is different. We might need a new service method like `sendExamAnswers`.
      // For now, let's assume `sendAnswers` can be generalized or we'll use a placeholder.
      // This will require a new backend endpoint e.g. POST /exams/:exam_id/submit_answers
      // The payload `playerAnswersPayload` is structured for this.
      // The response should ideally include the score and breakdown.

      // Simulating the call and response for now:
      // const response = await ExamService.submitExamAnswers(examData.id, playerAnswersPayload);
      console.log("Simulating sending exam answers for exam:", examData.id, "Payload:", playerAnswersPayload);

      // Simulate backend calculation of score based on `isCorrect` flag stored during answering.
      let correctCount = 0;
      let totalPointsEarned = 0;
      let totalPossiblePoints = 0;

      questions.forEach(q => {
        const questionPoints = q.points || 1; // Default to 1 point if not specified
        totalPossiblePoints += questionPoints;
        if (answers[q.id] && answers[q.id].isCorrect) {
          correctCount++;
          totalPointsEarned += questionPoints;
        }
      });

      const scorePercentage = totalPossiblePoints > 0 ? (totalPointsEarned / totalPossiblePoints) * 100 : 0;

      const simulatedResponse = {
        data: {
          message: "Examen enviado con éxito (simulado).",
          score: scorePercentage,
          correct_answers_count: correctCount,
          total_questions_count: questions.length,
          total_points_earned: totalPointsEarned,
          total_possible_points: totalPossiblePoints,
          // We could also include a list of correct_answer_ids if needed for detailed feedback later
        }
      };
      // End simulation

      setScore(simulatedResponse.data);
      setSubmitted(true);
      alertSuccess("Examen Enviado", `${simulatedResponse.data.message} Puntaje: ${scorePercentage.toFixed(2)}% (${correctCount}/${questions.length})`);
      // TODO: Clear saved progress from localStorage if implemented
      // EnarmUtil.clearExamProgress(examData.id);

    } catch (error) {
      console.error("Error submitting exam answers:", error);
      const errorMsg = error.response && error.response.data && error.response.data.message
                        ? error.response.data.message
                        : "No se pudo enviar el examen. Inténtalo de nuevo.";
      alertError("Error", errorMsg);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!examData || questions.length === 0) {
    return <p className="center-align grey-text" style={{marginTop: "20px"}}>No hay preguntas en este examen o el examen no pudo ser cargado.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (submitted && score !== null) {
    return (
      <div className="container center-align" style={{padding: "20px"}}>
        <h4>Resultados del Examen: {examData.name}</h4>
        <p>Has completado el examen.</p>
        <p>Respuestas Correctas: {score.correct_answers} de {score.total_questions}</p>
        <p>Puntos Obtenidos: {score.correct_answers} de {score.total_points} (asumiendo 1 pto por pregunta si no se especifica)</p>
        <p><strong>Puntaje Final: {score.score.toFixed(2)}%</strong></p>
        <CustomButton onClick={() => window.location.reload()} className="green">Volver a Intentar (Simulado)</CustomButton>
        {/* Or a link to go back to a list of exams */}
      </div>
    );
  }

  return (
    <div style={{padding: "10px"}}>
      <h4 className="center-align">{examData.name}</h4>
      {examData.description && <p className="center-align grey-text text-darken-1">{examData.description}</p>}
      <div className="divider"></div>

      {currentQuestion && (
        <Pregunta
          key={currentQuestion.id} // Ensure re-render when question changes
          pregunta={currentQuestion}
          question_id={currentQuestion.id}
          answers={currentQuestion.answers_attributes || currentQuestion.answers} // Adapt to structure
          selectedAnswer={answers[currentQuestion.id] ? answers[currentGcurrentQuestion.id].answerId : null}
          onAnswerSelected={(answerId, isCorrect) => handleAnswerSelection(currentQuestion.id, answerId, isCorrect)}
          showFeedback={false} // No immediate feedback during exam
          isExamMode={true} // Pass a prop to indicate exam mode
        />
      )}

      <div className="row" style={{ marginTop: '20px' }}>
        <CustomCol s={4} className="left-align">
          {currentQuestionIndex > 0 && (
            <CustomButton onClick={goToPreviousQuestion} waves="light" className="blue">
              <CustomIcon left>chevron_left</CustomIcon>
              Anterior
            </CustomButton>
          )}
        </CustomCol>
        <CustomCol s={4} className="center-align">
          <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
        </CustomCol>
        <CustomCol s={4} className="right-align">
          {currentQuestionIndex < questions.length - 1 ? (
            <CustomButton onClick={goToNextQuestion} waves="light" className="blue">
              Siguiente
              <CustomIcon right>chevron_right</CustomIcon>
            </CustomButton>
          ) : (
            <CustomButton onClick={handleSubmit} waves="light" className="green" disabled={loadingSubmit}>
              {loadingSubmit ? <CustomPreloader size="small" active color="white" /> : "Finalizar Examen"}
              <CustomIcon right>send</CustomIcon>
            </CustomButton>
          )}
        </CustomCol>
      </div>
    </div>
  );
};

ExamRenderer.propTypes = {
  examData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    exam_questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired, // exam_question_id
        points: PropTypes.number,
        position: PropTypes.number.isRequired,
        question: PropTypes.shape({
          id: PropTypes.number.isRequired,
          text: PropTypes.string.isRequired,
          answers_attributes: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              text: PropTypes.string.isRequired,
              is_correct: PropTypes.bool, // is_correct might not be present until submission
              description: PropTypes.string,
            })
          ),
          // Fallback if answers are directly under question like in clinical cases
           answers: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number.isRequired,
              text: PropTypes.string.isRequired,
              is_correct: PropTypes.bool,
              description: PropTypes.string,
            })
          )
        }).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ExamRenderer;
