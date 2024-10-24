import {
  BrowserRouter as Route,
  Switch,
} from "react-router-dom/cjs/react-router-dom.min";
import Dashboard from "./Dashboard";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom";
import ReportsData from "./AnalyticsPage";
import RolesPage from "./Roles";
// import LoginForm from "./loginUsers";

const Home = () => {
  return (
    <div>
      <BrowserRouter>
        <div className="">
          <Switch>
            {/* <Route exact path="/loginUsers">
                <LoginForm />
              </Route> */}

            <Route path="/Roles">
              <RolesPage />
            </Route>
            <Route path="/Dashboard">
              <Dashboard />
            </Route>
            <Route path="/AnalyticsPage">
              <ReportsData />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Home;
