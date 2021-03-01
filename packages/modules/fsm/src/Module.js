import React, { useMemo, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch, useRouteMatch, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BackButton, Header, HomeLink, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

import NewApplicationCitizen from "./pages/citizen/NewApplication/index";
import SelectRating from "./pages/citizen/Rating/SelectRating";
import { MyApplications } from "./pages/citizen/MyApplications";
import ApplicationDetails from "./pages/citizen/ApplicationDetails";

import { NewApplication } from "./pages/employee/NewApplication";
import EmployeeApplicationDetails from "./pages/employee/ApplicationDetails";
import CollectPayment from "./pages/employee/CollectPayment";
import ApplicationAudit from "./pages/employee/ApplicationAudit";
import Response from "./pages/Response";
import EditApplication from "./pages/employee/EditApplication";
import Inbox from "./pages/employee/Inbox";
import FstpOperatorDetails from "./pages/employee/FstpOperatorDetails";
import DsoDashboard from "./pages/employee/DsoDashboard";

import SearchApplication from "./pages/employee/SearchApplication";
import FstpInbox from "./pages/employee/FstpInbox";

import SelectPropertySubtype from "./pageComponents/SelectPropertySubtype";
import SelectPropertyType from "./pageComponents/SelectPropertyType";
import SelectAddress from "./pageComponents/SelectAddress";
import SelectStreet from "./pageComponents/SelectStreet";
import SelectLandmark from "./pageComponents/SelectLandmark";
import SelectPincode from "./pageComponents/SelectPincode";
import SelectTankSize from "./pageComponents/SelectTankSize";
import SelectPitType from "./pageComponents/SelectPitType";
import SelectGeolocation from "./pageComponents/SelectGeolocation";
import SelectSlumName from "./pageComponents/SelectSlumName";
import CheckSlum from "./pageComponents/CheckSlum";
import FSMCard from "./components/FsmCard";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
  return (
    <div className="ground-container">
      <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
        <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
          {t("ES_COMMON_HOME")}
        </Link>{" "}
        / <span>{location.pathname === "/digit-ui/employee/fsm/inbox" ? "Applications" : "FSM"}</span>
      </p>
      <Switch>
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
      </Switch>
    </div>
  );
};

const CitizenApp = ({ path }) => {
  const location = useLocation();
  return (
    <React.Fragment>
      {!location.pathname.includes("/new-application/response") && <BackButton>Back</BackButton>}
      <Switch>
        {Digit.UserService.hasAccess("FSM_DSO") && <PrivateRoute path={`${path}/inbox`} component={() => <Inbox parentRoute={path} />} />}
        <PrivateRoute path={`${path}/new-application`} component={() => <NewApplicationCitizen parentRoute={path} />} />
        <PrivateRoute path={`${path}/my-applications`} component={MyApplications} />
        <PrivateRoute
          path={`${path}/application-details/:id`}
          component={Digit.UserService.hasAccess("FSM_DSO") ? <EmployeeApplicationDetails parentRoute={path} /> : ApplicationDetails}
        />
        <PrivateRoute path={`${path}/rate/:id`} component={() => <SelectRating parentRoute={path} />} />
        <PrivateRoute path={`${path}/response`} component={(props) => <Response parentRoute={path} {...props} />} />
        <PrivateRoute path={`${path}/dso-dashboard`} component={() => <DsoDashboard parentRoute={path} />} />
      </Switch>
    </React.Fragment>
  );
};

const FSMModule = ({ stateCode, userType }) => {
  const moduleCode = "FSM";
  const { path, url } = useRouteMatch();
  const state = useSelector((state) => state);
  const language = state?.common?.selectedLanguage;
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  const roleAccess = Digit.Hooks.useAccessControl();
  console.log("find route acccess here", roleAccess);

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

const FSMLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("FSM_CITIZEN_FILE_PROPERTY", {});

  useEffect(() => {
    clearParams();
  }, []);

  const roleBasedLoginRoutes = [
    {
      role: "FSM_DSO",
      from: "/digit-ui/citizen/fsm/dso-dashboard",
      dashoardLink: "CS_LINK_DSO_DASHBOARD",
      loginLink: "CS_LINK_LOGIN_DSO",
    },
  ];

  if (userType === "citizen") {
    return (
      <React.Fragment>
        {/* TODO: change */}
        <Header>{t("CS_HOME_FSM_SERVICES")}</Header>
        <div className="d-grid">
          <HomeLink to={`${matchPath}/new-application`}>{t("CS_HOME_APPLY_FOR_DESLUDGING")}</HomeLink>
          <HomeLink to={`${matchPath}/my-applications`}>{t("CS_HOME_MY_APPLICATIONS")}</HomeLink>
          {/* <HomeLink to={{ pathname: `/digit-ui/citizen/login`, state: { role: "FSM_DSO", from: "" } }}>{t("Login as DSO")}</HomeLink> */}
          {roleBasedLoginRoutes.map(({ role, from, loginLink, dashoardLink }, index) => {
            if (Digit.UserService.hasAccess(role)) {
              return (
                <HomeLink key={index} to={{ pathname: from }}>
                  {t(dashoardLink)}
                </HomeLink>
              );
            } else {
              return (
                <HomeLink key={index} to={{ pathname: `/digit-ui/citizen/login`, state: { role: "FSM_DSO", from } }}>
                  {t(loginLink)}
                </HomeLink>
              );
            }
          })}
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

const componentsToRegister = {
  SelectPropertySubtype,
  SelectPropertyType,
  SelectAddress,
  SelectStreet,
  SelectLandmark,
  SelectPincode,
  SelectTankSize,
  SelectPitType,
  SelectGeolocation,
  SelectSlumName,
  CheckSlum,
  FSMCard,
  FSMModule,
  FSMLinks,
};

export const initFSMComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
