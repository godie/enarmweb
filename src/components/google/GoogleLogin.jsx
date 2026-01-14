import React, { useEffect } from "react";
import PropTypes from "prop-types";

export default function GoogleLogin({ onGoogleResponse, clientId }) {
    useEffect(() => {
        // Load Google Identity Services script
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: onGoogleResponse,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin-button"),
                    {
                        theme: "outline",
                        size: "large",
                        width: "100%", // Forzar a ocupar todo el contenedor
                        text: "signin_with",
                        locale: "es_LA"
                    }
                );
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [clientId, onGoogleResponse]);

    return (
        <div className="col s12 m10 l8 offset-m1 l2">
            <div className="section center" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div id="google-signin-button" style={{ width: '100%' }}></div>
            </div>
        </div>
    );
}

GoogleLogin.propTypes = {
    clientId: PropTypes.string.isRequired,
    onGoogleResponse: PropTypes.func.isRequired,
};
