// src/routes/AppRoutes.js
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import App from "../App";
import Examen from "../components/Examen";
import CasoTable from "../components/CasoTable";
import CasoContainer from "../components/CasoContainer";
import { Dashboard } from "../components/admin";
import Login from "../components/Login";
import FacebookLoginContainer from "../components/facebook/FacebookLoginContainer";
import Profile from "../components/Profile";
import PrivateRoute from './PrivateRoute';
import FacebookRoute from "../components/facebook/FacebookRoute";
import Logout, {AdminLogout} from "../components/Logout";
import Especialidades from '../components/admin/Especialidades';
import { Button, Icon } from "react-materialize";
import EspecialidadForm from "../components/admin/EspecialidadForm";

function DashboardCases(props) {
  return (
    <Dashboard>
      <CasoTable {...props} />
      <Button
          href="#/dashboard/new/caso"
          className="red btn btn-large btn-floating fixed-action-btn direction-top active"
          node="a"
          tooltipOptions={{position:'top'}}
          icon={<Icon>add</Icon>}
          tooltip="Agregar nuevo caso"
         />
    </Dashboard>
  );
}

function DashboardEditCaso(props) {
  return (
    <Dashboard>
      <CasoContainer {...props} />
    </Dashboard>
  );
}

function DashboardEditEspecialidades(props){
  return(
    <Dashboard>
      <EspecialidadForm {...props} />
    </Dashboard>
  )
}

function DashboardEspecialidades(props){
  return (
    <Dashboard>
      <Especialidades {...props} />
      <Button
                      href="#/dashboard/new/especialidad"
                      className="red btn btn-large btn-floating fixed-action-btn direction-top active"
                      node="a"
                      tooltipOptions={{position:'top'}}
                      icon={<Icon>add</Icon>}
                      tooltip="Agregar especialidad"
                     />
    </Dashboard>
  );
}

function AppExamen(props){
  return(
    <App>
      <Examen {... props} />
    </App>
  )
}

export default function AppRoutes() {
  return (
    <Switch>
      {/* — Facebook login flow — */}
      <Route
        path="/loginfb"
        exact
        component={() => (
          <App>
            <FacebookLoginContainer />
          </App>
        )}
      />

      {/* — Login / Logout — */}
      <Route path="/admin" exact component={() => (<App><Login /></App>)} />
      <Route path="/logout" exact component={Logout} />
      <Route path="/dashboard/logout" exact component={AdminLogout} />

      {/* — Routes protected by Facebook “loginfb” — */}
      <FacebookRoute
        path="/"
        exact
        component={() => (
          <App>
            <Examen />
          </App>
        )}
      />
      <FacebookRoute
        path="/caso/:identificador"
        component={AppExamen}
      />
      <FacebookRoute
        path="/profile"
        component={() => (
          <App>
            <Profile />
          </App>
        )}
      />

      {/* — Routes protected by normal auth — */}
      <PrivateRoute
        path="/dashboard"
        exact
        component={DashboardCases}
      />
      <PrivateRoute
        path="/dashboard/casos/:page"
        exact
        component={DashboardCases}
      />
      <PrivateRoute
        path="/dashboard/edit/caso/:identificador"
        component={DashboardEditCaso}
      />
      <PrivateRoute
        path="/dashboard/new/caso"
        component={DashboardEditCaso}
      />

      <PrivateRoute path="/dashboard/especialidades" component={DashboardEspecialidades} />
      <PrivateRoute path="/dashboard/new/especialidad" component={DashboardEditEspecialidades} />
      <PrivateRoute path="/dashboard/edit/especialidad/:identificador" component={DashboardEditEspecialidades} />

      {/* — Fallback: cualquier otra ruta, redirige a “/” — */}
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
