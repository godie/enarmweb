import React, { useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SweetAlert from "sweetalert2-react";
import UserService from "../services/UserService";
import Auth from "../modules/Auth";
import { Button, Col, Row, TextInput } from "react-materialize";
import { alertError } from "../services/AlertService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { from } = useLocation().state || { from: { pathname: "/dashboard" } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await UserService.login({
        email: email,
        password: password,
      });
      Auth.authenticateUser(data.token);
      history.replace(from);
    } catch (err) {
      console.error(err);
      alertError('Error!', 'Invalid Credentials!');
    }
  };

  return (
    <div className="container section">
      <Row className="z-depth-2 green darken-4">
        <form onSubmit={handleSubmit} className="col s12">
          <h2 className="center white-text">Entrar</h2>
          <Row>
            <Col s={12}>
              <TextInput
                label="email"
                id="email"
                s={12}
                className="white-text validate "
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>
            <Col s={12}>
              <TextInput
                password
                label="password"
                s={12}
                id="password"
                className="white-text validate "
                offset="s2"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Button
              s={8}
              large
              waves="light"
              offset="s2"
              className="col s8 offset-s2 grey lighten-3 green-text"
            >
              Entrar
            </Button>
          </Row>
        </form>
      </Row>
    </div>
  );
}
