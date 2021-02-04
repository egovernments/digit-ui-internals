import React from "react";
import { Header, Loader } from "@egovernments/digit-ui-react-components";
import MyApplication from "./MyApplication";
import { useTranslation } from "react-i18next";

export const MyApplications = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { info: userInfo } = Digit.UserService.getUser();

  const { isLoading, isError, error, data } = Digit.Hooks.fsm.useSearch(tenantId, { uuid: userInfo.uuid, limit: 100 });

  if (isLoading) {
    return <Loader />;
  }

  const { fsm: applicationsList } = data;

  return (
    <React.Fragment>
      <Header>{t("CS_TITLE_MY_APPLICATIONS")}</Header>
      {applicationsList?.length > 0 &&
        applicationsList.map((application, index) => (
          <div key={index}>
            <MyApplication application={application} />
          </div>
        ))}
    </React.Fragment>
  );
};
