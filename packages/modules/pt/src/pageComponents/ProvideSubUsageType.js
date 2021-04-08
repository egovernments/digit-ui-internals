import { CardLabel, FormStep, RadioButtons, RadioOrSelect } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { cardBodyStyle } from "../utils";

const ProvideSubUsageType = ({ t, config, onSelect, userType, formData }) => {
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  //const [SubUsageType, setSelfOccupied] = useState(formData?.ProvideSubUsageType);
  let SubUsageType, setSelfOccupied;
  if (!isNaN(index)) {
    [SubUsageType, setSelfOccupied] = useState(formData.units && formData.units[index] && formData.units[index].SubUsageType);
  } else {
    [SubUsageType, setSelfOccupied] = useState(formData.subusagetype?.SubUsageType);
  }

  const { data: Menu = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "UsageCategory") || {};

  let subusageoption = [];
  subusageoption = Menu?.PropertyTax?.UsageCategory || [];

  let i;
  let data = [];

  function getSubUsagedata(subusageoption) {
    for (i = 0; i < subusageoption.length; i++) {
      if (
        Array.isArray(subusageoption) &&
        subusageoption.length > 0 &&
        subusageoption[i].code.split(".")[1] == formData?.usageCategoryMajor.i18nKey.split("_")[3] &&
        subusageoption[i].code.split(".").length == 4
      ) {
        data.push({
          i18nKey:
            "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_" +
            subusageoption[i].code.split(".")[1] +
            "_" +
            subusageoption[i].code.split(".")[subusageoption[i].code.split(".").length - 1],
        });
      }
    }
    return data;
  }

  useEffect(() => {
    if (userType !== "employee" && formData?.usageCategoryMajor?.i18nKey == "PROPERTYTAX_BILLING_SLAB_OTHERS") {
      //selectPropertyPurpose({i18nKey : "RESIDENTAL"})
      //let index = window.location.href.charAt(window.location.href.length - 1);
      //onSelect(config.key, { i18nKey: "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_OTHERS_CREMATION/BURIAL" }, true, index);
      if (!isNaN(index)) {
        //let index = window.location.href.charAt(window.location.href.length - 1);
        let index = window.location.href.split("/").pop();
        let unit = formData.units && formData.units[index];
        onSelect(config.key, unit, true, index);
      } else {
        onSelect(config.key, { i18nKey: "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_OTHERS_CREMATION/BURIAL" }, true, index);
      }
    }
  }, [!isNaN(index) ? formData?.units[index]?.SubUsageType?.i18nKey : formData?.SubUsageType?.i18nKey]);

  useEffect(() => {
    if (userType !== "employee" && formData?.usageCategoryMajor?.i18nKey === "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL") {
      //selectPropertyPurpose({i18nKey : "RESIDENTAL"})
      //let index = window.location.href.charAt(window.location.href.length - 1);
      let index = window.location.href.split("/").pop();
      //onSelect(config.key, { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" }, true, index);
      if (!isNaN(index)) {
        //let index = window.location.href.charAt(window.location.href.length - 1);
        let index = window.location.href.split("/").pop();
        let unit = formData.units && formData.units[index];
        onSelect(config.key, unit, true, index);
      } else {
        onSelect(config.key, { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" }, true, index);
      }
    }
  });

  const onSkip = () => onSelect();

  function selectSelfOccupied(value) {
    setSelfOccupied(value);
  }

  function goNext() {
    //let index = window.location.href.charAt(window.location.href.length - 1);
    if (!isNaN(index)) {
      let unit = formData.units && formData.units[index];
      let floordet = { ...unit, SubUsageType };
      onSelect(config.key, floordet, false, index);
    } else {
      [];
      onSelect("subusagetype", { SubUsageType });
    }
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!SubUsageType}>
      <CardLabel>{t("Types of Floor Usage")}</CardLabel>
      <div style={cardBodyStyle}>
        {getSubUsagedata(subusageoption) && (
          <RadioOrSelect
            isMandatory={config.isMandatory}
            selectedOption={SubUsageType}
            options={getSubUsagedata(subusageoption) || {}}
            t={t}
            optionKey="i18nKey"
            onSelect={selectSelfOccupied}
          />
        )}
      </div>
    </FormStep>
  );
};

export default ProvideSubUsageType;
