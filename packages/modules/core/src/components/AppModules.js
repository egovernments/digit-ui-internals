import React, { useContext, useEffect } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import { AppHome } from "./Home";
import Login from "../pages/citizen/Login";

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
      {userType === "citizen" && (
        <Route path={`${path}/register`}>
          <Login stateCode={stateCode} isUserRegistered={false} />
        </Route>
      )}
      {userType === "citizen" && (
        <Route path={`${path}/login`}>
          <Login stateCode={stateCode} isUserRegistered={true} />
        </Route>
      )}
      <Route>
        <AppHome userType={userType} modules={modules} />
      </Route>
    </Switch>
  );
};
