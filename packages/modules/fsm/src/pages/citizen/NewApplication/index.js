import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { newConfig } from "../../../config/NewApplication/config";
import CheckPage from "./CheckPage";
import Response from "./Response";
import { useQueryClient } from "react-query";

const FileComplaint = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  let config = [];
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("FSM_CITIZEN_FILE_PROPERTY", {});

  const goNext = (skipStep) => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = config.find((routeObj) => routeObj.route === currentPath);
    let redirectWithHistory = history.push;
    if (skipStep) {
      redirectWithHistory = history.replace;
    }
    if (nextStep === null) {
      return redirectWithHistory(`${parentRoute}/new-application/check`);
    }
    redirectWithHistory(`${match.path}/${nextStep}`);
  };

  const submitComplaint = async () => {
    history.push(`${parentRoute}/new-application/response`);
  };

  function handleSelect(key, data, skipStep) {
    console.log("find saving data here", key, data, params);
    setParams({ ...params, ...{ [key]: { ...params[key], ...data } }, ...{ source: "ONLINE" } });
    goNext(skipStep);
  }

  const handleSkip = () => {};

  const handleSUccess = () => {
    clearParams();
    queryClient.invalidateQueries("FSM_CITIZEN_SEARCH");
  };
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "property-type";
  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${match.path}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} />
          </Route>
        );
      })}
      <Route path={`${match.path}/check`}>
        <CheckPage onSubmit={submitComplaint} value={params} />
      </Route>
      <Route path={`${match.path}/response`}>
        <Response data={params} onSuccess={handleSUccess} />
      </Route>
      <Route>
        <Redirect to={`${match.path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default FileComplaint;
