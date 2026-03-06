import PropTypes from "prop-types";
import { CustomSideNav, CustomSideNavItem } from "../custom"; // Added
const sidenavId = "admin-dashboard-sidenav";

const SideNavAdmin = ({ userName }) => {
    return (
        <CustomSideNav id={sidenavId} className="sidenav-fixed darken-4">
            <CustomSideNavItem subheader>
                <span className="white-text"> {userName ? userName : 'Admin'} Dashboard</span>
            </CustomSideNavItem>
            <CustomSideNavItem to="/dashboard/" className="" icon="dashboard">Dashboard</CustomSideNavItem>
            <CustomSideNavItem to="/dashboard/casos/1" className="" icon="assignment">Casos clinicos</CustomSideNavItem>
            <CustomSideNavItem to="/dashboard/especialidades" className="" icon="local_hospital">Especialidades</CustomSideNavItem>
            <CustomSideNavItem to="/dashboard/examenes" className="" icon="library_books">Exámenes</CustomSideNavItem>
            <CustomSideNavItem to="/dashboard/players" className="" icon="group">Jugadores</CustomSideNavItem>
            <CustomSideNavItem to="/dashboard/questions" className="" icon="help">Preguntas</CustomSideNavItem>
            <CustomSideNavItem to="/dashboard/flashcards" className="" icon="style">Flashcards</CustomSideNavItem>
            <CustomSideNavItem to="/dashboard/logros" className="" icon="emoji_events">Logros</CustomSideNavItem>
            <CustomSideNavItem divider />
            <CustomSideNavItem to="/dashboard/logout" className="white-text">Salir</CustomSideNavItem>
        </CustomSideNav>
    )
}
SideNavAdmin.propTypes = {
    userName: PropTypes.string
}
export default SideNavAdmin