import React from "react";
import { Switch, useLocation, Link } from "react-router-dom";
import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Inbox from "./Inbox";
import NewApplication from "./NewApplication";
import Search from "./Search";
import Response from "../Response";
import ApplicationDetails from "./ApplicationDetails";
import ReNewApplication from "./ReNewApplication";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
            <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("ES_COMMON_HOME")}
            </Link>{" "}
            / <span>{location.pathname === "/digit-ui/employee/tl/inbox" ? t("ES_COMMON_INBOX") : ""}</span>
          </p>
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => (
              <Inbox parentRoute={path} businessService="TL" filterComponent="TL_INBOX_FILTER" initialStates={{}} isInbox={true} />
            )}
          />
          <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
          <PrivateRoute path={`${path}/application-details/:id`} component={() => <ApplicationDetails parentRoute={path} />} />
          <PrivateRoute path={`${path}/renew-application-details/:id`} component={(props) => <ReNewApplication {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/search/:variant`} component={(props) => <Search {...props} parentRoute={path} />} />
          
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
