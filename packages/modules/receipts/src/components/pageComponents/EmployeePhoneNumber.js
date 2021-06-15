import React, { useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectEmployeePhoneNumber = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const [ iserror, setError] = useState(false)

  const inputs = [
    {
        label: t("HR_MOB_NO_LABEL"),
        isMandatory: true,
        type: "text",
        name:"mobileNumber",
        populators: {
          validation: {
            required: true,
            pattern: /^[6-9]\d{9}$/,
          },
          componentInFront: <div className="employee-card-input employee-card-input--front">+91</div>,
          error: t("CORE_COMMON_MOBILE_ERROR"),
      },
    }
  ];

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: value });

  }
  function validate(value, input){
    setError(!(input.populators.validation.pattern).test(value))
  }

  return (
    <div>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>

          <LabelFieldPair>
            <CardLabel className="card-label-smaller">
              {t(input.label)}
              {input.isMandatory ? " * " : null}
            </CardLabel>
            <div className="field-container" style={{width: "50%"}}>
            <div className="employee-card-input employee-card-input--front"><p>&#128269;</p></div>
              <TextInput
               className="field desktop-w-full"
                key={input.name}
                value={formData && formData[config.key] ? formData[config.key][input.name] : undefined}
                onChange={(e) => setValue(e.target.value, input.name)}
                disable={false}
                defaultValue={undefined}
                onBlur={(e)=>validate(e.target.value, input)}
                {...input.validation}
              />
                {iserror ?  <CardLabelError>{t(input.populators.error)}</CardLabelError> : null }
            </div>
          </LabelFieldPair>

        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectEmployeePhoneNumber;
