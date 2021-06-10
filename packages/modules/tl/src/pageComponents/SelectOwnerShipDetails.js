import React, { useState, useEffect } from "react";
import { FormStep, RadioOrSelect, RadioButtons, LabelFieldPair, Dropdown, CardLabel, CardLabelError } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation } from "react-router-dom";

const SelectOwnerShipDetails = ({ t, config, onSelect, userType, formData, onBlur, formState, setError, clearErrors }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;
  const [ownershipCategory, setOwnershipCategory] = useState(formData?.ownershipCategory);
  const { data: OwnerShipCategoryOb } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TLOwnerShipCategory");
  const ownerShipdropDown = [];
  let subCategoriesInOwnersType = ["INDIVIDUAL"];
  let OwnerShipCategory = {};
  let SubOwnerShipCategory = {};
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  OwnerShipCategoryOb &&
    OwnerShipCategoryOb.length > 0 &&
    OwnerShipCategoryOb.map((category) => {
      OwnerShipCategory[category.code] = category;
    });

  getOwnerDetails();

  function formDropdown(category) {
    const { name, code } = category;
    return {
      label: name,
      value: code,
      code: code,
    };
  }

  function getDropdwonForProperty(ownerShipdropDown) {
    return (
      ownerShipdropDown &&
      ownerShipdropDown.length &&
      ownerShipdropDown
        .splice(0, 4)
        .map((ownerShipDetails) => ({
          ...ownerShipDetails,
          i18nKey: `PT_OWNERSHIP_${
            ownerShipDetails.value.split(".")[1] ? ownerShipDetails.value.split(".")[1] : ownerShipDetails.value.split(".")[0]
          }`,
        }))
        .filter((ownerShipDetails) => ownerShipDetails.code.includes("INDIVIDUAL"))
    );
  }

  function getOwnerDetails() {
    if (OwnerShipCategory && SubOwnerShipCategory) {
      Object.keys(OwnerShipCategory).forEach((category) => {
        const categoryCode = OwnerShipCategory[category].code;
        ownerShipdropDown.push(formDropdown(OwnerShipCategory[category]));
      });
    }
  }

  function selectedValue(value) {
    setOwnershipCategory(value);
  }

  const onSkip = () => onSelect();
  function goNext() {
    sessionStorage.setItem("ownershipCategory", ownershipCategory?.value);
    onSelect(config.key, ownershipCategory);
  }

  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!ownershipCategory}>
      <RadioButtons
        isMandatory={config.isMandatory}
        options={getDropdwonForProperty(ownerShipdropDown) || []}
        selectedOption={ownershipCategory}
        optionsKey="i18nKey"
        onSelect={selectedValue}
        value={ownershipCategory}
        labelKey="PT_OWNERSHIP"
        isDependent={true}
        disabled={isUpdateProperty || isEditProperty}
      />
    </FormStep>
  );
};

export default SelectOwnerShipDetails;
