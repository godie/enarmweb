// src/components/AnalyticsTracker.js
import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga";

ReactGA.initialize("UA-2989088-15");

function AnalyticsTracker({ location }) {
  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, [location]);

  return null;
}

export default withRouter(AnalyticsTracker);
