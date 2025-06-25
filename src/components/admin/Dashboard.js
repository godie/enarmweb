import React from "react";
import Navi from "../Navi";
import SideNavAdmin from './SideNavAdmin';

export default function Dashboard(props){
    // The CustomNavbar inside Navi needs its sidenavTriggerId prop set to "admin-dashboard-sidenav"
    // for this SideNav to be triggered by the default menu icon in the navbar.
    // This change would need to be made in Navi.js or where Navi's CustomNavbar is configured.
    // For now, we ensure CustomSideNav has an ID.
    <SideNavAdmin />

    return (
      <div className="dashboard">
        <header>
          <div className="navbar-fixed">
          <Navi /> {/* Ensure Navi's CustomNavbar data-target matches sidenavId */}
          </div>
          <SideNavAdmin />
        </header>
        <main>
        <div className="container">
          <div className="row white">{props.children}</div>
        </div>
        </main>
      </div>
    );
  }


