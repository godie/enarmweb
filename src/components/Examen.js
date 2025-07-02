import React, { useState, useEffect } from "react";
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

  const [examType, setExamType] = useState(null); // 'caso' or 'exam'
  const [examData, setExamData] = useState(null); // Holds data for ExamRenderer
  const [clinicCaseId, setClinicCaseId] = useState(null); // For Caso component

  const [commentUrl, setCommentUrl] = useState("");
  const [width, setWidth] = useState(300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (identificador) { // It's a clinical case
      setExamType('caso');
      const caseId = EnarmUtil.getCategory({ match: { params: params } }); // Uses existing logic
      setClinicCaseId(caseId);
      setCommentUrl(`http://enarm.godieboy.com/#/caso/${caseId}`);
      setLoading(false);
    } else if (examId) { // It's a general exam
      setExamType('exam');
      ExamService.getExam(examId)
        .then(response => {
          setExamData(response.data); // Assuming response.data is the exam object with questions
          setCommentUrl(`http://enarm.godieboy.com/#/exam/${examId}`);
        })
        .catch(error => {
          console.error("Error fetching exam data:", error);
          alertError("Error", "No se pudo cargar el examen.");
          setExamData(null); // Clear data on error
        })
        .finally(() => setLoading(false));
    } else {
      // Default or fallback if no specific ID is provided (e.g., root path "/")
      // This part might need adjustment based on how the root path "/" should behave now
      setExamType('caso'); // Default to loading a 'caso'
      const defaultCaseId = EnarmUtil.getCategory({ match: { params: {} } }); // Load default/last current case
      setClinicCaseId(defaultCaseId);
      setCommentUrl(`http://enarm.godieboy.com/#/caso/${defaultCaseId}`);
      setLoading(false);
    }
  }, [identificador, examId, params]); // Rerun if any of these change

  // Effect for updating dimensions on mount and window resize (remains the same)
  useEffect(() => {
    const updateDimensionsFunc = () => {
      if (window.innerWidth < 500) {
        setWidth(300);
        // Original code set height here, but it's not used in FacebookComments props
      } else {
        let update_width = window.innerWidth - 500;
        setWidth(update_width);
        // Original code set height here
      }
    };

    updateDimensionsFunc(); // Call on mount
    window.addEventListener('resize', updateDimensionsFunc);

    return () => {
      window.removeEventListener('resize', updateDimensionsFunc); // Cleanup listener
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  if (loading) {
    return (
      <div className="s12 m12 l6 white center-align" style={{paddingTop: "50px"}}>
        <CustomPreloader />
      </div>
    );
  }

  return (
    <div className="s12 m12 l6 white">
      {examType === 'caso' && clinicCaseId && <Caso clinicCaseId={clinicCaseId} />}
      {examType === 'exam' && examData && <ExamRenderer examData={examData} />}
      {!loading && !clinicCaseId && !examData && examType === 'caso' && ( // Fallback for default case if it somehow fails to load ID
         <p className="center-align red-text">No se pudo cargar el caso clínico por defecto.</p>
      )}
       {!loading && !examData && examType === 'exam' && (
         <p className="center-align red-text">No se pudo cargar el contenido del examen.</p>
      )}


      {commentUrl && (
        <div className="row">
          <div className="col s12 m10 l8">
            <FacebookComments
              appId="401225480247747"
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
