import React, { useState, useEffect } from "react";
import { FormStep, TypeSelectCard, RadioButtons } from "@egovernments/digit-ui-react-components";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { cardBodyStyle } from "../utils";

const PropertyUsageType = ({ t, config, onSelect, userType, formData }) => {
  const [usageCategoryMajor, setPropertyPurpose] = useState(formData?.usageCategoryMajor);
  //   const { data: Menu, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OccupancyType");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { data: Menu = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "UsageCategory") || {};
  let usagecat = [];
  usagecat = Menu?.PropertyTax?.UsageCategory || [];
  let i;
  let menu = [];

  function usageCategoryMajorMenu(usagecat) {
    for (i = 0; i < 10; i++) {
      if (
        Array.isArray(usagecat) &&
        usagecat.length > 0 &&
        usagecat[i].code.split(".")[0] == "NONRESIDENTIAL" &&
        usagecat[i].code.split(".").length == 2
      ) {
        menu.push({ i18nKey: "PROPERTYTAX_BILLING_SLAB_" + usagecat[i].code.split(".")[1] });
      }
    }
    return menu;
  }

  /*  menu = [
    {
      i18nKey: "PROPERTYTAX_BILLING_SLAB_INSTITUTIONAL",
    },
    {
      i18nKey: "PROPERTYTAX_BILLING_SLAB_INDUSTRIAL",
    },
    {
      i18nKey: "PROPERTYTAX_BILLING_SLAB_COMMERCIAL",
    },
  ]; */

  const onSkip = () => onSelect();

  useEffect(() => {
    if (userType !== "employee" && formData?.isResdential?.i18nKey === "PT_COMMON_YES" && formData?.usageCategoryMajor?.i18nKey !== "RESIDENTIAL") {
      //selectPropertyPurpose({i18nKey : "RESIDENTAL"})
      onSelect(config.key, { i18nKey: "PROPERTYTAX_BILLING_SLAB_RESIDENTIAL" }, true);
    }
  }, [formData?.usageCategoryMajor?.i18nKey]);

  function selectPropertyPurpose(value) {
    setPropertyPurpose(value);
  }

  function goNext() {
    if (usageCategoryMajor.i18nKey === "PROPERTYTAX_BILLING_SLAB_OTHERS") {
      usageCategoryMajor.i18nKey = "PROPERTYTAX_BILLING_SLAB_NONRESIDENTIAL";
      onSelect(config.key, usageCategoryMajor);
    } else {
      onSelect(config.key, usageCategoryMajor);
    }
    // onSelect(config.key,ResidentialType, false, index);
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!usageCategoryMajor}>
      <div style={cardBodyStyle}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          //options={menu}
          options={usageCategoryMajorMenu(usagecat) || {}}
          selectedOption={usageCategoryMajor}
          onSelect={selectPropertyPurpose}
        />
      </div>
    </FormStep>
  );
};

export default PropertyUsageType;
