import React from "react";
import Navi from "../Navi";
// import { SideNav, SideNavItem } from "react-materialize"; // Removed
import CustomSideNav from "../custom/CustomSideNav"; // Added
import CustomSideNavItem from "../custom/CustomSideNavItem"; // Added

export default function Dashboard(props){
    // The CustomNavbar inside Navi needs its sidenavTriggerId prop set to "admin-dashboard-sidenav"
    // for this SideNav to be triggered by the default menu icon in the navbar.
    // This change would need to be made in Navi.js or where Navi's CustomNavbar is configured.
    // For now, we ensure CustomSideNav has an ID.
    const sidenavId = "admin-dashboard-sidenav";

    return (
      <div className="dashboard">
        <header>
          <div className="navbar-fixed">
          <Navi /> {/* Ensure Navi's CustomNavbar data-target matches sidenavId */}
          </div>
          <CustomSideNav id={sidenavId} className="green darken-3 white-text">
            {/* Simplified userView representation */}
            <CustomSideNavItem>
              <div style={{ padding: '10px' }}> {/* Basic styling for user section */}
                {/* In a real scenario, you might have an image and more structure */}
                <span>Diego Mendoza</span>
              </div>
            </CustomSideNavItem>
            <CustomSideNavItem divider />
            <CustomSideNavItem href="#/dashboard/casos/1">Casos clinicos</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/especialidades">Especialidades</CustomSideNavItem>
            <CustomSideNavItem divider />
            <CustomSideNavItem href="#/dashboard/logout">Salir</CustomSideNavItem>
          </CustomSideNav>
        </header>
        <main>
        <div className="container">
          <div className="row">{props.children}</div>
        </div>
        </main>
      </div>
    );
  }


