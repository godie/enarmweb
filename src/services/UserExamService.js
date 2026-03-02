import axios from "axios";
import BaseService from "./BaseService";

export default class UserExamService extends BaseService {
  static getUserExams() {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL("user_exams"), headers);
  }

  static getUserExam(id) {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL(`user_exams/${id}`), headers);
  }

  static startExam(examId) {
    const headers = this.getHeaders();
    return axios.post(BaseService.getURL("user_exams"), { exam_id: examId }, headers);
  }

  static completeExam(userExamId, answers) {
    const headers = this.getHeaders();
    return axios.put(BaseService.getURL(`user_exams/${userExamId}`), { answers }, headers);
  }
}
