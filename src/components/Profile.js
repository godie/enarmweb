import React from "react";
import Auth from "../modules/Auth";
class Profile extends React.Component {
  onStatusChange(response) {
    if (response.status === "connected") {
    } else {
      Auth.removeFacebookUser();
      window.location.reload();
    }
  }

  logout() {}

  render() {
    let fbUser = { name: "", email: "" };
    if (Auth.isFacebookUser()) {
      fbUser = JSON.parse(Auth.getFacebookUser());
    }
    return <div className="section center">Nombre:{fbUser.name}</div>;
  }
}

export default Profile;

// WEBPACK FOOTER //
// ./src/components/Profile.js
