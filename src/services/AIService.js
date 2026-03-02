import axios from "axios";
import BaseService from "./BaseService";

export default class AIService extends BaseService {
  static generateQuestion(prompt) {
    const headers = this.getHeaders();
    return axios.post(BaseService.getURL("ai/generate_question"), { prompt }, headers);
  }

  static generateClinicalCase(prompt) {
    const headers = this.getHeaders();
    return axios.post(BaseService.getURL("ai/generate_clinical_case"), { prompt }, headers);
  }

  static bulkCreateExam(formData) {
    const headers = this.getHeaders();
    return axios.post(BaseService.getURL("ai/bulk_create_exam"), formData, {
      ...headers,
      headers: {
        ...headers.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
