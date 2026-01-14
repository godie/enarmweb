// src/routes/AppRoutes.js
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import App from "../App";
import Examen from "../components/Examen";
import CasoTable from "../components/admin/CasoTable";
import CasoContainer from "../components/admin/CasoContainer";
import { Dashboard, CasoNuevo, Summary } from "../components/admin";
import Login from "../components/Login";
import PlayerLogin from "../components/PlayerLogin";
import FacebookLoginContainer from "../components/facebook/FacebookLoginContainer";
import Profile from "../components/Profile";
import PrivateRoute from './PrivateRoute';
import PlayerRoute from "../components/PlayerRoute";
import Logout, { AdminLogout } from "../components/Logout";
import Especialidades from '../components/admin/Especialidades';
// import { Button, Icon } from "react-materialize"; // Removed
import CustomButton from "../components/custom/CustomButton"; // Added
// CustomIcon is not directly used here if CustomButton handles the icon prop
import EspecialidadForm from "../components/admin/EspecialidadForm";

function DashboardCases(props) {
  return (
    <Dashboard>
      <CasoTable {...props} />
      <CustomButton
        href="#/dashboard/add/caso"
        className="red" // Ensured btn-large and btn-floating are here
        large
        floating
        fab
        // tooltipOptions prop is not standard, tooltip text is passed directly
        // For position, CustomButton would need a new prop e.g. tooltipPosition="top"
        // For now, CustomButton's default tooltip position will be used.
        icon="add"

        tooltip={{ html: "Agregar Caso", position: 'top' }}
        waves="light" // Adding default waves
      />
    </Dashboard>
  );
}

function DashBoardSummary(props) {
  return (
    <Dashboard>
      <Summary {...props} />
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

function DashboardEditEspecialidades(props) {
  return (
    <Dashboard>
      <EspecialidadForm {...props} />
    </Dashboard>
  )
}

function DashboardEspecialidades(props) {
  return (
    <Dashboard>
      <Especialidades {...props} />
      <CustomButton
        href="#/dashboard/new/especialidad"
        className="red btn-large btn-floating direction-top active" // Ensured
        node="a"
        fab
        // tooltipOptions={{position:'top'}} // See comment above
        icon="add"
        tooltip={{ html: "Agregar especialidad", position: 'top' }}
        waves="light" // Adding default waves
      />
    </Dashboard>
  );
}

function DashboardNuevoCaso(props) {
  return (
    <Dashboard>
      <CasoNuevo {...props} />
    </Dashboard>
  );
}

function AppExamen(props) {
  return (
    <App>
      <Examen {...props} />
    </App>
  )
}

export default function AppRoutes() {
  return (
    <Switch>
      {/* — Player login flow — */}
      <Route
        path="/login"
        exact
        component={() => (
          <App>
            <PlayerLogin />
          </App>
        )}
      />
      <Route
        path="/loginfb"
        exact
        component={() => (
          <Redirect to="/login" />
        )}
      />

      {/* — Login / Logout — */}
      <Route path="/admin" exact component={() => (<App><Login /></App>)} />
      <Route path="/logout" exact component={Logout} />
      <Route path="/dashboard/logout" exact component={AdminLogout} />

      {/* — Routes protected by PlayerRoute — */}
      <PlayerRoute
        path="/"
        exact
        component={() => (
          <App>
            <Examen />
          </App>
        )}
      />
      <PlayerRoute
        path="/caso/:identificador"
        component={AppExamen}
      />
      <PlayerRoute
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
        component={DashBoardSummary}
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
      <PrivateRoute
        path="/dashboard/add/caso"
        component={DashboardNuevoCaso}
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
