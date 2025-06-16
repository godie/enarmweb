import React from "react";
import Navi from "./Navi";
import { SideNav, SideNavItem } from "react-materialize";

export default function Dashboard(props){
    return (
      <div className="dashboard">
        <header>
          <div className="navbar-fixed">
          <Navi />
          </div>
          <SideNav className="green darken-3 white-text">
            <SideNavItem userView user={{name: 'diego mendoza'}} />
            <SideNavItem href="#/dashboard/casos/1">Casos clinicos</SideNavItem>
            <SideNavItem href="#/dashboard/especialidades">Especialidades</SideNavItem>
          </SideNav>
        </header>
        <main>
        <div className="container">
          <div className="row">{props.children}</div>
        </div>
        </main>
      </div>
    );
  }


