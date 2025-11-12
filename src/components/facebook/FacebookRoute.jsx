// src/components/FacebookRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";
import Auth from "../../modules/Auth"; // ajusta la ruta si tu Auth está en otro sitio

const FacebookRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Auth.isFacebookUser() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/loginfb",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default FacebookRoute;
