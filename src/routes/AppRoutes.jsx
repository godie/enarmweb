import { Route, Redirect, Switch } from "react-router-dom";
import Auth from "../modules/Auth";
// ScrollToTop component (to be implemented in Phase 5)
// import { ScrollToTop } from "../components/custom";

// V2 Layout
import V2App from "../v2/layouts/V2App";

// Auth & Route Guards
import PrivateRoute from "./PrivateRoute";
import PlayerRoute from "../components/PlayerRoute";
import Logout, { AdminLogout } from "../components/Logout";

// V2 Public Pages
import V2Landing from "../v2/pages/V2Landing";
import V2Login from "../v2/pages/V2Login";
import V2Signup from "../v2/pages/V2Signup";
import V2ForgotPassword from "../v2/pages/V2ForgotPassword";

// V2 Player Pages
import V2PlayerDashboard from "../v2/pages/V2PlayerDashboard";
import V2Examen from "../v2/pages/V2Examen";
import V2Profile from "../v2/pages/V2Profile";
import V2PracticaLanding from "../v2/pages/V2PracticaLanding";
import V2Contribuir from "../v2/pages/V2Contribuir";
import V2MisContribuciones from "../v2/pages/V2MisContribuciones";
import V2Onboarding from "../v2/pages/V2Onboarding";
import V2MockExamSetup from "../v2/pages/V2MockExamSetup";
import V2SessionSummary from "../v2/pages/V2SessionSummary";
import V2NationalLeaderboard from "../v2/pages/V2NationalLeaderboard";
import V2ImageBank from "../v2/pages/V2ImageBank";
import V2FlashcardStudy from "../v2/pages/V2FlashcardStudy";
import V2KnowledgeBase from "../v2/pages/V2KnowledgeBase";
import V2ErrorReview from "../v2/pages/V2ErrorReview";
import V2PublicProfile from "../v2/pages/V2PublicProfile";
import V2Checkout from "../v2/pages/V2Checkout";
import V2CaseStudy from "../v2/pages/V2CaseStudy";
import V2DirectMessaging from "../v2/pages/V2DirectMessaging";
import V2SubscriptionManagement from "../v2/pages/V2SubscriptionManagement";
import V2CouponCenter from "../v2/pages/V2CouponCenter";
import V2FlashcardCreator from "../v2/pages/V2FlashcardCreator";
import V2AIFlashcardGenerator from "../v2/pages/V2AIFlashcardGenerator";

// V2 Admin Pages
import V2AdminDashboard from "../v2/pages/V2AdminDashboard";
import V2AdminUsers from "../v2/pages/V2AdminUsers";

// V1 Admin (temporary — will be migrated to V2 in Phase 5)
import App from "../App";
import Dashboard from "../components/admin/Dashboard";
import Summary from "../components/admin/Summary";
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
import FlashcardCreate from "../pages/Player/FlashcardCreate";
import AchievementTable from "../components/admin/AchievementTable";
import AchievementForm from "../components/admin/AchievementForm";
import { CustomButton } from "../components/custom";

/* ── V1 Admin Dashboard Wrappers (temporary) ────────────────────── */

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

/* ── Main Routes ────────────────────────────────────────────────── */

export default function AppRoutes() {
  return (
    <>
    <Switch>
      {/* ── Redirects from old /v2/ paths ── */}
      <Route path="/v2" exact><Redirect to="/dashboard" /></Route>
      <Route path="/v2/dashboard"><Redirect to="/dashboard" /></Route>
      <Route path="/v2/leaderboard"><Redirect to="/leaderboard" /></Route>
      <Route path="/v2/imagenes"><Redirect to="/imagenes" /></Route>
      <Route path="/v2/flashcards/repaso"><Redirect to="/flashcards/repaso" /></Route>
      <Route path="/v2/biblioteca"><Redirect to="/biblioteca" /></Route>
      <Route path="/v2/errores"><Redirect to="/errores" /></Route>
      <Route path="/v2/caso/:identificador" render={({ match }) => <Redirect to={`/caso/${match.params.identificador}`} />} />
      <Route path="/v2/perfil" exact><Redirect to="/perfil" /></Route>
      <Route path="/v2/practica"><Redirect to="/practica" /></Route>
      <Route path="/v2/contribuir"><Redirect to="/contribuir" /></Route>
      <Route path="/v2/mis-contribuciones"><Redirect to="/mis-contribuciones" /></Route>
      <Route path="/v2/onboarding"><Redirect to="/onboarding" /></Route>
      <Route path="/v2/simulacro/setup"><Redirect to="/simulacro/setup" /></Route>
      <Route path="/v2/simulacro/resumen"><Redirect to="/simulacro/resumen" /></Route>
      <Route path="/v2/perfil/publico/:userId" render={({ match }) => <Redirect to={`/perfil/publico/${match.params.userId}`} />} />
      <Route path="/v2/checkout"><Redirect to="/checkout" /></Route>
      <Route path="/v2/caso-estudio/:id" render={({ match }) => <Redirect to={`/caso-estudio/${match.params.id}`} />} />
      <Route path="/v2/mensajes"><Redirect to="/mensajes" /></Route>
      <Route path="/v2/suscripcion"><Redirect to="/suscripcion" /></Route>
      <Route path="/v2/cupones"><Redirect to="/cupones" /></Route>
      <Route path="/v2/flashcards/crear"><Redirect to="/flashcards/crear" /></Route>
      <Route path="/v2/flashcards/generar"><Redirect to="/flashcards/generar" /></Route>
      <Route path="/v2/admin" exact><Redirect to="/admin" /></Route>
      <Route path="/v2/admin/usuarios"><Redirect to="/admin/usuarios" /></Route>
      <Route path="/v2/landing"><Redirect to="/" /></Route>
      <Route path="/v2/login"><Redirect to="/login" /></Route>
      <Route path="/v2/signup"><Redirect to="/signup" /></Route>
      <Route path="/v2/forgot-password"><Redirect to="/forgot-password" /></Route>

      {/* ── Redirects from old V1 paths ── */}
      <Route path="/loginfb" exact><Redirect to="/login" /></Route>
      <Route path="/flashcards/nueva" exact><Redirect to="/flashcards/crear" /></Route>
      <Route path="/flashcards" exact><Redirect to="/flashcards/repaso" /></Route>
      <Route path="/especialidad/:id" render={({ match }) => <Redirect to={`/practica?especialidad=${match.params.id}`} />} />

      {/* ── Public Routes ── */}
      <Route path="/" exact render={() => Auth.isPlayerAuthenticated() ? <Redirect to="/dashboard" /> : <V2Landing />} />
      <Route path="/login" exact component={V2Login} />
      <Route path="/signup" exact component={V2Signup} />
      <Route path="/forgot-password" exact component={V2ForgotPassword} />
      <Route path="/logout" exact component={Logout} />

      {/* ── Player Protected Routes ── */}
      <PlayerRoute exact path="/dashboard" component={() => (<V2App><V2PlayerDashboard /></V2App>)} />
      <PlayerRoute path="/leaderboard" component={() => (<V2App><V2NationalLeaderboard /></V2App>)} />
      <PlayerRoute path="/imagenes" component={() => (<V2App><V2ImageBank /></V2App>)} />
      <PlayerRoute path="/flashcards/repaso" component={() => (<V2App><V2FlashcardStudy /></V2App>)} />
      <PlayerRoute path="/biblioteca" component={() => (<V2App><V2KnowledgeBase /></V2App>)} />
      <PlayerRoute path="/errores" component={() => (<V2App><V2ErrorReview /></V2App>)} />
      <PlayerRoute path="/caso/:identificador" component={() => (<V2App><V2Examen /></V2App>)} />
      <PlayerRoute exact path="/perfil" component={() => (<V2App><V2Profile /></V2App>)} />
      <PlayerRoute path="/practica" component={() => (<V2App><V2PracticaLanding /></V2App>)} />
      <PlayerRoute path="/contribuir" component={() => (<V2App><V2Contribuir /></V2App>)} />
      <PlayerRoute path="/mis-contribuciones" component={() => (<V2App><V2MisContribuciones /></V2App>)} />
      <PlayerRoute path="/onboarding" component={() => (<V2App><V2Onboarding /></V2App>)} />
      <PlayerRoute path="/simulacro/setup" component={() => (<V2App><V2MockExamSetup /></V2App>)} />
      <PlayerRoute path="/simulacro/resumen" component={() => (<V2App><V2SessionSummary /></V2App>)} />
      <PlayerRoute path="/perfil/publico/:userId" component={() => (<V2App><V2PublicProfile /></V2App>)} />
      <PlayerRoute path="/checkout" component={() => (<V2App><V2Checkout /></V2App>)} />
      <PlayerRoute path="/caso-estudio/:id" component={() => (<V2App><V2CaseStudy /></V2App>)} />
      <PlayerRoute path="/mensajes" component={() => (<V2App><V2DirectMessaging /></V2App>)} />
      <PlayerRoute path="/suscripcion" component={() => (<V2App><V2SubscriptionManagement /></V2App>)} />
      <PlayerRoute path="/cupones" component={() => (<V2App><V2CouponCenter /></V2App>)} />
      <PlayerRoute path="/flashcards/crear" component={() => (<V2App><V2FlashcardCreator /></V2App>)} />
      <PlayerRoute path="/flashcards/generar" component={() => (<V2App><V2AIFlashcardGenerator /></V2App>)} />

      {/* ── Admin Protected Routes (V2) ── */}
      {/* TODO (Phase 2): V2Login needs admin login support — currently uses loginPlayer() only */}
      <PrivateRoute path="/admin" exact component={() => (<V2App><V2AdminDashboard /></V2App>)} />
      <PrivateRoute path="/admin/usuarios" component={() => (<V2App><V2AdminUsers /></V2App>)} />
      <Route path="/dashboard/logout" exact component={AdminLogout} />

      {/* ── Admin Protected Routes (V1 — temporary until Phase 5) ── */}
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

      {/* ── Catch-all ── */}
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
    {/* <ScrollToTop /> - TODO: Add back when component is ready */}
    </>
  );
}
