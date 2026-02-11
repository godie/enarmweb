import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import UserService from "../services/UserService";
import Auth from "../modules/Auth";
import { alertError } from "../services/AlertService";
import FacebookLoginContainer from "./facebook/FacebookLoginContainer";
import GoogleLoginContainer from "./google/GoogleLoginContainer";
import CustomRow from "./custom/CustomRow";
import CustomCol from "./custom/CustomCol";
import AuthForm from "./common/AuthForm";

export default function PlayerLogin() {
    const history = useHistory();
    const { from } = useLocation().state || { from: { pathname: "/" } };
    const [isSignup, setIsSignup] = useState(false);

    const loginAction = async (previousState, formData) => {
        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");
        const username = formData.get("username");

        try {
            let response;
            if (isSignup) {
                response = await UserService.createUser({ email, password, name, username });
            } else {
                response = await UserService.loginPlayer({ email, password });
            }

            Auth.authenticatePlayer(response.data.token);
            Auth.savePlayerInfo({
                name: response.data.name || name,
                email: response.data.email || email,
                id: response.data.id,
                role: response.data.role,
                preferences: response.data.preferences
            });

            history.replace(from);
            return null;
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || (isSignup ? "Error al registrarse" : "Credenciales inválidas");
            alertError('Error!', errorMsg);
            return errorMsg;
        }
    };

    const extraContent = (
        <>
            <div className="divider-row">O CONTINÚA CON</div>
            <CustomRow className="login-social-row">
                <CustomCol s={12} m={6}>
                    <GoogleLoginContainer />
                </CustomCol>
                <CustomCol s={12} m={6}>
                    <FacebookLoginContainer />
                </CustomCol>
            </CustomRow>
        </>
    );

    return (
        <AuthForm
            layout="card"
            title={isSignup ? "Registrarse" : "Iniciar Sesión"}
            action={loginAction}
            isSignup={isSignup}
            onToggleSignup={() => setIsSignup(!isSignup)}
            extraContent={extraContent}
            submitText={isSignup ? "Registrarse" : "Entrar"}
            isPendingText={isSignup ? "Registrando..." : "Entrando..."}
        />
    );
}
