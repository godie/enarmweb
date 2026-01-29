class Auth {

  static TOKEN_KEY = 'token';
  static USER_INFO_KEY = 'userInfo';

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static authenticateUser(token) {
    localStorage.setItem(Auth.TOKEN_KEY, token);
  }

  /**
   * Check if a user is authenticated
   */
  static isUserAuthenticated() {
    return localStorage.getItem(Auth.TOKEN_KEY) !== null;
  }

  /**
   * Check if the authenticated user is an admin
   */
  static isAdmin() {
    const info = this.getUserInfo();
    return !!(info && info.role === 'admin');
  }

  /**
   * Deauthenticate a user.
   */
  static deauthenticateUser() {
    localStorage.removeItem(Auth.TOKEN_KEY);
    localStorage.removeItem(Auth.USER_INFO_KEY);
  }

  /**
   * Get a token value.
   */
  static getToken() {
    return localStorage.getItem(Auth.TOKEN_KEY);
  }

  /**
   * Save user info (including role)
   */
  static saveUserInfo(info) {
    localStorage.setItem(Auth.USER_INFO_KEY, JSON.stringify(info));
  }

  static getUserInfo() {
    const info = localStorage.getItem(Auth.USER_INFO_KEY);
    return info ? JSON.parse(info) : null;
  }

  static removeUserInfo() {
    localStorage.removeItem(Auth.USER_INFO_KEY);
  }

  /**
   * ALIASES PARA COMPATIBILIDAD (Legacy)
   */
  static authenticatePlayer(token) {
    this.authenticateUser(token);
  }

  static isPlayerAuthenticated() {
    return this.isUserAuthenticated();
  }

  static deauthenticatePlayer() {
    this.deauthenticateUser();
  }

  static savePlayerInfo(info) {
    this.saveUserInfo(info);
  }

  static getPlayerInfo() {
    return this.getUserInfo();
  }

  static removePlayerInfo() {
    this.removeUserInfo();
  }

  static saveFacebookUser(fbuser) {
    this.saveUserInfo(fbuser);
  }

  static isFacebookUser() {
    const info = this.getUserInfo();
    return info && info.facebook_id;
  }

  static getFacebookUser() {
    return JSON.stringify(this.getUserInfo());
  }

  static removeFacebookUser() {
    this.removeUserInfo();
  }
}

export default Auth;
