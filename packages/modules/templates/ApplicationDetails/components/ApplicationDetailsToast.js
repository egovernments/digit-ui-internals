import React from "react";
import { Toast } from "@egovernments/digit-ui-react-components";

function ApplicationDetailsToast({ t, showToast, closeToast, businessService }) {
  return (
    <React.Fragment>
      {showToast && (
        <Toast
          error={showToast.key === "error" ? true : false}
          label={t(
            showToast.key === "success"
              ? businessService === "PT"
                ? `ES_PT_${showToast.action}_UPDATE_SUCCESS`
                : `ES_FSM_${showToast.action}_UPDATE_SUCCESS`
              : showToast.action
          )}
          onClose={closeToast}
        />
      )}
    </React.Fragment>
  );
}

export default ApplicationDetailsToast;
