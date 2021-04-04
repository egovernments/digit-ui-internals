import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const PTApplication = ({ application }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <KeyNote keyValue={t("PT_APPLICATION_NO_LABEL")} note={application.acknowldgementNumber} />
      <KeyNote keyValue={t("PT_APPLICATION_CATEGORY")} note={t("PROPERTY_TAX")} />
      <KeyNote keyValue={t("PT_SEARCHPROPERTY_TABEL_PTUID")} note={application.propertyId} />
      <KeyNote keyValue={t("PT_COMMON_TABLE_COL_APP_TYPE")} note={(application?.creationReason && t(`PT.${application.creationReason}`)) || "NA"} />
      <KeyNote keyValue={t("PT_COMMON_TABLE_COL_STATUS_LABEL")} note={t(application.status)} />
      <Link to={`/digit-ui/citizen/pt/property/application/${application.acknowldgementNumber}`}>
        <SubmitBar label={t("PT_MY_APPLICATION_TRACK")} />
      </Link>
    </Card>
  );
};

export default PTApplication;
