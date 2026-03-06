import axios from "axios";
import BaseService from "./BaseService";

export default class AchievementService extends BaseService {
  static getAchievements() {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL("achievements"), headers);
  }

  static createAchievement(achievement) {
    const headers = this.getHeaders();
    return axios.post(BaseService.getURL("achievements"), { achievement }, headers);
  }

  static updateAchievement(id, achievement) {
    const headers = this.getHeaders();
    return axios.put(BaseService.getURL(`achievements/${id}`), { achievement }, headers);
  }

  static deleteAchievement(id) {
    const headers = this.getHeaders();
    return axios.delete(BaseService.getURL(`achievements/${id}`), headers);
  }
}
