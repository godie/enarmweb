import axios from "axios";
import BaseService from "./BaseService";

export default class MessageService extends BaseService {
  static getConversations() {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL("messages"), headers);
  }

  static getConversation(userId) {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL(`messages/${userId}`), headers);
  }

  static sendMessage(message) {
    const headers = this.getHeaders();
    return axios.post(BaseService.getURL("messages"), { message }, headers);
  }
}
