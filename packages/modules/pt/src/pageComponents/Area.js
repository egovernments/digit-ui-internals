import React, { useState } from "react";
import { FormStep, CardLabel, TextInput } from "@egovernments/digit-ui-react-components";

const Area = ({ t, config, onSelect, value, userType, formData }) => {
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  let validation = {};
  const onSkip = () => onSelect();
  let floorarea;
  let setfloorarea;
  if (!isNaN(index)) {
    [floorarea, setfloorarea] = useState(formData.units && formData.units[index] && formData.units[index].floorarea);
  } else {
    [floorarea, setfloorarea] = useState(formData.landarea?.floorarea);
  }

  function setPropertyfloorarea(e) {
    setfloorarea(e.target.value);
  }

  const goNext = () => {
    if (!isNaN(index)) {
      let unit = formData.units && formData.units[index];
      //units["RentalArea"] = RentArea;
      //units["AnnualRent"] = AnnualRent;
      if (
        (formData?.isResdential?.i18nKey === "PT_COMMON_YES" || formData?.usageCategoryMajor?.i18nKey == "PROPERTYTAX_BILLING_SLAB_NONRESIDENTIAL") &&
        formData?.PropertyType?.i18nKey !== "COMMON_PROPTYPE_VACANT"
      ) {
        sessionStorage.setItem("area", "yes");
      } else {
        sessionStorage.setItem("area", "no");
      }

      let floordet = { ...unit, floorarea };
      onSelect(config.key, floordet, false, index);
      /*   onSelect(config.key, floordet, false, index);
      if (formData?.noOfFloors?.i18nKey === "PT_GROUND_PLUS_ONE_OPTION" && index < 1 && index > -1) {
        let newIndex1 = parseInt(index) + 1;
        onSelect("is-this-floor-self-occupied", {}, false, newIndex1, true);
      } else if (formData?.noOfFloors?.i18nKey === "PT_GROUND_PLUS_TWO_OPTION" && index < 2 && index > -1) {
        let newIndex2 = parseInt(index) + 1;
        onSelect("is-this-floor-self-occupied", {}, false, newIndex2, true);
      } else if ((formData?.noOofBasements?.i18nKey === "PT_ONE_BASEMENT_OPTION" || formData?.noOofBasements?.i18nKey === "PT_TWO_BASEMENT_OPTION") && index > -1) {
        onSelect("is-this-floor-self-occupied", {}, false, "-1", true);
      } else if (formData?.noOofBasements?.i18nKey === "PT_TWO_BASEMENT_OPTION" && index != -2) {
        onSelect("is-this-floor-self-occupied", {}, false, "-2", true);
      } */
    } else {
      if (
        (formData?.isResdential?.i18nKey === "PT_COMMON_YES" || formData?.usageCategoryMajor?.i18nKey == "PROPERTYTAX_BILLING_SLAB_NONRESIDENTIAL") &&
        formData?.PropertyType?.i18nKey !== "COMMON_PROPTYPE_VACANT"
      ) {
        sessionStorage.setItem("area", "yes");
      } else if (formData?.PropertyType?.code === "VACANT") {
        sessionStorage.setItem("area", "vacant");
      } else {
        sessionStorage.setItem("area", "no");
      }

      onSelect("landarea", { floorarea });
    }
  };
  //const onSkip = () => onSelect();

  function onChange(e) {
    if (e.target.value.length > 1024) {
      setError("CS_COMMON_LANDMARK_MAX_LENGTH");
    } else {
      setError(null);
      setfloorarea(e.target.value);
      if (userType === "employee") {
        const value = e?.target?.value;
        const key = e?.target?.id;
        onSelect(key, value);
      }
    }
  }

  return (
    <FormStep config={config} onChange={onChange} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={!floorarea}>
      <CardLabel>{`${t("PT_PLOT_SIZE_SQUARE_FEET_LABEL")}*`}</CardLabel>
      <TextInput
        t={t}
        type={"number"}
        isMandatory={false}
        optionKey="i18nKey"
        name="floorarea"
        value={floorarea}
        onChange={setPropertyfloorarea}
        {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_PLOT_SIZE_ERROR_MESSAGE") })}
      />
    </FormStep>
  );
};

export default Area;
