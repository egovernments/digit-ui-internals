import React, { useState } from "react";
import { FormStep, CardLabel, TextInput, CardHeader, Card, CardText } from "@egovernments/digit-ui-react-components";

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
  const [builtupplotsizeeroor, setbuiltupplotsizeeroor] = useState(null);
  function setPropertyplotSize(e) {
    setplotSize(e.target.value);
    setbuiltupplotsizeeroor(null);

    if (e.target.value && parseInt(builtUpArea) > parseInt(e.target.value)) {
      setbuiltupplotsizeeroor("PT_BUILTUPAREA_PLOTSIZE_ERROR_MSG");
    }
  }
  function setPropertybuiltUpArea(e) {
    setbuiltUpArea(e.target.value);
    setbuiltupplotsizeeroor(null);
    if (formData?.PropertyType?.i18nKey === "COMMON_PROPTYPE_BUILTUP_INDEPENDENTPROPERTY" && index != "0") {
      if (formData?.units[0]?.plotSize && parseInt(e.target.value) > parseInt(formData?.units[0]?.plotSize)) {
        setbuiltupplotsizeeroor("PT_BUILTUPAREA_PLOTSIZE_ERROR_MSG");
      }
    } else {
      if (plotSize && parseInt(e.target.value) > parseInt(plotSize)) {
        setbuiltupplotsizeeroor("PT_BUILTUPAREA_PLOTSIZE_ERROR_MSG");
      }
    }
  }

  const getheader = () => {
    if (formData?.PropertyType?.i18nKey === "COMMON_PROPTYPE_BUILTUP_SHAREDPROPERTY") {
      return "PT_FLOOR_DETAILS_HEADER";
    } else {
      return `PROPERTYTAX_FLOOR_${index}_DETAILS`;
    }
  };

  const goNext = () => {
    //let index = window.location.href.charAt(window.location.href.length - 1);
    if (!isNaN(index)) {
      let unit = (formData.units && formData.units[index]) || null;
      if (unit !== null) {
        unit["builtUpArea"] = builtUpArea;
        unit["plotSize"] = plotSize;
        onSelect(config.key, unit, "", index);
      } else {
        let floordet = { plotSize, builtUpArea };
        sessionStorage.setItem("propertyArea", "multiple");
        onSelect(config.key, floordet, "", index);
      }
    } else {
      sessionStorage.setItem("propertyArea", "multiple");
      onSelect("floordetails", { plotSize, builtUpArea });
    }
  };

  return (
    <FormStep
      config={((config.texts.header = getheader()), config)}
      header="ground"
      onSelect={goNext}
      onSkip={onSkip}
      t={t}
      forcedError={t(builtupplotsizeeroor)}
      isDisabled={builtupplotsizeeroor || (!builtUpArea && (!plotSize || !builtUpArea))}
    >
      {(index === "0" || isNaN(index)) && (
        <div>
          <CardLabel>{`${t("PT_FLOOR_DETAILS_PLOT_SIZE_LABEL")}`}</CardLabel>
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
      <CardLabel>{`${t("PT_FLOOR_DETAILS_BUILT_UP_AREA_LABEL")}`}</CardLabel>
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
