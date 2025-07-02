import React from "react";
import PropTypes from "prop-types";
import {CustomSideNav , CustomSideNavItem} from "../custom"; // Added
const sidenavId = "admin-dashboard-sidenav";


 const SideNavAdmin = ({userName}) => {
    return(
    <CustomSideNav id={sidenavId} className="green sidenav-fixed darken-3">
        <CustomSideNavItem className="pink-text" >
            <div style={{ padding: '10px' }}> {/* Basic styling for user section */}
                <span>{userName}</span>
            </div>
            </CustomSideNavItem>
            <CustomSideNavItem divider />
            <CustomSideNavItem href="#/dashboard/casos/1" className="white-text">Casos clinicos</CustomSideNavItem>
            <CustomSideNavItem href="#/admin/questions" className="white-text">Preguntas</CustomSideNavItem>
            <CustomSideNavItem href="#/admin/exams" className="white-text">Exámenes</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/especialidades" className="white-text">Especialidades</CustomSideNavItem>
            <CustomSideNavItem divider />
            <CustomSideNavItem href="#/dashboard/logout" className="white-text">Salir</CustomSideNavItem>
        </CustomSideNav>
        )
}
SideNavAdmin.propTypes = {
    userName: PropTypes.string
}
export default SideNavAdmin