import { useEffect } from "react";
import V2Navi from "../components/V2Navi";
import "../styles/v2-theme.css";

const V2App = ({ children }) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('theme', savedTheme);
  }, []);

  return (
    <div className="v2-app-container">
      <V2Navi />
      <main className="v2-content-wrapper">
        {children}
      </main>
    </div>
  );
};

export default V2App;
