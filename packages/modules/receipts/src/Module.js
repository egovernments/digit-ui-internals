import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, Switch, useLocation, useRouteMatch } from "react-router-dom";
import ReceiptsCard from "./receiptHomeCard";

export const ReceiptsModule = ({ stateCode, userType }) => {
  const moduleCode = "RECEIPTS";
  const state = useSelector((state) => state);
  const language = state?.common?.selectedLanguage;
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  const mobileView = innerWidth <= 640;
  const location = useLocation();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const inboxInitialState = {
    searchParams: {
      tenantId: tenantId,
    },
  };


  const { path, url } = useRouteMatch();

  if (userType === "employee") {
    return (
      <Switch>
        <React.Fragment>
          <div className="ground-container">
            <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
              <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
                {t("HR_COMMON_BUTTON_HOME")}
              </Link>{" "}
              / <span>{location.pathname === "/digit-ui/employee/hrms/inbox" ? t("HR_COMMON_HEADER") : t("HR_COMMON_HEADER")}</span>
            </p>
            <PrivateRoute
              path={`${path}/inbox`}
              component={() => (
                <div>Inbox of RECEIPTS</div>
              )}
            />
          </div>
        </React.Fragment>
      </Switch>
    );
  } else return null;
};

const componentsToRegister = {
  ReceiptsModule,
  ReceiptsCard,
};

export const initReceiptsComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
