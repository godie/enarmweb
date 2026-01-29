import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Caso from "./Caso"; // For clinical case type exams
import ExamRenderer from "./ExamRenderer"; // New component for general exams
import EnarmUtil from "../modules/EnarmUtil";
import ExamService from "../services/ExamService"; // To fetch Exam details
import FacebookComments from "./facebook/FacebookComments";
import { CustomPreloader } from "./custom"; // For loading state
import { alertError } from "../services/AlertService";

const Examen = () => {
  const params = useParams();
  const { identificador, examId } = params; // identificador for clinic cases, examId for general exams

  // The original test expects EnarmUtil.getCategory to be called with { match: { params } }
  // We use useMemo to avoid re-calculating on every render, but keep the call structure for tests
  const clinicCaseIdFromParams = useMemo(() => {
    return EnarmUtil.getCategory({ match: { params } });
  }, [params]);

  const examType = useMemo(() => identificador ? 'caso' : (examId ? 'exam' : 'caso'), [identificador, examId]);
  const effectiveClinicCaseId = useMemo(() => {
    if (examType === 'caso') return clinicCaseIdFromParams;
    return null;
  }, [examType, clinicCaseIdFromParams]);

  const [examData, setExamData] = useState(null); // Holds data for ExamRenderer
  const [width, setWidth] = useState('300');

  // Track current ID to handle loading state during transitions
  const [prevId, setPrevId] = useState(examId || identificador);
  const [loading, setLoading] = useState(examType === 'exam');

  if ((examId || identificador) !== prevId) {
    setPrevId(examId || identificador);
    if (examType === 'exam') {
        setLoading(true);
    }
  }

  const commentUrl = useMemo(() => {
    // Reverting to hardcoded domain as expected by tests for clinical cases
    if (examType === 'caso' && effectiveClinicCaseId) {
        return `http://enarm.godieboy.com/#/caso/${effectiveClinicCaseId}`;
    }
    if (examType === 'exam' && examId) {
        return `http://enarm.godieboy.com/#/exam/${examId}`;
    }
    return "";
  }, [examType, effectiveClinicCaseId, examId]);

  useEffect(() => {
    if (examType === 'exam' && examId) {
      ExamService.getExam(examId)
        .then(response => {
          setExamData(response.data);
        })
        .catch(error => {
          console.error("Error fetching exam data:", error);
          alertError("Error", "No se pudo cargar el examen.");
          setExamData(null);
        })
        .finally(() => setLoading(false));
    } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false);
    }
  }, [examType, examId]);

  // Effect for updating dimensions on mount and window resize
  useEffect(() => {
    const updateDimensionsFunc = () => {
      if (window.innerWidth < 500) {
        setWidth('300');
      } else {
        let update_width = window.innerWidth - 500;
        setWidth(update_width.toString());
      }
    };

    updateDimensionsFunc(); // Call on mount
    window.addEventListener('resize', updateDimensionsFunc);

    return () => {
      window.removeEventListener('resize', updateDimensionsFunc); // Cleanup listener
    };
  }, []);

  if (loading) {
    return (
      <div className="s12 m12 l6 white center-align" style={{paddingTop: "50px"}}>
        <CustomPreloader />
      </div>
    );
  }

  return (
    <div className="s12 m12 l6 white">
      {examType === 'caso' && effectiveClinicCaseId && <Caso clinicCaseId={effectiveClinicCaseId} />}
      {examType === 'exam' && examData && <ExamRenderer examData={examData} />}

      {!loading && !effectiveClinicCaseId && !examData && examType === 'caso' && (
         <p className="center-align red-text">No se pudo cargar el caso clínico por defecto.</p>
      )}
      {!loading && !examData && examType === 'exam' && (
         <p className="center-align red-text">No se pudo cargar el contenido del examen.</p>
      )}

      {commentUrl && (
        <div className="row">
          <div className="col s12 m10 l8">
            <FacebookComments
              appId={import.meta.env.VITE_FACEBOOK_APP_ID || "401225480247747"}
              href={commentUrl}
              width={width}
              numPosts={10}
              locale="es_LA"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Examen;
