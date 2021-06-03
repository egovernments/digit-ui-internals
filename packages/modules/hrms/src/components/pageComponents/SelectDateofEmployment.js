import React from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, DatePicker } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectDateofEmployment = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  // console.log("find errors here", errors)
  const inputs = [
    {
      label: "HR_APPOINTMENT_DATE_LABEL",
      type: "date",
      name: "dateOfAppointment",
      validation: {
        isRequired: true,
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
      isMandatory: true,
    }
  ];

  function setValue(value, input) {
    console.log(config.key, { ...formData[config.key], [input]: value })
    onSelect(config.key, { ...formData[config.key], [input]: value });
    console.log("find value here", value, input, formData);
  }

  return (
    <div>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>
          {errors[input.name] && <CardLabelError>{t(input.error)}</CardLabelError>}
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">
              {t(input.label)}
              {input.isMandatory ? " * " : null}
            </CardLabel>
            <div className="field">
              <DatePicker
                key={input.name}
                date={formData && formData[config.key] ? formData[config.key][input.name] : null}
                onChange={(e) => setValue(e, input.name)}
                disable={false}
                {...input.validation}
              />
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectDateofEmployment;
