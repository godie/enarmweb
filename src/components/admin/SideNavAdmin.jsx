import React from "react";
import PropTypes from "prop-types";
import { CustomSideNav, CustomSideNavItem } from "../custom"; // Added
const sidenavId = "admin-dashboard-sidenav";

const SideNavAdmin = ({ userName }) => {
    return (
        <CustomSideNav id={sidenavId} className="sidenav-fixed darken-4">
            <CustomSideNavItem subheader>
                <span className="white-text">Admin Dashboard</span>
            </CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/" className="white-text" icon="dashboard">Dashboard</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/casos/1" className="white-text" icon="assignment">Casos clinicos</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/especialidades" className="white-text" icon="local_hospital">Especialidades</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/examenes" className="white-text" icon="library_books">Exámenes</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/players" className="white-text" icon="group">Jugadores</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/questions" className="white-text" icon="help">Preguntas</CustomSideNavItem>
            <CustomSideNavItem divider />
            <CustomSideNavItem href="#/dashboard/logout" className="white-text">Salir</CustomSideNavItem>
        </CustomSideNav>
    )
}
SideNavAdmin.propTypes = {
    userName: PropTypes.string
}
export default SideNavAdmin