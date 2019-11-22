import React from 'react';
import logo from './logo.svg';
import './App.css';
import CasoTable from './components/CasoTable';
import CasoContainer from './components/CasoContainer';
import { Navbar} from 'react-materialize';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";



function App() {
  return (
    <Router>
    <div className="App container">
    <Navbar className="green darken-1" brand={<span>Enarm Simulator</span>} centerLogo alignLinks="left">
    <Link to="/">Home</Link>
    <Link to="/caso/1">Caso Clinico</Link>
        <Link to="/dashboard">Admin</Link>
</Navbar>
     
      <Switch>
        <Route path="/casos/:page" component={CasoTable} />
        <Route path="/edit/caso/:identificador" component={CasoContainer} />
        <Route path="/" component={CasoTable} />
        </Switch>
      

    </div>
    </Router>
  );
}


 /**
  * <Navbar alignLinks="left">
<NavItem href="">
Home
</NavItem>
<NavItem href="components.html">
Caso Clinico
</NavItem>
<NavItem>
  Admin
</NavItem>
</Navbar>
      <CasoTable />
  */
export default App;
