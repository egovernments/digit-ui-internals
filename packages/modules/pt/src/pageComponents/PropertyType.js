import React, { useState } from "react";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";

const PropertyType = ({ t, config, onSelect, userType, formData }) => {
  const [BuildingType, setBuildingType] = useState(formData?.PropertyType);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { data: Menu = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "PTPropertyType") || {};
  let proptype = [];
  proptype = Menu?.PropertyTax?.PropertyType;
  let i;
  let menu = [];
  function getPropertyTypeMenu(proptype) {
    if (Array.isArray(proptype) && proptype.length > 0) {
      for (i = 0; i < proptype.length; i++) {
        if (i != 1 && i != 4 && Array.isArray(proptype) && proptype.length > 0)
          menu.push({ i18nKey: "COMMON_PROPTYPE_" + proptype[i].code.replaceAll(".", "_") ,code:proptype[i].code});
      }
    }
    return menu;
  }

  const onSkip = () => onSelect();

  // const propertyOwnerShipCategory = Digit.Hooks.pt.useMDMS("pb", "PropertyTax", "OwnerShipCategory", {});
  function selectBuildingType(value) {
    setBuildingType(value);
  }

  function goNext() {
    sessionStorage.setItem("PropertyType", BuildingType.i18nKey);
    onSelect(config.key, BuildingType);
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!BuildingType}>
      <RadioButtons
        t={t}
        optionsKey="i18nKey"
        isMandatory={config.isMandatory}
        //options={menu}
        options={getPropertyTypeMenu(proptype) || {}}
        selectedOption={BuildingType}
        onSelect={selectBuildingType}
      />
    </FormStep>
  );
};
export default PropertyType;
