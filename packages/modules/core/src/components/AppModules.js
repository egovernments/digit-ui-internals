import React, { useContext, useEffect } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import { AppHome } from "./Home";
import Login from "../pages/citizen/Login";
import EmployeeLogin from "../pages/employee/login/index";
import ForgotPassword from "../pages/employee/ForgotPassword/index";

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes.map((item) => item.code).includes(tenant.code));
};

export const AppModules = ({ stateCode, userType, modules, appTenants }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const { path } = useRouteMatch();
  const registry = useContext(ComponentProvider);

  const appRoutes = modules.map(({ code, tenants }, index) => {
    const Module = registry.getComponent(`${code}Module`);
    return (
      <Route key={index} path={`${path}/${code.toLowerCase()}`}>
        <Module stateCode={stateCode} moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />
      </Route>
    );
  });

  return (
    <Switch>
      {appRoutes}
      <Route path={`${path}/login`}>{userType === "citizen" ? <Login stateCode={stateCode} /> : <EmployeeLogin />}</Route>
      <Route path={`${path}/forgot-password`}>{userType === "citizen" ? null : <ForgotPassword />}</Route>
      <Route>
        <AppHome userType={userType} modules={modules} />
      </Route>
    </Switch>
  );
};
