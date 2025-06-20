class Auth {

  static TOKEN_KEY = 'token';
  static FB_USER_KEY = 'fbUser';

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static authenticateUser(token) {
    localStorage.setItem(Auth.TOKEN_KEY, token);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem(Auth.TOKEN_KEY) !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem(Auth.TOKEN_KEY);
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return localStorage.getItem(Auth.TOKEN_KEY);
  }

  static saveFacebookUser(fbuser){
    localStorage.setItem(Auth.FB_USER_KEY,JSON.stringify(fbuser));
  }

  static isFacebookUser(){
     return localStorage.getItem(Auth.FB_USER_KEY) !== null;
  }

  static getFacebookUser() {
    const fbUser = localStorage.getItem(Auth.FB_USER_KEY);
    return fbUser ? JSON.parse(fbUser) : null;
  }

  static removeFacebookUser(){
    localStorage.removeItem(Auth.FB_USER_KEY);
  }


}

export default Auth;
