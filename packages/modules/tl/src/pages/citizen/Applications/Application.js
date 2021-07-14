import { Card, Header, KeyNote, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const MyApplications = () => {
  const { t } = useTranslation();
  const { isLoading, isError, data, error, ...rest } = Digit.Hooks.tl.useTLSearchApplication({});
  if (isLoading) {
    return <Loader />;
  }
  return (
    <React.Fragment>
      <Header>{`${t("TL_MY_APPLICATIONS_HEADER")}`}</Header>
      {data?.map((application) => {
        return (
          <div>
            <Card>
              <KeyNote keyValue={t("TL_COMMON_TABLE_COL_APP_NO")} note={application?.applicationNumber} />
              <KeyNote keyValue={t("TL_APPLICATION_CATEGORY")} note={t("ACTION_TEST_TRADE_LICENSE")} />
              <KeyNote keyValue={t("TL_COMMON_TABLE_COL_OWN_NAME")} note={application?.tradeLicenseDetail.owners.map((ele) => ele?.name)} />
              <KeyNote keyValue={t("TL_COMMON_TABLE_COL_STATUS")} note={t(`WF_NEWTL_${application?.status}`)} />
              <KeyNote keyValue={t("TL_COMMON_TABLE_COL_SLA_NAME")} note={`${application?.SLA / (1000 * 60 * 60 * 24)} Days`} />
              <KeyNote keyValue={t("TL_COMMON_TABLE_COL_TRD_NAME")} note={application?.tradeName} />
              <Link to={`/digit-ui/citizen/tl/tradelicence/application/${application?.applicationNumber}/${application.tenantId}`}>
                <SubmitBar label={t(application?.status != "PENDINGPAYMENT" ? "TL_VIEW_DETAILS" : "TL_VIEW_DETAILS_PAY")} />
              </Link>{" "}
            </Card>
          </div>
        );
      })}
    </React.Fragment>
  );
};
export default MyApplications;
