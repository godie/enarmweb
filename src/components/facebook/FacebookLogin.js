import React, { useEffect } from "react";
import PropTypes from "prop-types";


export default function FacebookLogin({
  appId,
  onStatusChange,
  locale,
  version,
  xfbml,
}) {
  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = () => {
      window.FB.init({
        appId,
        cookie: true,
        xfbml,
        version,
      });
      // Check current login status
      window.FB.getLoginStatus(onStatusChange);
      // Subscribe to status changes
      window.FB.Event.subscribe("auth.statusChange", onStatusChange);
    };

    // Load the SDK script if not already present
    if (!document.getElementById("facebook-jssdk")) {
      ((d, s, id) => {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js = d.createElement(s);
        js.id = id;
        js.src = `https://connect.facebook.net/${locale}/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    } else if (window.FB && xfbml) {
      // Re-parse XFBML if SDK already loaded
      window.FB.XFBML.parse();
    }

    // Cleanup subscription on unmount
    return () => {
      if (window.FB && window.FB.Event.unsubscribe) {
        window.FB.Event.unsubscribe("auth.statusChange", onStatusChange);
      }
    };
  }, [appId, locale, version, xfbml, onStatusChange]);

  return (
    <div className="s12 m8 l8 offset-l2 offset-m2">
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
};

FacebookLogin.defaultProps = {
  locale: "en_US",
  version: "v2.8",
  xfbml: true,
};
