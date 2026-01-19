import axios from "axios";
import BaseService from "./BaseService";

class UserService extends BaseService {
  // Login unificado para Administradores y Jugadores
  static login(user) {
    return axios.post(BaseService.getURL("users/login"), {
      email: user.email,
      password: user.password,
    });
  }

  // Registro de usuarios (Jugadores por defecto en el backend)
  static createUser(params) {
    return axios.post(BaseService.getURL("users"), { user: params });
  }

  // Google Login unificado
  static googleLogin(params) {
    return axios.post(BaseService.getURL("users/google_login"), params);
  }

  // Logros unificados
  static getAchievements(userId) {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL(`users/${userId}/achievements`), headers);
  }

  // Admin: Listar usuarios
  static getUsers() {
    const headers = this.getHeaders();
    return axios.get(BaseService.getURL("users"), headers);
  }

  // Admin: Actualizar usuario
  static updateUser(id, params) {
    const headers = this.getHeaders();
    return axios.put(BaseService.getURL(`users/${id}`), { user: params }, headers);
  }

  // Admin: Eliminar usuario
  static deleteUser(id) {
    const headers = this.getHeaders();
    return axios.delete(BaseService.getURL(`users/${id}`), headers);
  }

  // Aliases para compatibilidad durante la transición si es necesario
  static createPlayer(params) {
    return this.createUser(params);
  }

  static loginPlayer(params) {
    return this.login({ email: params.email, password: params.password });
  }
}

export default UserService;
