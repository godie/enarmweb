import React from "react";
import "./App.css";
import "./theme.css";
import Navi from "./components/Navi";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  render() {
    return (
      <div className="App container">
        <Navi />
        {this.props.children}
      </div>
    );
  }
}
export default App;
