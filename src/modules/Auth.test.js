import Auth from './Auth';
import { describe, beforeEach, it, expect } from 'vitest';

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

  describe('isAdmin', () => {
    it('should return true if user info has admin role', () => {
      const info = { role: 'admin' };
      localStorage.setItem('userInfo', JSON.stringify(info));
      expect(Auth.isAdmin()).toBe(true);
    });

    it('should return false if user info has player role', () => {
      const info = { role: 'player' };
      localStorage.setItem('userInfo', JSON.stringify(info));
      expect(Auth.isAdmin()).toBe(false);
    });

    it('should return false if no user info exists', () => {
      expect(Auth.isAdmin()).toBe(false);
    });
  });

  describe('deauthenticateUser', () => {
    it('should remove the token and user info from localStorage', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify({ name: 'Test' }));
      Auth.deauthenticateUser();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userInfo')).toBeNull();
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

  describe('saveUserInfo', () => {
    it('should save the user data to localStorage', () => {
      const user = { id: 1, name: 'User' };
      Auth.saveUserInfo(user);
      expect(localStorage.getItem('userInfo')).toBe(JSON.stringify(user));
    });
  });

  describe('getUserInfo', () => {
    it('should return the user data if it exists in localStorage', () => {
      const user = { id: 1, name: 'User' };
      localStorage.setItem('userInfo', JSON.stringify(user));
      expect(Auth.getUserInfo()).toEqual(user);
    });

    it('should return null if no user data exists in localStorage', () => {
      expect(Auth.getUserInfo()).toBeNull();
    });
  });

  describe('Legacy Aliases', () => {
    it('isPlayerAuthenticated should match isUserAuthenticated', () => {
      localStorage.setItem('token', 'abc');
      expect(Auth.isPlayerAuthenticated()).toBe(true);
    });

    it('getFacebookUser should return stringified user info', () => {
      const user = { facebook_id: '123' };
      Auth.saveUserInfo(user);
      expect(JSON.parse(Auth.getFacebookUser())).toEqual(user);
    });
  });
});
