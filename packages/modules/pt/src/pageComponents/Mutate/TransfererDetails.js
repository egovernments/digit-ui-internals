import React from "react";
import { FormStep, CardLabel, RadioButtons, RadioOrSelect, CardHeader, KeyNote, Card, CardCaption } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
// import { cardBodyStyle, stringReplaceAll } from "../utils";

const TransfererDetails = ({ userType, formData, config, onSelect }) => {
  const { t } = useTranslation();
  console.log(formData, config, "inside transferer details");
  const ownershipType = formData.searchResult.property?.ownershipCategory?.split?.(".");

  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={onSelect} onSkip={() => {}} isDisabled={false}>
        <CardHeader>{t("PT_MUTATION_TRANSFEROR_DETAILS")}</CardHeader>
        {formData.searchResult.property.owners.map((owner, index, arr) => {
          return (
            <React.Fragment key={index}>
              <CardCaption style={{ marginTop: "24px", marginBottom: "12px", display: "block" }}>{t("ES_OWNER") + "  " + (index + 1)}</CardCaption>
              {config.labels
                ?.filter((e) => e.ownershipType === "ALL" || ownershipType?.[0].includes(e.ownershipType) || e.ownershipType === ownershipType?.[0])
                .map((label) => {
                  let noteValue = label?.keyPath?.reduce((acc, curr) => (curr === "_index_" ? acc?.[index] : acc?.[curr]), formData);
                  return (
                    <KeyNote
                      key={label.label}
                      keyValue={t(label.label)}
                      note={typeof noteValue === "string" ? t(noteValue) : "N/A"}
                      noteStyle={label.noteStyle}
                    />
                  );
                })}
            </React.Fragment>
          );
        })}
      </FormStep>
    </React.Fragment>
  );
};

export default TransfererDetails;
