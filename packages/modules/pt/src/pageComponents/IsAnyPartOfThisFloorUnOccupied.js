import React, { useState } from "react";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";

const IsAnyPartOfThisFloorUnOccupied = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.split("/").pop();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  let IsAnyPartOfThisFloorUnOccupied, setSelfOccupied;
  if (!isNaN(index)) {
    [IsAnyPartOfThisFloorUnOccupied, setSelfOccupied] = useState(
      formData.units && formData.units[index] && formData.units[index].IsAnyPartOfThisFloorUnOccupied
    );
  } else {
    [IsAnyPartOfThisFloorUnOccupied, setSelfOccupied] = useState(formData?.IsAnyPartOfThisFloorUnOccupied);
  }
  //const { data: Menu, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");

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
    if (!isNaN(index)) {
      sessionStorage.setItem("IsAnyPartOfThisFloorUnOccupied", IsAnyPartOfThisFloorUnOccupied.i18nKey);
      let unit = formData.units && formData.units[index];
      let floordet = { ...unit, IsAnyPartOfThisFloorUnOccupied };
      onSelect(config.key, floordet, false, index);
    } else {
      sessionStorage.setItem("IsAnyPartOfThisFloorUnOccupied", IsAnyPartOfThisFloorUnOccupied.i18nKey);
      onSelect("IsAnyPartOfThisFloorUnOccupied", IsAnyPartOfThisFloorUnOccupied);
    }
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!IsAnyPartOfThisFloorUnOccupied}>
      <RadioButtons
        t={t}
        optionsKey="i18nKey"
        isMandatory={config.isMandatory}
        options={data}
        selectedOption={IsAnyPartOfThisFloorUnOccupied}
        onSelect={selectSelfOccupied}
      />
    </FormStep>
  );
};

export default IsAnyPartOfThisFloorUnOccupied;
