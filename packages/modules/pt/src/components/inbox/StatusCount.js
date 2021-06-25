import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "@egovernments/digit-ui-react-components";

const StatusCount = ({ status, searchParams, onAssignmentChange, statusMap, businessServices }) => {
  const { t } = useTranslation();

  // console.log(
  //   status,
  //   // statusMap?.find((e) => e.statusid === status.uuid),
  //   statusMap?.find((e) => e.statusid === status.uuid),
  //   "inside status count"
  // );

  return (
    <CheckBox
      onChange={(e) => onAssignmentChange(e, status)}
      checked={(() => {
        //IIFE
        // console.log(searchParams, searchParams?.applicationStatus, "inside application status");
        // if (!searchParams?.applicationStatus || !searchParams?.applicationStatus.length) return true;
        return searchParams?.applicationStatus.some((e) => e.uuid === status.uuid);
      })()}
      label={`${t(status.name)} (${statusMap?.find((e) => e.statusid === status.uuid)?.count || "-"})`}
    />
  );
};

export default StatusCount;
