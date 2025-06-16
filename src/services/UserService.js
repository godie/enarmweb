import axios from "axios";
//import Auth from '../modules/Auth';
import BaseService from "./BaseService";

class UserService {
  static login(user) {
    return axios.post(BaseService.getURL("auth_user"), {
      email: user.email,
      password: user.password,
    });
  }

  static createPlayer(params) {
    return axios.post(BaseService.getURL("players"), { player: params });
  }
}

export default UserService;
