import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginForm from "./components/Login";
import ReportsData from "./components/AnalyticsPage";
import UserForm from "./components/RegistrationForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataPage from "./components/Data";
import ForgotPasswordForm from "./components/ForgotPassword";
import ResetPasswordForm from "./components/ResetPassword";
import RolesPage from "./components/Roles";

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer />
    </AuthProvider>
  );
}

function AppContent() {
  const { isLoggedIn, userRole } = useAuth();

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/Login">
          <LoginForm />
        </Route>
        <Route path="/RegistrationForm">
          <UserForm />
        </Route>
        <Route path="/ForgotPassword">
          <ForgotPasswordForm />
        </Route>
        <Route path="/ResetPassword">
          <ResetPasswordForm />
        </Route>
        <Route path="/">
          {isLoggedIn ? (
            <Dashboard userRole={userRole} />
          ) : (
            <Redirect to="/Login" />
          )}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

function Dashboard({ userRole }) {
  return (
    <div>
      <Navbar />
      <div className="ml-0 mt-24 bg-blue-gray-900">
        <Switch>
          <Route exact path="/Dashboard">
            <Home />
          </Route>
          {userRole === "super-admin" && (
            <>
              <Route path="/Roles" component={RolesPage} />
              <Route path="/AnalyticsPage" component={ReportsData} />
              <Route path="/Data" component={DataPage} />
            </>
          )}
          {userRole === "admin" && (
            <>
              <Route path="/AnalyticsPage" component={ReportsData} />
            </>
          )}
          {userRole === "user" && (
            <>
            </>
          )}
          <Redirect to="/Dashboard" />
        </Switch>
      </div>
    </div>
  );
}

export default App;
