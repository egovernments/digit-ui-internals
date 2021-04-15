import React, { useState } from "react";
import { RadioButtons, TypeSelectCard, FormStep, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";

const PropertyBasementsDetails = ({ t, config, onSelect, userType, formData }) => {
  const [BasementDetails, setBasementDetails] = useState(formData?.noOofBasements);

  const menu = [
    {
      //i18nKey: "No Basement",
      i18nKey: "PT_NO_BASEMENT_OPTION",
    },
    {
      //i18nKey: "1 Basement",
      i18nKey: "PT_ONE_BASEMENT_OPTION",
    },
    {
      //i18nKey: "2 Basement",
      i18nKey: "PT_TWO_BASEMENT_OPTION",
    },
  ];

  const onSkip = () => onSelect();

  function selectBasementDetails(value) {
    setBasementDetails(value);
  }

  function goNext() {
    let index = window.location.href.charAt(window.location.href.length - 1);
    //let index = window.location.href.split("/").pop();
    sessionStorage.setItem("noOofBasements", BasementDetails.i18nKey);
    onSelect(config.key, BasementDetails, "", index);
  }

  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!BasementDetails} isMultipleAllow={true}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          options={menu}
          selectedOption={BasementDetails}
          onSelect={setBasementDetails}
        />
      </FormStep>
      {BasementDetails && <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_BASEMENT_NUMBER_INFO_MSG", BasementDetails)} />}
    </React.Fragment>
  );
};

export default PropertyBasementsDetails;
