import React, { useState, useEffect } from "react";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";

const SelectOwnerShipDetails = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const isUpdateProperty = formData?.isUpdateProperty || false;
  const [ownershipCategory, setOwnershipCategory] = useState(formData?.ownershipCategory);
  const { data: SubOwnerShipCategoryOb, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "SubOwnerShipCategory");
  const { data: OwnerShipCategoryOb } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerShipCategory");
  const ownerShipdropDown = [];
  let subCategoriesInOwnersType = ["INDIVIDUAL"];
  let OwnerShipCategory = {};
  let SubOwnerShipCategory = {};

  useEffect(() => {
    if (!isLoading && SubOwnerShipCategoryOb && OwnerShipCategoryOb) {
      const preFilledPropertyType = SubOwnerShipCategoryOb.filter(
        (ownershipCategory) => ownershipCategory.code === (formData?.ownershipCategory?.value || formData?.ownershipCategory)
      )[0];
      setOwnershipCategory(preFilledPropertyType);
    }
  }, [formData?.ownershipCategory, SubOwnerShipCategoryOb]);

  OwnerShipCategoryOb &&
    OwnerShipCategoryOb.length > 0 &&
    OwnerShipCategoryOb.map((category) => {
      OwnerShipCategory[category.code] = category;
    });
  SubOwnerShipCategoryOb &&
    SubOwnerShipCategoryOb.length > 0 &&
    SubOwnerShipCategoryOb.map((category) => {
      SubOwnerShipCategory[category.code] = category;
    });

  getOwnerDetails();

  function formDropdown(category) {
    const { name, code } = category;
    return {
      label: name,
      value: code,
      code: code
    };
  }

  function getDropdwonForProperty(ownerShipdropDown) {
    return (
      ownerShipdropDown &&
      ownerShipdropDown.length &&
      ownerShipdropDown.splice(0, 4).map((ownerShipDetails) => ({
        ...ownerShipDetails,
        i18nKey: `PT_OWNERSHIP_${ownerShipDetails.value.split(".")[1] ? ownerShipDetails.value.split(".")[1] : ownerShipDetails.value.split(".")[0]}`,
      }))
    );
  }

  function getOwnerDetails() {
    if (OwnerShipCategory && SubOwnerShipCategory) {
      Object.keys(OwnerShipCategory).forEach((category) => {
        const categoryCode = OwnerShipCategory[category].code;
        if (subCategoriesInOwnersType.indexOf(categoryCode) !== -1) {
          Object.keys(SubOwnerShipCategory)
            .filter((subCategory) => categoryCode === SubOwnerShipCategory[subCategory].ownerShipCategory)
            .forEach((linkedCategory) => {
              ownerShipdropDown.push(formDropdown(SubOwnerShipCategory[linkedCategory]));
            });
        } else {
          ownerShipdropDown.push(formDropdown(OwnerShipCategory[category]));
        }
      });
    }
  }

  function selectedValue(value) {
    setOwnershipCategory(value);
  }

  const onSkip = () => onSelect();
  function goNext() {
    let index = window.location.href.charAt(window.location.href.length - 1);
    sessionStorage.setItem("ownershipCategory", ownershipCategory.value);
    onSelect(config.key, ownershipCategory, "", index);
  }

  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!ownershipCategory}>
      <div style={cardBodyStyle}>
        <RadioButtons
          isMandatory={config.isMandatory}
          options={getDropdwonForProperty(ownerShipdropDown) || []}
          selectedOption={ownershipCategory}
          optionsKey="i18nKey"
          onSelect={selectedValue}
          value={ownershipCategory}
          labelKey = "PT_OWNERSHIP"
          isDependent = {true}
          disabled = {isUpdateProperty}
        />
      </div>
    </FormStep>
  );
};

export default SelectOwnerShipDetails;
