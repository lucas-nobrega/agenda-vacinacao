import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.2.0";
import "./assets/css/main.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "./app/modules/home/componentes/Admin";
import store from "./configureStore";
const hist = createBrowserHistory();


ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <Router history={hist}>
        <Switch>
          <Route path="/agenda" render={(props) => <AdminLayout {...props} />} />
          <Redirect to="/agenda/pagina_inicial" />
        </Switch>
      </Router>
    </Provider>
  </React.Fragment>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
