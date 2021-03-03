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

const MobileInbox = ({
  data,
  vehicleLog,
  isLoading,
  onSearch,
  onFilterChange,
  onSort,
  searchParams,
  searchFields,
  linkPrefix,
  removeParam,
  sortParams,
}) => {
  const { t } = useTranslation();
  const localizedData = data?.map(({ locality, applicationNo, createdTime, tenantId, status, sla }) => ({
    [t("ES_INBOX_APPLICATION_NO")]: applicationNo,
    [t("ES_INBOX_APPLICATION_DATE")]: `${createdTime.getDate()}/${createdTime.getMonth() + 1}/${createdTime.getFullYear()}`,
    [t("ES_INBOX_LOCALITY")]: GetCell(t(Digit.Utils.locale.getLocalityCode(locality, tenantId))),
    [t("ES_INBOX_STATUS")]: GetCell(t(`CS_COMMON_${status}`)),
    [t("ES_INBOX_SLA_DAYS_REMAINING")]: GetSlaCell(sla),
  }));

  const DSO = Digit.UserService.hasAccess("FSM_DSO") || false;

  const isFstpOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;

  const fstpOperatorData = vehicleLog?.map((vehicle) => ({
    [t("ES_INBOX_VEHICLE_LOG")]: vehicle?.applicationNo,
    [t("ES_INBOX_VEHICLE_NO")]: vehicle?.vehicle.registrationNumber,
    [t("ES_INBOX_DSO_NAME")]: vehicle?.tripOwner.name,
    [t("ES_INBOX_WASTE_COLLECTED")]: vehicle?.tripDetails[0]?.volume,
  }));

  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          {!DSO && !isFstpOperator && <ApplicationLinks isMobile={true} />}
          <ApplicationCard
            t={t}
            data={isFstpOperator ? fstpOperatorData : localizedData}
            onFilterChange={!isFstpOperator ? onFilterChange : false}
            serviceRequestIdKey={isFstpOperator ? t("ES_INBOX_VEHICLE_LOG") : DSO ? t("ES_INBOX_APPLICATION_NO") : t("ES_INBOX_APPLICATION_NO")}
            isFstpOperator={isFstpOperator}
            isLoading={isLoading}
            onSearch={!DSO ? onSearch : false}
            onSort={onSort}
            searchParams={searchParams}
            searchFields={searchFields}
            linkPrefix={linkPrefix}
            removeParam={removeParam}
            sortParams={sortParams}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileInbox;
