import React, { useEffect, useState } from "react";
import { FormStep, CardLabel, TextInput, LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

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
  const [error, setError] = useState(null);
  const [unitareaerror, setunitareaerror] = useState(null);

  function setPropertyfloorarea(e) {
    setfloorarea(e.target.value);
    setunitareaerror(null);
    if (formData?.PropertyType?.code === "BUILTUP.INDEPENDENTPROPERTY" && parseInt(formData?.units[index]?.builtUpArea) < e.target.value) {
      setunitareaerror("PT_TOTUNITAREA_LESS_THAN_BUILTUP_ERR_MSG");
    }
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
    }
  }

  useEffect(() => {
    if (userType === "employee") {
      onSelect(config.key, floorarea);
    }
  }, [floorarea]);

  const inputs = [
    {
      label: "PT_PLOT_SIZE_SQUARE_FEET_LABEL",
      type: "text",
      name: "area",
      validation: {},
    },
  ];

  const { pathname } = useLocation();
  const presentInModifyApplication = pathname.includes("modify");

  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller">
            {t(input.label)}
            {config.isMandatory ? " * " : null}
          </CardLabel>
          <div className="field">
            <TextInput
              key={input.name}
              id={input.name}
              value={floorarea}
              onChange={onChange}
              {...input.validation}
              autoFocus={presentInModifyApplication}
            />
          </div>
        </LabelFieldPair>
      );
    });
  }

  return (
    <FormStep
      config={config}
      onChange={onChange}
      forcedError={t(unitareaerror)}
      onSelect={goNext}
      onSkip={onSkip}
      t={t}
      isDisabled={unitareaerror || !floorarea}
    >
      <CardLabel>{`${t("PT_PLOT_SIZE_SQUARE_FEET_LABEL")}`}</CardLabel>
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
