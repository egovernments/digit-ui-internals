import React, { useState } from "react";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";

const IsAnyPartOfThisFloorUnOccupied = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const [unOccupiedFloorPart, setSelfOccupied] = useState(formData?.IsAnyPartOfThisFloorUnOccupied);
  const { data: Menu, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");

  const data = [
    {
      i18nKey: "No",
    },
    {
      i18nKey: "Yes",
    },
  ];
  const onSkip = () => onSelect();

  function selectSelfOccupied(value) {
    setSelfOccupied(value);
  }

  function goNext() {
    //let index = window.location.href.charAt(window.location.href.length - 1);
    let index = window.location.href.split("/").pop();
    if (unOccupiedFloorPart.i18nKey === "No") {
      sessionStorage.setItem("IsAnyPartOfThisFloorUnOccupied", unOccupiedFloorPart.i18nKey);
      onSelect(config.key, unOccupiedFloorPart, "", index);
    } else {
      sessionStorage.setItem("IsAnyPartOfThisFloorUnOccupied", unOccupiedFloorPart.i18nKey);
      onSelect(config.key, unOccupiedFloorPart, "", index);
    }
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!unOccupiedFloorPart}>
      <RadioButtons
        t={t}
        optionsKey="i18nKey"
        isMandatory={config.isMandatory}
        options={data}
        selectedOption={unOccupiedFloorPart}
        onSelect={selectSelfOccupied}
      />
    </FormStep>
  );
};

export default IsAnyPartOfThisFloorUnOccupied;
