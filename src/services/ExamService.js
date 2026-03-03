import axios from "axios";
import BaseService from "./BaseService";
import Auth from "../modules/Auth";

axios.defaults.timeout = 10000;

export default class ExamService extends BaseService {
  static getExams(page) {
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
    //caso['name'] = caso.description.slice(0,10);
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

  /**
   * Propose for Backend: The clinical_cases endpoint should support filtering by category_id.
   * If not implemented, clinical_cases#index should be updated to:
   * @example
   * def index
   *   @clinical_cases = ClinicalCase.all
   *   @clinical_cases = @clinical_cases.where(category_id: params[:category_id]) if params[:category_id].present?
   *   ...
   * end
   */
  static getClinicalCasesByCategory(categoryId) {
    let headers = this.getHeaders();
    headers.params = { category_id: categoryId };
    let url = "clinical_cases";
    return axios.get(BaseService.getURL(url), headers);
  }

  /**
   * Sugerencia para Backend: Agregar endpoint que devuelva las contribuciones del usuario actual.
   * GET /users/me/contributions
   */
  static getUserContributions() {
    const headers = this.getHeaders();
    let url = "users/me/contributions";
    return axios.get(BaseService.getURL(url), headers);
  }

  static saveQuestion(question) {
    const headers = this.getHeaders();
    let url = "questions";
    if (question.id > 0) {
      url = url + "/" + question.id;
      return axios.put(BaseService.getURL(url), { question }, headers);
    } else {
      return axios.post(BaseService.getURL(url), { question }, headers);
    }
  }

}