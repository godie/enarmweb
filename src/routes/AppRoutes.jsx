import { Route, Redirect, Switch } from "react-router-dom";
import Auth from "../modules/Auth";
import { ScrollToTop } from "../components/custom";
import { CustomButton } from "../components/custom";

// Core Layout
import App from "../App";
import Dashboard from "../components/admin/Dashboard";
import Summary from "../components/admin/Summary";

// Admin Components
import CasoTable from "../components/admin/CasoTable";
import Especialidades from "../components/admin/Especialidades";
import EspecialidadForm from "../components/admin/EspecialidadForm";
import CasoContainer from "../components/admin/CasoContainer";
import UserTable from "../components/admin/UserTable";
import UserForm from "../components/admin/UserForm";
import ExamenTable from "../components/admin/ExamenTable";
import ExamenForm from "../components/admin/ExamenForm";
import QuestionTable from "../components/admin/QuestionTable";
import QuestionDetail from "../components/admin/QuestionDetail";
import FlashcardTable from "../components/admin/FlashcardTable";
import AchievementTable from "../components/admin/AchievementTable";
import AchievementForm from "../components/admin/AchievementForm";

// Auth & Infrastructure
import PrivateRoute from "./PrivateRoute";
import PlayerRoute from "../components/PlayerRoute";
import PlayerLogin from "../components/PlayerLogin";
import Logout, { AdminLogout } from "../components/Logout";
import Login from "../components/Login";
import Landing from "../components/Landing";

// Player V1 Pages
import PlayerDashboard from "../components/PlayerDashboard";
import PlayerCasoContainer from "../components/PlayerCasoContainer";
import Examen from "../components/Examen";
import MyContributions from "../pages/Player/MyContributions";
import Flashcards from "../pages/Player/Flashcards";
import FlashcardCreate from "../pages/Player/FlashcardCreate";
import Onboarding from "../components/Onboarding";
import Profile from "../components/Profile";
import EspecialidadCasos from "../pages/Player/EspecialidadCasos";

// V2 Pages
import V2App from "../v2/layouts/V2App";
import V2PlayerDashboard from "../v2/pages/V2PlayerDashboard";
import V2Examen from "../v2/pages/V2Examen";
import V2Profile from "../v2/pages/V2Profile";
import V2PracticaLanding from "../v2/pages/V2PracticaLanding";
import V2Contribuir from "../v2/pages/V2Contribuir";
import V2MisContribuciones from "../v2/pages/V2MisContribuciones";
import V2Onboarding from "../v2/pages/V2Onboarding";
import V2Landing from "../v2/pages/V2Landing";
import V2Login from "../v2/pages/V2Login";
import V2Signup from "../v2/pages/V2Signup";
import V2MockExamSetup from "../v2/pages/V2MockExamSetup";
import V2SessionSummary from "../v2/pages/V2SessionSummary";
import V2NationalLeaderboard from "../v2/pages/V2NationalLeaderboard";
import V2ImageBank from "../v2/pages/V2ImageBank";
import V2FlashcardStudy from "../v2/pages/V2FlashcardStudy";
import V2KnowledgeBase from "../v2/pages/V2KnowledgeBase";
import V2ErrorReview from "../v2/pages/V2ErrorReview";
import V2ForgotPassword from "../v2/pages/V2ForgotPassword";
import V2PublicProfile from "../v2/pages/V2PublicProfile";
import V2Checkout from "../v2/pages/V2Checkout";
import V2CaseStudy from "../v2/pages/V2CaseStudy";
import V2DirectMessaging from "../v2/pages/V2DirectMessaging";
import V2SubscriptionManagement from "../v2/pages/V2SubscriptionManagement";
import V2CouponCenter from "../v2/pages/V2CouponCenter";
import V2FlashcardCreator from "../v2/pages/V2FlashcardCreator";
import V2AIFlashcardGenerator from "../v2/pages/V2AIFlashcardGenerator";
import V2AdminDashboard from "../v2/pages/V2AdminDashboard";
import V2AdminUsers from "../v2/pages/V2AdminUsers";

function DashboardCases(props) {
  return (
    <Dashboard>
      <CasoTable {...props} />
      <CustomButton
        to="/dashboard/add/caso"
        className="red"
        large
        floating
        fab
        icon="add"
        tooltip={{ text: "Agregar Caso", position: 'top' }}
        waves="light"
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
        to="/dashboard/new/especialidad"
        className="red btn-large btn-floating direction-top active"
        node="a"
        fab
        icon="add"
        tooltip={{ text: "Agregar especialidad", position: 'top' }}
        waves="light"
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
        to="/dashboard/new/exam"
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

function DashboardFlashcards(props) {
  return (
    <Dashboard>
      <FlashcardTable {...props} />
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
{/* — V2 Routes — */}
      <Route path="/v2" exact>
        <Redirect to="/v2/dashboard" />
      </Route>
      <PlayerRoute path="/v2/dashboard" component={() => (<V2App><V2PlayerDashboard /></V2App>)} />
      <PlayerRoute path="/v2/leaderboard" component={() => (<V2App><V2NationalLeaderboard /></V2App>)} />
      <PlayerRoute path="/v2/imagenes" component={() => (<V2App><V2ImageBank /></V2App>)} />
      <PlayerRoute path="/v2/flashcards/repaso" component={() => (<V2App><V2FlashcardStudy /></V2App>)} />
      <PlayerRoute path="/v2/biblioteca" component={() => (<V2App><V2KnowledgeBase /></V2App>)} />
      <PlayerRoute path="/v2/errores" component={() => (<V2App><V2ErrorReview /></V2App>)} />
      <PlayerRoute path="/v2/caso/:identificador" component={() => (<V2App><V2Examen /></V2App>)} />
      <PlayerRoute exact path="/v2/perfil" component={() => (<V2App><V2Profile /></V2App>)} />
      <PlayerRoute path="/v2/practica" component={() => (<V2App><V2PracticaLanding /></V2App>)} />
      <PlayerRoute path="/v2/contribuir" component={() => (<V2App><V2Contribuir /></V2App>)} />
      <PlayerRoute path="/v2/mis-contribuciones" component={() => (<V2App><V2MisContribuciones /></V2App>)} />
      <PlayerRoute path="/v2/onboarding" component={() => (<V2App><V2Onboarding /></V2App>)} />
      <PlayerRoute path="/v2/simulacro/setup" component={() => (<V2App><V2MockExamSetup /></V2App>)} />
      <PlayerRoute path="/v2/simulacro/resumen" component={() => (<V2App><V2SessionSummary /></V2App>)} />
      <PlayerRoute path="/v2/perfil/publico/:userId" component={() => (<V2App><V2PublicProfile /></V2App>)} />
      <PlayerRoute path="/v2/checkout" component={() => (<V2App><V2Checkout /></V2App>)} />
      <PlayerRoute path="/v2/caso-estudio/:id" component={() => (<V2App><V2CaseStudy /></V2App>)} />
      <PlayerRoute path="/v2/mensajes" component={() => (<V2App><V2DirectMessaging /></V2App>)} />
      <PlayerRoute path="/v2/suscripcion" component={() => (<V2App><V2SubscriptionManagement /></V2App>)} />
      <PlayerRoute path="/v2/cupones" component={() => (<V2App><V2CouponCenter /></V2App>)} />
      <PlayerRoute path="/v2/flashcards/crear" component={() => (<V2App><V2FlashcardCreator /></V2App>)} />
      <PlayerRoute path="/v2/flashcards/generar" component={() => (<V2App><V2AIFlashcardGenerator /></V2App>)} />

      {/* — V2 Admin Routes — */}
      <PrivateRoute path="/v2/admin" exact component={() => (<V2App><V2AdminDashboard /></V2App>)} />
      <PrivateRoute path="/v2/admin/usuarios" component={() => (<V2App><V2AdminUsers /></V2App>)} />


      <Route path="/v2/landing" exact component={V2Landing} />
      <Route path="/v2/login" exact component={V2Login} />
      <Route path="/v2/signup" exact component={V2Signup} />
      <Route path="/v2/forgot-password" exact component={V2ForgotPassword} />

      <Route path="/login" exact component={() => <PlayerLogin />} />
      <Route
        path="/loginfb"
        exact
        component={() => (
          <Redirect to="/login" />
        )}
      />

      <Route path="/admin" exact component={() => (<App><Login /></App>)} />
      <Route path="/logout" exact component={Logout} />
      <Route path="/dashboard/logout" exact component={AdminLogout} />

      <Route path="/"
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
      <PlayerRoute path="/caso/:identificador" component={AppExamen} />
      <PlayerRoute path="/contribuir" component={() => (<App><PlayerCasoContainer /></App>)} />
      <PlayerRoute path="/mis-contribuciones" component={() => (<App><MyContributions /></App>)} />
      <PlayerRoute path="/flashcards/nueva" component={() => (<App><FlashcardCreate /></App>)} />
      <PlayerRoute path="/flashcards" component={() => (<App><Flashcards /></App>)} />
      <PlayerRoute path="/onboarding" component={() => (<App><Onboarding /></App>)} />
      <PlayerRoute path="/perfil" component={() => (<App><Profile /></App>)} />
      <PlayerRoute path="/especialidad/:id" component={(props) => (<App><EspecialidadCasos {...props} /></App>)} />

      <PrivateRoute path="/dashboard" exact component={DashBoardSummary} />
      <PrivateRoute path="/dashboard/casos/:page" exact component={DashboardCases} />
      <PrivateRoute path="/dashboard/edit/caso/:identificador" component={DashboardEditCaso} />
      <PrivateRoute path="/dashboard/new/caso" component={DashboardEditCaso} />
      <PrivateRoute path="/dashboard/add/caso" component={DashboardEditCaso} />

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
      <PrivateRoute path="/dashboard/flashcards/new" component={DashboardFlashcardsCreate} />
      <PrivateRoute path="/dashboard/examenes" component={DashboardExams} />
      <PrivateRoute path="/dashboard/logros" exact component={DashboardAchievements} />
      <PrivateRoute path="/dashboard/logros/new" component={DashboardAchievementCreate} />
      <PrivateRoute path="/dashboard/logros/edit/:id" component={DashboardAchievementEdit} />
      <PrivateRoute path="/dashboard/new/exam" component={DashboardEditExamen} />
      <PrivateRoute path="/dashboard/edit/exam/:identificador" component={DashboardEditExamen} />


            <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
    <ScrollToTop />
    </>
  );
}
