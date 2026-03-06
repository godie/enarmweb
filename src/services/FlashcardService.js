import axios from "axios";
import BaseService from "./BaseService";

export default class FlashcardService extends BaseService {
  static getFlashcards(categoryId) {
    const headers = this.getHeaders();
    if (categoryId) headers.params = { category_id: categoryId };
    return axios.get(BaseService.getURL("flashcards"), headers);
  }

  static getFlashcard(id) {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL(`flashcards/${id}`), headers);
  }

  static getDueFlashcards() {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL("flashcards/due"), headers);
  }

  static reviewFlashcard(id, quality) {
    const headers = this.getHeaders();
    return axios.post(BaseService.getURL(`flashcards/${id}/review`), { quality }, headers);
  }
}
