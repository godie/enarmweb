import React from "react";
import { Route, Redirect } from "react-router-dom";
import Auth from "../modules/Auth"; // ajusta la ruta si tu Auth está en otro sitio

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Auth.isUserAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/admin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
