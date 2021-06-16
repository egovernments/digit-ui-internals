import { Dropdown } from "@egovernments/digit-ui-react-components";
import React from "react";

export const configEmployeeActiveApplication = ({ t, action, selectFile, uploadedFile, setUploadedFile, selectedReason, Reasons, selectReason }) => {

    return {
        label: {
            heading: `CR_COMMON_HEADER`,
            submit: `CR_CANCEL_RECEIPT_BUTTON`,
        },
        form: [
            {
                body: [
                    {
                        label: t("CR_RECEIPT_CANCELLATION_REASON_LABEL "),
                        type: "dropdown",
                        isMandatory: true,
                        name: "reasonForDeactivation",
                        populators: (
                            <Dropdown isMandatory selected={selectedReason} optionKey="code" option={Reasons} select={selectReason} t={t} />
                        ),
                    },
                    {
                        label: t("CR_MORE_DETAILS_LABEL"),
                        type: "text",
                        populators: {
                            name: "orderNo",
                        },
                    },
                    {
                        label: t("CR_ADDITIONAL_PENALTY"),
                        type: "text",
                        populators: {
                            name: "remarks",
                        },
                    }
                ],
            },
        ],
    };
};