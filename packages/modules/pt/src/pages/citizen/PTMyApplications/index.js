import { Header, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PTApplication from "./pt-application";
import { propertyCardBodyStyle } from "../../../utils";

export const PTMyApplications = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  let filter = window.location.href.split("/").pop();
  let filter1 =
    filter === "limit:50" ? { limit: "50", sortOrder: "ASC", sortBy: "createdTime" } : { limit: "4", sortOrder: "ASC", sortBy: "createdTime" };

  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch({ filters: filter1 }, { filters: filter1 });
  if (isLoading) {
    return <Loader />;
  }

  const { Properties: applicationsList } = data || {};

  return (
    <React.Fragment>
      <Header>{t("CS_TITLE_MY_APPLICATIONS")}</Header>
      <div style={{ ...propertyCardBodyStyle, maxHeight: "calc(100vh - 14em)" }}>
        {applicationsList?.length > 0 &&
          applicationsList.map((application, index) => (
            <div key={index}>
              <PTApplication application={application} />
            </div>
          ))}
        {!applicationsList?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("PT_NO_APPLICATION_FOUND_MSG")}</p>}

        {filter !== "limit:50" && (
          <div>
            <p style={{ marginLeft: "16px", marginTop: "16px" }}>
              {t("PT_LOAD_MORE_MSG")}{" "}
              <span className="link">
                <Link to="/digit-ui/citizen/pt/property/my-applications/limit:50">{t("PT_COMMON_CLICK_HERE")}</Link>
              </span>
            </p>
          </div>
        )}
      </div>

      <p style={{ marginLeft: "16px", marginTop: "16px" }}>
        {t("PT_TEXT_NOT_ABLE_TO_FIND_THE_APPLICATION")}{" "}
        <span className="link" style={{ display: "block" }}>
          <Link to="/digit-ui/citizen/pt/property/new-application/info">{t("PT_COMMON_CLICK_HERE_TO_REGISTER_NEW_PROPERTY")}</Link>
        </span>
      </p>
    </React.Fragment>
  );
};
