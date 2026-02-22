import { useEffect } from "react";
import "./App.css";
import "./theme.css";
import Navi from "./components/Navi";
import Auth from "./modules/Auth";

const App = ({ children }) => {
  useEffect(() => {
    const user = Auth.getUserInfo();
    const savedTheme = localStorage.getItem('theme');
    const prefTheme = user?.preferences?.theme;

    const themeToApply = prefTheme || savedTheme;
    if (themeToApply) {
      document.documentElement.setAttribute('theme', themeToApply);
      if (!savedTheme) localStorage.setItem('theme', themeToApply);
    }
  }, []);

  return (
    <div className="App">
      <Navi />
      <div className="container">
        {children}
      </div>
    </div>
  );
};

export default App;
