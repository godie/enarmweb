import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import ExamService from "../../services/ExamService";
import {
    CustomButton,
    CustomPreloader,
    CustomCollection,
    CustomCollectionItem,
    CustomCard,
    CustomRow,
    CustomCol,
    CustomIcon
} from "../custom";
import { alertError } from "../../services/AlertService";

const QuestionDetail = () => {
  const { questionId } = useParams();
  const history = useHistory();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionDetail = async () => {
        setLoading(true);
        try {
          const response = await ExamService.getQuestionDetail(questionId);
          setQuestion(response.data);
        } catch (error) {
          console.error(`Error fetching question detail for ID ${questionId}:`, error);
          alertError("Error", "No se pudo cargar el detalle de la pregunta.");
          setQuestion(null);
        } finally {
          setLoading(false);
        }
      };
    fetchQuestionDetail();
  }, [questionId]);


  if (loading) {
    return (
        <div className="center-align" style={{ padding: '50px' }}>
            <CustomPreloader active color="green" size="big" />
        </div>
    );
  }

  if (!question) {
    return (
      <div className="container center-align" style={{ padding: '50px' }}>
        <h5 className="grey-text">Pregunta no encontrada.</h5>
        <CustomButton className="blue" onClick={() => history.push('/dashboard/questions')}>
            <CustomIcon left>arrow_back</CustomIcon>
            Volver al listado
        </CustomButton>
      </div>
    );
  }

  return (
    <CustomRow>
      <CustomCol s={12} m={10} offset="m1">
        <CustomCard
            title={`Detalle de la Pregunta #${question.id}`}
            className="white"
        >
          <p style={{ fontSize: "1.2em", marginBottom: "20px" }} className="grey-text text-darken-3">
            {question.text}
          </p>

          <div className="divider" style={{margin: '20px 0'}}></div>

          {question.clinicalCaseId && (
            <p>
              <strong>Caso Clínico Asociado: </strong>
              <Link to={`/dashboard/edit/caso/${question.clinicalCaseId}`}>
                {question.clinicalCaseName || `Caso ID: ${question.clinicalCaseId}`}
              </Link>
            </p>
          )}
          {!question.clinicalCaseId && (
            <p className="grey-text">Esta pregunta no está asociada a ningún caso clínico.</p>
          )}

          <h5 className="grey-text text-darken-2" style={{marginTop: '30px'}}>Respuestas:</h5>
          {question.answers && question.answers.length > 0 ? (
            <CustomCollection>
              {question.answers.map((answer) => (
                <CustomCollectionItem key={answer.id} className={answer.is_correct ? "green lighten-5" : ""}>
                  <p style={{margin: 0, fontWeight: answer.is_correct ? 'bold' : 'normal'}}>
                    {answer.text}
                    {answer.is_correct && (
                        <span className="secondary-content green-text">
                            <CustomIcon>check_circle</CustomIcon>
                        </span>
                    )}
                  </p>
                  {answer.description && (
                    <p style={{ fontSize: "0.9em", color: "#666", marginTop: "5px" }}>
                      <em>Explicación: {answer.description}</em>
                    </p>
                  )}
                </CustomCollectionItem>
              ))}
            </CustomCollection>
          ) : (
            <p className="red-text">No hay respuestas disponibles para esta pregunta.</p>
          )}

          <div className="card-action" style={{ paddingLeft: 0, paddingRight: 0, marginTop: '20px', borderTop: 'none' }}>
            <CustomButton onClick={() => history.push('/dashboard/questions')} className="grey lighten-1">
                <CustomIcon left>arrow_back</CustomIcon>
                Volver
            </CustomButton>
          </div>
        </CustomCard>
      </CustomCol>
    </CustomRow>
  );
};

export default QuestionDetail;
