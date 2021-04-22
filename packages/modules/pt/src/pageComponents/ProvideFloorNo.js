import React, { useState, useEffect } from "react";
import { FormStep, CardLabel, RadioButtons, RadioOrSelect } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";

const ProvideFloorNo = ({ t, config, onSelect, userType, formData }) => {
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  //const [SubUsageTypeOfRentedArea, setSelfOccupied] = useState(formData?.ProvideSubUsageTypeOfRentedArea);
  const [Floorno, setFloorno] = useState(formData?.Floorno || "");

  const { data: floordata } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Floor") || {};
  let floorlist = [];
  floorlist = floordata?.PropertyTax?.Floor;
  let i;
  let data = [];

  function getfloorlistdata(floorlist) {
    for (i = 0; Array.isArray(floorlist) && i < floorlist.length; i++) {
      data.push({ i18nKey: "PROPERTYTAX_FLOOR_" + floorlist[i].code.replaceAll("-", "_") });
    }
    return data;
  }
  const onSkip = () => onSelect();

  function selectFloorno(value) {
    setFloorno(value);
  }

  function goNext() {
    onSelect(config.key, Floorno);
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!Floorno}>
      <CardLabel>{t("PT_FLOOR_NUMBER_LABEL")}</CardLabel>
      <div style={{ ...cardBodyStyle, maxHeight: "calc(100vh - 26em)" }} className={'form-pt-dropdown-only'}>
        {data && (
          <RadioOrSelect
            t={t}
            optionKey="i18nKey"
            isMandatory={config.isMandatory}
            options={getfloorlistdata(floorlist) || {}}
            selectedOption={Floorno}
            onSelect={selectFloorno}
          />
        )}
      </div>
    </FormStep>
  );
};

export default ProvideFloorNo;
