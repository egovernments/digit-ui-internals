import React, { useMemo, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch, useRouteMatch, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { BackButton, Header, HomeLink, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { getI18n } from "react-i18next";

import SelectRating from "./pages/citizen/Rating/SelectRating";
import FileComplaint from "./pages/citizen/FileComplaint/index";
import { NewApplication } from "./pages/employee/NewApplication";
import { MyApplications } from "./pages/citizen/MyApplications";
import ApplicationDetails from "./pages/citizen/ApplicationDetails";
import EmployeeApplicationDetails from "./pages/employee/ApplicationDetails";
import CollectPayment from "./pages/employee/CollectPayment";
import ApplicationAudit from "./pages/employee/ApplicationAudit";
import Response from "./pages/Response";
import EditApplication from "./pages/employee/EditApplication";
import Inbox from "./pages/employee/Inbox";
import FstpOperatorDetails from "./pages/employee/FstpOperatorDetails";
import FstpInbox from "./pages/employee/FstpInbox";
import SearchApplication from "./pages/employee/SearchApplication";

const EmployeeApp = ({ path, url, userType }) => {
  const location = useLocation();
  return (
    <Switch>
      <div className="ground-container">
        <p style={{ marginBottom: "24px" }}>
          <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
            Home
          </Link>{" "}
          / <span>{location.pathname === "/digit-ui/employee/fsm/inbox" ? "Applications" : "FSM"}</span>
        </p>
        <PrivateRoute exact path={`${path}/`} component={() => <FSMLinks matchPath={path} userType={userType} />} />
        <PrivateRoute path={`${path}/inbox`} component={() => <Inbox parentRoute={path} />} />
        <PrivateRoute path={`${path}/fstp-inbox`} component={() => <FstpInbox parentRoute={path} />} />
        <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
        <PrivateRoute path={`${path}/modify-application/:id`} component={() => <EditApplication />} />
        <PrivateRoute path={`${path}/application-details/:id`} component={() => <EmployeeApplicationDetails parentRoute={path} />} />
        <PrivateRoute path={`${path}/fstp-operator-details/:id`} component={FstpOperatorDetails} />
        <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/collect-payment`} component={() => <CollectPayment parentRoute={path} />} />
        <PrivateRoute path={`${path}/application-audit/:id`} component={() => <ApplicationAudit parentRoute={path} />} />
        <PrivateRoute path={`${path}/search`} component={() => <SearchApplication />} />
      </div>
    </Switch>
  );
};

const CitizenApp = ({ path }) => {
  const location = useLocation();
  return (
    <React.Fragment>
      {!location.pathname.includes("/new-application/response") && <BackButton>Back</BackButton>}
      <Switch>
        <PrivateRoute path={`${path}/new-application`} component={() => <FileComplaint parentRoute={path} />} />
        <PrivateRoute path={`${path}/my-applications`} component={MyApplications} />
        <PrivateRoute path={`${path}/application-details/:id`} component={ApplicationDetails} />
        <PrivateRoute path={`${path}/rate/:id`} component={() => <SelectRating parentRoute={path} />} />
        <PrivateRoute path={`${path}/response`} component={() => <Response parentRoute={path} />} />
      </Switch>
    </React.Fragment>
  );
};

export const FSMModule = ({ stateCode, userType }) => {
  const moduleCode = "FSM";
  const { path, url } = useRouteMatch();
  const state = useSelector((state) => state);
  const language = state?.common?.selectedLanguage;
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }

  console.log("fsm", userType, path, state, store);

  if (userType === "citizen") {
    return <CitizenApp path={path} />;
  } else {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  }
};

export const FSMLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("FSM_CITIZEN_FILE_PROPERTY", {});

  useEffect(() => {
    clearParams();
  }, []);

  if (userType === "citizen") {
    return (
      <React.Fragment>
        {/* TODO: change */}
        <Header>{t("CS_HOME_FSM_SERVICES")}</Header>
        <div className="d-flex">
          <HomeLink to={`${matchPath}/new-application`}>{t("CS_HOME_APPLY_FOR_DESLUDGING")}</HomeLink>
          <HomeLink to={`${matchPath}/my-applications`}>{t("CS_HOME_MY_APPLICATIONS")}</HomeLink>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <div className="employee-app-container">
        <div className="ground-container">
          <div className="employeeCard">
            <div className="complaint-links-container">
              <div className="header">
                <span className="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
                      fill="white"
                    ></path>
                  </svg>
                </span>
                <span className="text">{t("ES_TITLE_FSM")}</span>
              </div>
              <div className="body">
                <span className="link">
                  <Link to={`${matchPath}/inbox`}>{t("ES_TITLE_INBOX")}</Link>
                </span>
                <span className="link">
                  <Link to={`${matchPath}/new-application/`}>{t("ES_TITLE_NEW_DESULDGING_APPLICATION")}</Link>
                </span>
                {/* <span className="link">
                  <Link to={`${matchPath}/application-audit/`}>{t("ES_TITLE_APPLICATION_AUDIT")}</Link>
                </span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
