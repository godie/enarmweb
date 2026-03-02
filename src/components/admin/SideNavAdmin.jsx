import { useEffect } from "react";
import PropTypes from "prop-types";
import { Sidenav } from "@materializecss/materialize";
import { CustomSideNav, CustomSideNavItem } from "../custom"; // Added
const sidenavId = "admin-dashboard-sidenav";

const SideNavAdmin = ({ userName }) => {
    useEffect(() => {
        const sidenavElement = document.getElementById(sidenavId);
        if (!sidenavElement) return;

        const instance = Sidenav.getInstance(sidenavElement) || Sidenav.init(sidenavElement);
        instance.open();
    }, []);

    return (
        <CustomSideNav id={sidenavId} className="sidenav-fixed darken-4">
            <CustomSideNavItem subheader>
                <span className="white-text"> {userName ? userName : 'Admin'} Dashboard</span>
            </CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/" className="" icon="dashboard">Dashboard</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/casos/1" className="" icon="assignment">Casos clinicos</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/especialidades" className="" icon="local_hospital">Especialidades</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/examenes" className="" icon="library_books">Exámenes</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/players" className="" icon="group">Jugadores</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/questions" className="" icon="help">Preguntas</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/flashcards" className="" icon="style">Flashcards</CustomSideNavItem>
            <CustomSideNavItem href="#/dashboard/logros" className="" icon="emoji_events">Logros</CustomSideNavItem>
            <CustomSideNavItem divider />
            <CustomSideNavItem href="#/dashboard/logout" className="white-text">Salir</CustomSideNavItem>
        </CustomSideNav>
    )
}
SideNavAdmin.propTypes = {
    userName: PropTypes.string
}
export default SideNavAdmin