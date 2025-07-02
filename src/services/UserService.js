import axios from "axios";
//import Auth from '../modules/Auth';
import BaseService from "./BaseService";

class UserService extends BaseService{
  static login(user) {
    return axios.post(BaseService.getURL("auth_user"), {
      email: user.email,
      password: user.password,
    });
  }

  static createPlayer(params) {
    return axios.post(BaseService.getURL("players"), { player: params });
  }

  static getAchievements(playerId) {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL(`players/${playerId}/achievements`), headers);
  }
}

export default UserService;
