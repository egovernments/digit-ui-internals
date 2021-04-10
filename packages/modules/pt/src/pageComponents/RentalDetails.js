import React, { useState, useEffect } from "react";
import { FormStep, CardLabel, TextInput } from "@egovernments/digit-ui-react-components";

const RentalDetails = ({ t, config, onSelect, value, userType, formData }) => {
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  let validation = {};
  const onSkip = () => onSelect();
  let RentArea, AnnualRent;
  let setRentArea, setAnnualRent;
  if (!isNaN(index)) {
    [RentArea, setRentArea] = useState(formData.units && formData.units[index] && formData.units[index].RentArea);
    [AnnualRent, setAnnualRent] = useState(formData.units && formData.units[index] && formData.units[index].AnnualRent);
  } else {
    [RentArea, setRentArea] = useState(formData.Constructiondetails?.RentArea);
    [AnnualRent, setAnnualRent] = useState(formData.Constructiondetails?.AnnualRent);
  }
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { data: Menu, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "RentalDetails");

  if (Menu) {
    config.texts.cardText = Menu?.PropertyTax?.RentalDetails[0]?.code
      ? `PT_ASSESSMENT_FLOW_RENTAL_DETAIL_${Menu?.PropertyTax?.RentalDetails[0]?.code}`
      : "";
  }

  useEffect(() => {
    if (userType !== "employee" && formData?.IsThisFloorSelfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED") {
      //selectPropertyPurpose({i18nKey : "RESIDENTAL"})
      /* let index = window.location.href.charAt(window.location.href.length - 1);
      let unit = formData.units && formData.units[index];
      onSelect(config.key, unit, true, index); */

      if (!isNaN(index)) {
        //let index = window.location.href.charAt(window.location.href.length - 1);
        let index = window.location.href.split("/").pop();
        let unit = formData.units && formData.units[index];
        onSelect(config.key, unit, true, index);
      } else {
        onSelect(config.key, {}, true, index);
      }
    }
  });

  function setPropertyRentArea(e) {
    setRentArea(e.target.value);
  }
  function setPropertyAnnualRent(e) {
    setAnnualRent(e.target.value);
  }
  const inputs = [
    {
      label: "Plot Size(sq.yd)*",
      type: "text",
      name: "PlotSize",
      validation: {
        pattern: "/^[ws]{1,256}$/",
      },
      error: "CORE_COMMON_PLOTSIZE_INVALID",
    },
    {
      label: "Built Up Area(sq.yd)*",
      type: "text",
      name: "BuiltUpArea",
      validation: {
        pattern: "/^[w]([w/,s])*$/",
      },
      error: "CORE_COMMON_AREA_INVALID",
    },
  ];
  const goNext = () => {
    if (!isNaN(index)) {
      let unit = formData.units && formData.units[index];
      //units["RentalArea"] = RentArea;
      //units["AnnualRent"] = AnnualRent;
      let floordet = { ...unit, RentArea, AnnualRent };
      onSelect(config.key, floordet, false, index);
    } else {
      onSelect("Constructiondetails", { RentArea, AnnualRent });
    }
  };
  //const onSkip = () => onSelect();

  return (
    <FormStep config={config} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={!RentArea || !AnnualRent}>
      <CardLabel>{`${t("PT_FLOOR_DETAILS_RENTED_AREA_LABEL")}*`}</CardLabel>
      <TextInput
        t={t}
        isMandatory={false}
        type={"number"}
        optionKey="i18nKey"
        name="RentArea"
        value={RentArea}
        onChange={setPropertyRentArea}
        {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_RENT_AREA_ERROR_MESSAGE") })}
      />
      <CardLabel>{`${t("PT_FLOOR_DETAILS_BUILT_UP_AREA_LABEL")}*`}</CardLabel>
      <TextInput
        t={t}
        isMandatory={false}
        type={"number"}
        optionKey="i18nKey"
        name="AnnualRent"
        value={AnnualRent}
        onChange={setPropertyAnnualRent}
        {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_BUILT_AREA_ERROR_MESSAGE") })}
      />
    </FormStep>
  );
};

export default RentalDetails;
