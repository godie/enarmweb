import axios from "axios";
import BaseService from "./BaseService";
import Auth from "../modules/Auth";

axios.defaults.timeout = 10000;

export default class ExamService {
  static getExams(page) {
    let token = `bearer ${Auth.getToken()}`;
    let headers = { headers: { Authorization: token }, params: { page: page } };
    //Todo exams are differentes :P
    let url = "clinical_cases";
    return axios.get(BaseService.getURL(url), headers);
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
    let headers = { headers: { Authorization: token } };

    if (caso.id > 0) {
      url = url + "/" + caso.id;
      return axios.put(BaseService.getURL(url),{ clinical_case: caso },headers);
    } else {
      return axios.post(BaseService.getURL(url),{ clinical_case: caso },headers);
    }
  }

  static sendAnswers(playerAnswers) {
    let token = `bearer ${Auth.getToken()}`;
    let url = "player_answers";
    let headers = { headers: { Authorization: token } };

    if (playerAnswers.id > 0) {
      url = url + "/" + playerAnswers.id;
      return axios.put(BaseService.getURL(url), playerAnswers, headers);
    } else {
      return axios.post(BaseService.getURL(url), playerAnswers, headers);
    }
  }

  static saveCategory(category){
    const headers = this.getHeaders();
    let url = 'categories';
    if(category.id > 0){
      url = `${url}/${category.id}`;
      return axios.put(BaseService.getURL(url), category, headers);
    }else{
      return axios.post(BaseService.getURL(url), category, headers);
    }
  }

  static getCategory(id){
    const headers = this.getHeaders();
    let url = `categories/${id}`;
    return axios.get(BaseService.getURL(url), headers);
  }

  static getHeaders(){
    let token = `bearer ${Auth.getToken()}`;
    return { headers: { Authorization: token } };
  }
}