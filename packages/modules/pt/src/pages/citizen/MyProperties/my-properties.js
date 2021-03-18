import React from "react";
import { useTranslation } from "react-i18next";
import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const MyProperty = ({ application }) => {
  const { t } = useTranslation();
  const address = application?.address;
  const owners = application?.owners;
  return (
    <Card>
      <KeyNote keyValue={t("PT_COMMON_TABLE_COL_PT_ID")} note={application.propertyId} />
      <KeyNote
        keyValue={t("PT_COMMON_TABLE_COL_OWNER_NAME")}
        note={owners.map((owners, index) => (
          <div key="index">{index == owners.length - 1 ? owners?.name + "," : owners.name}</div>
        ))}
      />
      <KeyNote
        keyValue={t("PT_COMMON_COL_ADDRESS")}
        note={
          `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
            address?.landmark ? `${address?.landmark}, ` : ""
          }${t(address?.locality.name)}, ${t(address?.city)},${t(address?.pincode) ? `${address.pincode}` : " "}` || "CS_APPLICATION_TYPE_PT"
        }
      />
      <KeyNote keyValue={t("PT_COMMON_TABLE_COL_STATUS_LABEL")} note={t("PT_COMMON_" + application.status)} />
      <Link /* to={`/digit-ui/citizen/pt/property/application/${application.acknowldgementNumber}`} */>
        <SubmitBar label={t("PT_VIEW_DETAILS")} />
      </Link>
    </Card>
  );
};

export default MyProperty;
