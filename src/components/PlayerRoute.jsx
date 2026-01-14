import React from "react";
import { Route, Redirect } from "react-router-dom";
import Auth from "../modules/Auth";

const PlayerRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      Auth.isPlayerAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default PlayerRoute;
