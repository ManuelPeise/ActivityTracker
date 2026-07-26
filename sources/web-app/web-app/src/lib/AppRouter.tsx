import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import { useAuth } from "../hooks/useAuth";
import LandingPage from "../pages/landingPage/LandingPage";
import Interface from "../pages/interfaces/Interface";

const UnauthenticatedRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={HomePage} />
      </Routes>
    </Router>
  );
};

const AuthenticatedRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={LandingPage} />
        <Route path="/connections" Component={Interface} />
      </Routes>
    </Router>
  );
};

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AuthenticatedRouter /> : <UnauthenticatedRouter />;
};

export default AppRouter;
