import React from "react";
import { Dropdown } from "@egovernments/digit-ui-react-components";

export const configRejectApplication = ({ t, rejectMenu, rejectionReason, selectReason }) => {
  return {
    label: {
      heading: "ES_FSM_ACTION_TITLE_DECLINE_REQUEST",
      submit: "CS_COMMON_DECLINE",
      cancel: "CS_COMMON_CANCEL",
    },
    form: [
      {
        body: [
          {
            label: t("ES_FSM_ACTION_DECLINE_REASON"),
            isMandatory: true,
            type: "dropdown",
            populators: <Dropdown t={t} option={rejectMenu} id="reason" optionKey="code" selected={rejectionReason} select={selectReason} />,
          },
          {
            label: t("ES_FSM_ACTION_COMMENTS"),
            type: "textarea",
            populators: {
              name: "comments",
            },
          },
        ],
      },
    ],
  };
};
