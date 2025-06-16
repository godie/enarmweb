import React from "react";
import Auth from "../modules/Auth";

const Profile = () => {
  // Converted method. Note: This function is not called within the component's
  // lifecycle based on the original code. Its invocation would be external.
  const onStatusChange = (response) => {
    if (response.status === "connected") {
      // Logic for connected status (was empty in original)
    } else {
      Auth.removeFacebookUser();
      window.location.reload(); // This is generally an anti-pattern in React
    }
  };

  // Converted method. Also not called within this component's lifecycle.
  const logout = () => {
    // Empty as in original
  };

  let fbUser = { name: "", email: "" }; // Default user object
  if (Auth.isFacebookUser()) {
    const userStr = Auth.getFacebookUser();
    if (userStr) {
      try {
        fbUser = JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing Facebook user data from Auth module:", e);
        // fbUser remains as default { name: "", email: "" }
        // Optionally, could clear the invalid data from Auth here
        // Auth.removeFacebookUser();
        // window.location.reload(); // Or force a reload/re-login
      }
    }
  }

  return <div className="section center">Nombre:{fbUser.name}</div>;
};

export default Profile;

// WEBPACK FOOTER // (Removed as it's not part of the source code)
// ./src/components/Profile.js
