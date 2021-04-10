import React, { useState } from "react";
import { FormStep, CardLabel, TextInput } from "@egovernments/digit-ui-react-components";

const GroundFloorDetails = ({ t, config, onSelect, value, userType, formData }) => {
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  let validation = {};
  const onSkip = () => onSelect();
  //const [plotSize, setplotSize] = useState(formData.units && formData.units[index] && formData.units[index].plotSize);
  //const [builtUpArea, setbuiltUpArea] = useState(formData.units && formData.units[index] && formData.units[index].builtUpArea);
  //const [plotSize, setplotSize] = useState(formData.plotSize);
  //const [builtUpArea, setbuiltUpArea] = useState(formData.builtUpArea);
  let plotSize, builtUpArea, setplotSize, setbuiltUpArea;
  if (!isNaN(index)) {
    [plotSize, setplotSize] = useState(formData.units && formData.units[index] && formData.units[index].plotSize);
    [builtUpArea, setbuiltUpArea] = useState(formData.units && formData.units[index] && formData.units[index].builtUpArea);
  } else {
    [plotSize, setplotSize] = useState(formData.floordetails?.plotSize);
    [builtUpArea, setbuiltUpArea] = useState(formData.floordetails?.builtUpArea);
  }
  function setPropertyplotSize(e) {
    setplotSize(e.target.value);
  }
  function setPropertybuiltUpArea(e) {
    setbuiltUpArea(e.target.value);
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
  const getdisable = () => {
    if (index === "0" || isNaN(index)) {
      return !plotSize && !builtUpArea;
    } else {
      return !builtUpArea;
    }
  };
  const goNext = () => {
    //let index = window.location.href.charAt(window.location.href.length - 1);
    if (!isNaN(index)) {
      let unit = formData.units && formData.units[index];
      /* let floordet = { plotSize, builtUpArea };
    sessionStorage.setItem("propertyArea", "multiple");
    onSelect(config.key, floordet, "", index); */
      let floordet = { plotSize, builtUpArea };
      sessionStorage.setItem("propertyArea", "multiple");
      onSelect(config.key, floordet, "", index);
    } else {
      sessionStorage.setItem("propertyArea", "multiple");
      onSelect("floordetails", { plotSize, builtUpArea });
    }
  };
  //const onSkip = () => onSelect();

  return (
    <FormStep config={config} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={!builtUpArea && (!plotSize || !builtUpArea)}>
      {(index === "0" || isNaN(index)) && (
        <div>
          <CardLabel>{`${t("PT_FLOOR_DETAILS_PLOT_SIZE_LABEL")}*`}</CardLabel>
          <TextInput
            t={t}
            type={"number"}
            isMandatory={false}
            optionKey="i18nKey"
            name="PlotSize"
            value={plotSize}
            onChange={setPropertyplotSize}
            {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_PLOT_SIZE_ERROR_MESSAGE") })}
          />
        </div>
      )}
      <CardLabel>{`${t("PT_FLOOR_DETAILS_BUILT_UP_AREA_LABEL")}*`}</CardLabel>
      <TextInput
        t={t}
        type={"number"}
        isMandatory={false}
        optionKey="i18nKey"
        name="BuiltUpArea"
        value={builtUpArea}
        onChange={setPropertybuiltUpArea}
        {...(validation = { pattern: "^([0-9]){0,8}$", type: "number", title: t("PT_BUILT_AREA_ERROR_MESSAGE") })}
      />
    </FormStep>
  );
};

export default GroundFloorDetails;
