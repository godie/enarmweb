import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import UserService from "../services/UserService";
import Auth from "../modules/Auth";
import { alertError } from "../services/AlertService";
import AuthForm from "./common/AuthForm";

export default function Login() {
  const history = useHistory();
  const { from } = useLocation().state || { from: { pathname: "/dashboard" } };

  const loginAction = async (previousState, formData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const { data } = await UserService.login({ email, password });
      Auth.authenticateUser(data.token);
      history.replace(from);
      return null;
    } catch (err) {
      console.error(err);
      alertError('Error!', 'Invalid Credentials!');
      return 'Invalid Credentials!';
    }
  };

  return (
    <AuthForm
      title="Entrar"
      action={loginAction}
      submitText="Entrar"
      isPendingText="Entrando..."
    />
  );
}
