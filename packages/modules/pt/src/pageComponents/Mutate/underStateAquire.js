import React, { useState } from "react";
import { FormStep, RadioButtons, CardLabel, TextInput } from "@egovernments/digit-ui-react-components";

const PTPropertyUnderStateAquire = ({ ...props }) => {
  const { t, config, onSelect, userType, formData } = props;

  const menu = [{ code: "YES" }, { code: "NO" }];

  const [isPropertyUnderGovtPossession, setSelected] = useState(formData?.[config.key]?.isPropertyUnderGovtPossession);
  const [govtAcquisitionDetails, setReason] = useState(formData?.[config.key]?.govtAcquisitionDetails);

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], isPropertyUnderGovtPossession, govtAcquisitionDetails });
  };

  const onSkip = () => {};

  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!isPropertyUnderGovtPossession?.code}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          options={menu}
          selectedOption={isPropertyUnderGovtPossession}
          onSelect={(v) => {
            setSelected(v);
          }}
          labelKey="PT_MUTATION_STATE_ACQUISITION"
          isDependent={true}
        />
        <CardLabel>{t("PT_MUTATION_GOVT_ACQUISITION_DETAILS")}</CardLabel>
        <TextInput
          disable={isPropertyUnderGovtPossession?.code !== "YES"}
          value={govtAcquisitionDetails}
          onChange={(e) => setReason(e.target.value)}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default PTPropertyUnderStateAquire;
