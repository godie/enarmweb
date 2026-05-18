import axios from 'axios';
import BaseService from './BaseService';

export default class KnowledgeBaseService extends BaseService {
  static getTopics() {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL('v2/knowledge-base'), headers);
  }

  static searchTopics(search) {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL('v2/knowledge-base'), {
      ...headers,
      params: { search }
    });
  }
}
