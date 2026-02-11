import { useEffect } from "react";
import PropTypes from "prop-types";

export default function FacebookLogin({
  appId,
  onStatusChange,
  locale = "es_LA",
  version = "v23.0",
  xfbml = true,
  useCustomButton = false,
}) {
  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId,
        cookie: true,
        xfbml,
        version,
      });
      window.FB.getLoginStatus(onStatusChange);
      window.FB.Event.subscribe("auth.statusChange", onStatusChange);
    };

    if (!document.getElementById("facebook-jssdk")) {
      ((d, s, id) => {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js = d.createElement(s);
        js.id = id;
        js.src = `https://connect.facebook.net/${locale}/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    } else if (window.FB && xfbml && !useCustomButton) {
      window.FB.XFBML.parse();
    }

    return () => {
      if (window.FB && window.FB.Event.unsubscribe) {
        window.FB.Event.unsubscribe("auth.statusChange", onStatusChange);
      }
    };
  }, [appId, locale, version, xfbml, onStatusChange, useCustomButton]);

  const handleCustomClick = () => {
    if (typeof window.FB !== "undefined") {
      window.FB.login(
        (response) => onStatusChange(response),
        { scope: "public_profile,email" }
      );
    }
  };

  if (useCustomButton) {
    return (
      <button
        type="button"
        className="btn btn-outline waves-effect"
        onClick={handleCustomClick}
        aria-label="Iniciar sesión con Facebook"
      >
        <i className="material-icons left">facebook</i>
        Facebook
      </button>
    );
  }

  return (
    <div className="col s12 m10 l8 offset-m1 offset-l2">
      <div className="section center">
        <div
          className="fb-login-button"
          data-max-rows="1"
          data-size="large"
          data-button-type="continue_with"
          data-show-faces="false"
          data-auto-logout-link="true"
          data-use-continue-as="false"
          data-scope="public_profile,email"
        />
      </div>
    </div>
  );
}

FacebookLogin.propTypes = {
  appId: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  locale: PropTypes.string,
  version: PropTypes.string,
  xfbml: PropTypes.bool,
  useCustomButton: PropTypes.bool,
};

FacebookLogin.defaultProps = {
  locale: "es_LA",
  version: "v23.0",
  xfbml: true,
  useCustomButton: false,
};
