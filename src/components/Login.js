import React, { useActionState } from "react"; // Replaced useState with useActionState
import { useHistory, useLocation } from "react-router-dom";
import UserService from "../services/UserService";
import Auth from "../modules/Auth";
import CustomButton from "./custom/CustomButton";
import CustomRow from "./custom/CustomRow";
import CustomCol from "./custom/CustomCol";
import CustomTextInput from "./custom/CustomTextInput";
import { alertError } from "../services/AlertService";

export default function Login() {
  const history = useHistory();
  const { from } = useLocation().state || { from: { pathname: "/dashboard" } };

  // Define the action function
  const loginAction = async (previousState, formData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const { data } = await UserService.login({ email, password });
      Auth.authenticateUser(data.token);
      history.replace(from);
      return null; // Indicates success
    } catch (err) {
      console.error(err);
      alertError('Error!', 'Invalid Credentials!');
      return 'Invalid Credentials!'; // Return error message
    }
  };

  const [error, submitAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="container section">
      <CustomRow className="z-depth-2 green darken-4">
        {/* Use the submitAction in the form */}
        <form action={submitAction} className="col s12">
          <h2 className="center white-text">Entrar</h2>
          <CustomRow>
            <CustomCol s={8} offset="s2">
              <CustomTextInput
                label="email"
                id="email"
                name="email" // Added name attribute for formData
                inputClassName="white-text"
                validate
                // Removed onChange and value, form will be uncontrolled initially or handled by React's form features
              />
            </CustomCol>
            <CustomCol s={8} offset="s2">
              <CustomTextInput
                type="password"
                label="password"
                id="password"
                name="password" // Added name attribute for formData
                inputClassName="white-text"
                validate
                // Removed onChange and value
              />
            </CustomCol>
          </CustomRow>
          {error && (
            <CustomRow>
              <CustomCol s={8} offset="s2">
                <p className="red-text center-align">{error}</p>
              </CustomCol>
            </CustomRow>
          )}
          <CustomRow>
            <CustomButton
              type="submit"
              large
              waves="light"
              className="col s8 offset-s2 grey lighten-3 green-text"
              disabled={isPending} // Disable button when pending
            >
              {isPending ? "Entrando..." : "Entrar"}
            </CustomButton>
          </CustomRow>
        </form>
      </CustomRow>
    </div>
  );
}
