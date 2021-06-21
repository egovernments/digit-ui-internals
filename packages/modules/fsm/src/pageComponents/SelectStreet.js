import React, { useEffect, useState } from "react";
import { FormStep, TextInput, LabelFieldPair, CardLabel } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";

const SelectStreet = ({ t, config, onSelect, userType, formData, formState, setError, clearErrors }) => {
  const onSkip = () => onSelect();

  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  let inputs;
  if (window.location.href.includes("tl")) {
    inputs = config.inputs;
  } else {
    inputs = [
      {
        label: "PT_PROPERTY_ADDRESS_STREET_NAME",
        type: "text",
        name: "street",
        validation: {
          pattern: "[a-zA-Z0-9 ]{1,255}",
          // maxlength: 256,
          title: t("CORE_COMMON_STREET_INVALID"),
        },
      },
      {
        label: "PT_PROPERTY_ADDRESS_HOUSE_NO",
        type: "text",
        name: "doorNo",
        validation: {
          pattern: "[A-Za-z0-9#,\/ \-]{1,63}",
          // maxlength: 256,
          title: t("CORE_COMMON_DOOR_INVALID"),
        },
      },
    ];
  }

  const convertValidationToRules = ({ validation, name, messages }) => {
    if (validation) {
      let { pattern: valPattern, maxlength, minlength, required: valReq } = validation || {};
      let pattern = (value) => {
        if (valPattern) {
          if (valPattern instanceof RegExp) return valPattern.test(value) ? true : messages?.pattern || `${name.toUpperCase()}_PATTERN`;
          else if (typeof valPattern === "string")
            return new RegExp(valPattern)?.test(value) ? true : messages?.pattern || `${name.toUpperCase()}_PATTERN`;
        }
        return true;
      };
      let maxLength = (value) => (maxlength ? (value?.length <= maxlength ? true : messages?.maxlength || `${name.toUpperCase()}_MAXLENGTH`) : true);
      let minLength = (value) => (minlength ? (value?.length >= minlength ? true : messages?.minlength || `${name.toUpperCase()}_MINLENGTH`) : true);
      let required = (value) => (valReq ? (!!value ? true : messages?.required || `${name.toUpperCase()}_REQUIRED`) : true);

      return { pattern, required, minLength, maxLength };
    }
    return {};
  };

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    if (userType === "employee") {
      //   console.log(formState.errors[config.key]?.type, "inside form errors");
      if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) setError(config.key, { type: errors });
      else if (!Object.keys(errors).length && formState.errors[config.key]) clearErrors(config.key);
    }
  }, [errors]);

  useEffect(() => {
    const keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = formData[config.key]?.[key]));

    // console.log(formValue, part, formData[config.key], errors, "inside form value change");
    if (!_.isEqual(formValue, part)) {
      onSelect(config.key, { ...formData[config.key], ...formValue });
      trigger();
    }
  }, [formValue]);

  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller">
            {t(input.label)}
            {config.isMandatory ? " * " : null}
          </CardLabel>
          <div className="field">
            <Controller
              control={control}
              defaultValue={formData?.address?.[input.name]}
              name={input.name}
              rules={{ validate: convertValidationToRules(input) }}
              render={(_props) => (
                <TextInput
                  id={input.name}
                  key={input.name}
                  value={_props.value}
                  onChange={(e) => {
                    setFocusIndex({ index });
                    _props.onChange(e.target.value);
                  }}
                  onBlur={_props.onBlur}
                  autoFocus={focusIndex?.index == index}
                  {...input.validation}
                />
              )}
            />
          </div>
        </LabelFieldPair>
      );
    });
  }
  return (
    <FormStep
      config={{ ...config, inputs }}
      _defaultValues={{ street: formData?.address.street, doorNo: formData?.address.doorNo }}
      onSelect={(data) => onSelect(config.key, data)}
      onSkip={onSkip}
      t={t}
    />
  );
};

export default SelectStreet;
