import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import Auth from "../../modules/Auth";
import GoogleLogin from "./GoogleLogin";
import UserService from "../../services/UserService";
import { alertError } from "../../services/AlertService";

export default function GoogleLoginContainer() {
    const history = useHistory();

    const handleGoogleResponse = useCallback(
        (response) => {
            // The response includes a credential field which is the ID Token
            const idToken = response.credential;

            // Decode JWT to get user info (optional, backend should verify)
            const base64Url = idToken.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            const googleUser = JSON.parse(jsonPayload);

            UserService.googleLogin({
                google_id: googleUser.sub,
                email: googleUser.email,
                name: googleUser.name,
                id_token: idToken // Full token for backend verification if needed
            })
                .then((res) => {
                    Auth.authenticatePlayer(res.data.token);
                    Auth.savePlayerInfo({
                        name: googleUser.name,
                        email: googleUser.email,
                        id: res.data.id,
                        role: res.data.role
                    });
                    history.replace("/");
                })
                .catch((err) => {
                    console.error("Google Login error:", err);
                    alertError("Error", "No se pudo iniciar sesión con Google");
                });
        },
        [history]
    );

    return (
        <GoogleLogin
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "32979180819-lob8rj66qsjukuq9dnjgqckv04nv5tof.apps.googleusercontent.com"}
            onGoogleResponse={handleGoogleResponse}
        ></GoogleLogin>
    );
}
