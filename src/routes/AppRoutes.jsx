// src/routes/AppRoutes.js
import { Switch, Route, Redirect } from "react-router-dom";

import App from "../App";
import Examen from "../components/Examen";
import CasoTable from "../components/admin/CasoTable";
import { Dashboard, CasoContainer, Summary } from "../components/admin";
import Login from "../components/Login";
import PlayerLogin from "../components/PlayerLogin";
import Profile from "../components/Profile";
import PlayerCasoContainer from "../components/PlayerCasoContainer";
import PrivateRoute from './PrivateRoute';
import PlayerRoute from "../components/PlayerRoute";
import Logout, { AdminLogout } from "../components/Logout";
import Especialidades from '../components/admin/Especialidades';
// import { Button, Icon } from "react-materialize"; // Removed
import CustomButton from "../components/custom/CustomButton"; // Added
// CustomIcon is not directly used here if CustomButton handles the icon prop
import EspecialidadForm from "../components/admin/EspecialidadForm";
import UserTable from "../components/admin/UserTable";
import ExamenTable from "../components/admin/ExamenTable";
import ExamenForm from "../components/admin/ExamenForm";
import Onboarding from "../components/Onboarding";
import EspecialidadCasos from "../pages/Player/EspecialidadCasos";
import MyContributions from "../pages/Player/MyContributions";

import PlayerDashboard from "../components/PlayerDashboard";
import Landing from "../components/Landing";
import Auth from "../modules/Auth";

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

        tooltip={{ text: "Agregar Caso", position: 'top' }}
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

function DashboardEditEspecialidades() {
  return (
    <Dashboard>
      <EspecialidadForm />
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
        tooltip={{ text: "Agregar especialidad", position: 'top' }}
        waves="light" // Adding default waves
      />
    </Dashboard>
  );
}

function DashboardUsers(props) {
  return (
    <Dashboard>
      <UserTable {...props} />
    </Dashboard>
  );
}

function DashboardExams(props) {
  return (
    <Dashboard>
      <ExamenTable {...props} />
      <CustomButton
        href="#/dashboard/new/exam"
        className="red btn-large btn-floating direction-top active"
        node="a"
        fab
        icon="add"
        tooltip={{ text: "Agregar examen", position: 'top' }}
        waves="light"
      />
    </Dashboard>
  );
}

function DashboardEditExamen(props) {
  return (
    <Dashboard>
      <ExamenForm {...props} />
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
      {/* — Player login flow (no Navi, full-page green + card) — */}
      <Route path="/login" exact component={() => <PlayerLogin />} />
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

      {/* — Home: landing for guests (no Navi), dashboard for authenticated players — */}
      <Route
        path="/"
        exact
        render={() =>
          Auth.isPlayerAuthenticated() ? (
            <App>
              <PlayerDashboard />
            </App>
          ) : (
            <Landing />
          )
        }
      />
      <PlayerRoute
        path="/caso/:identificador"
        component={AppExamen}
      />
      <PlayerRoute
        path="/contribuir"
        component={() => (
          <App>
            <PlayerCasoContainer />
          </App>
        )}
      />
      <PlayerRoute
        path="/mis-contribuciones"
        component={() => (
          <App>
            <MyContributions />
          </App>
        )}
      />
      <PlayerRoute
        path="/onboarding"
        component={() => (
          <App>
            <Onboarding />
          </App>
        )}
      />
      <PlayerRoute
        path="/perfil"
        component={() => (
          <App>
            <Profile />
          </App>
        )}
      />
      <PlayerRoute
        path="/especialidad/:id"
        component={(props) => (
          <App>
            <EspecialidadCasos {...props} />
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
        component={DashboardEditCaso}
      />

      <PrivateRoute path="/dashboard/especialidades" component={DashboardEspecialidades} />
      <PrivateRoute path="/dashboard/new/especialidad" component={DashboardEditEspecialidades} />
      <PrivateRoute path="/dashboard/edit/especialidad/:identificador" component={DashboardEditEspecialidades} />

      <PrivateRoute path="/dashboard/players" component={DashboardUsers} />
      <PrivateRoute path="/dashboard/examenes" component={DashboardExams} />
      <PrivateRoute path="/dashboard/new/exam" component={DashboardEditExamen} />
      <PrivateRoute path="/dashboard/edit/exam/:identificador" component={DashboardEditExamen} />

      {/* — Fallback: cualquier otra ruta, redirige a “/” — */}
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
