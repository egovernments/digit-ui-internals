import React, { useState } from "react";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";

const SelectSpecialOwnerCategoryType = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.charAt(window.location.href.length - 1);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const [ownerType, setOwnerType] = useState(formData.owners && formData.owners[index] && formData.owners[index].ownerType);
  const { data: Menu, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");

  const onSkip = () => onSelect();

  function setTypeOfOwner(value) {
    setOwnerType(value);
  }

  function goNext() {
    let ownerDetails = formData.owners && formData.owners[index];
    ownerDetails["ownerType"] = ownerType;
    onSelect(config.key, ownerDetails, "", index);
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!ownerType}>
      <div style={{ ...cardBodyStyle, maxHeight: "calc(100vh - 22em)" }}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          options={Menu || []}
          selectedOption={ownerType}
          onSelect={setTypeOfOwner}
          labelKey = "PROPERTYTAX_OWNERTYPE"
          isDependent = {true}
        />
      </div>
    </FormStep>
  );
};

export default SelectSpecialOwnerCategoryType;
