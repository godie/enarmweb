import axios from "axios";
import BaseService from "./BaseService";

export default class SpecialistService extends BaseService {
  static getSpecialists() {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL("specialists"), headers);
  }

  static getSpecialist(id) {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL(`specialists/${id}`), headers);
  }
}
