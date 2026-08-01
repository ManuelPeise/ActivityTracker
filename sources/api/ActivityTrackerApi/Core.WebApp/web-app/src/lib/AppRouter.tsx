import React from "react";
import SandBox from "../pages/sandbox/SandBox";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import { useAuth } from "../hooks/useAuth";
import LandingPage from "../pages/landingPage/LandingPage";
import HealthConnectContainer from "../pages/healthConnect/HealthConnectContainer";

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/health-connect"
              element={<HealthConnectContainer />}
            />
            <Route path="/sandbox" element={<SandBox />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
