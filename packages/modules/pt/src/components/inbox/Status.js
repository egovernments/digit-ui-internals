import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import StatusCount from "./StatusCount";

const Status = ({ onAssignmentChange, searchParams, businessServices, statusMap, moduleCode }) => {
  const { t } = useTranslation();

  console.log({ businessServices, moduleCode }, "inside status");

  const [moreStatus, showMoreStatus] = useState(false);

  const { data: statusData, isLoading } = Digit.Hooks.useApplicationStatusGeneral({ businessServices }, {});

  const { userRoleStates, otherRoleStates } = statusData || {};

  const translateState = (state) => {
    return `ES_PT_COMMON_STATUS_${state.state || "CREATED"}`;
  };

  console.log(statusData, "status data");

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="status-container">
      <div className="filter-label" style={{ fontWeight: "normal" }}>
        {t("ES_INBOX_STATUS")}
      </div>
      {userRoleStates?.map((option, index) => {
        return (
          <StatusCount
            businessServices={businessServices}
            key={index}
            onAssignmentChange={onAssignmentChange}
            status={{ name: translateState(option), code: option.applicationStatus, ...option }}
            searchParams={searchParams}
            statusMap={statusMap}
          />
        );
      })}
      {moreStatus &&
        otherRoleStates?.map((option, index) => {
          return (
            <StatusCount
              businessServices={businessServices}
              key={option.uuid}
              onAssignmentChange={onAssignmentChange}
              status={{ name: translateState(option), code: option.applicationStatus, ...option }}
              searchParams={searchParams}
              statusMap={statusMap}
            />
          );
        })}
      <div className="filter-button" onClick={() => showMoreStatus(!moreStatus)}>
        {" "}
        {moreStatus ? t("ES_COMMON_LESS") : t("ES_COMMON_MORE")}{" "}
      </div>
    </div>
  );
};

export default Status;
