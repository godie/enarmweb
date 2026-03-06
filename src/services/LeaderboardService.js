import axios from "axios";
import BaseService from "./BaseService";

export default class LeaderboardService extends BaseService {
  static getTopUsers() {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL("leaderboard"), headers);
  }
}
