import Auth from './Auth';

describe('Auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('authenticateUser', () => {
    it('should save the token to localStorage', () => {
      const token = 'test-token';
      Auth.authenticateUser(token);
      expect(localStorage.getItem('token')).toBe(token);
    });
  });

  describe('isUserAuthenticated', () => {
    it('should return true if a token exists in localStorage', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);
      expect(Auth.isUserAuthenticated()).toBe(true);
    });

    it('should return false if no token exists in localStorage', () => {
      expect(Auth.isUserAuthenticated()).toBe(false);
    });
  });

  describe('deauthenticateUser', () => {
    it('should remove the token from localStorage', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);
      Auth.deauthenticateUser();
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should return false from isUserAuthenticated after deauthenticating', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);
      Auth.deauthenticateUser();
      expect(Auth.isUserAuthenticated()).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return the token if it exists in localStorage', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);
      expect(Auth.getToken()).toBe(token);
    });

    it('should return null if no token exists in localStorage', () => {
      expect(Auth.getToken()).toBeNull();
    });
  });

  describe('saveFacebookUser', () => {
    it('should save the Facebook user data to localStorage', () => {
      const fbUser = { id: 'fb-123', name: 'Facebook User' };
      Auth.saveFacebookUser(fbUser);
      expect(localStorage.getItem('fbUser')).toBe(JSON.stringify(fbUser));
    });
  });

  describe('isFacebookUser', () => {
    it('should return true if Facebook user data exists in localStorage', () => {
      const fbUser = { id: 'fb-123', name: 'Facebook User' };
      localStorage.setItem('fbUser', JSON.stringify(fbUser));
      expect(Auth.isFacebookUser()).toBe(true);
    });

    it('should return false if no Facebook user data exists in localStorage', () => {
      expect(Auth.isFacebookUser()).toBe(false);
    });
  });

  describe('getFacebookUser', () => {
    it('should return the Facebook user data if it exists in localStorage', () => {
      const fbUser = { id: 'fb-123', name: 'Facebook User' };
      localStorage.setItem('fbUser', JSON.stringify(fbUser));
      expect(Auth.getFacebookUser()).toEqual(fbUser);
    });

    it('should return null if no Facebook user data exists in localStorage', () => {
      expect(Auth.getFacebookUser()).toBeNull();
    });
  });

  describe('removeFacebookUser', () => {
    it('should remove the Facebook user data from localStorage', () => {
      const fbUser = { id: 'fb-123', name: 'Facebook User' };
      localStorage.setItem('fbUser', JSON.stringify(fbUser));
      Auth.removeFacebookUser();
      expect(localStorage.getItem('fbUser')).toBeNull();
    });

    it('should result in isFacebookUser returning false', () => {
      const fbUser = { id: 'fb-123', name: 'Facebook User' };
      localStorage.setItem('fbUser', JSON.stringify(fbUser));
      Auth.removeFacebookUser();
      expect(Auth.isFacebookUser()).toBe(false);
    });
  });
});
