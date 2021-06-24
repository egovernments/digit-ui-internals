import React from "react";
import { Dropdown, UploadFile } from "@egovernments/digit-ui-react-components";

export const configPTDocVerifierApplication = ({
  t,
  action,
  docVerifiers,
  selectedDocVerifier,
  setSelectedDocVerifier,
  selectFile,
  uploadedFile,
  setUploadedFile,
}) => {
  return {
    label: {
      heading: `WF_${action}_APPLICATION`,
      submit: `WF_PT.CREATE_${action}`,
      cancel: "ES_PT_COMMON_CANCEL",
    },
    form: [
      {
        body: [
          {
            label: t("ES_PT_DOC_VERIFIERS"),
            isMandatory: true,
            type: "dropdown",
            populators: (
              <Dropdown
                option={docVerifiers}
                autoComplete="off"
                optionKey="name"
                id="fieldInspector"
                select={setSelectedDocVerifier}
                selected={selectedDocVerifier}
              />
            ),
          },
          {
            label: t("ES_PT_ACTION_COMMENTS"),
            type: "textarea",
            populators: {
              name: "comments",
            },
          },
          {
            label: t("ES_PT_UPLOAD_FILE"),
            populators: (
              <UploadFile
                // accept=".jpg"
                onUpload={selectFile}
                onDelete={() => {
                  setUploadedFile(null);
                }}
                message={uploadedFile ? `1 ${t(`ES_PT_ACTION_FILEUPLOADED`)}` : t(`ES_PT_ACTION_NO_FILEUPLOADED`)}
              />
            ),
          },
        ],
      },
    ],
  };
};
