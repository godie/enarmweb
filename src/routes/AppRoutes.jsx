// src/routes/AppRoutes.js
import { Switch, Route, Redirect } from "react-router-dom";

import App from "../App";
import Examen from "../components/Examen";
import CasoTable from "../components/admin/CasoTable";
import { Dashboard, CasoContainer, Summary } from "../components/admin";
import Login from "../components/auth/Login";
import PlayerLogin from "../components/auth/PlayerLogin";
import Profile from "../components/Profile";
import PlayerCasoContainer from "../components/PlayerCasoContainer";
import PrivateRoute from './PrivateRoute';
import PlayerRoute from "../components/guards/PlayerRoute";
import Logout, { AdminLogout } from "../components/auth/Logout";
import Especialidades from '../components/admin/Especialidades';
import EspecialidadForm from "../components/admin/EspecialidadForm";
import UserTable from "../components/admin/UserTable";
import UserForm from "../components/admin/UserForm";
import QuestionTable from "../components/admin/QuestionTable";
import QuestionDetail from "../components/admin/QuestionDetail";
import FlashcardTable from "../components/admin/FlashcardTable";
import AchievementTable from "../components/admin/AchievementTable";
import AchievementForm from "../components/admin/AchievementForm";
import ExamenTable from "../components/admin/ExamenTable";
import ExamenForm from "../components/admin/ExamenForm";
import Onboarding from "../components/Onboarding";
import EspecialidadCasos from "../pages/Player/EspecialidadCasos";
import MyContributions from "../pages/Player/MyContributions";
import Flashcards from "../pages/Player/Flashcards";
import FlashcardCreate from "../pages/Player/FlashcardCreate";

import PlayerDashboard from "../components/PlayerDashboard";
import Landing from "../components/Landing";
import Auth from "../modules/Auth";
import { ScrollToTop } from "../components/custom";
import V2App from "../v2/layouts/V2App";
import V2PlayerDashboard from "../v2/pages/V2PlayerDashboard";
import V2Examen from "../v2/pages/V2Examen";
import V2Profile from "../v2/pages/V2Profile";

function DashboardCases(props) {
  return (
    <Dashboard>
      <CasoTable {...props} />
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

function DashboardUserCreate(props) {
  return (
    <Dashboard>
      <UserForm {...props} />
    </Dashboard>
  );
}

function DashboardQuestions(props) {
  return (
    <Dashboard>
      <QuestionTable {...props} />
    </Dashboard>
  );
}

function DashboardQuestionView(props) {
  return (
    <Dashboard>
      <QuestionDetail mode="view" {...props} />
    </Dashboard>
  );
}

function DashboardQuestionEdit(props) {
  return (
    <Dashboard>
      <QuestionDetail mode="edit" {...props} />
    </Dashboard>
  );
}

function DashboardQuestionCreate(props) {
  return (
    <Dashboard>
      <QuestionDetail mode="create" {...props} />
    </Dashboard>
  );
}

function DashboardExams(props) {
  return (
    <Dashboard>
      <ExamenTable {...props} />
    </Dashboard>
  );
}

function DashboardFlashcards(props) {
  return (
    <Dashboard>
      <FlashcardTable {...props} />
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

function DashboardFlashcardsCreate(props) {
  return (
    <Dashboard>
      <FlashcardCreate {...props} />
    </Dashboard>
  );
}

function DashboardAchievements(props) {
  return (
    <Dashboard>
      <AchievementTable {...props} />
    </Dashboard>
  );
}

function DashboardAchievementCreate(props) {
  return (
    <Dashboard>
      <AchievementForm {...props} />
    </Dashboard>
  );
}

function DashboardAchievementEdit(props) {
  return (
    <Dashboard>
      <AchievementForm {...props} />
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
    <>
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
        path="/flashcards/nueva"
        component={() => (
          <App>
            <FlashcardCreate />
          </App>
        )}
      />
      <PlayerRoute
        path="/flashcards"
        component={() => (
          <App>
            <Flashcards />
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

      <PrivateRoute path="/dashboard/players" exact component={DashboardUsers} />
      <PrivateRoute path="/dashboard/players/new" component={DashboardUserCreate} />
      <PrivateRoute path="/dashboard/questions" exact component={DashboardQuestions} />
      <PrivateRoute path="/dashboard/questions/new" component={DashboardQuestionCreate} />
      <PrivateRoute path="/dashboard/questions/:id/edit" component={DashboardQuestionEdit} />
      <PrivateRoute path="/dashboard/questions/:id" component={DashboardQuestionView} />
      <PrivateRoute path="/dashboard/flashcards" exact component={DashboardFlashcards} />
      <PrivateRoute path="/dashboard/examenes" component={DashboardExams} />
      <PrivateRoute path="/dashboard/new/exam" component={DashboardEditExamen} />
      <PrivateRoute path="/dashboard/edit/exam/:identificador" component={DashboardEditExamen} />
      <PrivateRoute path="/dashboard/flashcards/new" component={DashboardFlashcardsCreate} />
      <PrivateRoute path="/dashboard/logros" exact component={DashboardAchievements} />
      <PrivateRoute path="/dashboard/logros/new" component={DashboardAchievementCreate} />
      <PrivateRoute path="/dashboard/logros/edit/:id" component={DashboardAchievementEdit} />


      {/* — V2 Routes — */}
      <PlayerRoute
        path="/v2/dashboard"
        component={() => (
          <V2App>
            <V2PlayerDashboard />
          </V2App>
        )}
      />
      <PlayerRoute
        path="/v2/caso/:identificador"
        component={() => (
          <V2App>
            <V2Examen />
          </V2App>
        )}
      />
      <PlayerRoute
        path="/v2/perfil"
        component={() => (
          <V2App>
            <V2Profile />
          </V2App>
        )}
      />

      {/* — Fallback: cualquier otra ruta, redirige a “/” — */}
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
    <ScrollToTop />
    </>
  );
}
