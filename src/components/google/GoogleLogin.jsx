import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function GoogleLogin({ onGoogleResponse, clientId, useCustomButton = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return script;
    };

    let script = document.querySelector('script[src*="gsi/client"]');
    if (!script) {
      script = loadScript();
    }

    const initButton = () => {
      if (!window.google || !containerRef.current) return;
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: onGoogleResponse,
        });
        if (useCustomButton) {
          // One Tap se puede mostrar con prompt(); el botón custom solo abre el flujo
          return;
        }
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          locale: "es_LA",
        });
      } catch (e) {
        console.warn("Google Sign-In init:", e);
      }
    };

    if (window.google) {
      initButton();
    } else {
      script.addEventListener("load", initButton);
      return () => script.removeEventListener("load", initButton);
    }
  }, [clientId, onGoogleResponse, useCustomButton]);

  const handleCustomClick = () => {
    if (typeof window.google !== "undefined" && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    }
  };

  if (useCustomButton) {
    return (
      <button
        type="button"
        className="btn btn-outline waves-effect"
        onClick={handleCustomClick}
        aria-label="Iniciar sesión con Google"
      >
        <i className="material-icons left">public</i>
        Google
      </button>
    );
  }

  return (
    <div className="col s12 m10 l8 offset-m1 offset-l2">
      <div className="section center" style={{ maxWidth: "270px", margin: "0 auto" }}>
        <div ref={containerRef} id="google-signin-button" style={{ width: "100%" }} />
      </div>
    </div>
  );
}

GoogleLogin.propTypes = {
  clientId: PropTypes.string.isRequired,
  onGoogleResponse: PropTypes.func.isRequired,
  useCustomButton: PropTypes.bool,
};
