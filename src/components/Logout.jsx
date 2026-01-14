// src/components/Logout.js
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import Auth from "../modules/Auth";

export default function Logout() {
  useEffect(() => {
    Auth.deauthenticateUser();
    Auth.deauthenticatePlayer();
  }, []);
  return <Redirect to="/" />;
}

export function AdminLogout() {
  useEffect(() => {
    Auth.deauthenticateUser();
  }, []);
  return <Redirect to="/login" />;
}
