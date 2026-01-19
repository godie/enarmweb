import { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Auth from "../../modules/Auth";
import FacebookLogin from "../facebook/FacebookLogin";
import UserService from "../../services/UserService";

export default function FacebookLoginContainer() {
  const history = useHistory();
  const onStatusChange = useCallback(
    (response) => {
      console.log("FB status change:", response);

      if (response.status === "connected") {
        // Retrieve user info from Facebook
        window.FB.api("/me", { fields: "id,name,email" }, (fbRes) => {
          const params = {
            name: fbRes.name,
            facebook_id: fbRes.id,
            email: fbRes.email || "no_mail",
          };

          // Persist in localStorage and backend
          Auth.saveFacebookUser(params);
          UserService.createPlayer(params)
            .then((response) => {
              Auth.authenticatePlayer(response.data.token);
              Auth.savePlayerInfo({
                name: params.name,
                email: params.email,
                id: response.data.id,
                role: response.data.role
              });
              history.replace("/");
            })
            .catch((err) => console.error("UserService error:", err));
        });
      } else {
        Auth.removeFacebookUser();
      }
    },
    [history]
  );

  useEffect(() => {
    if (window.FB) {
      // Render the FB button and subscribe to status changes
      window.FB.XFBML.parse();
      window.FB.Event.subscribe("auth.statusChange", onStatusChange);
    }

    // Cleanup subscription on unmount
    return () => {
      if (window.FB && window.FB.Event.unsubscribe) {
        window.FB.Event.unsubscribe("auth.statusChange", onStatusChange);
      }
    };
  }, [onStatusChange]);

  return (
    <FacebookLogin appId="401225480247747" onStatusChange={onStatusChange} ></FacebookLogin>
  );
}
