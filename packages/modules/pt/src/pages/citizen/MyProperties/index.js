import { Card, CardSubHeader, CardText, Header, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MyProperty from "./my-properties";
import { propertyCardBodyStyle } from "../../../utils";

export const MyProperties = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch({ tenantId });

  if (isLoading) {
    return <Loader />;
  }

  const { Properties: applicationsList } = data || {};

  return (
    <React.Fragment>
      <Header>{t("PT_MY_PROPERTIES_HEADER")}</Header>
      <div style={{ ...propertyCardBodyStyle, maxHeight: "calc(100vh - 14em)" }}>
        {applicationsList?.length > 0 &&
          applicationsList.map((application, index) => (
            <div key={index}>
              <MyProperty application={application} />
            </div>
          ))}
        {!applicationsList?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("PT_NO_PROP_FOUND_MSG")}</p>}

      </div>
      <p style={{ marginLeft: "16px", marginTop: "16px" }}>
          {t("PT_TEXT_NOT_ABLE_TO_FIND_THE_PROPERTY")}{" "}
          <span className="link">
            <Link to="/digit-ui/citizen/pt/property/new-application/info">{t("PT_COMMON_CLICK_HERE_TO_REGISTER_NEW_PROPERTY")}</Link>
          </span>
        </p>
    </React.Fragment>
  );
};
