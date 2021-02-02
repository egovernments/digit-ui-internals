import { Card } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { ApplicationCard } from "./inbox/ApplicationCard";
import ApplicationLinks from "./inbox/ApplicationLinks";

const GetSlaCell = (value) => {
  return value < 0 ? (
    <span style={{ color: "#D4351C", backgroundColor: "rgba(212, 53, 28, 0.12)", padding: "0 24px", borderRadius: "11px" }}>{value}</span>
  ) : (
    <span style={{ color: "#00703C", backgroundColor: "rgba(0, 112, 60, 0.12)", padding: "0 24px", borderRadius: "11px" }}>{value}</span>
  );
};

const GetCell = (value) => <span style={{ color: "#505A5F" }}>{value}</span>;

const MobileInbox = ({ data, onFilterChange, onSearch }) => {
  const { t } = useTranslation();
  const localizedData = data?.map(({ locality, applicationNo, createdTime, tenantId, status, sla }) => ({
    [t("ES_INBOX_APPLICATION_NO")]: applicationNo,
    [t("ES_INBOX_APPLICATION_DATE")]: `${createdTime.getDate()}/${createdTime.getMonth() + 1}/${createdTime.getFullYear()}`,
    [t("ES_INBOX_LOCALITY")]: GetCell(t(Digit.Utils.locale.getLocalityCode(locality, tenantId))),
    [t("ES_INBOX_STATUS")]: GetCell(t(`CS_COMMON_${status}`)),
    [t("ES_INBOX_SLA_DAYS_REMAINING")]: GetSlaCell(sla),
  }));

  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          <ApplicationLinks isMobile={true} />
          <ApplicationCard
            data={localizedData}
            onFilterChange={onFilterChange}
            serviceRequestIdKey={t("ES_INBOX_APPLICATION_NO")}
            onSearch={onSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileInbox;
