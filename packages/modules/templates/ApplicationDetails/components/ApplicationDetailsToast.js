import React from "react";
import { Toast } from "@egovernments/digit-ui-react-components";

function ApplicationDetailsToast({ t, showToast, closeToast, businessService }) {
  const label = showToast?.key === "error" ? showToast?.error?.message : `ES_${businessService}_${showToast?.action?.action}_UPDATE_SUCCESS`;
  return <React.Fragment>{showToast && <Toast error={showToast.key === "error"} label={label} onClose={closeToast} />}</React.Fragment>;
}

export default ApplicationDetailsToast;
