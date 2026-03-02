import { useHistory } from "react-router-dom";
import Navi from "../layout/Navi";
import SideNavAdmin from './SideNavAdmin';
import { CustomButton } from "../custom";

export default function Dashboard(props) {
  const history = useHistory();
  const showSideNav = true;

  return (
    <div className="dashboard">
      <header>
        <div className="navbar-fixed">
          <Navi sidenavTriggerId="admin-dashboard-sidenav" showSidenavTrigger={showSideNav} />
        </div>
        {showSideNav && <SideNavAdmin />}
      </header>
      <main className="main-content">
        <div className="dashboard-content">
          <div className="row" style={{ marginBottom: "0.5rem" }}>
            <div className="col s12">
              <CustomButton
                flat
                className="green-text text-darken-2"
                icon="arrow_back"
                onClick={() => history.goBack()}
              >
                Atrás
              </CustomButton>
              
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              {props.children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
