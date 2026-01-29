import axios from "axios";
import BaseService from "./BaseService";
import Auth from "../modules/Auth";

axios.defaults.timeout = 10000;

export default class ExamService extends BaseService {
  static getExams(page = 1) {
    let headers = this.getHeaders();
    headers.params = { page: page };
    let url = "exams";
    return axios.get(BaseService.getURL(url), headers);
  }

  static getClinicalCases(page) {
    let headers = this.getHeaders();
    headers.params = { page: page };
    let url = "clinical_cases";
    return axios.get(BaseService.getURL(url), headers);
  }

  static getExam(id) {
    const headers = this.getHeaders();
    let url = `exams/${id}`;
    return axios.get(BaseService.getURL(url), headers);
  }

  static saveExam(exam) {
    const headers = this.getHeaders();
    let url = "exams";
    if (exam.id > 0) {
      url = url + "/" + exam.id;
      return axios.put(BaseService.getURL(url), { exam }, headers);
    } else {
      return axios.post(BaseService.getURL(url), { exam }, headers);
    }
  }

  static createExam(examData) {
    const headers = this.getHeaders();
    const url = "exams";
    return axios.post(BaseService.getURL(url), { exam: examData }, headers);
  }

  static updateExam(examId, examData) {
    const headers = this.getHeaders();
    const url = `exams/${examId}`;
    return axios.put(BaseService.getURL(url), { exam: examData }, headers);
  }

  static deleteExam(id) {
    const headers = this.getHeaders();
    let url = `exams/${id}`;
    return axios.delete(BaseService.getURL(url), headers);
  }

  static getQuestions(clinicCaseId) {
    let headers = this.getHeaders();
    let url = `clinical_cases/${clinicCaseId}`;
    return axios.get(BaseService.getURL(url), headers);
  }

  static getCaso(clinicCaseId) {
    let url = "clinical_cases/" + clinicCaseId;
    let headers = this.getHeaders();
    return axios.get(BaseService.getURL(url), headers);
  }

  static loadCategories() {
    let url = "categories";
    let headers = this.getHeaders();
    return axios.get(BaseService.getURL(url), headers);
  }

  static saveCaso(caso) {
    let token = `bearer ${Auth.getToken()}`;
    let url = "clinical_cases";
    let headers = { headers: { Authorization: token, 'Content-Type': 'application/json', accept: 'application/json' } };
    if (caso.id > 0) {
      url = url + "/" + caso.id;
      delete caso.id
      return axios.put(BaseService.getURL(url), { clinical_case: caso }, headers);
    } else {
      return axios.post(BaseService.getURL(url), { clinical_case: caso }, headers);
    }
  }

  static sendAnswers(playerAnswers) {
    let token = `bearer ${Auth.getToken()}`;
    let url = "user_answers";
    let headers = { headers: { Authorization: token } };

    if (playerAnswers.id > 0) {
      url = url + "/" + playerAnswers.id;
      return axios.put(BaseService.getURL(url), playerAnswers, headers);
    } else {
      return axios.post(BaseService.getURL(url), playerAnswers, headers);
    }
  }

  static saveCategory(category) {
    const headers = this.getHeaders();
    let url = 'categories';
    if (category.id > 0) {
      url = `${url}/${category.id}`;
      return axios.put(BaseService.getURL(url), category, headers);
    } else {
      return axios.post(BaseService.getURL(url), category, headers);
    }
  }

  static getCategory(id) {
    const headers = this.getHeaders();
    let url = `categories/${id}`;
    return axios.get(BaseService.getURL(url), headers);
  }

  // New method to get all questions (simulated)
  static getAllQuestions(page = 1) {
    console.warn("ExamService.getAllQuestions is using simulated data and pagination.");
    const allQuestions = [
      { id: 1, text: "Cual es la causa mas frecuente de hipertension arterial sistemica en el adulto?", clinicalCaseId: 1, clinicalCaseName: "Caso Hipertension Adulto", answers: [{id:1, text:"Respuesta A"},{id:2, text:"Respuesta B"}] },
      { id: 2, text: "Paciente masculino de 34 anios de edad, con diagnostico de VIH hace 5 anios...", clinicalCaseId: 2, clinicalCaseName: "Caso VIH", answers: [{id:3, text:"Respuesta X"},{id:4, text:"Respuesta Y"}] },
      { id: 3, text: "Cual es el tratamiento de eleccion para la crisis hipertensiva tipo urgencia?", clinicalCaseId: null, clinicalCaseName: null, answers: [{id:5, text:"Respuesta 1"},{id:6, text:"Respuesta 2"}] },
      { id: 4, text: "Definicion de Preeclampsia", clinicalCaseId: 3, clinicalCaseName: "Caso Obstetricia", answers: [{id:7, text:"Definicion A"},{id:8, text:"Definicion B"}] },
      { id: 5, text: "Cual es el tumor oseo maligno mas frecuente en ninos?", clinicalCaseId: null, clinicalCaseName: null, answers: [{id:9, text:"Osteosarcoma"},{id:10, text:"Sarcoma de Ewing"}] },
    ];
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedQuestions = allQuestions.slice(startIndex, endIndex);

    return Promise.resolve({
      data: {
        questions: paginatedQuestions,
        totalPages: Math.ceil(allQuestions.length / itemsPerPage),
        currentPage: page,
      }
    });
  }

  // New method to get a single question's details (simulated)
  static getQuestionDetail(questionId) {
    console.warn(`ExamService.getQuestionDetail for ID ${questionId} is using simulated data.`);
    const allQuestionsWithDetails = {
        1: {
          id: 1,
          text: "Cual es la causa mas frecuente de hipertension arterial sistemica en el adulto?",
          clinicalCaseId: 1,
          clinicalCaseName: "Caso Hipertension Adulto",
          answers: [
            { id: 1, text: "Idiopática o esencial (Correcta)", is_correct: true, description: "En más del 90-95% de los casos, la HTA es idiopática o esencial, lo que significa que no tiene una causa secundaria identificable." },
            { id: 2, text: "Enfermedad renal crónica", is_correct: false, description: "Si bien es una causa importante de HTA secundaria, no es la más frecuente en la población general adulta." },
            { id: 3, text: "Hiperaldosteronismo primario", is_correct: false, description: "Es una causa endocrina de HTA, pero menos común que la esencial." },
          ]
        },
        2: {
          id: 2,
          text: "Paciente masculino de 34 anios de edad, con diagnostico de VIH hace 5 anios, acude por presentar lesiones papulares, umbilicadas, brillantes, localizadas en cara y cuello. Cual es el diagnostico mas probable?",
          clinicalCaseId: 2,
          clinicalCaseName: "Caso VIH",
          answers: [
            { id: 4, text: "Molusco contagioso (Correcta)", is_correct: true, description: "Las lesiones descritas son características del molusco contagioso, una infección viral cutánea común en pacientes con VIH." },
            { id: 5, text: "Sarcoma de Kaposi", is_correct: false, description: "Puede presentar lesiones cutáneas en VIH, pero típicamente son violáceas y pueden ser nodulares o en placa." },
            { id: 6, text: "Dermatitis seborreica", is_correct: false, description: "Común en VIH, pero se manifiesta como eritema y descamación, no pápulas umbilicadas brillantes." },
          ]
        },
        3: {
          id: 3,
          text: "Cual es el tratamiento de eleccion para la crisis hipertensiva tipo urgencia?",
          clinicalCaseId: null,
          clinicalCaseName: null,
          answers: [
            { id: 7, text: "Captopril oral (Correcta)", is_correct: true, description: "En las urgencias hipertensivas, se busca disminuir la PA gradualmente en 24-48h, y los antihipertensivos orales como IECA (Captopril) son de elección." },
            { id: 8, text: "Nifedipino sublingual", is_correct: false, description: "El nifedipino sublingual no se recomienda por el riesgo de hipotensión brusca e isquemia." },
            { id: 9, text: "Labetalol IV", is_correct: false, description: "Los medicamentos IV se reservan para emergencias hipertensivas (con daño a órgano diana)." },
          ]
        },
         4: {
          id: 4,
          text: "Segun la GPC, cual es la definicion de Preeclampsia?",
          clinicalCaseId: 3,
          clinicalCaseName: "Caso Obstetricia",
          answers: [
            { id: 10, text: "Hipertension arterial >140/90 mmHg despues de las 20 SDG + proteinuria >300mg/24h (Correcta)", is_correct: true, description: "Esta es la definición clásica de preeclampsia." },
            { id: 11, text: "Hipertension arterial >160/110 mmHg antes de las 20 SDG", is_correct: false, description: "La hipertensión antes de las 20 SDG sugiere hipertensión crónica." },
          ]
        },
        5: {
          id: 5,
          text: "Cual es el tumor oseo maligno mas frecuente en ninos?",
          clinicalCaseId: null,
          clinicalCaseName: null,
          answers: [
            { id: 12, text: "Osteosarcoma (Correcta)", is_correct: true, description: "El osteosarcoma es el tumor óseo maligno primario más frecuente en niños y adolescentes." },
            { id: 13, text: "Sarcoma de Ewing", is_correct: false, description: "Es el segundo tumor óseo maligno más frecuente en este grupo de edad." },
          ]
        }
      };
    const question = allQuestionsWithDetails[questionId];
    if (question) {
      return Promise.resolve({ data: question });
    } else {
      return Promise.reject({ message: "Question not found" });
    }
  }
}
