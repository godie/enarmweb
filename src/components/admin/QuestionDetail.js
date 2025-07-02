import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import ExamService from "../../services/ExamService"; // Assuming ExamService will have a method to fetch a single question
import { CustomButton, CustomPreloader, CustomCollection, CustomCollectionItem } from "../custom"; // Assuming custom components
import { alertError } from "../../services/AlertService";

const QuestionDetail = () => {
  const { questionId } = useParams();
  const history = useHistory();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestionDetail();
  }, [questionId]);

  const fetchQuestionDetail = async () => {
    setLoading(true);
    try {
      // TODO: Implement ExamService.getQuestionDetail(questionId)
      // For now, using a placeholder. Replace with actual API call.
      // const response = await ExamService.getQuestionDetail(questionId);
      // setQuestion(response.data);

      // Placeholder data:
      console.warn(`Using placeholder data for question ID: ${questionId}. Implement API call in ExamService.getQuestionDetail`);
      const placeholderQuestions = {
        1: {
          id: 1,
          text: "Cual es la causa mas frecuente de hipertension arterial sistemica en el adulto?",
          clinicalCaseId: 1,
          clinicalCaseName: "Caso Hipertension Adulto",
          answers: [
            { id: 1, text: "Respuesta A (Correcta)", is_correct: true, description: "Esta es la explicación de por qué A es correcta." },
            { id: 2, text: "Respuesta B", is_correct: false, description: null },
            { id: 3, text: "Respuesta C", is_correct: false, description: null },
          ]
        },
        2: {
          id: 2,
          text: "Paciente masculino de 34 anios de edad, con diagnostico de VIH hace 5 anios...",
          clinicalCaseId: 2,
          clinicalCaseName: "Caso VIH",
          answers: [
            { id: 4, text: "Opción X", is_correct: false, description: null },
            { id: 5, text: "Opción Y (Correcta)", is_correct: true, description: "Explicación detallada." },
            { id: 6, text: "Opción Z", is_correct: false, description: null },
          ]
        },
        3: {
          id: 3,
          text: "Cual es el tratamiento de eleccion para la crisis hipertensiva tipo urgencia?",
          clinicalCaseId: null,
          clinicalCaseName: null,
          answers: [
            { id: 7, text: "Respuesta 1", is_correct: false, description: null },
            { id: 8, text: "Respuesta 2", is_correct: false, description: null },
            { id: 9, text: "Respuesta 3 (Correcta)", is_correct: true, description: "Porque sí." },
          ]
        },
         4: {
          id: 4,
          text: "Definicion de Preeclampsia",
          clinicalCaseId: 3,
          clinicalCaseName: "Caso Obstetricia",
          answers: [
            { id: 10, text: "Definición A", is_correct: false, description: null },
            { id: 11, text: "Definición B (Correcta)", is_correct: true, description: "Explicación." },
          ]
        },
        5: {
          id: 5,
          text: "Cual es el tumor oseo maligno mas frecuente en ninos?",
          clinicalCaseId: null,
          clinicalCaseName: null,
          answers: [
            { id: 12, text: "Osteosarcoma (Correcta)", is_correct: true, description: "Es el más común." },
            { id: 13, text: "Sarcoma de Ewing", is_correct: false, description: null },
          ]
        }
      };
      const foundQuestion = placeholderQuestions[questionId];
      if (foundQuestion) {
        setQuestion(foundQuestion);
      } else {
        alertError("Error", `No se encontró la pregunta con ID: ${questionId}.`);
        setQuestion(null);
      }
      // End of placeholder data

    } catch (error) {
      console.error(`Error fetching question detail for ID ${questionId}:`, error);
      alertError("Error", "No se pudo cargar el detalle de la pregunta.");
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    history.goBack();
  };

  if (loading) {
    return <CustomPreloader />;
  }

  if (!question) {
    return (
      <div className="container center">
        <p>Pregunta no encontrada.</p>
        <CustomButton onClick={goBack}>Volver</CustomButton>
      </div>
    );
  }

  return (
    <div className="container">
      <h3 className="center">Detalle de la Pregunta</h3>
      <div className="card">
        <div className="card-content">
          <span className="card-title">Pregunta ID: {question.id}</span>
          <p style={{ fontSize: "1.2em", marginBottom: "20px" }}>{question.text}</p>

          {question.clinicalCaseId && (
            <p>
              <strong>Caso Clínico Asociado: </strong>
              {/* TODO: Update this link */}
              <Link to={`/admin/caso/${question.clinicalCaseId}`}>
                {question.clinicalCaseName || `Caso ID: ${question.clinicalCaseId}`}
              </Link>
            </p>
          )}
          {!question.clinicalCaseId && (
            <p><strong>Caso Clínico Asociado:</strong> N/A</p>
          )}

          <h5>Respuestas:</h5>
          {question.answers && question.answers.length > 0 ? (
            <CustomCollection>
              {question.answers.map((answer) => (
                <CustomCollectionItem key={answer.id} className={answer.is_correct ? "green lighten-4" : ""}>
                  <p>{answer.text}</p>
                  {answer.is_correct && (
                    <span className="chip green white-text">Correcta</span>
                  )}
                  {answer.description && (
                    <p style={{ fontSize: "0.9em", color: "grey", marginTop: "5px" }}>
                      <em>Explicación: {answer.description}</em>
                    </p>
                  )}
                </CustomCollectionItem>
              ))}
            </CustomCollection>
          ) : (
            <p>No hay respuestas disponibles para esta pregunta.</p>
          )}
        </div>
        <div className="card-action">
          <CustomButton onClick={goBack} className="blue">Volver al Listado</CustomButton>
          {/* Future: <CustomButton className="orange">Editar Pregunta</CustomButton> */}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
