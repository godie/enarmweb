import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import UserService from "../services/UserService";
import Auth from "../modules/Auth";
import { alertError } from "../services/AlertService";
import FacebookLoginContainer from "./facebook/FacebookLoginContainer";
import GoogleLoginContainer from "./google/GoogleLoginContainer";
import CustomRow from "./custom/CustomRow";
import AuthForm from "./common/AuthForm";

export default function PlayerLogin() {
    const history = useHistory();
    const { from } = useLocation().state || { from: { pathname: "/" } };
    const [isSignup, setIsSignup] = useState(false);

    const loginAction = async (previousState, formData) => {
        const email = formData.get("email");
        const password = formData.get("password");
        const name = formData.get("name");

        try {
            let response;
            if (isSignup) {
                response = await UserService.createPlayer({ email, password, name });
            } else {
                response = await UserService.loginPlayer({ email, password });
            }

            Auth.authenticatePlayer(response.data.token);
            Auth.savePlayerInfo({
                name: response.data.name || name,
                email: response.data.email || email,
                id: response.data.id
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
            <div className="divider" style={{ backgroundColor: 'rgba(255,255,255,0.2)', margin: '20px 0' }}></div>
            <h5 className="center white-text" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>O continúa con</h5>
            <CustomRow>
                <FacebookLoginContainer />
                <GoogleLoginContainer />
            </CustomRow>
        </>
    );

    return (
        <AuthForm
            title={isSignup ? "Registrarse" : "Entrar"}
            action={loginAction}
            isSignup={isSignup}
            onToggleSignup={() => setIsSignup(!isSignup)}
            extraContent={extraContent}
            submitText={isSignup ? "Registrarse" : "Entrar"}
            isPendingText={isSignup ? "Registrando..." : "Entrando..."}
        />
    );
}
