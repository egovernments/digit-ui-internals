import React from "react";
import { CheckBox, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import StatusCount from "./StatusCount";

const Status = ({ onAssignmentChange, fsmfilters }) => {
  const { t } = useTranslation();
  const { data: applicationsWithCount, isLoading } = Digit.Hooks.fsm.useApplicationStatus();
  // console.log("find application stats", applicationsWithCount)
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="status-container">
      <div className="filter-label">{t("ES_INBOX_STATUS")}</div>
      {applicationsWithCount?.map((option, index) => (
        <StatusCount
          key={index}
          onAssignmentChange={onAssignmentChange}
          status={option}
          fsmfilters={fsmfilters}
        />
      ))}
    </div>
  );
};

export default Status;
