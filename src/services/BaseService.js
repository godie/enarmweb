import Auth from "../modules/Auth";
class BaseService {

  static getURL(url) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ||
      (window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://enarmapi.godieboy.com');
    return `${apiBaseUrl}/${url}`;
  }

  static getHeaders() {
    let token = `bearer ${Auth.getToken()}`;
    return { headers: { Authorization: token }, params: {} };
  }

}

export default BaseService;
