import React, { useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import UserService from "../services/UserService";
import Auth from "../modules/Auth";
// import { TextInput } from "react-materialize"; // Removed
import CustomButton from "./custom/CustomButton";
import CustomRow from "./custom/CustomRow";
import CustomCol from "./custom/CustomCol";
import CustomTextInput from "./custom/CustomTextInput"; // Added
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
      <CustomRow className="z-depth-2 green darken-4">
        <form onSubmit={handleSubmit} className="col s12"> {/* This form implies it's a Col s12 already */}
          <h2 className="center white-text">Entrar</h2>
          <CustomRow>
            <CustomCol s={12}>
              <CustomTextInput
                label="email"
                id="email"
                // s={12} // Handled by CustomCol wrapper
                inputClassName="white-text" // Pass 'white-text' to input itself
                validate // Adds 'validate' class to input
                onChange={(e) => setEmail(e.target.value)}
                value={email} // Added value prop for controlled component
              />
            </CustomCol>
            {/* Password field's Col should get the offset */}
            <CustomCol s={12} offset="s2">
              <CustomTextInput
                type="password" // Changed from 'password' boolean prop
                label="password"
                // s={12} // Handled by CustomCol wrapper
                id="password"
                inputClassName="white-text" // Pass 'white-text' to input itself
                validate // Adds 'validate' class to input
                onChange={(e) => setPassword(e.target.value)}
                value={password} // Added value prop for controlled component
              />
            </CustomCol>
          </CustomRow>
          <CustomRow>
            <CustomButton
              type="submit"
              large
              waves="light"
              className="col s8 offset-s2 grey lighten-3 green-text"
              // s={8} and offset="s2" are part of className now
            >
              Entrar
            </CustomButton>
          </Row>
        </form>
      </Row>
    </div>
  );
}
